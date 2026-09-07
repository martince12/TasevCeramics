/* Component regression checks using the installed Next compiler and a small hook
 * harness. These exercise actual component event handlers; they do not replace
 * browser layout, native validation, or assistive-technology testing. */
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const path = require('node:path');
const { test } = require('node:test');
const { transform, loadBindings } = require('next/dist/build/swc');

async function load(file, dependencies = {}, globals = {}) {
  await loadBindings();
  const source = fs.readFileSync(path.join(__dirname, '..', file), 'utf8');
  const { code } = await transform(source, {
    filename: file,
    jsc: { parser: { syntax: 'ecmascript', jsx: true }, transform: { react: { runtime: 'automatic' } }, target: 'es2022' },
    module: { type: 'commonjs' },
  });
  const exports = {};
  vm.runInNewContext(code, {
    exports,
    URL,
    require: (id) => Object.hasOwn(dependencies, id) ? dependencies[id] : require(id),
    ...globals,
  });
  return exports;
}

async function component(file, props = {}, globals = {}) {
  let cursor = 0;
  const slots = [];
  let pendingEffects = [];
  let tree;
  const listeners = new Map();
  const frames = new Map();
  const sections = new Map();
  let frameId = 0;
  const add = (name, handler) => {
    if (!listeners.has(name)) listeners.set(name, new Set());
    listeners.get(name).add(handler);
  };
  const remove = (name, handler) => listeners.get(name)?.delete(handler);
  const dispatch = (name, event) => listeners.get(name)?.forEach((handler) => handler(event));
  const flush = () => { const queued = [...frames.values()]; frames.clear(); queued.forEach((callback) => callback()); };
  const window = {
    scrollY: 0, innerWidth: 390, innerHeight: 800,
    location: new URL('http://localhost/?source=test#home'),
    matchMedia: () => ({ matches: false }),
    requestAnimationFrame: (callback) => { frames.set(++frameId, callback); return frameId; },
    cancelAnimationFrame: (id) => frames.delete(id),
    addEventListener: add,
    removeEventListener: remove,
  };
  window.history = { state: { next: 'retained' }, replaceState(state, _, url) { this.state = state; window.location = new URL(url, window.location); } };
  const document = {
    body: { style: { overflow: '' } }, activeElement: { focus() {} },
    getElementById: (id) => sections.get(id),
    addEventListener: (name, fn) => add('document:' + name, fn),
    removeEventListener: (name, fn) => remove('document:' + name, fn),
  };
  const react = {
    useState(initial) {
      const i = cursor++;
      if (!(i in slots)) slots[i] = initial;
      return [slots[i], (value) => { slots[i] = typeof value === 'function' ? value(slots[i]) : value; }];
    },
    useMemo: (fn) => fn(),
    useRef(initial) {
      const i = cursor++;
      if (!(i in slots)) slots[i] = { current: initial };
      return slots[i];
    },
    useEffect(fn, deps) {
      const i = cursor++;
      const previous = slots[i];
      if (!previous || deps.some((dep, index) => dep !== previous.deps[index])) {
        pendingEffects.push(() => { previous?.cleanup?.(); slots[i] = { deps, cleanup: fn() }; });
      }
    },
  };
  const loaded = await load(file, { react, 'next/link': 'a', 'next/image': 'img', 'next/navigation': { usePathname: () => globals.mockPathname || '/' } }, { window, document, ...globals });
  function all(node = tree) {
    if (node == null || typeof node !== 'object') return [];
    if (Array.isArray(node)) return node.flatMap(all);
    return [node, ...all(node.props?.children ?? null)];
  }
  function render() {
    cursor = 0;
    tree = loaded.default(props);
    for (const node of all()) {
      if (node.props?.ref) node.props.ref.current = {
        focus() { document.activeElement = this; },
        getClientRects: () => [{}],
        querySelectorAll: () => all().filter((item) => item.type === 'button' || item.type === 'a').map((item) => item.props.ref?.current || { focus() {}, getClientRects: () => [{}] }),
      };
    }
    const effects = pendingEffects;
    pendingEffects = [];
    effects.forEach((effect) => effect());
    return tree;
  }
  render();
  return {
    render, all, window, document, sections,
    event(name) { dispatch(name); flush(); render(); },
    documentEvent(name, event) { dispatch('document:' + name, event); render(); flush(); render(); },
    unmount() { slots.forEach((slot) => slot?.cleanup?.()); },
    get: (id) => all().find((node) => node.props.id === id),
    change(id, value) { this.get(id).props.onChange({ target: { value } }); render(); },
    click(node) { node.props.onClick(); render(); },
    key(key, options = {}) { dispatch('keydown', { key, preventDefault() {}, ...options }); render(); },
  };
}
const text = (node) => node == null || typeof node === 'boolean' ? '' : typeof node !== 'object' ? String(node) : Array.isArray(node) ? node.map(text).join('') : text(node.props?.children);

 test('calculator: every category, tile size, work type, decimal input, and invalid input', async () => {
  const view = await component('src/components/PricingCalculator.js');
  const total = () => text(view.all().find((node) => node.type === 'output'));
  assert.equal(total(), '—€');
  for (const category of ['bathroom', 'kitchen', 'living-room', 'stairs-terrace']) {
    view.change('quote-category', category);
    assert.equal(view.get('quote-tile').props.value, '');
    assert.equal(total(), '—€');
    for (const [tile, rate] of [['30-60', 17], ['60x120', 19], ['120x120', 22]]) {
      view.change('quote-tile', tile);
      for (const work of ['new', 'old']) {
        view.change('quote-work', work);
        for (const area of ['10', '12.5', '12,5']) {
          view.change('quote-area', area);
          assert.equal(total(), `${Number(area.replace(',', '.')) * (rate + (work === 'old' ? 7 : 0))}€`);
        }
      }
    }
  }
  for (const category of ['pools', 'stone']) {
    view.change('quote-category', category);
    assert.equal(view.get('quote-tile').props.disabled, true);
    view.change('quote-area', '10');
    view.change('quote-work', 'new');
    assert.equal(total(), '250€');
    view.change('quote-work', 'old');
    assert.equal(total(), '320€');
  }
  for (const area of ['0', '-4', 'abc', 'Infinity']) {
    view.change('quote-area', area);
    assert.equal(total(), '—€');
    assert.equal(view.get('quote-area').props['aria-invalid'], true);
    assert.ok(view.get('quote-error'));
  }
  view.change('quote-area', '');
  assert.equal(total(), '—€');
  assert.equal(view.get('quote-error'), undefined);
});

test('contact: exact payload, pending state, success reset, and server error', async () => {
  let finish;
  let request;
  const view = await component('src/components/ContactForm.js', {}, { fetch: (url, options) => { request = { url, options }; return new Promise((resolve) => { finish = resolve; }); } });
  for (const [id, value] of [['name', 'Test Name'], ['phone', '071000000'], ['email', 'test@example.com'], ['message', 'Test project']]) view.change(`contact-${id}`, value);
  const submission = view.all().find((node) => node.type === 'form').props.onSubmit({ preventDefault() {} });
  view.render();
  assert.equal(view.all().find((node) => node.type === 'button').props.disabled, true);
  assert.equal(request.url, '/api/contact');
  assert.equal(request.options.method, 'POST');
  assert.deepEqual(JSON.parse(request.options.body), { name: 'Test Name', phone: '071000000', email: 'test@example.com', message: 'Test project' });
  finish({ ok: true });
  await submission;
  view.render();
  assert.equal(view.get('contact-name').props.value, '');
  assert.match(text(view.all().find((node) => node.props.role === 'status')), /Пораката е испратена/);
  view.change('contact-name', 'Keep this');
  const failed = view.all().find((node) => node.type === 'form').props.onSubmit({ preventDefault() {} });
  finish({ ok: false });
  await failed;
  view.render();
  assert.equal(view.get('contact-name').props.value, 'Keep this');
  assert.match(text(view.all().find((node) => node.props.role === 'status')), /Обиди се повторно/);
});

test('gallery: all existing project images retained and every reference resolves', async () => {
  const { categories, imagesByCategory } = await load('src/data/galleryData.js');
  assert.equal(categories.length, 6);
  let count = 0;
  for (const category of categories) {
    assert.ok(fs.existsSync(path.join('public', category.cover)));
    const images = imagesByCategory[category.slug];
    for (const image of images) assert.ok(fs.existsSync(path.join('public', image)), image);
    const disk = fs.readdirSync(path.join('public/gallery', category.slug)).filter((file) => file.endsWith('.jpg'));
    assert.equal(images.length, disk.length);
    count += images.length;
  }
  assert.equal(count, 205);
});

test('lightbox: open, buttons, arrow wraparound, Escape, backdrop, and scroll restoration', async () => {
  const view = await component('src/components/GalleryLightboxGrid.js', { images: ['/1.jpg', '/2.jpg', '/3.jpg'], title: 'Project' });
  const control = (label) => view.all().find((node) => node.props['aria-label'] === label);
  const counter = () => text(view.all().find((node) => node.props.className === 'lightbox-counter'));
  view.click(view.all().find((node) => node.props.className === 'gallery-image'));
  assert.equal(counter(), '1 / 3');
  assert.equal(view.document.body.style.overflow, 'hidden');
  view.key('ArrowLeft'); assert.equal(counter(), '3 / 3');
  view.key('ArrowRight'); assert.equal(counter(), '1 / 3');
  view.click(control('Следна')); assert.equal(counter(), '2 / 3');
  view.click(control('Претходна')); assert.equal(counter(), '1 / 3');
  view.key('Escape');
  assert.equal(view.all().find((node) => node.props.role === 'dialog'), undefined);
  assert.equal(view.document.body.style.overflow, '');
  view.click(view.all().find((node) => node.props.className === 'gallery-image'));
  view.all().find((node) => node.props.role === 'dialog').props.onMouseDown();
  view.render();
  assert.equal(view.all().find((node) => node.props.role === 'dialog'), undefined);
});

test('mobile navigation: toggle, close on link, Escape, resize, and solid scroll state', async () => {
  const view = await component('src/components/Navbar.js');
  const toggle = () => view.all().find((node) => node.props.className === 'menu-toggle');
  const header = () => view.all().find((node) => node.type === 'header');
  assert.equal(toggle().props['aria-expanded'], false);
  view.click(toggle());
  assert.equal(toggle().props['aria-expanded'], true);
  assert.ok(view.get('mobile-navigation'));
  assert.equal(view.document.body.style.overflow, 'hidden');
  const links = view.all(view.get('mobile-navigation')).filter((node) => node.props.href?.startsWith('/#'));
  assert.equal(links.length, 5);
  view.click(links[2]);
  assert.equal(toggle().props['aria-expanded'], false);
  assert.equal(view.document.body.style.overflow, '');
  view.click(toggle()); view.key('Escape');
  assert.equal(toggle().props['aria-expanded'], false);
  view.click(toggle());
  view.window.innerWidth = 1000;
  view.event('resize');
  assert.equal(toggle().props['aria-expanded'], true);
  view.window.innerWidth = 1024;
  view.event('resize');
  assert.equal(toggle().props['aria-expanded'], false);
  view.window.scrollY = 100;
  view.event('scroll');
  assert.match(header().props.className, /is-solid/);
});

test('Resend endpoint: validation and unchanged email contract with a mocked provider', async () => {
  let delivered;
  class Resend { constructor() { this.emails = { send: async (payload) => { delivered = payload; } }; } }
  const { POST } = await load('src/app/api/contact/route.js', { resend: { Resend } }, { Response, process: { env: { RESEND_API_KEY: 'test-only', CONTACT_TO_EMAIL: 'owner@example.com', CONTACT_FROM_EMAIL: 'site@example.com' } } });
  assert.equal((await POST({ json: async () => ({}) })).status, 400);
  const result = await POST({ json: async () => ({ name: 'Test', phone: '071000000', email: 'test@example.com', message: 'Project details' }) });
  assert.equal(result.status, 200);
  assert.equal(delivered.to, 'owner@example.com');
  assert.equal(delivered.from, 'site@example.com');
  assert.equal(delivered.replyTo, 'test@example.com');
  assert.match(delivered.text, /Phone: 071000000/);
  assert.match(delivered.text, /Project details/);
});

test('scroll reveals: progressive enhancement, viewport entry, focus, reduced motion, and cleanup', async () => {
  const makeElement = (top) => {
    const classes = new Set();
    return {
      classes,
      classList: { add: (...names) => names.forEach((name) => classes.add(name)), remove: (...names) => names.forEach((name) => classes.delete(name)) },
      getBoundingClientRect: () => ({ top }),
      contains(target) { return target === this; },
    };
  };
  const visible = makeElement(100);
  const below = makeElement(1000);
  const field = makeElement(1800);
  let preferenceChange;
  let focus;
  const preference = {
    matches: false,
    addEventListener: (_, fn) => { preferenceChange = fn; },
    removeEventListener: () => { preferenceChange = undefined; },
  };
  let observer;
  class Observer {
    constructor(callback) { this.callback = callback; this.observed = new Set(); observer = this; }
    observe(element) { this.observed.add(element); }
    unobserve(element) { this.observed.delete(element); }
    disconnect() { this.observed.clear(); }
  }
  const window = { innerHeight: 800, matchMedia: () => preference, IntersectionObserver: Observer };
  const document = {
    querySelectorAll: () => [visible, below, field],
    addEventListener: (_, fn) => { focus = fn; },
    removeEventListener: () => { focus = undefined; },
  };
  const view = await component('src/components/ScrollReveal.js', {}, { window, document });
  assert.equal(visible.classes.size, 0, 'already visible content must not flash');
  assert.equal(below.classes.has('reveal-pending'), true);
  observer.callback([{ target: below, isIntersecting: true }]);
  assert.equal(below.classes.has('reveal-pending'), false);
  assert.equal(below.classes.has('reveal-entered'), true);
  assert.equal(observer.observed.has(below), false);
  focus({ target: field });
  assert.equal(field.classes.size, 0, 'focused content must be immediately visible');
  preference.matches = true;
  preferenceChange();
  assert.equal(below.classes.size, 0);
  assert.equal(observer.observed.size, 0);
  preference.matches = false;
  preferenceChange();
  assert.equal(below.classes.has('reveal-pending'), true);
  view.unmount();
  assert.equal(below.classes.size, 0);
  assert.equal(observer.observed.size, 0);
  assert.equal(preferenceChange, undefined);
  assert.equal(focus, undefined);
  // The no-observer fallback must leave the server-rendered content visible.
  await component('src/components/ScrollReveal.js', {}, { window: { matchMedia: () => preference }, document });
  assert.equal(below.classes.size, 0);
});

test('section navigation: scroll tracking, repeated home clicks, mobile menu and route boundaries', async () => {
  const view = await component('src/components/Navbar.js');
  const visits = [];
  ['home', 'about', 'gallery', 'pricing', 'contact'].forEach((id, index) => view.sections.set(id, {
    id,
    getBoundingClientRect: () => ({ top: index * 1000 - view.window.scrollY }),
    scrollIntoView: (options) => visits.push({ id, options, overflow: view.document.body.style.overflow }),
  }));
  const historyState = view.window.history.state;
  view.window.scrollY = 4000;
  view.event('scroll');
  assert.equal(view.window.location.hash, '#contact');
  assert.equal(view.window.location.search, '?source=test');
  assert.equal(view.window.history.state, historyState);
  assert.equal(view.all().find(node => node.props.href === '/#contact').props['aria-current'], 'location');

  function anchorEvent(href = '/#home', extra = {}) {
    const anchor = { href, target: '', hasAttribute: () => false };
    return { button: 0, target: { closest: () => anchor }, defaultPrevented: false, preventDefault() { this.defaultPrevented = true; }, ...extra };
  }
  // Reproduce the stale #home URL while physically still at Contact.
  view.window.location.hash = '#home';
  const click = anchorEvent();
  view.documentEvent('click', click);
  assert.equal(click.defaultPrevented, true);
  assert.equal(visits.at(-1).id, 'home');
  assert.equal(visits.at(-1).options.behavior, 'smooth');
  view.documentEvent('click', anchorEvent());
  assert.equal(visits.length, 2, 'the same hash must scroll on every click');

  view.click(view.all().find(node => node.props.className === 'menu-toggle'));
  assert.equal(view.document.body.style.overflow, 'hidden');
  view.window.matchMedia = () => ({ matches: true });
  view.documentEvent('click', anchorEvent('/#gallery'));
  assert.equal(visits.at(-1).id, 'gallery');
  assert.equal(visits.at(-1).options.behavior, 'instant');
  assert.equal(visits.at(-1).overflow, '', 'unlock the menu before scrolling');
  assert.equal(view.get('mobile-navigation'), undefined);

  for (const event of [anchorEvent('/#home', { ctrlKey: true }), anchorEvent('/#home', { button: 1 }), anchorEvent('/gallery/stone'), anchorEvent('https://example.com/#home')]) {
    view.documentEvent('click', event);
    assert.equal(event.defaultPrevented, false);
  }
  assert.equal(visits.length, 3);
  view.unmount();
  view.documentEvent('click', anchorEvent());
  assert.equal(visits.length, 3, 'clean up delegated navigation on unmount');

  const categoryView = await component('src/components/Navbar.js', {}, { mockPathname: '/gallery/stone' });
  const crossPageClick = anchorEvent();
  categoryView.documentEvent('click', crossPageClick);
  assert.equal(crossPageClick.defaultPrevented, false, 'Next handles navigation back from category pages');
  assert.equal(categoryView.all().find(node => node.props.href === '/#home' && node.props.className === 'nav-link').props['aria-current'], undefined);
});

test('JSON-LD serialization preserves data while escaping HTML script delimiters', async () => {
  const { default: JsonLd } = await load('src/components/JsonLd.js');
  const data = { '@context': 'https://schema.org', name: '</script><script>alert(1)</script>' };
  const markup = JsonLd({ data });
  const serialized = markup.props.dangerouslySetInnerHTML.__html;
  assert.equal(markup.props.type, 'application/ld+json');
  assert.equal(serialized.includes('<'), false);
  assert.deepEqual(JSON.parse(serialized), data);
});
