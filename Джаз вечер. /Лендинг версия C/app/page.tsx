"use client";

import { useEffect, useRef, useState } from "react";

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
    title: "Музыка, которой раньше не было",
    text: "Музыканты подхватывают мысль, её ритм и настроение — и сразу переводят их в звук. Эту пьесу нельзя заранее отрепетировать или повторить.",
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
    label: "Одному",
    title: "Одному — нормально",
    text: "Общая тема помогает почувствовать себя частью вечера без неловких знакомств и светского разговора.",
  },
  {
    label: "Без подготовки",
    title: "Без специальной подготовки",
    text: "Мы говорим не языком терминов, а через ситуации и чувства, знакомые каждому.",
  },
  {
    label: "Слушать",
    title: "Можно просто слушать",
    text: "Никто не потребует высказаться или доказать свою точку зрения. Внимание — уже форма участия.",
  },
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

    const visual = section.querySelector<HTMLElement>(".tragic-visual");
    const finale = section.querySelector<HTMLElement>(
      ".tragic-final-question",
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
        className="tragic-section"
        aria-labelledby="theme-title"
      >
        <div className="tragic-sticky">
          <div className="tragic-copy">
            <div className="tragic-kicker">
              <span>Тема первой встречи</span>
              <i aria-hidden="true" />
              <b>№ 01</b>
            </div>
            <h2 id="theme-title">Трагический характер</h2>
            <p className="tragic-lead">
              Характер становится судьбой, когда мы не узнаём собственную
              ошибку в её следующем повторении.
            </p>
            <div className="tragic-body">
              <p>
                Событие произошло, но опыт из него не извлечён. Поэтому мы снова
                приходим в ту же точку — с теми же чувствами, страхами и
                поступками.
              </p>
              <p>
                На первой встрече попробуем увидеть этот круг в собственной
                жизни. Можно включиться в беседу или просто слушать.
              </p>
            </div>
          </div>

          <div
            className="tragic-visual"
            role="img"
            aria-label="Человек снова и снова идёт по замкнутому кругу, оставляя следы повторения; в конце в круге появляется небольшой разрыв"
          >
            <span className="tragic-field" aria-hidden="true" />
            <span className="tragic-ring tragic-ring-base" aria-hidden="true" />
            <span
              className="tragic-ring tragic-ring-echo-one tragic-sequence"
              aria-hidden="true"
            />
            <span
              className="tragic-ring tragic-ring-echo-two tragic-sequence"
              aria-hidden="true"
            />
            <span
              className="tragic-ring tragic-ring-echo-three tragic-sequence"
              aria-hidden="true"
            />

            <span className="tragic-scar tragic-scar-one" aria-hidden="true" />
            <span className="tragic-scar tragic-scar-two" aria-hidden="true" />
            <span className="tragic-scar tragic-scar-three" aria-hidden="true" />

            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              className="tragic-ghost tragic-ghost-one tragic-sequence"
              src="/tragic-loop-walker.png"
              alt=""
              aria-hidden="true"
            />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              className="tragic-ghost tragic-ghost-two tragic-sequence"
              src="/tragic-loop-walker.png"
              alt=""
              aria-hidden="true"
            />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              className="tragic-walker tragic-orbit"
              src="/tragic-loop-walker.png"
              alt=""
              aria-hidden="true"
            />

            <blockquote className="tragic-quote tragic-sequence">
              <p>
                «Ад — это забытое.
                <br />
                А раз забытое, значит,
                <br />
                будет повторяться».
              </p>
              <cite>Мераб Мамардашвили</cite>
            </blockquote>

            <span className="tragic-break tragic-sequence" aria-hidden="true" />
            <div className="tragic-final-question tragic-sequence">
              Какой опыт должен быть извлечён,
              <br />
              чтобы круг разомкнулся?
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
            src="/philosopher-scene.webp"
            alt="Мраморный философ сидит за столом в джазовом клубе"
            width="1600"
            height="900"
          />
          <div className="layered-tint" />
          <div className="layered-atmosphere" aria-hidden="true">
            <span className="layered-stage-glow" />
            <span className="layered-light-shaft" />
            <span className="layered-haze" />
          </div>
          <div className="layered-copy">
            <p className="eyebrow light">Разговор без снобизма</p>
            <h2 id="layered-scene-title">
              Здесь не оценивают.
              <br />
              Здесь слушают.
            </h2>
            <p className="layered-lead">
              Здесь одинаково рады тем, кто давно интересуется философией и
              джазом, и тем, кто только начинает с ними знакомиться. Главное —
              интерес к теме, внимание друг к другу и дружелюбная атмосфера.
            </p>
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
