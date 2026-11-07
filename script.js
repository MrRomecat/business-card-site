/* Переключатель языка RU / EN: меняет data-lang и lang на <html>,
   заголовок вкладки и description; выбор хранится в localStorage. */
(function () {
  'use strict';

  var STORAGE_KEY = 'stub-lang';
  var root = document.documentElement;

  var META = {
    ru: {
      title: 'Сергей Бондарчук — личностный рост, деньги, продвижение в социальных сетях',
      description: 'Сергей Бондарчук: личностный рост, деньги и продвижение в социальных сетях. Иду путём, который меня вдохновляет. Консультации — пишите на info@bondarchuksergey.com или в Telegram.',
      alt: 'Сергей Бондарчук'
    },
    en: {
      title: 'Sergey Bondarchuk — Personal Growth, Money, Social Media Promotion',
      description: 'Sergey Bondarchuk: personal growth, money and social media promotion. I walk the path that inspires me. For a consultation, write to info@bondarchuksergey.com or on Telegram.',
      alt: 'Sergey Bondarchuk'
    }
  };

  var buttons = document.querySelectorAll('[data-set-lang]');
  var description = document.querySelector('meta[name="description"]');
  var photo = document.querySelector('.portrait__img');

  function apply(lang) {
    var meta = META[lang];
    root.setAttribute('data-lang', lang);
    root.lang = lang;
    document.title = meta.title;
    if (description) description.setAttribute('content', meta.description);
    if (photo) photo.alt = meta.alt;

    for (var i = 0; i < buttons.length; i++) {
      var isActive = buttons[i].getAttribute('data-set-lang') === lang;
      buttons[i].setAttribute('aria-pressed', isActive ? 'true' : 'false');
    }

    /* размеры заголовка и первой фразы меняются вместе с языком —
       сообщаем раскладке «листвы», что нужно пересчитаться */
    document.dispatchEvent(new CustomEvent('bs:langchange'));
  }

  function save(lang) {
    try {
      localStorage.setItem(STORAGE_KEY, lang);
    } catch (e) { /* приватный режим — просто не запоминаем */ }
  }

  for (var i = 0; i < buttons.length; i++) {
    buttons[i].addEventListener('click', function () {
      var lang = this.getAttribute('data-set-lang');
      if (!META[lang] || lang === root.getAttribute('data-lang')) return;
      apply(lang);
      save(lang);
    });
  }

  var initial = root.getAttribute('data-lang');
  apply(META[initial] ? initial : 'ru');
})();

/* «Листва» на широких экранах: раскладываем фразы равномерно по всему экрану,
   обходя контент (фото, заголовок, email, кнопки, шапку) с запасом и не давая
   фразам наезжать друг на друга. CSS-позиции из styles.css остаются запасным
   вариантом на случай выключенного JS. На мобильных (облако под кнопками)
   раскладкой управляет CSS — здесь только снимаем инлайновые стили. */
(function () {
  'use strict';

  /* тот же порог, что и в styles.css для мобильной раскладки */
  var MOBILE = '(max-width: 720px), (max-width: 1000px) and (max-height: 500px)';
  var CONTENT_GAP = 18; /* отступ фраз от элементов контента, px */
  var LEAF_GAP = 12;    /* минимальный зазор между фразами, px */
  var EDGE = 14;        /* отступ от краёв экрана, px */
  var DRIFT = 10;       /* запас на вертикальное покачивание анимации, px */

  var container = document.querySelector('.leaves');
  if (!container) return;
  var leaves = Array.prototype.slice.call(container.children);
  var obstacleSelector = '.logo, .tagline, .lang-switch, .portrait, .title, .directions, .email, .btn';

  function rand(min, max) {
    return min + Math.random() * (max - min);
  }

  function shuffle(arr) {
    for (var i = arr.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var t = arr[i];
      arr[i] = arr[j];
      arr[j] = t;
    }
    return arr;
  }

  function overlaps(r, list) {
    for (var i = 0; i < list.length; i++) {
      var b = list[i];
      if (r.left < b.right && r.right > b.left && r.top < b.bottom && r.bottom > b.top) return true;
    }
    return false;
  }

  function clearInline(el) {
    el.style.left = '';
    el.style.top = '';
    el.style.right = '';
    el.style.bottom = '';
    el.style.display = '';
  }

  function layout() {
    if (window.matchMedia(MOBILE).matches) {
      leaves.forEach(clearInline);
      return;
    }

    var area = container.getBoundingClientRect();
    if (!area.width || !area.height) return;

    var obstacles = [];
    document.querySelectorAll(obstacleSelector).forEach(function (el) {
      var r = el.getBoundingClientRect();
      if (!r.width && !r.height) return;
      obstacles.push({
        left: r.left - CONTENT_GAP,
        top: r.top - CONTENT_GAP,
        right: r.right + CONTENT_GAP,
        bottom: r.bottom + CONTENT_GAP
      });
    });

    /* показываем все фразы (включая скрытые запасным CSS) и меряем их габариты */
    var sizes = leaves.map(function (el) {
      el.style.display = 'inline-block';
      el.style.right = 'auto';
      el.style.bottom = 'auto';
      var r = el.getBoundingClientRect();
      return { w: r.width, h: r.height };
    });

    /* сетка ячеек по экрану — чтобы фразы распределялись равномерно, без пустых зон */
    var n = leaves.length;
    var cols = Math.max(2, Math.round(Math.sqrt(n * area.width / area.height)));
    var rows = Math.max(2, Math.ceil(n / cols));
    var cells = [];
    for (var ry = 0; ry < rows; ry++) {
      for (var cx = 0; cx < cols; cx++) {
        cells.push({
          left: area.left + (area.width * cx) / cols,
          top: area.top + (area.height * ry) / rows,
          width: area.width / cols,
          height: area.height / rows
        });
      }
    }
    shuffle(cells);

    var placed = [];

    function tryPlace(el, size, cell, tries) {
      var minX = area.left + EDGE;
      var maxX = area.right - EDGE - size.w;
      var minY = area.top + EDGE + DRIFT;
      var maxY = area.bottom - EDGE - size.h;
      if (maxX < minX || maxY < minY) return false;
      for (var t = 0; t < tries; t++) {
        var x = cell ? rand(Math.max(minX, cell.left), Math.min(maxX, cell.left + cell.width)) : rand(minX, maxX);
        var y = cell ? rand(Math.max(minY, cell.top), Math.min(maxY, cell.top + cell.height)) : rand(minY, maxY);
        if (x < minX || x > maxX || y < minY || y > maxY) continue;
        var rect = {
          left: x - LEAF_GAP / 2,
          top: y - LEAF_GAP / 2 - DRIFT,
          right: x + size.w + LEAF_GAP / 2,
          bottom: y + size.h + LEAF_GAP / 2
        };
        if (overlaps(rect, obstacles) || overlaps(rect, placed)) continue;
        placed.push(rect);
        el.style.left = (x - area.left) + 'px';
        el.style.top = (y - area.top) + 'px';
        return true;
      }
      return false;
    }

    var failed = [];
    var order = shuffle(leaves.map(function (_, i) { return i; }));
    order.forEach(function (i, k) {
      if (!tryPlace(leaves[i], sizes[i], cells[k % cells.length], 30)) failed.push(i);
    });

    /* не поместившиеся в свою ячейку — пробуем в другие ячейки, затем куда угодно */
    failed.forEach(function (i) {
      var ok = false;
      for (var c = 0; c < cells.length && !ok; c++) ok = tryPlace(leaves[i], sizes[i], cells[c], 8);
      if (!ok) ok = tryPlace(leaves[i], sizes[i], null, 120);
      if (!ok) leaves[i].style.display = 'none';
    });
  }

  var resizeTimer;
  window.addEventListener('resize', function () {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(layout, 150);
  });
  document.addEventListener('bs:langchange', layout);
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(layout);
  window.addEventListener('load', layout);
  layout();
})();
