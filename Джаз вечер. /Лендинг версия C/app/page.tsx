"use client";

import type { CSSProperties } from "react";
import { useEffect, useRef, useState } from "react";
import {
  trackAuthorVideoOpen,
  trackTelegramClick,
  trackTicketClick,
  trackWhatsAppClick,
} from "./analytics";

const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
const assetPath = (path: string) => `${basePath}${path}`;
const telegramUrl = "https://t.me/vad6272";
const ticketChannelUrl = "https://t.me/VadimBond7";
const whatsappUrl = "https://wa.me/79032405040";
const ticketOptions = [
  { quantity: 1, label: "1 билет", url: "https://payform.ru/qsccfki/" },
  { quantity: 2, label: "2 билета", url: "https://payform.ru/tbcd9NC/" },
  { quantity: 3, label: "3 билета", url: "https://payform.ru/5fcd9OZ/" },
  { quantity: 4, label: "4 билета", url: "https://payform.ru/5fcd9Ph/" },
  { quantity: 5, label: "5 билетов", url: "https://payform.ru/5fcd9Pk/" },
  { quantity: 6, label: "6 билетов", url: "https://payform.ru/5fcd9Pl/" },
];

const formatSteps = [
  {
    number: "01",
    marker: "Беседа",
    title: "Мысль возникает в беседе",
    text: "Ведущий задаёт тему. Кто-то из гостей говорит первым, остальные слушают.",
    image: "01-conversation",
    imageAlt: "Гости внимательно слушают друг друга за столом",
    cutout: "format-host-stage-full-cutout.webp",
  },
  {
    number: "02",
    marker: "Импровизация",
    title: "Музыка, которой раньше не было",
    text: "Музыканты слушают гостей и следят за настроением зала. В нужный момент ведущий даёт им знак начать импровизацию.",
    image: "02-musical-response",
    imageAlt: "Джазовые музыканты импровизируют на сцене",
    cutout: "format-bassist-cutout.webp",
  },
  {
    number: "03",
    marker: "Новый круг",
    title: "Импровизация меняет ход беседы",
    text: "Разговор продолжается, но та же мысль теперь звучит иначе — так начинается новый круг.",
    image: "03-return-to-room",
    imageAlt: "Гости продолжают беседу после музыкальной импровизации",
    cutout: "format-audience-row-full-cutout.webp",
  },
];

const scenarios = [
  {
    title: "Можно прийти без компании",
    text: "Не нужно заранее знать других гостей или специально с кем-то знакомиться: общая тема объединяет весь зал.",
  },
  {
    title: "Готовиться не нужно",
    text: "Мы говорим о том, что знакомо по собственному опыту. Специальных знаний не требуется.",
  },
  {
    title: "Молчать — тоже участвовать",
    text: "Никто не попросит вас говорить, если вы этого не хотите. Внимание — уже форма участия.",
  },
];

const faqs = [
  {
    question: "Во сколько начало?",
    answer: "Начало в 17:30.",
  },
  {
    question: "Как устроена посадка?",
    answer:
      "Посадка свободная, без нумерации. Можно занять любое свободное место.",
  },
  {
    question: "Как добраться?",
    answer:
      "Moscow Imagine Live Club: улица Покровка, 16/16, вход с Хохловской площади. Ближайшие станции метро — «Чистые пруды», «Тургеневская» и «Сретенский бульвар».",
  },
];

function AuthorVideo({ placement }: { placement: string }) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const close = () => {
    videoRef.current?.pause();
    dialogRef.current?.close();
  };

  return (
    <>
      <button
        type="button"
        className="author-video-link"
        aria-label="Послушать замысел: видео от автора, две минуты"
        onClick={() => {
          dialogRef.current?.showModal();
          videoRef.current?.play().catch(() => {});
          trackAuthorVideoOpen(placement);
        }}
      >
        <span className="author-video-thumb" aria-hidden="true">
          <img src={assetPath("/video/intro-01.jpg")} alt="" />
          <i />
        </span>
        <span className="author-video-text">
          <b>Послушать замысел</b>
          <em>две минуты от автора</em>
        </span>
      </button>
      <dialog
        className="author-video-dialog"
        ref={dialogRef}
        onClose={() => videoRef.current?.pause()}
        onMouseDown={(event) => {
          if (event.target === dialogRef.current) {
            close();
          }
        }}
      >
        <video
          ref={videoRef}
          controls
          playsInline
          preload="none"
          poster={assetPath("/video/intro-01.jpg")}
        >
          <source src={assetPath("/video/intro-01.mp4")} type="video/mp4" />
          <track
            kind="subtitles"
            srcLang="ru"
            label="Русские субтитры"
            src={assetPath("/video/intro-01.ru.vtt")}
            default
          />
        </video>
        <button
          type="button"
          className="author-video-close"
          onClick={close}
          aria-label="Закрыть видео"
        >
          ×
        </button>
      </dialog>
    </>
  );
}

function TicketQuantityPicker({
  value,
  onChange,
}: {
  value: number;
  onChange: (quantity: number) => void;
}) {
  return (
    <div className="ticket-quantity">
      <span>Количество билетов</span>
      <div className="ticket-quantity-options" role="group" aria-label="Количество билетов">
        {ticketOptions.map((option) => (
          <button
            key={option.quantity}
            type="button"
            aria-label={option.label}
            aria-pressed={value === option.quantity}
            onClick={() => onChange(option.quantity)}
          >
            {option.quantity}
          </button>
        ))}
      </div>
    </div>
  );
}

export default function Home() {
  const musiciansRef = useRef<HTMLElement>(null);
  const themeRef = useRef<HTMLElement>(null);
  const [ticketQuantity, setTicketQuantity] = useState(1);
  const selectedTicket = ticketOptions[ticketQuantity - 1];

  useEffect(() => {
    const section = musiciansRef.current;
    const motionAllowed = window.matchMedia(
      "(prefers-reduced-motion: no-preference)",
    ).matches;

    if (!section || !motionAllowed) {
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          section.dataset.active = "true";
          observer.disconnect();
        }
      },
      {
        threshold: 0.24,
      },
    );

    section.dataset.motionReady = "true";
    observer.observe(section);

    return () => {
      observer.disconnect();
      delete section.dataset.motionReady;
      delete section.dataset.active;
    };
  }, []);

  useEffect(() => {
    const section = themeRef.current;
    const motionAllowed = window.matchMedia(
      "(min-width: 981px) and (prefers-reduced-motion: no-preference)",
    ).matches;

    if (!section || !motionAllowed) {
      return;
    }

    const visual = section.querySelector<HTMLElement>(".theme-visual");
    const finale = section.querySelector<HTMLElement>(
      ".theme-final-question",
    );

    if (!visual) {
      return;
    }

    const markComplete = () => {
      section.dataset.complete = "true";
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          section.dataset.active = "true";
          observer.disconnect();
        }
      },
      {
        threshold: 0.28,
      },
    );

    section.dataset.autoReady = "true";
    finale?.addEventListener("animationend", markComplete, { once: true });
    observer.observe(visual);

    return () => {
      observer.disconnect();
      finale?.removeEventListener("animationend", markComplete);
      delete section.dataset.autoReady;
      delete section.dataset.active;
      delete section.dataset.complete;
    };
  }, []);

  return (
    <main id="top">
      <header className="site-header" aria-label="Основная навигация">
        <a className="brand" href="#top" aria-label="Разговор и джаз — в начало">
          <span>РАЗГОВОР</span>
          <b aria-hidden="true">×</b>
          <span>ДЖАЗ</span>
        </a>
        <nav>
          <a href="#format">Формат</a>
          <a href="#ticket">Билет</a>
        </nav>
        <a
          className="header-contact"
          href={telegramUrl}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => trackTelegramClick("header")}
          aria-label="Написать в Telegram"
        >
          Telegram <span aria-hidden="true">↗</span>
        </a>
      </header>

      <section className="hero" aria-labelledby="hero-title">
        <div className="hero-media" aria-hidden="true">
          <picture>
            <source
              type="image/webp"
              srcSet={`${assetPath("/hero-jazz-club-800.webp")} 800w, ${assetPath("/hero-jazz-club-1200.webp")} 1200w, ${assetPath("/hero-jazz-club-1600.webp")} 1600w`}
              sizes="100vw"
            />
            <img src={assetPath("/hero-jazz-club-1600.webp")} alt="" />
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
          <h1 id="hero-title">
            Разговор по душам,{" "}
            <span>
              на который отвечает <em>живой джаз</em>
            </span>
          </h1>
          <p className="hero-copy">
            Музыканты слушают разговор и импровизируют по его ходу.
          </p>
          <div className="hero-actions">
            <a className="button button-primary" href="#format">
              Узнать подробнее <span aria-hidden="true">↓</span>
            </a>
            <AuthorVideo placement="hero" />
          </div>
        </div>
        <div className="hero-facts" aria-label="Ключевые факты">
          <div>
            <span>Где</span>
            <strong>Moscow Imagine Live Club</strong>
          </div>
          <div>
            <span>Гостей</span>
            <strong>не более 60</strong>
          </div>
          <div>
            <span>Когда</span>
            <strong>Суббота, 19 сентября · 17:30</strong>
          </div>
        </div>
      </section>

      <section className="why-section" aria-labelledby="why-title">
        <div className="why-inner">
          <p className="eyebrow light">Зачем идти</p>
          <h2 id="why-title">Такие разговоры не случаются сами</h2>
          <p className="why-lead">
            Со временем разговоры всё чаще сводятся к работе, новостям и планам.
            Не потому, что говорить не о чем. Просто не хватает времени или
            подходящей компании, а начинать бывает неловко.
          </p>
          <p className="why-body">
            Мы выбираем тему и собираем людей, чтобы спокойно говорить и слушать друг друга.
            Так устроен этот вечер.
          </p>
          <p className="why-closing">
            Отсюда уходят не с готовым ответом, а с вопросом, который ещё долго звучит
            внутри.
          </p>
        </div>
      </section>

      <section className="section section-dark" id="format">
        <div className="format-scroll-stage">
          <div className="format-ambient" aria-hidden="true" />
          <div className="format-intro">
            <p className="eyebrow light">Как устроен вечер</p>
            <h2>Разговор сменяется музыкой и продолжается</h2>
            <p className="format-concept">
              За вечер этот цикл повторяется.
            </p>
          </div>
          <div className="format-story">
            <div className="format-storyline" aria-hidden="true" />
            {formatSteps.map((step, index) => (
              <article
                className={`format-chapter${index === 1 ? " format-chapter-reverse" : ""}`}
                id={`format-step-${step.number}`}
                key={step.number}
                style={
                  {
                    "--format-cutout-image": `url("${assetPath(`/${step.cutout}`)}")`,
                  } as CSSProperties
                }
              >
                <figure className="format-frame">
                  <picture>
                    <source
                      type="image/webp"
                      srcSet={`${assetPath(`/${step.image}-800.webp`)} 800w, ${assetPath(`/${step.image}-1200.webp`)} 1200w`}
                      sizes="(max-width: 980px) 100vw, 50vw"
                    />
                    <img
                      src={assetPath(`/${step.image}-1200.webp`)}
                      alt={step.imageAlt}
                      width="1200"
                      height="800"
                    />
                  </picture>
                  <span className="format-light-orbit" aria-hidden="true" />
                  <span className="format-cutout" aria-hidden="true" />
                  <span aria-hidden="true">{step.number}</span>
                </figure>
                <div className="format-chapter-copy">
                  <p className="format-marker">
                    <span>{step.number}</span>
                    {step.marker}
                  </p>
                  <h3>{step.title}</h3>
                  <p>{step.text}</p>
                </div>
              </article>
            ))}
            <p className="format-closing">
              Ваше присутствие меняет музыку. Даже если вы промолчите весь
              вечер.
            </p>
          </div>
        </div>
      </section>

      <section
        ref={themeRef}
        className="theme-section"
        aria-labelledby="theme-title"
      >
        <div className="theme-sticky">
          <div className="theme-copy">
            <div className="theme-kicker">
              <span>Тема первой встречи</span>
              <i aria-hidden="true" />
              <b>№ 01</b>
            </div>
            <h2 id="theme-title">Созданные друг для друга проходят мимо</h2>
            <p className="theme-lead">
              Иногда среди десятков людей один человек вдруг притягивает внимание. Мы ещё
              ничего о нём не знаем, но уже чувствуем: здесь может начаться что-то важное.
            </p>
            <div className="theme-body">
              <p>
                На первом вечере поговорим о первых мгновениях любви — о том, откуда берётся это притяжение
                и почему иногда мы всё-таки не делаем шаг навстречу.
              </p>
            </div>
          </div>

          <div
            className="theme-visual"
            role="img"
            aria-label="Две линии проходят рядом, но не встречаются"
          >
            <svg
              className="theme-paths"
              viewBox="0 0 600 240"
              preserveAspectRatio="xMidYMid meet"
              aria-hidden="true"
            >
              <path
                className="theme-path theme-path-upper"
                pathLength="1"
                d="M0,34 C150,34 232,106 300,110 C368,114 450,34 600,34"
              />
              <path
                className="theme-path theme-path-lower"
                pathLength="1"
                d="M0,206 C150,206 232,134 300,130 C368,126 450,206 600,206"
              />
              <line className="theme-tick" x1="300" y1="98" x2="300" y2="110" />
              <line className="theme-tick" x1="300" y1="130" x2="300" y2="142" />
            </svg>

            <blockquote className="theme-quote theme-sequence">
              <p>
                Но люди, созданные друг для друга,
                <br />
                Соединяются, увы, так редко
              </p>
              <cite>Николай Гумилёв</cite>
            </blockquote>

            <div className="theme-final-question theme-sequence">
              Кого мы не замечаем, проходя мимо?
            </div>
          </div>
        </div>
      </section>

      <section
        ref={musiciansRef}
        className="musicians-section"
        aria-labelledby="musicians-title"
      >
        <div className="musicians-shell">
          <div className="musicians-intro">
            <div>
              <p className="eyebrow light">Кто на сцене</p>
              <h2 id="musicians-title">
                Они не сопровождают разговор.
                <em>Они продолжают его музыкой.</em>
              </h2>
            </div>
            <div className="musicians-copy">
              <p>
                На сцене — профессиональные джазовые музыканты.
              </p>
            </div>
          </div>

          <figure
            className="ensemble-stage"
            aria-label="Пианист и контрабасист вступают в музыкальный диалог"
          >
            <span className="ensemble-glow" aria-hidden="true" />
            <div className="ensemble-words" aria-hidden="true">
              <span>Слышат</span>
              <span>Отвечают</span>
            </div>

            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              className="ensemble-pianist"
              src={assetPath("/decor/pianist-grand-piano.webp")}
              alt=""
              aria-hidden="true"
              width="1536"
              height="1024"
            />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              className="ensemble-bassist"
              src={assetPath("/format-bassist-cutout.webp")}
              alt=""
              aria-hidden="true"
              width="1024"
              height="1536"
            />

            <figcaption className="ensemble-note">
              <span>Без готовой программы</span>
            </figcaption>
          </figure>

          <div className="host-profile">
            <div className="host-photo">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={assetPath("/host-vadim-portrait.webp")}
                alt="Вадим Бондаренко, ведущий вечера"
                width="1122"
                height="1402"
              />
            </div>
            <div className="host-copy">
              <p className="eyebrow light">Ведущий</p>
              <p>
                Я не преподаватель и не философ. Четыре года я веду
                {" "}
                <a
                  href="https://t.me/VadimBond7"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => trackTelegramClick("host_channel")}
                >телеграм-канал</a>, где разбираю важные для меня
                вопросы. За это время там накопилось больше двухсот заметок. В какой-то момент мне
                захотелось обсуждать эти вопросы не только в канале, но и вживую — вместе с другими
                людьми. Так появился этот вечер.
              </p>
              <p>
                Моя задача — задать тему, вести разговор и давать слово тем, кто хочет высказаться.
              </p>
              <p className="host-signature">
                Вадим Бондаренко · автор формата
              </p>
            </div>
          </div>
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
            src={assetPath("/philosopher-scene.webp")}
            alt="Мраморный философ сидит за столом в джазовом клубе"
            width="1600"
            height="900"
          />
          <div className="layered-tint" />
          <div className="layered-copy">
            <p className="eyebrow light">Разговор без снобизма</p>
            <h2 id="layered-scene-title">
              Здесь не оценивают.
              <br />
              Здесь слушают.
            </h2>
            <p className="layered-lead">
              Разговор держится не на эрудиции, а на внимании друг к другу.
              Здесь не побеждают в споре и не проверяют, кто что читал.
            </p>
            <div className="layered-scenario-list">
              {scenarios.map((scenario) => (
                <article className="layered-scenario" key={scenario.title}>
                  <h3>{scenario.title}</h3>
                  <p>{scenario.text}</p>
                </article>
              ))}
            </div>
          </div>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            className="layered-candle-cleanup"
            src={assetPath("/candle-flame-cleanup.png")}
            alt=""
            aria-hidden="true"
            width="1600"
            height="900"
          />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            className="layered-candle-motion"
            src={assetPath("/candle-flame-real.webp")}
            alt=""
            aria-hidden="true"
            width="1600"
            height="900"
          />
          <div className="layered-shade" />
          <div className="film-grain layered-grain" />
        </div>
      </section>

      <section className="section ticket-section" id="ticket">
        <div className="ticket-copy">
          <p className="eyebrow">Билет на вечер</p>
          <h2>Вся программа — в одном билете</h2>
          <p>На первом вечере — не более 60 гостей.</p>
        </div>

        <aside className="ticket-card" aria-label="Состав билета">
          <div className="ticket-topline">
            <span>ЦЕНА БИЛЕТА</span>
            <strong>2 500 ₽</strong>
            <p className="ticket-subscriber-offer">
              <span>
                Подписчикам телеграм-канала — <strong>2 250 ₽</strong>
              </span>
              <a
                href={ticketChannelUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => trackTelegramClick("ticket_channel")}
              >
                Получить промокод <span aria-hidden="true">↗</span>
              </a>
            </p>
          </div>
          <ul>
            <li>участие в общем разговоре</li>
            <li>все музыкальные импровизации вечера</li>
          </ul>
          <p className="ticket-terms">
            Посадка свободная. Еда и напитки оплачиваются отдельно.
          </p>
          <div className="ticket-order">
            <TicketQuantityPicker
              value={ticketQuantity}
              onChange={setTicketQuantity}
            />
            <p className="ticket-total">
              <span>Итого</span>
              <strong>
                {(selectedTicket.quantity * 2500).toLocaleString("ru-RU")} ₽
              </strong>
            </p>
          </div>
          <a
            className="button button-ticket"
            href={selectedTicket.url}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => trackTicketClick("ticket_card")}
          >
            Купить билет
          </a>
        </aside>
      </section>

      <section className="section faq-section">
        <div className="faq-heading">
          <h2>Коротко о важном</h2>
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

      <section className="section contact-section" aria-labelledby="contact-title">
        <div className="contact-copy">
          <p className="eyebrow light">Остался вопрос?</p>
          <h2 id="contact-title">Напишите мне</h2>
          <p>
            Я сам отвечу о вечере, билетах и всём, что важно знать до встречи.
          </p>
        </div>
        <div className="contact-actions">
          <a
            className="button button-primary"
            href={telegramUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => trackTelegramClick("after_faq")}
          >
            Написать в Telegram <span aria-hidden="true">↗</span>
          </a>
          <a
            className="button button-contact-secondary"
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => trackWhatsAppClick("after_faq")}
          >
            Написать в WhatsApp <span aria-hidden="true">↗</span>
          </a>
        </div>
      </section>

      <section
        className="final-section"
        style={
          {
            "--final-section-image": `url("${assetPath("/final-venue-crop.webp")}")`,
          } as CSSProperties
        }
      >
        <p className="eyebrow light">19 сентября · 17:30 · Москва</p>
        <h2>Этот разговор прозвучит только один раз</h2>
        <p>
          К этой теме можно вернуться. Но именно в таком составе зал больше не соберётся, и эта музыка не прозвучит снова.
        </p>
        <a className="button button-primary" href="#ticket">
          Купить билет
        </a>
      </section>

      <footer>
        <a className="brand footer-brand" href="#top">
          <span>РАЗГОВОР</span><b>×</b><span>ДЖАЗ</span>
        </a>
        <p>Moscow Imagine Live Club · Покровка, 16/16</p>
        <nav className="footer-contacts" aria-label="Связаться с организатором">
          <a
            href={telegramUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => trackTelegramClick("footer")}
          >
            Telegram
          </a>
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => trackWhatsAppClick("footer")}
          >
            WhatsApp
          </a>
        </nav>
      </footer>
    </main>
  );
}
