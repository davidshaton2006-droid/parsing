(() => {
  "use strict";

  const menuButton = document.querySelector("#menuToggle");
  const navigation = document.querySelector("#nav");
  if (menuButton && navigation) {
    const closeMenu = () => { navigation.dataset.open = "false"; menuButton.setAttribute("aria-expanded", "false"); };
    menuButton.addEventListener("click", () => {
      const next = navigation.dataset.open !== "true";
      navigation.dataset.open = String(next);
      menuButton.setAttribute("aria-expanded", String(next));
    });
    navigation.querySelectorAll("a").forEach(a => a.addEventListener("click", closeMenu));
    document.addEventListener("keydown", e => { if (e.key === "Escape") closeMenu(); });
    document.addEventListener("click", e => { if (!navigation.contains(e.target) && !menuButton.contains(e.target)) closeMenu(); });
  }

  const goals = {
    security: {
      title: "Спокойнее за свой автомобиль.",
      summary: "Подберите охранную систему и комфортные функции под конкретную модель машины. Специалисты помогут уточнить совместимость оборудования.",
      services: ["Автосигнализация", "Автозапуск", "Парковочные системы"],
      service: "Автосигнализация / автозапуск"
    },
    multimedia: {
      title: "Современная электроника. Без лишнего.",
      summary: "Штатная мультимедиа, Android-головное устройство, камеры и обзор 360°. Возможности комплекта зависят от автомобиля.",
      services: ["Мультимедиа", "Камеры 360°", "Парктроники"],
      service: "Мультимедиа и камеры"
    },
    comfort: {
      title: "Меньше шума. Больше комфорта.",
      summary: "Шумоизоляция, улучшение акустики и автоматизация привычных действий. Обсудите подходящий набор дооснащения.",
      services: ["Шумоизоляция", "Автозвук", "Доводчики дверей"],
      service: "Шумоизоляция и комфорт"
    },
    style: {
      title: "Детали меняют впечатление.",
      summary: "Тонировка, защитные плёнки, аккуратный свет и детейлинг. Начните с задач, для которых используете автомобиль каждый день.",
      services: ["Тонировка", "Защитные плёнки", "Автосвет"],
      service: "Тонировка и защитные плёнки"
    }
  };

  let activeGoal = "security";
  const buttons = [...document.querySelectorAll(".goal-btn")];
  const title = document.querySelector("#goalTitle");
  const summary = document.querySelector("#goalSummary");
  const tags = document.querySelector("#goalTags");
  const goalAction = document.querySelector("#goalAction");
  const serviceSelect = document.querySelector("#formService");

  function setGoal(key) {
    const goal = goals[key];
    if (!goal) return;
    activeGoal = key;
    buttons.forEach(b => b.setAttribute("aria-pressed", String(b.dataset.goal === key)));
    if (title) title.textContent = goal.title;
    if (summary) summary.textContent = goal.summary;
    if (tags) {
      tags.replaceChildren();
      goal.services.forEach(item => {
        const li = document.createElement("li");
        li.textContent = item;
        tags.appendChild(li);
      });
    }
  }
  buttons.forEach(button => button.addEventListener("click", () => setGoal(button.dataset.goal)));
  goalAction?.addEventListener("click", () => {
    if (serviceSelect) serviceSelect.value = goals[activeGoal].service;
  });

  document.querySelectorAll("[data-service]").forEach(link => {
    link.addEventListener("click", () => {
      if (serviceSelect) serviceSelect.value = link.dataset.service;
    });
  });

  const form = document.querySelector("#leadForm");
  const formMessage = document.querySelector("#formMessage");
  const copyButton = document.querySelector("#copyRequest");
  const textValue = (id) => document.getElementById(id)?.value.trim() ?? "";

  function requestText() {
    return [
      "Здравствуйте! Хочу уточнить возможность дооснащения автомобиля в Чиж-Авто (Жлобы, 115).",
      "",
      "Направление: " + (textValue("formService") || "Не выбрано"),
      "Автомобиль: " + (textValue("formCar") || "Не указан"),
      "Имя: " + (textValue("formName") || "Не указано"),
      "Телефон для связи: " + (textValue("formPhone") || "Не указан"),
      "Комментарий: " + (textValue("formComment") || "Нет"),
      "",
      "Подскажите, пожалуйста, совместимость оборудования, ориентировочную стоимость и доступное время для консультации."
    ].join("\n");
  }

  if (form) {
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      if (!form.reportValidity()) return;
      const subject = "Запрос с демонстрационного сайта Чиж-Авто, Жлобы 115";
      const destination = "mailto:chizh-avto@mail.ru?subject=" +
        encodeURIComponent(subject) + "&body=" + encodeURIComponent(requestText());
      if (formMessage) formMessage.textContent = "Открываем почтовое приложение с подготовленным текстом. Проверьте письмо и отправьте его самостоятельно. Это не подтверждение записи.";
      window.location.href = destination;
    });
  }

  if (copyButton) {
    copyButton.addEventListener("click", async () => {
      const result = requestText();
      try {
        if (navigator.clipboard?.writeText) {
          await navigator.clipboard.writeText(result);
        } else {
          const holder = document.createElement("textarea");
          holder.value = result; holder.style.position = "fixed"; holder.style.opacity = "0";
          document.body.appendChild(holder);
          holder.select();
          const copied = document.execCommand("copy");
          holder.remove();
          if (!copied) throw new Error("Copy rejected");
        }
        if (formMessage) formMessage.textContent = "Текст обращения скопирован. Его можно отправить на chizh-avto@mail.ru или озвучить по телефону.";
      } catch {
        if (formMessage) formMessage.textContent = "Не удалось скопировать текст автоматически. Отправьте обращение по email или позвоните по указанному номеру.";
      }
    });
  }

  // Motion for JavaScript: progressive enhancement only. Content is always
  // visible before import and stays visible if CDN or scripts fail.
  const reduceMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
  if (!reduceMotion) {
    import("https://cdn.jsdelivr.net/npm/motion@12.23.24/+esm")
      .then(({ animate, inView, stagger }) => {
        animate(".hero-content > .eyebrow, .hero-heading, .hero-description, .hero-actions", {
          opacity: [0.78, 1], y: [18, 0]
        }, { duration: 0.8, delay: stagger(0.085), easing: [0.22, 1, 0.36, 1] });
        inView(".service", (element) => {
          animate(element, { opacity: [0.65, 1], y: [22, 0] }, { duration: 0.65, easing: "ease-out" });
        }, { amount: 0.15 });
        inView(".case", (element) => {
          animate(element, { opacity: [0.7, 1], y: [18, 0] }, { duration: 0.55 });
        }, { amount: 0.1 });
      })
      .catch(() => { /* animation is optional, never hide content */ });
  }
})();
