// ==UserScript==
// @name         ГГПК Расписание ПГБ-121 → Telegram
// @namespace    schedule-watcher-pgb121
// @version      3.0
// @description  Проверяет расписание ПГБ-121 на странице ггпк.by каждые 30 минут (сам перезагружает страницу) и шлёт изменения в Telegram
// @match        http://ggpk.by/Raspisanie/Files/P_KURS.html*
// @match        https://ggpk.by/Raspisanie/Files/P_KURS.html*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_xmlhttpRequest
// @grant        GM_registerMenuCommand
// @connect      api.telegram.org
// @run-at       document-idle
// @updateURL    https://raw.githubusercontent.com/kladweb/autoposting-scripts/refs/heads/main/schedule/schedule-watcher.js
// @downloadURL  https://raw.githubusercontent.com/kladweb/autoposting-scripts/refs/heads/main/schedule/schedule-watcher.js
// ==/UserScript==

(function () {
  'use strict';

  // ======================= НАСТРОЙКИ =======================
  const GROUP_NAME = 'ПГБ-121';
  // Токен и chat_id больше НЕ хранятся в тексте скрипта — он теперь публикуется
  // в открытом репозитории на GitHub для автообновления. Секреты вводятся один
  // раз через пункт меню "⚙️ Настроить Telegram" и хранятся локально через
  // GM_setValue — обновление скрипта с GitHub их не затрагивает.

  const CHECK_INTERVAL_MS = 15 * 60 * 1000; // 15 минут между проверками — скрипт сам перезагружает страницу с этим
  // интервалом
  // ===========================================================

  // ---------------- Парсинг таблицы (rowspan/colspan) ----------------
  function tableToMatrix(table) {
    const rows = Array.from(table.querySelectorAll('tr'));
    const matrix = [];
    const spanMap = {};

    for (const tr of rows) {
      const row = [];
      let col = 0;
      const cells = Array.from(tr.querySelectorAll('td'));
      let cellIdx = 0;

      while (true) {
        if (spanMap[col] && spanMap[col].remaining > 0) {
          row.push(spanMap[col].value);
          spanMap[col].remaining -= 1;
          col += 1;
          continue;
        }
        if (cellIdx >= cells.length) break;

        const td = cells[cellIdx];
        const text = td.textContent.replace(/\s+/g, ' ').trim();
        const colspan = parseInt(td.getAttribute('colspan') || '1', 10);
        const rowspan = parseInt(td.getAttribute('rowspan') || '1', 10);

        for (let i = 0; i < colspan; i++) {
          row.push(text);
          if (rowspan > 1) {
            spanMap[col] = {remaining: rowspan - 1, value: text};
          }
          col += 1;
        }
        cellIdx += 1;
      }
      matrix.push(row);
    }
    return matrix;
  }

  // Возвращает список дней на странице: [{ day, lessons: [...] }, ...]
  function parseScheduleFromDocument(doc, groupName) {
    const tables = Array.from(doc.querySelectorAll('table'));
    const result = [];

    for (const table of tables) {
      const matrix = tableToMatrix(table);
      if (matrix.length < 2) continue;

      const header = matrix[0];
      const groupCol = header.findIndex((h) => h === groupName);
      if (groupCol === -1) continue; // группы нет в этой таблице

      const dayLabel = matrix[1][0];
      const lessons = [];

      for (let i = 2; i < matrix.length; i += 3) {
        const subjectRow = matrix[i];
        const teacherRow = matrix[i + 1];
        const noteRow = matrix[i + 2];
        if (!subjectRow) break;

        const period = subjectRow[0];
        const time = subjectRow[1];
        const subject = (subjectRow[groupCol] || '').trim();
        const teacher = teacherRow ? (teacherRow[groupCol] || '').trim() : '';
        const note = noteRow ? (noteRow[groupCol] || '').trim() : '';

        if (subject || teacher || note) {
          lessons.push({period, time, subject, teacher, note});
        }
      }
      result.push({day: dayLabel, lessons});
    }
    return result;
  }

  // ---------------- Форматирование даты/времени без секунд ----------------
  function formatDateTimeShort(date) {
    return date.toLocaleString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  }

  // ---------------- Форматирование сообщения ----------------
  function formatSchedule(schedule, groupName, changedAt) {
    const lines = [
      '📚 *РАСПИСАНИЕ*',
      '',
      `👥 *${groupName}*`,
    ];

    for (const day of schedule) {
      if (!day.lessons.length) continue;

      lines.push(
        `📅 *${day.day}*`,
        '━━━━━━━━━━━━━━'
      );

      for (const lesson of day.lessons) {
        const time = (lesson.time || '')
        .replace(/\s+/g, ' ')
        .trim()
        .replace(/(\d{1,2}\.\d{2})\s+(\d{1,2}\.\d{2})/g, '$1 | $2');

        const subject = lesson.subject || 'Нет данных';
        // const subject = `*${lesson.subject}*`;

        lines.push(
          `*${lesson.period}.*  ${time}`,
          `📖 ${subject}`
        );

        if (lesson.note) {
          lines.push(`🚪 Ауд. ${lesson.note}`);
        }

        lines.push('');
      }
    }
    const footerTime = changedAt ? formatDateTimeShort(changedAt) : 'ещё не было реальных изменений';
    lines.push(
      '━━━━━━━━━━━━━━',
      '🔔 Расписание обновлено',
      `🕒 ${footerTime}`,
      ' ',
    );

    return lines.join('\n').trim();
  }

  // ---------------- Экспорт для юнит-тестов (в браузере не выполняется) ----------------
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = {tableToMatrix, parseScheduleFromDocument, formatSchedule};
    return;
  }

  // ==================== Дальше — код, который реально работает в браузере ====================

  function log(message, isError) {
    const prefix = '[Расписание ПГБ-121]';
    if (isError) console.error(prefix, message);
    else console.log(prefix, message);
    updateBadge(message);
  }

  // ---------------- Небольшой индикатор статуса в углу страницы ----------------
  let badgeEl = null;

  function ensureBadge() {
    if (badgeEl) return badgeEl;
    badgeEl = document.createElement('div');
    badgeEl.style.cssText = [
      'position:fixed', 'right:10px', 'bottom:10px', 'z-index:999999',
      'background:#222', 'color:#eee', 'font:12px/1.4 sans-serif',
      'padding:6px 10px', 'border-radius:6px', 'opacity:0.85',
      'max-width:280px', 'box-shadow:0 1px 4px rgba(0,0,0,0.4)',
    ].join(';');
    document.body.appendChild(badgeEl);
    return badgeEl;
  }

  function updateBadge(text) {
    try {
      ensureBadge().textContent = '📅 ' + text;
    } catch (e) {
      /* документ может быть ещё не готов — не критично */
    }
  }

  // ---------------- Отправка в Telegram (через GM_xmlhttpRequest — обходит CORS) ----------------
  function sendTelegramMessage(text) {
    const token = GM_getValue('telegramBotToken', '');
    const chatId = GM_getValue('telegramChatId', '');
    if (!token || !chatId) {
      return Promise.reject(
        new Error('Telegram не настроен — используй меню «⚙️ Настроить Telegram»')
      );
    }
    const url = `https://api.telegram.org/bot${token}/sendMessage`;

    // Telegram ограничивает сообщения 4096 символами — режем на части при необходимости.
    const chunks = [];
    let remaining = text;
    while (remaining.length > 0) {
      chunks.push(remaining.slice(0, 3900));
      remaining = remaining.slice(3900);
    }

    const sendOne = (chunk) =>
      new Promise((resolve, reject) => {
        GM_xmlhttpRequest({
          method: 'POST',
          url,
          headers: {'Content-Type': 'application/json'},
          data: JSON.stringify({chat_id: chatId, text: chunk, parse_mode: 'Markdown'}),
          onload: (res) => {
            if (res.status >= 200 && res.status < 300) resolve();
            else reject(new Error(`Telegram API error ${res.status}: ${res.responseText}`));
          },
          onerror: () => reject(new Error('Telegram request failed (network error)')),
        });
      });

    return chunks.reduce((p, chunk) => p.then(() => sendOne(chunk)), Promise.resolve());
  }

  // ---------------- Основная проверка ----------------
  async function performCheck(isManual) {
    try {
      log(isManual ? 'Ручная проверка…' : 'Проверяю расписание…');
      // Страница только что загружена (обычным образом или через наш
      // location.reload()) — браузер уже сам определил кодировку и
      // распарсил DOM, поэтому используем document напрямую.
      const allDays = parseScheduleFromDocument(document, GROUP_NAME);

      if (allDays.length === 0) {
        throw new Error(`Расписание для группы ${GROUP_NAME} не найдено на странице`);
      }

      // На странице иногда остаются старые дни — нас интересует только последний.
      const schedule = [allDays[allDays.length - 1]];
      const currentJson = JSON.stringify(schedule);
      const previousJson = GM_getValue('lastScheduleJson', null);

      GM_setValue('lastChecked', Date.now());

      if (previousJson === null) {
        // Первое чтение файла вообще — фиксируем этот момент как lastChanged
        // ("точка отсчёта"). Дальше эта дата меняется только при реальном
        // изменении расписания в блоке ниже.
        GM_setValue('lastScheduleJson', currentJson);
        GM_setValue('lastChanged', Date.now());
        log(`База сохранена: ${schedule[0].day}`);
        return;
      }

      if (currentJson !== previousJson) {
        const changedAt = new Date();
        const message = formatSchedule(schedule, GROUP_NAME, changedAt);
        await sendTelegramMessage(message);
        GM_setValue('lastScheduleJson', currentJson);
        GM_setValue('lastChanged', changedAt.getTime());
        log(`Изменение отправлено: ${schedule[0].day}`);
      } else {
        // Подстраховка: если lastChanged ещё не был выставлен (например,
        // lastScheduleJson уже был сохранён в прошлой версии скрипта, где
        // baseline не фиксировал lastChanged) — фиксируем его прямо сейчас,
        // раз реального изменения всё равно не произошло.
        if (!GM_getValue('lastChanged', 0)) {
          GM_setValue('lastChanged', Date.now());
        }
        log(`Без изменений: ${schedule[0].day}`);
      }
    } catch (err) {
      log('Ошибка: ' + err.message, true);
      try {
        await sendTelegramMessage(`⚠️ Ошибка в проверке расписания (Tampermonkey): ${err.message}`);
      } catch (e) {
        /* если и телеграм недоступен — просто молчим, ошибка уже в консоли */
      }
    }
  }

  // ---------------- Планирование: сам перезагружает страницу раз в 30 минут ----------------
  function scheduleNextReload(delayMs) {
    const safeDelay = Math.max(delayMs, 1000);
    log(`Следующая перезагрузка через ${Math.round(safeDelay / 60000)} мин.`);
    setTimeout(() => location.reload(), safeDelay);
  }

  async function init() {
    const lastChecked = GM_getValue('lastChecked', 0);
    const elapsed = Date.now() - lastChecked;

    if (elapsed >= CHECK_INTERVAL_MS) {
      await performCheck(false);
      scheduleNextReload(CHECK_INTERVAL_MS);
    } else {
      // Страницу открыли/перезагрузили раньше срока (например, вручную) —
      // проверку не делаем, просто доводим таймер до полных 30 минут.
      log('Ждём следующей плановой проверки…');
      scheduleNextReload(CHECK_INTERVAL_MS - elapsed);
    }
  }

  init();

  // ---------------- Команды в меню Tampermonkey (правый клик на иконку расширения) ----------------
  if (typeof GM_registerMenuCommand === 'function') {
    GM_registerMenuCommand('⚙️ Настроить Telegram', () => {
      const currentToken = GM_getValue('telegramBotToken', '');
      const currentChatId = GM_getValue('telegramChatId', '');

      const token = prompt('Токен Telegram-бота:', currentToken);
      if (token === null) return; // отменили
      const chatId = prompt('Chat ID:', currentChatId);
      if (chatId === null) return;

      GM_setValue('telegramBotToken', token.trim());
      GM_setValue('telegramChatId', chatId.trim());
      log('Настройки Telegram сохранены.');
    });

    GM_registerMenuCommand('🔍 Проверить сейчас', () => performCheck(true));

    GM_registerMenuCommand('🧪 Тестовое сообщение в Telegram', async () => {
      try {
        const allDays = parseScheduleFromDocument(document, GROUP_NAME);
        if (allDays.length === 0) throw new Error('Расписание не найдено на странице');
        const schedule = [allDays[allDays.length - 1]];
        // Тестовая кнопка — не настоящее изменение, поэтому показываем реальную
        // сохранённую дату последнего изменения. Если реальных изменений ещё
        // не было (lastChanged пуст) — явно показываем это в сообщении, а не
        // подставляем текущее время (иначе дата будет "меняться" при каждом тесте).
        const lastChanged = GM_getValue('lastChanged', 0);
        const changedAt = lastChanged ? new Date(lastChanged) : null;
        // const message = `🧪 ТЕСТОВОЕ сообщение (реального изменения не было)\n\n${formatSchedule(schedule, GROUP_NAME)}`;
        const message = formatSchedule(schedule, GROUP_NAME, changedAt);
        await sendTelegramMessage(message);
        log('Тестовое сообщение отправлено.');
      } catch (err) {
        log('Ошибка теста: ' + err.message, true);
      }
    });

    GM_registerMenuCommand('📊 Статус', () => {
      const lastChecked = GM_getValue('lastChecked', 0);
      const lastChanged = GM_getValue('lastChanged', 0);
      const fmt = (ts) => (ts ? formatDateTimeShort(new Date(ts)) : 'ещё не было');
      alert(
        `Последняя проверка: ${fmt(lastChecked)}\n` +
        `Последнее изменение: ${fmt(lastChanged)}`
      );
    });
  }

  log('Скрипт запущен.');
})();
