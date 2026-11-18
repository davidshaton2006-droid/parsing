# Демонстрационные сайты для потенциальных клиентов

Один публичный репозиторий для нескольких независимых HTML-сайтов. Каждый сайт открывается по отдельному адресу GitHub Pages.

## Адреса после включения GitHub Pages

- [Каталог](https://davidshaton2006-droid.github.io/parsing/)
- [GT Service](https://davidshaton2006-droid.github.io/parsing/gt-service/)
- [Альфа Авто](https://davidshaton2006-droid.github.io/parsing/alfa-auto/)
- [RIA-Service](https://davidshaton2006-droid.github.io/parsing/ria-service/)

## Структура

```
index.html                    # каталог
gt-service/index.html         # GT Service
alfa-auto/index.html          # Альфа Авто
ria-service/index.html        # RIA-Service
.github/workflows/deploy-pages.yml
.nojekyll
```

Каждый HTML-файл автономен: основные изображения включены в файл. Для публикации не нужны npm, Node.js или отдельная сборка.

## Включение Pages (один раз)

1. Открыть [Settings → Pages](https://github.com/davidshaton2006-droid/parsing/settings/pages).
2. В «Build and deployment → Source» выбрать **GitHub Actions**.
3. Открыть [Actions](https://github.com/davidshaton2006-droid/parsing/actions/workflows/deploy-pages.yml), выбрать **Run workflow** (если автозапуск не произошёл).
4. Проверить зелёный статус job `deploy` и адреса выше.

После включения Pages **каждый push в `main`, включая добавление любой новой папки**, запускает публикацию всех демо. Новый сайт: создать уникальный `slug/index.html`, добавить карточку в корневой `index.html`, проверить Actions и публичный URL.

## Главный скилл для всех ИИ-разработчиков

**СНАЧАЛА прочитать [skills/shaton-client-site-factory/SKILL.md](skills/shaton-client-site-factory/SKILL.md)** и три документа из `references/`. Там описаны цель B2B-демо, исследования, дизайн, обязательные внешние источники навыков, Motion, проверка фактов, формы, доступность и деплой. В корне также находятся [AGENTS.md](AGENTS.md) и [CLAUDE.md](CLAUDE.md), которые направляют совместимых агентов к скиллу до начала разработки.

Перенос в другой ИИ: передать папку `skills/shaton-client-site-factory/` целиком или ZIP-архив, попросить прочитать `SKILL.md` первым и его `references/`. Инструкции в GitHub не считываются автоматически произвольным чатом, если тот не получил доступ к файлам.

## Важно

Это неофициальные демонстрационные концепты, а не официальные сайты организаций. Цены, условия и фотографии должны быть согласованы до боевого запуска. Запись через демо-формы не означает реальную бронь. Часть внешних ресурсов требует подключения к интернету.
