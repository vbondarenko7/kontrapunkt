"use client";

import type { CSSProperties, FormEvent } from "react";
import { useEffect, useRef, useState } from "react";

const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
const isStaticPreview = process.env.NEXT_PUBLIC_STATIC_PREVIEW === "true";
const waitlistApiUrl =
  process.env.NEXT_PUBLIC_WAITLIST_API_URL ?? `${basePath}/api/waitlist`;
const assetPath = (path: string) => `${basePath}${path}`;

const formatSteps = [
  {
    number: "01",
    marker: "Беседа",
    title: "Мысль возникает в беседе",
    text: "Ведущий задаёт тему. Кто-то делится мыслью, остальные слушают.",
    image: "01-conversation",
    imageAlt: "Гости внимательно слушают друг друга за столом",
    cutout: "format-host-stage-full-cutout.webp",
  },
  {
    number: "02",
    marker: "Импровизация",
    title: "Музыка, которой раньше не было",
    text: "Музыканты подхватывают мысль, её ритм и настроение — и сразу переводят их в звук. Эту пьесу нельзя заранее отрепетировать или повторить.",
    image: "02-musical-response",
    imageAlt: "Джазовое трио импровизирует на сцене",
    cutout: "format-bassist-cutout.webp",
  },
  {
    number: "03",
    marker: "Новый круг",
    title: "Музыка возвращает тему залу",
    text: "После импровизации беседа продолжается. Та же мысль звучит иначе — и начинается новый круг.",
    image: "03-return-to-room",
    imageAlt: "Гости продолжают беседу после музыкальной импровизации",
    cutout: "format-audience-row-full-cutout.webp",
  },
];

const scenarios = [
  {
    title: "Одному здесь не одиноко",
    text: "Общая тема делает вас частью вечера без светских знакомств и неловких вопросов.",
  },
  {
    title: "Готовиться не нужно",
    text: "Мы говорим не терминами, а через ситуации и чувства, знакомые каждому.",
  },
  {
    title: "Молчать — тоже участвовать",
    text: "Никто не вызовет вас высказаться. Внимание — уже форма участия.",
  },
];

const faqs = [
  {
    question: "Во сколько начало и сколько длится вечер?",
    answer: "[ЗАПОЛНИТЬ: время начала и длительность]",
  },
  {
    question: "Сколько будет музыкальных импровизаций?",
    answer:
      "[ЗАПОЛНИТЬ: число циклов]. Между ними продолжается разговор.",
  },
  {
    question: "Можно ли поужинать во время вечера?",
    answer:
      "[ЗАПОЛНИТЬ: подтвердить у площадки]. Еда и напитки оплачиваются отдельно.",
  },
  {
    question: "Как устроена посадка?",
    answer:
      "Посадка свободная: после прихода вы выбираете любое доступное место в зале.",
  },
  {
    question: "Как добраться?",
    answer: "[ЗАПОЛНИТЬ: адрес и ближайшее метро]",
  },
  {
    question: "Будет ли съёмка?",
    answer:
      "[ЗАПОЛНИТЬ: решить, будет ли фото и видео и как это устроено]",
  },
];

type WaitlistStatus = "idle" | "submitting" | "success" | "error";

export default function Home() {
  const [ticketNoticeOpen, setTicketNoticeOpen] = useState(false);
  const [waitlistStatus, setWaitlistStatus] =
    useState<WaitlistStatus>("idle");
  const [waitlistMessage, setWaitlistMessage] = useState("");
  const musiciansRef = useRef<HTMLElement>(null);
  const themeRef = useRef<HTMLElement>(null);

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

  useEffect(() => {
    if (!ticketNoticeOpen) {
      return;
    }

    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setTicketNoticeOpen(false);
      }
    };

    document.addEventListener("keydown", closeOnEscape);
    return () => document.removeEventListener("keydown", closeOnEscape);
  }, [ticketNoticeOpen]);

  const openWaitlist = () => {
    setWaitlistStatus("idle");
    setWaitlistMessage("");
    setTicketNoticeOpen(true);
  };

  const submitWaitlist = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setWaitlistStatus("submitting");
    setWaitlistMessage("");

    const form = event.currentTarget;
    const formData = new FormData(form);

    try {
      const response = await fetch(waitlistApiUrl, {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({
          name: formData.get("name"),
          contact: formData.get("contact"),
          consent: formData.get("consent") === "yes",
          website: formData.get("website"),
        }),
      });
      const result = (await response.json()) as { message?: string };

      if (!response.ok) {
        throw new Error(result.message ?? "Не удалось сохранить контакт.");
      }

      setWaitlistStatus("success");
      setWaitlistMessage(
        result.message ?? "Готово. Мы сообщим, когда откроются продажи.",
      );
      form.reset();
    } catch (error) {
      setWaitlistStatus("error");
      setWaitlistMessage(
        error instanceof Error
          ? error.message
          : "Не удалось сохранить контакт. Попробуйте ещё раз.",
      );
    }
  };

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
          <p className="hero-script">живые встречи</p>
          <h1 id="hero-title">
            Разговор по душам,{" "}
            <span>
              который становится{" "}
              <em>живым джазом</em>
            </span>
          </h1>
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
            <span>Формат</span>
            <strong>Разговор и джазовая импровизация</strong>
          </div>
          <div>
            <span>Когда</span>
            <strong>[ЗАПОЛНИТЬ: дата и время]</strong>
          </div>
        </div>
      </section>

      <section className="why-section" aria-labelledby="why-title">
        <div className="why-inner">
          <p className="eyebrow light">Зачем идти</p>
          <h2 id="why-title">Такие разговоры не случаются сами</h2>
          <p className="why-lead">
            После тридцати разговор незаметно сжимается до работы, новостей и
            планов. Не потому что не о чем — просто некогда, не с кем и неловко
            начинать.
          </p>
          <p className="why-body">
            Чтобы разговор состоялся, его кто-то должен устроить: выбрать
            вопрос, собрать людей, задать тон и следить, чтобы услышали всех.
            Этот вечер — такое устройство.
          </p>
          <p className="why-closing">
            Уносят отсюда не конспект, а вопрос, который не закрывается на
            выходе.
          </p>
        </div>
      </section>

      <section className="section section-dark" id="format">
        <div className="format-scroll-stage">
          <div className="format-ambient" aria-hidden="true" />
          <div className="format-intro">
            <p className="eyebrow light">Как устроен вечер</p>
            <h2>Беседа становится музыкой</h2>
            <p className="format-concept">
              Три образа одного вечера: мысль рождается, музыка отвечает,
              беседа продолжается.
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
            <h2 id="theme-title">Созданные друг для друга проходят мимо</h2>
            <p className="theme-lead">
              Мы любим не тех, кто похож на наших родителей. Мы любим тех, кто
              похож на то, что однажды открылось в нас самих.
            </p>
            <div className="theme-body">
              <p>
                Если это так, то встреча — вопрос не удачи, а готовности узнать.
                И тогда понятно, почему люди, которым стоило встретиться,
                расходятся: пути пересеклись некстати, и никто никого не узнал.
              </p>
              <p>
                На первом вечере разберём, что именно мы узнаём в другом
                человеке — и почему это чувство всегда возвращается одним и тем
                же.
              </p>
            </div>
          </div>

          <div
            className="theme-visual"
            role="img"
            aria-label="Две линии проходят рядом, но не встречаются"
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
                Но люди, созданные друг для друга,
                <br />
                Соединяются, увы, так редко
              </p>
              <cite>Николай Гумилёв</cite>
            </blockquote>

            <div className="theme-final-question theme-sequence">
              Кого мы проходим, не узнав?
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
              <p className="eyebrow light">Кто на сцене</p>
              <h2 id="musicians-title">
                Они не сопровождают беседу.
                <em>Они отвечают ей.</em>
              </h2>
            </div>
            <div className="musicians-copy">
              <p>
                На сцене — профессиональные джазовые музыканты с большим опытом
                живой импровизации. Они слушают ход беседы, улавливают паузы,
                напряжение и настроение зала — и превращают всё это в музыку,
                которой раньше не было.
              </p>
              <div className="musicians-fact">
                <span>Опыт</span>
                <strong>
                  [ЗАПОЛНИТЬ: действующие джазовые музыканты, играют в московских
                  клубах более N лет]
                </strong>
              </div>
            </div>
          </div>

          <figure
            className="ensemble-stage"
            aria-label="Пианист и контрабасист вступают в музыкальный диалог"
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
              <span>Не готовая программа</span>
              <strong>Музыка возникает в моменте — вместе с беседой</strong>
            </figcaption>
          </figure>

          <div className="host-profile">
            <div className="host-photo">[ЗАПОЛНИТЬ: фото ведущего]</div>
            <div className="host-copy">
              <p className="eyebrow light">Ведущий</p>
              <p>
                Я не преподаватель и не философ. Четыре года я веду
                телеграм-канал, где разбираю эти вопросы для себя — там
                накопилось больше двухсот заметок. Мне негде было говорить об
                этом вживую, поэтому я сделал такой вечер.
              </p>
              <p>
                Моя работа здесь — задать тему и следить, чтобы услышали всех.
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
            alt="Мраморный философ сидит за столом в джазовом клубе"
            width="1600"
            height="900"
          />
          <div className="layered-tint" />
          <div className="layered-copy">
            <p className="eyebrow light">Разговор без снобизма</p>
            <h2 id="layered-scene-title">
              Здесь не оценивают.
              <br />
              Здесь слушают.
            </h2>
            <p className="layered-lead">
              Разговор держится не на эрудиции, а на внимании друг к другу.
              Здесь не побеждают в споре и не проверяют, кто что читал.
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
            onClick={openWaitlist}
          >
            Узнать о старте продаж
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

      <section
        className="final-section"
        style={
          {
            "--final-section-image": `url("${assetPath("/final-venue-crop.webp")}")`,
          } as CSSProperties
        }
      >
        <p className="eyebrow light">Чистые пруды · Москва</p>
        <h2>Этот разговор прозвучит только один раз</h2>
        <p>
          Тема может вернуться. Состав зала, его паузы и музыка этого вечера — нет.
        </p>
        <button
          className="button button-primary"
          type="button"
          onClick={openWaitlist}
        >
          Узнать дату первым
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
            {isStaticPreview ? (
              <div className="waitlist-success">
                <p className="eyebrow">Предварительный анонс</p>
                <h2 id="ticket-modal-title">Дата первого вечера скоро появится</h2>
                <p>
                  Вместе с датой опубликуем финальную стоимость и откроем
                  предварительный список.
                </p>
                <button
                  className="button button-dark"
                  type="button"
                  onClick={() => setTicketNoticeOpen(false)}
                >
                  Понятно
                </button>
              </div>
            ) : waitlistStatus === "success" ? (
              <div className="waitlist-success" aria-live="polite">
                <p className="eyebrow">Контакт сохранён</p>
                <h2 id="ticket-modal-title">Вы в предварительном списке</h2>
                <p>{waitlistMessage}</p>
                <button
                  className="button button-dark"
                  type="button"
                  onClick={() => setTicketNoticeOpen(false)}
                >
                  Закрыть
                </button>
              </div>
            ) : (
              <>
                <p className="eyebrow">Предварительный список</p>
                <h2 id="ticket-modal-title">Узнать о первом вечере</h2>
                <p>
                  Оставьте контакт — напишем один раз, когда появятся дата и
                  билеты.
                </p>
                <form className="waitlist-form" onSubmit={submitWaitlist}>
                  <label>
                    <span>Имя <small>необязательно</small></span>
                    <input
                      autoComplete="name"
                      maxLength={80}
                      name="name"
                      placeholder="Как к вам обращаться"
                      type="text"
                    />
                  </label>
                  <label>
                    <span>Email или Telegram</span>
                    <input
                      autoComplete="email"
                      autoFocus
                      maxLength={160}
                      name="contact"
                      placeholder="name@example.com или @username"
                      required
                      type="text"
                    />
                  </label>
                  <label className="waitlist-consent">
                    <input name="consent" required type="checkbox" value="yes" />
                    <span>Согласен получить сообщение о первом вечере.</span>
                  </label>
                  <label className="waitlist-honeypot" aria-hidden="true">
                    <span>Сайт</span>
                    <input
                      autoComplete="off"
                      name="website"
                      tabIndex={-1}
                      type="text"
                    />
                  </label>
                  {waitlistMessage && (
                    <p
                      className="waitlist-error"
                      role="alert"
                    >
                      {waitlistMessage}
                    </p>
                  )}
                  <button
                    className="button button-dark"
                    disabled={waitlistStatus === "submitting"}
                    type="submit"
                  >
                    {waitlistStatus === "submitting"
                      ? "Сохраняем…"
                      : "Оставить контакт"}
                  </button>
                </form>
              </>
            )}
          </section>
        </div>
      )}
    </main>
  );
}
