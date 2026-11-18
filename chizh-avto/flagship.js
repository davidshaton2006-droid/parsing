/* CHIZH AUTO / flagship interactive concept.
   Every text block, link, and contact action is usable if JS/CDNs are unavailable. */
(() => {
  'use strict';
  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => Array.from(root.querySelectorAll(selector));
  const reduced = window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches ?? false;

  // Responsive navigation with Escape, outside click and restored focus.
  const menuButton = $('#menuButton');
  const nav = $('#navLinks');
  const menuClose = (restore = false) => {
    if (!menuButton || !nav) return;
    if (restore && nav.dataset.open === 'true') menuButton.focus();
    nav.dataset.open = 'false';
    menuButton.setAttribute('aria-expanded', 'false');
    menuButton.setAttribute('aria-label', 'Открыть меню');
  };
  menuButton?.addEventListener('click', () => {
    const open = nav.dataset.open !== 'true';
    nav.dataset.open = String(open);
    menuButton.setAttribute('aria-expanded', String(open));
    menuButton.setAttribute('aria-label', open ? 'Закрыть меню' : 'Открыть меню');
  });
  $$('a', nav).forEach(a => a.addEventListener('click', () => menuClose(false)));
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') menuClose(true);
  });
  document.addEventListener('pointerdown', e => {
    if (nav && menuButton && !nav.contains(e.target) && !menuButton.contains(e.target)) menuClose();
  });

  // Top scroll indicator, with no content-blocking intro or loading overlay.
  const progress = $('#scrollProgress');
  let scrollQueued = false;
  function updateScrollProgress() {
    const total = document.documentElement.scrollHeight - window.innerHeight;
    const fraction = total > 0 ? Math.min(1, Math.max(0, window.scrollY / total)) : 0;
    if (progress) progress.style.transform = `scaleX(${fraction.toFixed(4)})`;
    scrollQueued = false;
  }
  window.addEventListener('scroll', () => {
    if (!scrollQueued) { scrollQueued = true; requestAnimationFrame(updateScrollProgress); }
  }, { passive: true });
  window.addEventListener('resize', updateScrollProgress, { passive: true });
  updateScrollProgress();

  // Real service directions, sourced from the published company catalog.
  // Prices are company-published FROM values, never a quote or a live booking.
  const modes = {
    security: {
      index: '01 / PROTECTION', stage: 'РЕЖИМ / SECURITY', title: 'ЗАЩИТА,\nКОТОРАЯ\nРАБОТАЕТ.',
      body: 'Охранные комплексы, управление со смартфона и автозапуск при совместимости. Состав функций уточняется для конкретной машины.',
      points: ['Автосигнализации', 'Управление со смартфона', 'Автозапуск при совместимости'],
      price: 'от 9 150 ₽', select: 'Автосигнализации и автозапуск'
    },
    media: {
      index: '02 / CONNECTIVITY', stage: 'РЕЖИМ / MULTIMEDIA', title: 'ВСЁ НУЖНОЕ\nНА ОДНОМ\nЭКРАНЕ.',
      body: 'Головные устройства, камеры переднего и заднего вида, круговой обзор и парковочные помощники. Решение под штатную электронику.',
      points: ['Android-мультимедиа', 'Камеры и система 360°', 'Парковочные радары'],
      price: 'По запросу', select: 'Мультимедиа и камеры 360°'
    },
    sound: {
      index: '03 / SOUND', stage: 'РЕЖИМ / SOUND', title: 'ЗВУК,\nКОТОРЫЙ\nТВОЙ.',
      body: 'Новые динамики, усилители и настройка звучания под музыкальные привычки. Можно начать с улучшения штатной системы.',
      points: ['Акустика', 'Усиление звучания', 'Подбор компонентов'],
      price: 'от 4 000 ₽', select: 'Автозвук'
    },
    light: {
      index: '04 / VISION', stage: 'РЕЖИМ / OPTICS', title: 'СМОТРИ\nНА ДОРОГУ\nИНАЧЕ.',
      body: 'Восстановление фар, регулировка, работа с оптикой и установка Bi-LED линз. Обсуждаются совместимость и законность решения.',
      points: ['Bi-LED линзы', 'Полировка и бронирование фар', 'Регулировка света'],
      price: 'от 1 000 ₽', select: 'Автосвет и оптика'
    },
    style: {
      index: '05 / FINISH', stage: 'РЕЖИМ / STYLE', title: 'ХАРАКТЕР\nВ КАЖДОЙ\nДЕТАЛИ.',
      body: 'Тонировка, защитные плёнки, шумоизоляция, детейлинг. От повседневного комфорта до выразительного внешнего вида.',
      points: ['Защитные плёнки', 'Тонировка', 'Шумоизоляция и уход'],
      price: 'от 4 000 ₽', select: 'Плёнки и детейлинг'
    }
  };
  let currentMode = 'security';
  let motionApi = null;
  const modeButtons = $$('.config-option');
  const stage = $('#configStage');
  const resultTitle = $('#resultTitle');
  const resultDescription = $('#resultDescription');
  const resultPoints = $('#resultPoints');
  const resultPrice = $('#resultPrice');
  const resultNumber = $('#resultNumber');
  const stageMode = $('#stageMode');
  const inquiryService = $('#requestService');

  function changeMode(key) {
    const data = modes[key];
    if (!data) return;
    currentMode = key;
    modeButtons.forEach(b => b.setAttribute('aria-pressed', String(b.dataset.mode === key)));
    stage.dataset.mode = key;
    resultTitle.replaceChildren(...data.title.split('\n').flatMap((line, i, all) => {
      const nodes = [document.createTextNode(line)];
      if (i < all.length - 1) nodes.push(document.createElement('br'));
      return nodes;
    }));
    resultDescription.textContent = data.body;
    resultNumber.textContent = data.index;
    resultPrice.textContent = data.price;
    stageMode.textContent = data.stage;
    resultPoints.replaceChildren(...data.points.map(text => {
      const li = document.createElement('li');
      li.textContent = text;
      return li;
    }));
    if (motionApi && !reduced) {
      try {
        motionApi.animate('.result-title, .result-description, .result-points, .result-price', {
          opacity: [0.68, 1], y: [9, 0]
        }, { duration: 0.42, delay: motionApi.stagger(0.045), ease: [0.16, 1, 0.3, 1] });
      } catch { /* the information is already available */ }
    }
  }
  modeButtons.forEach(button => button.addEventListener('click', () => changeMode(button.dataset.mode)));
  $('.config-nav')?.addEventListener('keydown', e => {
    const keys = ['ArrowLeft','ArrowRight','ArrowUp','ArrowDown','Home','End'];
    if (!keys.includes(e.key)) return;
    e.preventDefault();
    const index = modeButtons.indexOf(document.activeElement);
    const movement = e.key === 'Home' ? 0 : e.key === 'End' ? modeButtons.length - 1 : Math.max(0, (index + (e.key === 'ArrowRight' || e.key === 'ArrowDown' ? 1 : -1) + modeButtons.length) % modeButtons.length);
    const next = modeButtons[movement];
    next?.focus(); next?.click();
  });
  $('#configCTA')?.addEventListener('click', () => {
    if (inquiryService) inquiryService.value = modes[currentMode].select;
  });
  $$('[data-service]').forEach(link => link.addEventListener('click', () => {
    if (inquiryService) inquiryService.value = link.dataset.service;
  }));

  // Responsive custom schematic pointer movement; decorative only.
  if (!reduced && window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
    stage?.addEventListener('pointermove', e => {
      const bounds = stage.getBoundingClientRect();
      const x = (e.clientX - bounds.left) / bounds.width - .5;
      const y = (e.clientY - bounds.top) / bounds.height - .5;
      const car = $('.car-graphic', stage);
      if (car) car.style.transform = `perspective(950px) rotateX(${(-y * 3.5).toFixed(2)}deg) rotateY(${(x * 5).toFixed(2)}deg)`;
    }, { passive: true });
    stage?.addEventListener('pointerleave', () => {
      const car = $('.car-graphic', stage);
      if (car) car.style.transform = '';
    });
    $$('.magnetic').forEach(button => {
      button.addEventListener('pointermove', e => {
        const rect = button.getBoundingClientRect();
        const dx = (e.clientX - rect.left - rect.width/2) * .08;
        const dy = (e.clientY - rect.top - rect.height/2) * .12;
        button.style.transform = `translate3d(${dx.toFixed(1)}px, ${dy.toFixed(1)}px, 0)`;
      }, { passive: true });
      button.addEventListener('pointerleave', () => button.style.transform = '');
      button.addEventListener('blur', () => button.style.transform = '');
    });
  }

  // No-JS horizontal scroll-snap is the baseline. Embla enhances drag and arrows.
  const portfolio = $('#portfolioTrack');
  const previous = $('#projectsPrev');
  const next = $('#projectsNext');
  let carousel = null;
  const fallbackSlide = delta => {
    if (!portfolio) return;
    const card = $('.portfolio-card', portfolio);
    const width = (card?.getBoundingClientRect().width || 410) + 18;
    portfolio.scrollBy({left: width * delta, behavior: reduced ? 'instant' : 'smooth'});
  };
  previous?.addEventListener('click', () => carousel ? carousel.scrollPrev() : fallbackSlide(-1));
  next?.addEventListener('click', () => carousel ? carousel.scrollNext() : fallbackSlide(1));

  import('https://cdn.jsdelivr.net/npm/embla-carousel@8.6.0/+esm').then(mod => {
    if (!portfolio || !mod?.default) return;
    const inner = document.createElement('div');
    inner.className = 'portfolio-inner';
    while (portfolio.firstChild) inner.append(portfolio.firstChild);
    portfolio.append(inner);
    portfolio.classList.add('embla-ready');
    try {
      carousel = mod.default(portfolio, {align:'start', containScroll:'trimSnaps', loop:false, dragFree:true});
      const sync = () => {
        if (previous) previous.disabled = !carousel.canScrollPrev();
        if (next) next.disabled = !carousel.canScrollNext();
      };
      carousel.on('select', sync);
      carousel.on('reInit', sync);
      sync();
    } catch {
      portfolio.classList.remove('embla-ready');
      [...inner.children].forEach(child => portfolio.append(child));
      inner.remove();
      carousel = null;
    }
  }).catch(() => { /* native scroll-snap remains fully usable */ });

  // An honest mailto handoff, not a pretend CRM/booking system.
  const form = $('#inquiryForm');
  const feedback = $('#inquiryFeedback');
  const read = id => document.getElementById(id)?.value.trim() || '';
  const buildMessage = () => [
    'Здравствуйте, Чиж-Авто! Хочу уточнить возможность дооснащения автомобиля по адресу: Краснодар, ул. Жлобы, 115.',
    '',
    'Направление: ' + (read('requestService') || 'Не указано'),
    'Автомобиль: ' + (read('requestCar') || 'Не указан'),
    'Имя: ' + (read('requestName') || 'Не указано'),
    'Телефон: ' + (read('requestPhone') || 'Не указан'),
    'Комментарий: ' + (read('requestComment') || 'Нет'),
    '',
    'Подскажите, какие решения подойдут для моего автомобиля, какая стоимость и когда можно приехать?'
  ].join('\n');

  form?.addEventListener('submit', e => {
    e.preventDefault();
    if (!form.reportValidity()) return;
    const subject = 'Вопрос по дооснащению автомобиля — Жлобы, 115';
    const url = 'mailto:chizh-avto@mail.ru?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(buildMessage());
    if (feedback) feedback.textContent = 'Открываем почту с подготовленным письмом. Отправьте его самостоятельно. Это не подтверждение записи.';
    window.location.href = url;
  });
  $('#copyRequest')?.addEventListener('click', async () => {
    try {
      const value = buildMessage();
      if (navigator.clipboard && window.isSecureContext) await navigator.clipboard.writeText(value);
      else {
        const helper = document.createElement('textarea');
        helper.value = value;
        helper.setAttribute('aria-hidden','true');
        Object.assign(helper.style, {position:'fixed',top:'0',left:'0',opacity:'0'});
        document.body.appendChild(helper); helper.focus(); helper.select();
        if (!document.execCommand('copy')) throw new Error('Copy unavailable');
        helper.remove();
      }
      if (feedback) feedback.textContent = 'Текст скопирован. Его можно отправить на chizh-avto@mail.ru.';
    } catch {
      if (feedback) feedback.textContent = 'Копирование недоступно в этом браузере. Напишите на chizh-avto@mail.ru или позвоните.';
    }
  });

  // Motion: timeline entrance, staggered sections and scroll-linked photograph.
  // Do not hide anything before the library loads; CDN failures never hide text.
  if (!reduced) import('https://cdn.jsdelivr.net/npm/motion@12.23.24/+esm')
    .then(({ animate, inView, stagger, scroll }) => {
      motionApi = {animate, stagger};
      const introItems = $$('.hero-kicker, .hero-title .line, .hero-desc, .hero-cta .btn');
      if (introItems.length) animate(introItems, {opacity: [0.66, 1], y: [28, 0]}, {duration: 1.0, delay: stagger(0.095, {startDelay: .05}), ease: [0.16,1,.3,1]});
      const photo = $('.hero-photo');
      const hero = $('.hero');
      if (photo && hero) {
        try {scroll(animate(photo, {y:[0,72], scale:[1.01,1.105]}, {ease:'linear'}), {target:hero, offset:['start start','end start']});} catch {}
      }
      const specs = [
        ['.statement-title', {opacity:[.7,1], y:[40,0]}, .8],
        ['.section-head .display', {opacity:[.72,1], y:[24,0]}, .7],
        ['.service-row', {opacity:[.83,1], x:[-19,0]}, .55],
        ['.portfolio-card', {opacity:[.78,1], y:[20,0]}, .55],
        ['.proof-column', {opacity:[.7,1], y:[30,0]}, .65],
        ['.process-step', {opacity:[.8,1], x:[18,0]}, .56],
        ['.faq-items details', {opacity:[.8,1], y:[12,0]}, .48]
      ];
      for (const [selector, props, duration] of specs) {
        $$(selector).forEach(element => {
          try {inView(element, () => {animate(element, props, {duration, ease:[.16,1,.3,1]});}, {amount:.14});} catch {}
        });
      }
    }).catch(() => { /* original content stays visible */ });
})();