const paths = {
  "arrow-up-right": "M6 18 18 6M6 6h12v12",
  "arrow-down": "M12 4v16m-7-7 7 7 7-7",
  "arrow-left": "M20 12H4m7-7-7 7 7 7",
  "chevron-left": "m15 5-7 7 7 7",
  "chevron-right": "m9 5 7 7-7 7",
  close: "m6 6 12 12M6 18 18 6",
  menu: "M4 6h16M4 12h16M4 18h16",
};

// SVG paths render consistently without relying on an OS emoji/icon font.
export default function UiIcon({ name = "arrow-up-right" }) {
  return (
    <svg className="ui-icon" viewBox="0 0 24 24" width="1em" height="1em" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
      <path d={paths[name]} />
    </svg>
  );
}
