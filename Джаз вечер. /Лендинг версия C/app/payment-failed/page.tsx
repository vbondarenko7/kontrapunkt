const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

export default function PaymentFailed() {
  return (
    <main className="not-found">
      <div className="film-grain" aria-hidden="true" />
      <div className="not-found-inner">
        <p className="eyebrow light">Оплата не завершена</p>
        <h1>Билет пока не оплачен</h1>
        <p>Попробуйте ещё раз или напишите нам, если оплата не проходит.</p>
        <a className="button button-primary" href={`${basePath}/#ticket`}>
          Вернуться к билету
        </a>
      </div>
    </main>
  );
}
