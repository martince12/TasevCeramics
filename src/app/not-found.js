import Link from "next/link";

export default function NotFound() {
  return (
    <main id="main-content" className="category-page container">
      <p className="eyebrow">404</p>
      <div className="section-heading">
        <div><h1>Страницата не е пронајдена.</h1></div>
        <p>Проверете ја адресата или погледнете ги изработените проекти во галеријата.</p>
      </div>
      <Link href="/#gallery" className="text-link">← Назад кон галерија</Link>
    </main>
  );
}
