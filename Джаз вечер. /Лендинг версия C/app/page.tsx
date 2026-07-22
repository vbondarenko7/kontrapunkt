"use client";

import { useState } from "react";

const benefits = [
  {
    number: "01",
    marker: "Снаружи",
    title: "Рабочий день остаётся снаружи",
    text: "Клубный свет, общий стол и живая музыка быстро меняют темп вечера — без долгого разгона.",
  },
  {
    number: "02",
    marker: "Впервые",
    title: "Музыка, которой раньше не было",
    text: "Ансамбль импровизирует по следам разговора. Эту пьесу нельзя заранее отрепетировать или повторить.",
  },
  {
    number: "03",
    marker: "Вместе",
    title: "Общий опыт вместо светской беседы",
    text: "Тема сама даёт повод слушать, спорить и продолжить разговор после музыки — даже если вы пришли впервые.",
  },
];

const formatSteps = [
  {
    number: "01",
    title: "Разговор",
    text: "Ведущий открывает тему и приглашает зал к спокойному разговору о том, что касается каждого.",
  },
  {
    number: "02",
    title: "Музыкальный ответ",
    text: "Когда слов становится достаточно, джазовый ансамбль отвечает на услышанное живой импровизацией.",
  },
  {
    number: "03",
    title: "Продолжение",
    text: "Музыка меняет настроение разговора. Мы возвращаемся к теме и слышим её уже немного иначе.",
  },
];

const scenarios = [
  {
    label: "После работы",
    title: "Сменить темп",
    text: "Центр Москвы, приглушённый зал и вечер, в который не нужно приносить рабочую роль.",
  },
  {
    label: "Одному",
    title: "Не чувствовать себя лишним",
    text: "Общая тема собирает зал быстрее любого знакомства. Можно включиться сразу или сначала осмотреться.",
  },
  {
    label: "Вдвоём",
    title: "Услышать друг друга иначе",
    text: "Разговор со сцены и музыка дают новые темы, которые легко унести с собой после вечера.",
  },
];

const assurances = [
  "Высказаться — если хочется добавить свою мысль",
  "Слушать — если интереснее следить за разговором",
  "Оставить ответ музыкантам — когда слов уже достаточно",
];

const faqs = [
  {
    question: "Какой уровень подготовки нужен?",
    answer:
      "Достаточно интереса к живым вопросам, с которыми сталкивается каждый. Разговор строится вокруг личного опыта и понятен каждому гостю.",
  },
  {
    question: "Как можно участвовать в разговоре?",
    answer:
      "Вы сами выбираете свой способ: высказаться, поддержать разговор или провести вечер внимательным слушателем.",
  },
  {
    question: "Комфортно ли прийти одному?",
    answer:
      "Да. Общая тема и спокойный разговор помогают быстро почувствовать себя частью вечера.",
  },
  {
    question: "Как устроена посадка?",
    answer:
      "Посадка свободная: после прихода вы выбираете любое доступное место в зале.",
  },
  {
    question: "Где будут указаны условия возврата?",
    answer:
      "Точные условия возврата будут показаны перед оплатой и продублированы в письме с билетом.",
  },
];

export default function Home() {
  const [ticketNoticeOpen, setTicketNoticeOpen] = useState(false);

  return (
    <main id="top">
      <header className="site-header" aria-label="Основная навигация">
        <a className="brand" href="#top" aria-label="Разговор и джаз — в начало">
          <span>РАЗГОВОР</span>
          <b aria-hidden="true">×</b>
          <span>ДЖАЗ</span>
        </a>
        <nav>
          <a href="#format">Формат</a>
          <a href="#ticket">Билет</a>
        </nav>
        <span className="header-place">Чистые пруды</span>
      </header>

      <section className="hero" aria-labelledby="hero-title">
        <div className="hero-media" aria-hidden="true">
          <picture>
            <source
              type="image/webp"
              srcSet="/venue-hero-800.webp 800w, /venue-hero-1200.webp 1200w, /venue-hero.webp 1600w"
              sizes="100vw"
            />
            <img src="/venue-hero.webp" alt="" />
          </picture>
        </div>
        <div className="hero-tint" />
        <div className="hero-shade" />
        <div className="film-grain" />
        <div className="hero-note-stream" aria-hidden="true">
          <i /><i /><i /><i /><i /><i /><i />
        </div>
        <div className="hero-inner">
          <p className="chapter"><b>01</b> / первый вечер</p>
          <p className="hero-script">живые встречи</p>
          <h1 id="hero-title">
            Разговор по душам,
            <span>
              который становится
              <em>живым джазом</em>
            </span>
          </h1>
          <p className="hero-line">
            Философская беседа встречается с джазовой импровизацией
          </p>
          <p className="hero-copy">
            Музыканты ловят мысли и настроение зала и сразу переводят их в музыку.
          </p>
          <a className="button button-primary" href="#format">
            Узнать подробнее <span aria-hidden="true">↓</span>
          </a>
        </div>
        <div className="hero-facts" aria-label="Ключевые факты">
          <div>
            <span>Где</span>
            <strong>Moscow Imagine Live Club</strong>
          </div>
          <div>
            <span>Как</span>
            <strong>Разговор и джазовая импровизация</strong>
          </div>
          <div>
            <span>Для кого</span>
            <strong>Можно прийти одному или вдвоём</strong>
          </div>
        </div>
      </section>

      <section className="section section-dark" id="format">
        <div className="format-scroll-stage">
          <div className="format-ambient" aria-hidden="true" />
          <div className="format-object-layer" aria-hidden="true">
            <span className="format-object format-object-pianist" />
            <span className="format-object format-object-bust" />
            <span className="format-object format-object-bass" />
            <span className="format-object format-object-metronome" />
          </div>
          <div className="format-intro">
            <div className="format-note-stream" aria-hidden="true">
              <i /><i /><i /><i /><i /><i />
            </div>
            <p className="eyebrow light">Как устроен вечер</p>
            <h2>Разговор становится музыкой</h2>
          </div>
          <div className="format-grid">
            {formatSteps.map((step) => (
              <article className="format-step" key={step.number}>
                <span>{step.number}</span>
                <h3>{step.title}</h3>
                <p>{step.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section section-light why-section" id="why">
        <div className="section-heading why-intro">
          <p className="eyebrow">Что вы получаете</p>
          <h2>
            <span className="why-question">Лекция? Концерт?</span>
            <span className="why-answer">Не совсем.</span>
          </h2>
          <p>
            Вечер держится на внимании зала, точном разговоре и музыке,
            которая возникает в ответ — без заранее написанного сценария.
          </p>
        </div>
        <div className="benefit-list">
          {benefits.map((benefit) => (
            <article className="benefit" key={benefit.number}>
              <div className="benefit-copy">
                <span>{benefit.number}</span>
                <h3>{benefit.title}</h3>
                <p>{benefit.text}</p>
              </div>
              <div className="benefit-marker" aria-hidden="true">
                <span>{benefit.number}</span>
                <em>{benefit.marker}</em>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section
        id="layered"
        className="layered-scene"
        aria-labelledby="layered-scene-title"
      >
        <div className="layered-stage">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            className="layered-base"
            src="/philosopher-scene.webp"
            alt="Мраморный философ сидит за столом в джазовом клубе"
            width="1600"
            height="900"
          />
          <div className="layered-tint" />
          <div className="layered-copy">
            <p className="eyebrow light">Как можно прийти</p>
            <h2 id="layered-scene-title">У вечера нет обязательного сценария</h2>
            <div className="layered-scenario-list">
              {scenarios.map((scenario) => (
                <article className="layered-scenario" key={scenario.label}>
                  <span>{scenario.label}</span>
                  <div>
                    <h3>{scenario.title}</h3>
                    <p>{scenario.text}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>
          {/* The duplicate is masked so the moving copy passes behind the statue. */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            className="layered-statue"
            src="/philosopher-scene.webp"
            alt=""
            aria-hidden="true"
            width="1600"
            height="900"
          />
          <div className="layered-shade" />
          <div className="film-grain layered-grain" />
        </div>
      </section>

      <section className="section participation-section">
        <div className="participation-copy">
          <p className="eyebrow light">Свобода быть собой</p>
          <h2>Ваша роль не назначена заранее</h2>
          <p>
            Здесь не вызывают к микрофону и не проверяют знания. Каждый сам
            выбирает дистанцию до разговора.
          </p>
        </div>
        <ul className="assurance-list">
          {assurances.map((assurance, index) => (
            <li key={assurance}>
              <span aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>
              {assurance}
            </li>
          ))}
        </ul>
      </section>

      <section className="section ticket-section" id="ticket">
        <div className="ticket-copy">
          <p className="eyebrow">Билет на вечер</p>
          <h2>Один билет на весь вечер</h2>
          <p>
            В него входит разговор и все музыкальные импровизации. Посадка
            свободная — выбираете любое доступное место в зале.
          </p>
          <div className="trust-note">
            <strong>До оплаты</strong>
            <span>
              Покажем дату, тему, финальную стоимость и точные условия возврата.
            </span>
          </div>
        </div>

        <aside className="ticket-card" aria-label="Состав билета">
          <div className="ticket-topline">
            <span>ПРЕДВАРИТЕЛЬНАЯ ЦЕНА</span>
            <strong>2 300 ₽</strong>
          </div>
          <ul>
            <li>Вход на всю программу вечера</li>
            <li>Все циклы разговора и живой импровизации</li>
            <li>Свободная посадка по доступным местам</li>
            <li>Еда и напитки оплачиваются отдельно</li>
          </ul>
          <button
            className="button button-ticket"
            type="button"
            onClick={() => setTicketNoticeOpen(true)}
          >
            Купить билет
          </button>
          <p className="limited">Количество мест ограничено камерным форматом.</p>
        </aside>
      </section>

      <section className="section faq-section">
        <div className="faq-heading">
          <p className="eyebrow light">Перед решением</p>
          <h2>Коротко о важном</h2>
        </div>
        <div className="faq-list">
          {faqs.map((faq) => (
            <details key={faq.question}>
              <summary>{faq.question}</summary>
              <p>{faq.answer}</p>
            </details>
          ))}
        </div>
      </section>

      <section className="final-section">
        <p className="eyebrow light">Чистые пруды · Москва</p>
        <h2>Этот разговор прозвучит только один раз</h2>
        <p>
          Тема может вернуться. Состав зала, его паузы и музыка этого вечера — нет.
        </p>
        <button
          className="button button-primary"
          type="button"
          onClick={() => setTicketNoticeOpen(true)}
        >
          Купить билет
        </button>
      </section>

      <footer>
        <a className="brand footer-brand" href="#top">
          <span>РАЗГОВОР</span><b>×</b><span>ДЖАЗ</span>
        </a>
        <p>Moscow Imagine Live Club · Чистые пруды</p>
        <p>Камерные вечера разговора и джаза</p>
      </footer>

      {ticketNoticeOpen && (
        <div
          className="modal-backdrop"
          role="presentation"
          onMouseDown={() => setTicketNoticeOpen(false)}
        >
          <section
            className="modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="ticket-modal-title"
            onMouseDown={(event) => event.stopPropagation()}
          >
            <button
              className="modal-close"
              type="button"
              aria-label="Закрыть"
              title="Закрыть"
              onClick={() => setTicketNoticeOpen(false)}
            >
              ×
            </button>
            <p className="eyebrow">Продажи откроются после анонса</p>
            <h2 id="ticket-modal-title">Дата следующего вечера скоро появится</h2>
            <p>
              Вместе с датой опубликуем тему, финальную стоимость и условия возврата.
            </p>
            <button
              className="button button-dark"
              type="button"
              onClick={() => setTicketNoticeOpen(false)}
            >
              Понятно
            </button>
          </section>
        </div>
      )}
    </main>
  );
}
