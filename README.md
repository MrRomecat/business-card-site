# bondarchuksergey.com — сайт-визитка и агрегатор ссылок

Одностраничный сайт-визитка: фото, фраза о себе, контакты и кнопки со ссылками на соцсети и мессенджеры — всё в одном месте. Бесплатная замена платным сервисам «ссылка в био» (Linktree, Taplink и подобным): никаких подписок, брендинга сторонних сервисов и чужих серверов — только три файла на любом статическом хостинге.

Сайт одинаково хорошо работает на телефонах, планшетах, ноутбуках и больших мониторах.

**[Демо →](https://bondarchuksergey.com/)** (зеркало на GitHub Pages: [mrromecat.github.io/business-card-site](https://mrromecat.github.io/business-card-site/))

## Что умеет

- **Визитка** — круглое фото, заголовок-девиз, email.
- **Агрегатор ссылок** — под фото кнопки со ссылками: Telegram, Instagram, YouTube, LinkedIn, WhatsApp, сайт, что угодно. Сейчас там одна кнопка «Консультация»; добавил строку в HTML — появилась ещё одна.
- **Два языка** — переключатель RU / EN в углу. Выбор запоминается в браузере и восстанавливается при следующем визите, без мигания текста при загрузке.
- **Адаптивная вёрстка** — отдельные раскладки для телефонов (в том числе горизонтально), планшетов в обеих ориентациях, ноутбуков и широких экранов.
- **«Листва» из фраз** — девиз на 20 языках рассыпан по экрану и мягко покачивается; на телефонах собирается в облако под кнопками. Анимация отключается, если в системе включён режим «уменьшить движение».
- **Быстрый и лёгкий** — без фреймворков и сборщиков. HTML + CSS + 2 КБ JavaScript, всего ≈ 19 КБ без фото. Фото в WebP с JPEG-fallback.
- **SEO и шаринг** — `title`, `description`, Open Graph-картинка для превью в мессенджерах и соцсетях, favicon.
- **Доступность** — семантическая разметка, видимый фокус с клавиатуры, крупные зоны нажатия на телефонах, `aria`-подписи.

## Структура

```
index.html            — разметка страницы
styles.css            — все стили, включая адаптив
script.js             — переключатель языка (единственный скрипт)
assets/portrait.webp  — фото 520×520 (WebP)
assets/portrait.jpg   — то же фото, fallback
assets/og-image.jpg   — картинка для превью ссылки, 1200×630
favicon.ico, icon-192.png, apple-touch-icon.png — иконки
```

## Как сделать свою визитку

1. **Фото.** Замените `assets/portrait.webp` и `assets/portrait.jpg` на свои (квадрат, лучше 520×520 px). При желании обновите `assets/og-image.jpg` — это превью ссылки в мессенджерах.
2. **Тексты.** В `index.html` поменяйте заголовок, email и подпись домена. Русский и английский варианты лежат рядом в `<span class="t-ru">` и `<span class="t-en">`.
3. **Ссылки на соцсети.** Сейчас под email одна кнопка — «Консультация» (ссылка на Telegram). Добавляйте новые кнопки прямо под ней, по одной строке на каждую:

   ```html
   <a class="btn" href="https://t.me/username" target="_blank" rel="noopener">Telegram</a>
   <a class="btn" href="https://instagram.com/username" target="_blank" rel="noopener">Instagram</a>
   <a class="btn" href="https://youtube.com/@username" target="_blank" rel="noopener">YouTube</a>
   <a class="btn" href="https://wa.me/79990000000" target="_blank" rel="noopener">WhatsApp</a>
   ```

   Кнопки выстраиваются столбиком по центру — как в сервисах «ссылка в био».
4. **Логотип.** `₿$` в шапке — монограмма инициалов владельца. Поставьте свои буквы или символы в `<span class="logo">` и перерисуйте иконки.
5. **Цвета и шрифты.** Все значения собраны в начале `styles.css` в блоке `:root` — достаточно поменять переменные.
6. **Фразы-листва.** Список из 20 фраз лежит в `<ul class="leaves">`. Можно заменить на свои или удалить весь блок — остальное не сломается.

## Запуск локально

Файлы открываются и просто двойным кликом по `index.html`, но чтобы шрифты и переключатель языка работали точно как на хостинге, лучше поднять локальный сервер:

```bash
python -m http.server 8765
```

и открыть http://localhost:8765.

## Публикация

Это статический сайт — подойдёт любой хостинг:

- **GitHub Pages** — Settings → Pages → Branch: `main`, папка `/ (root)`.
- Netlify, Vercel, Cloudflare Pages — перетащить папку в интерфейс.
- Обычный хостинг — загрузить файлы по FTP.

Для своего домена пропишите его в `canonical` и `og:url` в `index.html`, а для GitHub Pages — ещё в файле `CNAME` (одна строка с доменом) и в DNS у регистратора: A-записи на `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153` и CNAME `www` → `<логин>.github.io`.

## Технологии

Чистые HTML5, CSS3 и ванильный JavaScript. Шрифты — Google Fonts (Caprasimo, Comfortaa, Figtree). Зависимостей, сборки и серверной части нет.

## Лицензия

[MIT](LICENSE) — берите, меняйте, используйте для себя и клиентов. Фото и тексты владельца сайта лицензией не покрываются — замените их на свои.

---

### English

A one-page personal landing: photo, tagline, contacts and a row of buttons linking to your social networks and messengers — all in one place. A free, self-hosted alternative to paid "link in bio" services (Linktree, Taplink, etc.).

Works equally well on phones, tablets, laptops and large desktop screens. Two languages (RU / EN) with a switcher that remembers the choice. No frameworks, no build step — HTML + CSS + 2 KB of JavaScript, ≈ 19 KB total without the photo. To add your own links, put more `<a class="btn">` elements next to the existing "Consultation" button in `index.html`.
