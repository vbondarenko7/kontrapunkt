const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

export default function NotFound() {
  return (
    <main className="not-found">
      <div className="film-grain" aria-hidden="true" />
      <div className="not-found-inner">
        <p className="eyebrow light">Ошибка 404</p>
        <h1>Эта страница не прозвучала</h1>
        <p>Похоже, такой страницы нет. Вернитесь на главную.</p>
        <a className="button button-primary" href={`${basePath}/`}>
          На главную
        </a>
      </div>
    </main>
  );
}
