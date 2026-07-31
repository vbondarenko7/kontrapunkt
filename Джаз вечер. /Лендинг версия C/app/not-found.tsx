const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

export default function NotFound() {
  return (
    <main className="not-found">
      <div className="film-grain" aria-hidden="true" />
      <div className="not-found-inner">
        <p className="eyebrow light">Ошибка 404</p>
        <h1>Эта страница не прозвучала</h1>
        <p>
          Возможно, адрес изменился. Вернитесь к программе джазового вечера.
        </p>
        <a className="button button-primary" href={`${basePath}/`}>
          Вернуться к началу
        </a>
      </div>
    </main>
  );
}
