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

После включения Pages каждый push в `main` автоматически обновляет все демо. Новый сайт: создать `slug/index.html` и добавить карточку в корневой `index.html`.

## Важно

Это неофициальные демонстрационные концепты, а не официальные сайты организаций. Цены, условия и фотографии должны быть согласованы до боевого запуска. Запись через демо-формы не означает реальную бронь. Часть внешних ресурсов требует подключения к интернету.
