"use client";

import { useEffect, useRef, useState } from "react";

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
    marker: "Беседа",
    title: "Мысль возникает в беседе",
    text: "Ведущий задаёт тему. Кто-то делится мыслью, остальные слушают. Участвовать можно настолько, насколько хочется.",
    image: "01-conversation",
    imageAlt: "Гости внимательно слушают друг друга за столом",
  },
  {
    number: "02",
    marker: "Импровизация",
    title: "Музыканты переводят её в звук",
    text: "Они подхватывают не только слова — их ритм, напряжение и настроение. Так рождается музыка, которой раньше не было.",
    image: "02-musical-response",
    imageAlt: "Джазовое трио импровизирует на сцене",
  },
  {
    number: "03",
    marker: "Новый круг",
    title: "Музыка возвращает тему залу",
    text: "После импровизации беседа продолжается. Та же мысль звучит иначе — и начинается новый круг.",
    image: "03-return-to-room",
    imageAlt: "Гости продолжают беседу после музыкальной импровизации",
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
  const collectiveCanvasRef = useRef<HTMLElement>(null);
  const tragicThemeRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const section = collectiveCanvasRef.current;
    const motionAllowed = window.matchMedia(
      "(min-width: 981px) and (prefers-reduced-motion: no-preference)",
    ).matches;

    if (!section || !motionAllowed) {
      return;
    }

    const fragments = Array.from(
      section.querySelectorAll<HTMLElement>(".collective-fragment"),
    );
    const fragmentStarts = [0.02, 0.09, 0.16, 0.23, 0.3, 0.37, 0.44, 0.51];
    let animationFrame = 0;

    const updateCanvas = () => {
      animationFrame = 0;
      const rect = section.getBoundingClientRect();
      const scrollDistance = Math.max(1, section.offsetHeight - window.innerHeight);
      const progress = Math.min(1, Math.max(0, -rect.top / scrollDistance));

      fragments.forEach((fragment, index) => {
        const localProgress = Math.min(
          1,
          Math.max(0, (progress - fragmentStarts[index]) / 0.42),
        );
        fragment.style.animationDelay = `${-localProgress}s`;
      });

      section.style.setProperty("--collective-fill", `${progress * 100}%`);
      section.dataset.complete = progress > 0.965 ? "true" : "false";
    };

    const requestUpdate = () => {
      if (!animationFrame) {
        animationFrame = window.requestAnimationFrame(updateCanvas);
      }
    };

    section.dataset.scrollReady = "true";
    updateCanvas();
    window.addEventListener("scroll", requestUpdate, { passive: true });
    window.addEventListener("resize", requestUpdate);

    return () => {
      window.removeEventListener("scroll", requestUpdate);
      window.removeEventListener("resize", requestUpdate);
      window.cancelAnimationFrame(animationFrame);
    };
  }, []);

  useEffect(() => {
    const section = tragicThemeRef.current;
    const motionAllowed = window.matchMedia(
      "(min-width: 981px) and (prefers-reduced-motion: no-preference)",
    ).matches;

    if (!section || !motionAllowed) {
      return;
    }

    const scrubbedElements = Array.from(
      section.querySelectorAll<HTMLElement>(".theme-scrub"),
    );
    let animationFrame = 0;

    const updateTheme = () => {
      animationFrame = 0;
      const rect = section.getBoundingClientRect();
      const scrollDistance = Math.max(1, section.offsetHeight - window.innerHeight);
      const progress = Math.min(1, Math.max(0, -rect.top / scrollDistance));

      scrubbedElements.forEach((element) => {
        element.style.animationDelay = `${-progress}s`;
      });

      section.dataset.complete = progress > 0.92 ? "true" : "false";
    };

    const requestUpdate = () => {
      if (!animationFrame) {
        animationFrame = window.requestAnimationFrame(updateTheme);
      }
    };

    section.dataset.scrollReady = "true";
    updateTheme();
    window.addEventListener("scroll", requestUpdate, { passive: true });
    window.addEventListener("resize", requestUpdate);

    return () => {
      window.removeEventListener("scroll", requestUpdate);
      window.removeEventListener("resize", requestUpdate);
      window.cancelAnimationFrame(animationFrame);
    };
  }, []);

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
              srcSet="/hero-jazz-club-800.webp 800w, /hero-jazz-club-1200.webp 1200w, /hero-jazz-club-1600.webp 1600w"
              sizes="100vw"
            />
            <img src="/hero-jazz-club-1600.webp" alt="" />
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
            <span>Для кого</span>
            <strong>Для тех, кто ценит интеллектуальный и творческий досуг</strong>
          </div>
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
              >
                <figure className="format-frame">
                  <picture>
                    <source
                      type="image/webp"
                      srcSet={`/${step.image}-800.webp 800w, /${step.image}-1200.webp 1200w`}
                      sizes="(max-width: 980px) 100vw, 50vw"
                    />
                    <img
                      src={`/${step.image}-1200.webp`}
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
          </div>
        </div>
      </section>

      <section
        ref={collectiveCanvasRef}
        className="collective-section"
        aria-labelledby="collective-title"
      >
        <div className="collective-sticky">
          <div className="collective-copy">
            <p className="eyebrow light">Финальный аккорд</p>
            <h2 id="collective-title">
              Каждая встреча — картина, которую мы создаём вместе.
              <em>Здесь и сейчас.</em>
            </h2>
          </div>

          <div className="collective-visual">
            <div
              className="collective-art"
              role="img"
              aria-label="Абстрактная картина собирается из отдельных фрагментов в единое целое"
            >
              <span className="collective-underlay" aria-hidden="true" />
              {Array.from({ length: 8 }, (_, index) => (
                <span
                  className="collective-fragment"
                  aria-hidden="true"
                  key={index}
                />
              ))}
              <span className="collective-frame" aria-hidden="true" />
            </div>
            <div className="collective-progress" aria-hidden="true">
              <span />
            </div>
          </div>
        </div>
      </section>

      <section
        ref={tragicThemeRef}
        className="theme-section"
        aria-labelledby="theme-title"
      >
        <div className="theme-sticky">
          <div className="theme-copy">
            <p className="eyebrow">Тема первой встречи</p>
            <h2 id="theme-title">Трагический характер</h2>
            <p className="theme-question">
              Почему мы вступаем в бой там, где достаточно пройти мимо, — и
              отступаем там, где нужно сделать шаг?
            </p>

            <div className="theme-beats">
              <article className="theme-beat theme-beat-one theme-scrub">
                <span>01 / импульс</span>
                <h3>Спешим, когда нужна выдержка</h3>
                <p>
                  Одно обидное слово — и мы уже готовы обнажить меч. Хотя иногда
                  достаточно не отвечать и пройти мимо.
                </p>
              </article>

              <article className="theme-beat theme-beat-two theme-scrub">
                <span>02 / выбор</span>
                <h3>Отступаем, когда нужна смелость</h3>
                <p>
                  Перед важным разговором, признанием или великодушным поступком
                  тот же человек может испугаться и не сделать шаг.
                </p>
              </article>
            </div>

            <div className="theme-summary theme-scrub">
              <p>
                Поговорим о трагическом несовпадении между чувством и поступком —
                и о пространстве для другого выбора.
              </p>
              <span>
                Можно включиться в беседу или остаться внимательным слушателем.
              </span>
            </div>
          </div>

          <div
            className="theme-visual"
            role="img"
            aria-label="Красный импульс останавливается перед столкновением, затем две разделённые формы делают шаг навстречу друг другу"
          >
            <span className="theme-thread" aria-hidden="true" />

            <div className="theme-strike-scene theme-scrub" aria-hidden="true">
              <span className="theme-strike-origin" />
              <span className="theme-strike theme-scrub" />
              <span className="theme-stop" />
              <span className="theme-ripple theme-scrub" />
              <em className="theme-pause-word theme-scrub">выдержка</em>
            </div>

            <div className="theme-step-scene theme-scrub" aria-hidden="true">
              <span className="theme-form theme-form-left" />
              <span className="theme-connection theme-scrub" />
              <span className="theme-form theme-form-right theme-scrub" />
              <em className="theme-step-word theme-scrub">сделать шаг</em>
            </div>
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
