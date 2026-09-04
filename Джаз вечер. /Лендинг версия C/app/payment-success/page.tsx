"use client";

import { useEffect } from "react";
import { trackPurchase } from "../analytics";

const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

export default function PaymentSuccess() {
  useEffect(() => {
    trackPurchase();
  }, []);

  return (
    <main className="not-found">
      <div className="film-grain" aria-hidden="true" />
      <div className="not-found-inner">
        <p className="eyebrow light">Оплата прошла</p>
        <h1>До встречи на вечере</h1>
        <p>Подтверждение и чек придут на электронную почту.</p>
        <a className="button button-primary" href={`${basePath}/`}>
          Вернуться на сайт
        </a>
      </div>
    </main>
  );
}
