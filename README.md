# Демонстрационные сайты для потенциальных клиентов

Один публичный репозиторий для нескольких независимых сайтов, включая React/Vite и автономные HTML-проекты. Каждый сайт открывается по отдельному адресу GitHub Pages.

## Адреса после включения GitHub Pages

- [Каталог](https://davidshaton2006-droid.github.io/parsing/)
- [GT Service](https://davidshaton2006-droid.github.io/parsing/gt-service/)
- [Альфа Авто](https://davidshaton2006-droid.github.io/parsing/alfa-auto/)
- [RIA-Service](https://davidshaton2006-droid.github.io/parsing/ria-service/)

- [Чиж-Авто, React](https://davidshaton2006-droid.github.io/parsing/chizh-avto/)

## Структура

```
index.html                    # каталог
gt-service/index.html         # GT Service
alfa-auto/index.html          # Альфа Авто
ria-service/index.html        # RIA-Service
.github/workflows/deploy-pages.yml
.nojekyll
```

Большинство демо — автономные статические HTML-страницы. **Чиж-Авто** — отдельное полноценное React/Vite-приложение: GitHub Actions устанавливает зависимости, собирает клиентский bundle и проверяет основные интерактивные сценарии с помощью Playwright перед публикацией. Новые React/Vite-сайты следует добавлять с собственным процессом сборки, а не копировать исходный JSX в Pages.

## Включение Pages (один раз)

1. Открыть [Settings → Pages](https://github.com/davidshaton2006-droid/parsing/settings/pages).
2. В «Build and deployment → Source» выбрать **GitHub Actions**.
3. Открыть [Actions](https://github.com/davidshaton2006-droid/parsing/actions/workflows/deploy-pages.yml), выбрать **Run workflow** (если автозапуск не произошёл).
4. Проверить зелёный статус job `deploy` и адреса выше.

После включения Pages **каждый push в `main`, включая добавление любой новой папки**, запускает публикацию всех демо. Новый сайт: создать уникальный `slug/index.html`, добавить карточку в корневой `index.html`, проверить Actions и публичный URL.

## Обязательное правило для КАЖДОГО нового сайта: 5 изображений ДО кода

Порядок неизменен: **исследование реального бизнеса, конкурентов, фактов и фирменного стиля → изучение всех 8 UI-источников → ровно 5 отличающихся макетов ИЗОБРАЖЕНИЯМИ → в КАЖДОМ desktop и mobile → выбор/утверждение пользователем → только после этого код, тесты и GitHub Pages**.

Нельзя заменять пять изображений HTML-превью, текстовыми идеями или одним шаблоном с пятью цветами. После согласования результат разработки должен соответствовать выбранному изображению для ПК и смартфона. Не менять старые сайты по новой схеме без отдельной просьбы.

**Новые обязательные источники на каждый сайт:**

- [davila7/claude-code-templates](https://github.com/davila7/claude-code-templates): актуальные skill/agent/command решения для frontend, дизайн-процесса и QA.
- [Aceternity UI](https://ui.aceternity.com/) и 21st CLI: пользователь указал `npx @21st-dev/cli add @aceternity`; для установки необходимо сначала выбрать конкретный компонент. Например, по официальной документации `npx shadcn@latest add @aceternity/<component>`, либо соответствующий точный идентификатор в 21st CLI. Не запускать шаблонную команду без имени компонента.
- [@jahed на 21st.dev](https://21st.dev/@jahed): авторские cinematic/glass/mobile/UI компоненты для изучения, выбора и уместного применения.
- [21st.dev](https://21st.dev/): актуальный каталог UI-компонентов, визуальных вариантов, тем, шаблонов и их исходников.

**Прежние четыре остаются обязательными:** [jakubkrehel/skills](https://github.com/jakubkrehel/skills), [UI UX Pro Max](https://github.com/nextlevelbuilder/ui-ux-pro-max-skill), [Astryx](https://github.com/meta/astryx), [Motion](https://motion.dev/docs). Проверять совместимость/лицензии; не утверждать об установке без выполнения.

Полные критерии и команды: [TOOLKIT_AND_DESIGN_GATE.md](skills/shaton-client-site-factory/references/TOOLKIT_AND_DESIGN_GATE.md). Этот файл является обязательной частью скилла.

## Главный скилл для всех ИИ-разработчиков

**СНАЧАЛА прочитать [skills/shaton-client-site-factory/SKILL.md](skills/shaton-client-site-factory/SKILL.md)**, затем [TOOLKIT_AND_DESIGN_GATE.md](skills/shaton-client-site-factory/references/TOOLKIT_AND_DESIGN_GATE.md), остальные документы `references/`. Там описаны цель B2B-демо, исследования, дизайн, обязательные внешние источники навыков, Motion, проверка фактов, формы, доступность и деплой. В корне также находятся [AGENTS.md](AGENTS.md) и [CLAUDE.md](CLAUDE.md), которые направляют совместимых агентов к скиллу до начала разработки.

Перенос в другой ИИ: передать папку `skills/shaton-client-site-factory/` целиком или ZIP-архив, попросить прочитать `SKILL.md` первым и его `references/`. Инструкции в GitHub не считываются автоматически произвольным чатом, если тот не получил доступ к файлам.

## Важно

Это неофициальные демонстрационные концепты, а не официальные сайты организаций. Цены, условия и фотографии должны быть согласованы до боевого запуска. Запись через демо-формы не означает реальную бронь. Часть внешних ресурсов требует подключения к интернету.
