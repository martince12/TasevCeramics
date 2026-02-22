import Link from "next/link";
import Image from "next/image";
import { categories } from "@/data/galleryData";
import PricingCalculator from "@/components/PricingCalculator";
import ContactForm from "@/components/ContactForm";

export default function HomePage() {
  return (
      <main>
        {/* HERO */}
        <section
            id="home"
            className="section scroll-mt-24 bg-[url('/background-hero.jpg')]  bg-contain bg-center text-white min-h-dvh flex items-center"
        >
          <div className="mx-auto max-w-7xl px-4 py-10 md:py-0 w-full">
            <div className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur p-6 md:p-10">
              <div className="grid gap-8 md:grid-cols-2 md:items-center">
                {/* LEFT: text */}
                <div>
                  <p className="text-xs uppercase tracking-widest text-white/70">
                    Ceramic / Tiling
                  </p>

                  <h1 className="mt-4 text-3xl md:text-5xl font-bold tracking-tight text-[#242323]">
                    Поставување на керамика со врвен квалитет.
                  </h1>

                  <p className="mt-4 text-sm md:text-base text-[#242323]/80 max-w-xl">
                    Со прецизност, искуство и внимание кон деталите, создаваме простори што траат со години.
                  </p>

                  <div className="mt-6 flex flex-col sm:flex-row gap-3">
                    <Link
                        href="/#gallery"
                        className="rounded-full bg-white text-black px-5 py-3 text-sm text-center hover:opacity-90"
                    >
                      Погледни проекти
                    </Link>

                    <Link
                        href="/#contact"
                        className="rounded-full border border-black/35 px-5 py-3 text-sm text-center text-[#242323] hover:bg-white/10 transition"
                    >
                      Контакт
                    </Link>
                  </div>

                  {/* small trust row */}
                  <div className="mt-8 flex flex-wrap gap-3 text-xs text-black/70">
                  <span className="rounded-full border border-black/35 bg-black/5 px-3 py-1">
                    Професионален пристап
                  </span>
                    <span className="rounded-full border border-black/35 bg-black/5 px-3 py-1">
                    Секогаш на време
                  </span>
                    <span className="rounded-full border border-black/35 bg-black/5 px-3 py-1">
                    Квалитетна изработка
                  </span>
                  </div>
                </div>

                {/* RIGHT: image */}
                <div className="relative">
                  <div className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur p-2">
                    <div className="relative aspect-[4/3] overflow-hidden rounded-2xl">
                      <Image
                          src="/hero-photo2.webp"
                          alt="Ceramic work preview"
                          fill
                          className="object-cover"
                          priority
                      />
                    </div>
                  </div>

                  {/* subtle highlight ring */}
                  <div className="pointer-events-none absolute -inset-2 rounded-[28px] border border-white/10"/>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ABOUT */}
        <section
            id="about"
            className="section scroll-mt-24 bg-zinc-50 text-zinc-900"
        >
          <div className="mx-auto max-w-[1400px] px-6 py-20">
            <div className="grid gap-12 md:grid-cols-2 md:items-start">

              {/* LEFT SIDE */}
              <div>
                <p className="text-xl uppercase tracking-widest text-[#705849]/80">
                  За нас
                </p>

                <h2 className="mt-4 text-3xl md:text-4xl font-bold tracking-tight text-[#705849]">
                  Искуство, прецизност и квалитет во секој проект.
                </h2>

                <p className="mt-6 text-base text-zinc-600 max-w-xl">
                  Со над 20 години искуство, нудиме прецизна и квалитетна изработка на плочки, гранит, мермер, травертин и украсен камен.
                </p>


                <p className="mt-4 text-base text-zinc-600 max-w-xl">
                  Работиме со современи алати, внимаваме на секој детал и гарантираме навремена и професионална реализација.
                </p>

              </div>

              {/* RIGHT SIDE CARDS */}
              <div className="grid gap-6 sm:grid-cols-2">
                {[
                  {
                    title: "Прецизна изработка",
                    desc: "Рамно поставување, чисти фуги и прецизно сечење."
                  },
                  {
                    title: "Секогаш на време",
                    desc: "Работата е завршена во договорениот рок."
                  },
                  {
                    title: "Стручна консултација",
                    desc: "Помош при избор на плочки и материјали."
                  },
                  {
                    title: "Чиста работна средина",
                    desc: "Работам уредно и ја оставам просторијата чиста."
                  }
                ].map((card) => (
                    <div
                        key={card.title}
                        className="rounded-2xl border border-white/10 bg-[#a18777]/90 backdrop-blur text-white p-6 shadow-sm hover:bg-[#705849] transition"
                    >
                      <h3 className="font-semibold text-lg">{card.title}</h3>
                      <p className="mt-2 text-sm text-white/80">
                        {card.desc}
                      </p>
                    </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* GALLERY (PREVIEW) */}
        <section id="gallery" className="section scroll-mt-24 bg-[#705849] text-zinc-900">
          <div className="mx-auto max-w-[1400px] px-6 py-20">
            <div className="mb-12">
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-white">
                Галерија
              </h2>
              <p className="mt-4 text-lg text-white max-w-2xl">
                Изработени проекти.
              </p>
            </div>

            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {categories.map((cat) => (
                  <Link
                      key={cat.slug}
                      href={`/gallery/${cat.slug}`}
                      className="group relative aspect-[4/3] overflow-hidden rounded-3xl border border-white/10 bg-white/5 backdrop-blur hover:shadow-[0_0_40px_rgba(255,255,255,0.15)] transition"
                  >
                    <div
                        className="relative aspect-[4/3] overflow-hidden rounded-3xl border border-white/10 bg-white/5 backdrop-blur">
                      <Image
                          src={cat.cover}
                          alt={cat.title}
                          fill
                          className="object-cover transition duration-500 group-hover:scale-110"
                      />
                    </div>

                    <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition"/>

                    <div className="absolute bottom-0 p-6">
                      <h3 className="text-xl font-semibold text-white">{cat.title}</h3>
                    </div>
                  </Link>
              ))}
            </div>
          </div>
        </section>

        {/* PRICING */}
        <section id="pricing" className="section scroll-mt-24">
          <div className="mx-auto max-w-7xl px-4 py-16">
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-[#705849]">Ценовник</h2>
            <p className="mt-4 text-sm md:text-base opacity-80 max-w-2xl">
              Цената е ориентативна и може да варира во зависност од условите и сложеноста на проектот.
            </p>

            <div className="mt-8 rounded-4xl border-[#705849] bg-[#705849] p-6">
              <PricingCalculator/>
            </div>
          </div>
        </section>

        {/* CONTACT */}
        <section id="contact" className="section scroll-mt-24 bg-[#705849] text-white">
          <div className="mx-auto max-w-[1400px] px-6 py-20">

            {/* Heading */}
            <div className="max-w-2xl">
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
                Ако сакате професионална изработка на вашиот проект, контактирајте не.
              </h2>
              <p className="mt-4 text-lg text-white/70">
                Секој проект започнува со консултација и увид на лице место, со цел да добиете точна и транспарентна понуда.
              </p>
            </div>

            {/* Content Grid */}
            <div className="mt-16 grid gap-12 md:grid-cols-2">

              {/* Left side */}
              <div>

                <h3 className="text-xl font-semibold">
                  Директно јави се:
                </h3>

                <p className="mt-4 text-2xl font-bold">
                  +389 71 355 519
                </p>

                <p className="mt-4 text-white/70">
                  Достапен сум за консултации, договор и преглед на простор од Понеделник до Петок после 17 часот.
                </p>
              </div>

              {/* Right side - Form */}
              <ContactForm/>

            </div>
          </div>
        </section>
      </main>
  );
}