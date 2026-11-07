/* Переключатель языка RU / EN: меняет data-lang и lang на <html>,
   заголовок вкладки и description; выбор хранится в localStorage. */
(function () {
  'use strict';

  var STORAGE_KEY = 'stub-lang';
  var root = document.documentElement;

  var META = {
    ru: {
      title: 'Сергей Бондарчук — Иду путём, который меня вдохновляет',
      description: 'Сергей Бондарчук. Иду путём, который меня вдохновляет. Консультации — пишите на info@bondarchuksergey.com или в Telegram.',
      alt: 'Сергей Бондарчук'
    },
    en: {
      title: 'Sergey Bondarchuk — I walk the path that inspires me',
      description: 'Sergey Bondarchuk. I walk the path that inspires me. For a consultation, write to info@bondarchuksergey.com or on Telegram.',
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
