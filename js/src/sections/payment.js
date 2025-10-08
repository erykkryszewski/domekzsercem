(function () {
  if (window.__ercodingDatesSelectedBootstrap) return;
  window.__ercodingDatesSelectedCallbacks = window.__ercodingDatesSelectedCallbacks || [];
  window.__ercodingEnsureDatesSelectedObserver = function (optionsObject) {
    const minStableMsNumber = optionsObject && optionsObject.minStableMsNumber ? optionsObject.minStableMsNumber : 500;
    if (window.__ercodingDatesSelectedObserver) {
      const t0 = document.querySelector('.wpbs-main-wrapper-calendar-1');
      if (t0 && t0.classList.contains('wpbs-dates-selected')) {
        for (let i = 0; i < window.__ercodingDatesSelectedCallbacks.length; i++) {
          try {
            window.__ercodingDatesSelectedCallbacks[i]();
          } catch (e) {}
        }
      }
      return;
    }
    let lastFiredStableFlag = false;
    let pendingStableTimerId = null;
    function clearStableTimer() {
      if (pendingStableTimerId) {
        clearTimeout(pendingStableTimerId);
        pendingStableTimerId = null;
      }
    }
    function isDatesSelectedNow() {
      const t = document.querySelector('.wpbs-main-wrapper-calendar-1');
      if (!t) return false;
      return t.classList.contains('wpbs-dates-selected');
    }
    function scheduleStableFire() {
      if (pendingStableTimerId) return;
      pendingStableTimerId = setTimeout(function () {
        pendingStableTimerId = null;
        if (isDatesSelectedNow()) {
          if (!lastFiredStableFlag) {
            lastFiredStableFlag = true;
            for (let i = 0; i < window.__ercodingDatesSelectedCallbacks.length; i++) {
              try {
                window.__ercodingDatesSelectedCallbacks[i]();
              } catch (e) {}
            }
          }
        }
      }, minStableMsNumber);
    }
    function resetOnRemoval() {
      clearStableTimer();
      lastFiredStableFlag = false;
    }
    if (isDatesSelectedNow()) {
      scheduleStableFire();
    }
    const obs = new MutationObserver(function () {
      const hasClassNow = isDatesSelectedNow();
      if (hasClassNow) {
        scheduleStableFire();
      } else {
        resetOnRemoval();
      }
    });
    obs.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
      subtree: true,
      childList: true,
    });
    window.__ercodingDatesSelectedObserver = obs;
  };
  window.__ercodingDatesSelectedBootstrap = true;
})();

document.addEventListener('DOMContentLoaded', function () {
  const formFieldsElement = document.querySelector('.wpbs-form-fields');
  if (!formFieldsElement) return;

  const leftColumn = document.createElement('div');
  leftColumn.className = 'payment__column payment__column--left';

  const rightColumn = document.createElement('div');
  rightColumn.className = 'payment__column payment__column--right';

  const rightSelectors = [
    '.wpbs-form-field-part-payment-applicability',
    '.wpbs-form-field-coupon',
    '.payment__discount',
    '.payment__total',
    '.payment__options',
  ];

  const leftSelectors = ['.calendar-maybe-if-it-will-work'];

  Array.from(formFieldsElement.children).forEach(function (child) {
    if (
      rightSelectors.some(function (selector) {
        return child.matches(selector);
      })
    ) {
      rightColumn.appendChild(child);
    } else if (
      leftSelectors.some(function (selector) {
        return child.matches(selector);
      })
    ) {
      leftColumn.prepend(child);
    } else {
      leftColumn.appendChild(child);
    }
  });

  formFieldsElement.innerHTML = '';
  formFieldsElement.appendChild(leftColumn);
  formFieldsElement.appendChild(rightColumn);

  const ercodingIntervalMs = 300;

  let calendarCheckIntervalId = null;
  function startCalendarCheck() {
    if (calendarCheckIntervalId) return;
    calendarCheckIntervalId = setInterval(function () {
      const calendarElement = document.querySelector('.calendar-maybe-if-it-will-work');
      if (!calendarElement) return;
      if (!leftColumn.contains(calendarElement)) {
        leftColumn.prepend(calendarElement);
      }
      clearInterval(calendarCheckIntervalId);
      calendarCheckIntervalId = null;
    }, ercodingIntervalMs);
  }

  startCalendarCheck();

  window.__ercodingEnsureDatesSelectedObserver({ minStableMsNumber: 500 });

  function toggleRightColumnOnDatesSelected() {
    const targetElement = document.querySelector('.wpbs-main-wrapper-calendar-1');
    if (!targetElement) return;
    const hasClass = targetElement.classList.contains('wpbs-dates-selected');
    if (hasClass) {
      if (!rightColumn.classList.contains('payment__column--hide-after')) {
        rightColumn.classList.add('payment__column--hide-after');
      }
    } else {
      if (rightColumn.classList.contains('payment__column--hide-after')) {
        rightColumn.classList.remove('payment__column--hide-after');
      }
    }
  }

  window.__ercodingDatesSelectedCallbacks.push(toggleRightColumnOnDatesSelected);
  toggleRightColumnOnDatesSelected();
});

(function () {
  'use strict';

  if (window.__ercodingWpbsAutoSelectorRunningV2) return;
  window.__ercodingWpbsAutoSelectorRunningV2 = true;

  const ercodingIntervalMs = 300;

  let stoppedFlag = false;
  let pendingTimeoutIdsArray = [];
  let overlayElement = null;

  function addTimeout(fn, ms) {
    const id = setTimeout(fn, ms);
    pendingTimeoutIdsArray.push(id);
    return id;
  }

  function clearAllTimeouts() {
    for (let i = 0; i < pendingTimeoutIdsArray.length; i++) {
      clearTimeout(pendingTimeoutIdsArray[i]);
    }
    pendingTimeoutIdsArray = [];
  }

  function sleepMs(millisecondsNumber) {
    return new Promise(function (resolveFunction) {
      if (stopNow()) return resolveFunction();
      addTimeout(resolveFunction, millisecondsNumber);
    });
  }

  function showOverlay() {
    const paramsObject = new URLSearchParams(window.location.search);
    const checkinString = paramsObject.get('checkin');
    const checkoutString = paramsObject.get('checkout');
    if (!checkinString || !checkoutString) return;
    if (document.getElementById('ercoding-wpbs-overlay')) return;
    const styleElement = document.createElement('style');
    styleElement.id = 'ercoding-wpbs-overlay-style';
    styleElement.textContent =
      '#ercoding-wpbs-overlay{position:fixed;inset:0;background:rgba(255,255,255,.96);display:flex;align-items:center;justify-content:center;z-index:2147483646;opacity:1;transition:opacity .35s ease}#ercoding-wpbs-overlay.ercoding-hide{opacity:0;pointer-events:none}#ercoding-wpbs-overlay .ercoding-box{display:flex;flex-direction:column;gap:16px;align-items:center;justify-content:center;font-family:system-ui,-apple-system,Segoe UI,Roboto,Ubuntu,Cantarell,Noto Sans,sans-serif;color:#222}#ercoding-wpbs-overlay .ercoding-loader{width:54px;height:54px;border-radius:50%;border:6px solid #ddd;border-top-color:#111;animation:ercodingspin 1s linear infinite}@keyframes ercodingspin{to{transform:rotate(360deg)}}#ercoding-wpbs-overlay .ercoding-text{font-weight:700;letter-spacing:.2px}';
    document.head.appendChild(styleElement);
    overlayElement = document.createElement('div');
    overlayElement.id = 'ercoding-wpbs-overlay';
    const boxElement = document.createElement('div');
    boxElement.className = 'ercoding-box';
    const loaderElement = document.createElement('div');
    loaderElement.className = 'ercoding-loader';
    const textElement = document.createElement('div');
    textElement.className = 'ercoding-text';
    textElement.textContent = 'Sprawdzanie dostępności i obliczanie finalnej kwoty';
    boxElement.appendChild(loaderElement);
    boxElement.appendChild(textElement);
    overlayElement.appendChild(boxElement);
    document.body.appendChild(overlayElement);
  }

  function hideOverlaySmoothly() {
    const el = document.getElementById('ercoding-wpbs-overlay');
    if (!el) return;
    el.classList.add('ercoding-hide');
    addTimeout(function () {
      if (el && el.parentNode) el.parentNode.removeChild(el);
      const styleEl = document.getElementById('ercoding-wpbs-overlay-style');
      if (styleEl && styleEl.parentNode) styleEl.parentNode.removeChild(styleEl);
    }, 380);
  }

  function stopNow() {
    if (stoppedFlag) return true;
    const pricingTableElement = document.querySelector(
      'table.wpbs-pricing-table.wpbs-part-payment-applicable.wpbs-payment-method-stripe',
    );
    if (pricingTableElement) {
      stoppedFlag = true;
      clearAllTimeouts();
      return true;
    }
    return false;
  }

  function hideOverlayWhenDatesSelected() {
    const t = document.querySelector('.wpbs-main-wrapper-calendar-1');
    if (!t) return;
    if (t.classList.contains('wpbs-dates-selected')) {
      const el = document.getElementById('ercoding-wpbs-overlay');
      if (el) {
        hideOverlaySmoothly();
      }
    }
  }

  window.__ercodingEnsureDatesSelectedObserver({ minStableMsNumber: 500 });
  window.__ercodingDatesSelectedCallbacks.push(hideOverlayWhenDatesSelected);

  function hideOverlayWhenDatesSelected() {
    const t = document.querySelector('.wpbs-main-wrapper-calendar-1');
    if (!t) return;
    if (t.classList.contains('wpbs-dates-selected')) {
      hideOverlaySmoothly();
    }
  }

  if (!window.__ercodingDatesSelectedCallbacks) {
    window.__ercodingDatesSelectedCallbacks = [];
  }
  window.__ercodingDatesSelectedCallbacks.push(hideOverlayWhenDatesSelected);

  const pricingObserver = new MutationObserver(function () {
    if (stopNow()) pricingObserver.disconnect();
  });
  pricingObserver.observe(document.body, { childList: true, subtree: true });

  function parseYmd(dateString) {
    if (typeof dateString !== 'string') return null;
    const partsArray = dateString.split('-');
    if (!partsArray || partsArray.length !== 3) return null;
    const yearNumber = parseInt(partsArray[0], 10);
    const monthNumber = parseInt(partsArray[1], 10);
    const dayNumber = parseInt(partsArray[2], 10);
    if (!yearNumber || !monthNumber || !dayNumber) return null;
    return { yearNumber: yearNumber, monthNumber: monthNumber, dayNumber: dayNumber };
  }

  function getUrlRangeAndGuests() {
    const paramsObject = new URLSearchParams(window.location.search);
    const checkinString = paramsObject.get('checkin');
    const checkoutString = paramsObject.get('checkout');
    const guestsString = paramsObject.get('guests');
    if (!checkinString || !checkoutString) return null;
    const ci = parseYmd(checkinString);
    const co = parseYmd(checkoutString);
    if (!ci || !co) return null;
    return { ci: ci, co: co, guests: guestsString || '' };
  }

  function computeTotalPeopleFromGuestsString(valueString) {
    if (typeof valueString !== 'string') return null;
    const parts = valueString.split('-');
    if (!parts || parts.length === 0) return null;
    let total = 0;
    for (let i = 0; i < parts.length; i++) {
      const token = parts[i];
      const numberCandidate = parseInt(token, 10);
      if (isNaN(numberCandidate)) continue;
      const nextToken = parts[i + 1] || '';
      if (nextToken.indexOf('pies') !== -1) continue;
      total += numberCandidate;
    }
    if (total <= 0) return null;
    return total;
  }

  async function waitForCalendarReady(maxMs) {
    const start = Date.now();
    while (Date.now() - start < maxMs) {
      if (stopNow()) return null;
      const root = document.querySelector('.wpbs-container.wpbs-visible');
      if (root && root.querySelector('.wpbs-date')) return root;
      await sleepMs(ercodingIntervalMs);
    }
    return null;
  }

  function getMonthNode(root) {
    if (!root) return null;
    return root.querySelector('.wpbs-calendars .wpbs-calendar');
  }

  function isTargetMonthShown(root, y, m) {
    const monthNode = getMonthNode(root);
    if (!monthNode) return false;
    const cls = Array.from(monthNode.classList);
    const yOk = cls.some(function (c) {
      return c.indexOf('wpbs-calendar-year-') === 0 && parseInt(c.replace('wpbs-calendar-year-', ''), 10) === y;
    });
    const mOk = cls.some(function (c) {
      return c.indexOf('wpbs-calendar-month-') === 0 && parseInt(c.replace('wpbs-calendar-month-', ''), 10) === m;
    });
    return yOk && mOk;
  }

  function getMonthSelect(root) {
    if (!root) return null;
    return root.querySelector('select[name="wpbs-month-selector-dropdown"]');
  }

  function findSelectOptionFor(root, y, m) {
    const sel = getMonthSelect(root);
    if (!sel) return null;
    for (let i = 0; i < sel.options.length; i++) {
      const opt = sel.options[i];
      const ts = parseInt(opt.value, 10);
      if (!ts) continue;
      const d = new Date(ts * 1000);
      const oy = d.getUTCFullYear();
      const om = d.getUTCMonth() + 1;
      if (oy === y && om === m) return opt;
    }
    return null;
  }

  function fireChange(el) {
    if (!el) return;
    el.dispatchEvent(new Event('change', { bubbles: true }));
    el.dispatchEvent(new Event('input', { bubbles: true }));
  }

  function pointerClick(el) {
    if (!el) return;
    const r = el.getBoundingClientRect();
    const cx = r.left + r.width / 2;
    const cy = r.top + r.height / 2;
    el.dispatchEvent(
      new PointerEvent('pointerover', {
        bubbles: true,
        cancelable: true,
        pointerType: 'mouse',
        clientX: cx,
        clientY: cy,
      }),
    );
    el.dispatchEvent(new MouseEvent('mouseover', { bubbles: true, cancelable: true, clientX: cx, clientY: cy }));
    el.dispatchEvent(
      new PointerEvent('pointerdown', {
        bubbles: true,
        cancelable: true,
        pointerType: 'mouse',
        clientX: cx,
        clientY: cy,
        buttons: 1,
      }),
    );
    el.dispatchEvent(
      new MouseEvent('mousedown', { bubbles: true, cancelable: true, clientX: cx, clientY: cy, buttons: 1 }),
    );
    el.dispatchEvent(
      new PointerEvent('pointerup', {
        bubbles: true,
        cancelable: true,
        pointerType: 'mouse',
        clientX: cx,
        clientY: cy,
        buttons: 1,
      }),
    );
    el.dispatchEvent(
      new MouseEvent('mouseup', { bubbles: true, cancelable: true, clientX: cx, clientY: cy, buttons: 1 }),
    );
    el.dispatchEvent(
      new MouseEvent('click', { bubbles: true, cancelable: true, clientX: cx, clientY: cy, buttons: 1 }),
    );
  }

  function pointerHover(el) {
    if (!el) return;
    const r = el.getBoundingClientRect();
    const cx = r.left + r.width / 2;
    const cy = r.top + r.height / 2;
    el.dispatchEvent(
      new PointerEvent('pointerover', {
        bubbles: true,
        cancelable: true,
        pointerType: 'mouse',
        clientX: cx,
        clientY: cy,
      }),
    );
    el.dispatchEvent(new MouseEvent('mouseover', { bubbles: true, cancelable: true, clientX: cx, clientY: cy }));
    el.dispatchEvent(new MouseEvent('mousemove', { bubbles: true, cancelable: true, clientX: cx, clientY: cy }));
  }

  function getCell(root, y, m, d) {
    if (!root) return null;
    return root.querySelector(
      '.wpbs-date.wpbs-is-bookable[data-year="' +
        String(y) +
        '"][data-month="' +
        String(m) +
        '"][data-day="' +
        String(d) +
        '"]',
    );
  }

  function isFirstSelected(root, y, m, d) {
    const n = root && getCell(root, y, m, d);
    if (!n) return false;
    if (n.classList.contains('wpbs-selected-first')) return true;
    if (n.classList.contains('wpbs-date-selected')) return true;
    return false;
  }

  function isLastSelected(root, y, m, d) {
    const n = root && getCell(root, y, m, d);
    if (!n) return false;
    if (n.classList.contains('wpbs-selected-last')) return true;
    return false;
  }

  async function waitForRerender(oldRoot, maxMs) {
    const start = Date.now();
    while (Date.now() - start < maxMs) {
      if (stopNow()) return oldRoot;
      const nowRoot = document.querySelector('.wpbs-container.wpbs-visible');
      if (nowRoot && nowRoot !== oldRoot) return nowRoot;
      await sleepMs(ercodingIntervalMs);
    }
    return document.querySelector('.wpbs-container.wpbs-visible') || oldRoot;
  }

  async function showMonth(root, y, m) {
    if (stopNow()) return root;
    if (isTargetMonthShown(root, y, m)) return root;
    const sel = getMonthSelect(root);
    if (sel) {
      const opt = findSelectOptionFor(root, y, m);
      if (opt) {
        sel.value = opt.value;
        fireChange(sel);
        await sleepMs(600);
        root = await waitForRerender(root, 3000);
        if (isTargetMonthShown(root, y, m)) return root;
      }
    }
    const nextBtn = root.querySelector('.wpbs-calendar-header .wpbs-next');
    const prevBtn = root.querySelector('.wpbs-calendar-header .wpbs-prev');
    let guard = 0;
    while (!isTargetMonthShown(root, y, m) && guard < 48) {
      if (stopNow()) return root;
      const node = getMonthNode(root);
      let cy = null;
      let cm = null;
      if (node) {
        const cl = Array.from(node.classList);
        cl.forEach(function (c) {
          if (c.indexOf('wpbs-calendar-year-') === 0) cy = parseInt(c.replace('wpbs-calendar-year-', ''), 10);
          if (c.indexOf('wpbs-calendar-month-') === 0) cm = parseInt(c.replace('wpbs-calendar-month-', ''), 10);
        });
      }
      let goNext = true;
      if (cy && cm) {
        if (cy > y) goNext = false;
        if (cy === y && cm > m) goNext = false;
      }
      if (goNext && nextBtn) pointerClick(nextBtn);
      if (!goNext && prevBtn) pointerClick(prevBtn);
      guard += 1;
      await sleepMs(600);
      root = await waitForRerender(root, 2500);
    }
    return root;
  }

  async function hoverPathAcross(root, fromY, fromM, fromD, toY, toM, toD) {
    if (stopNow()) return root;
    if (fromY === toY && fromM === toM) {
      const startDay = Math.min(fromD, toD);
      const endDay = Math.max(fromD, toD);
      for (let day = startDay; day <= endDay; day++) {
        if (stopNow()) return root;
        const el = getCell(root, fromY, fromM, day);
        if (el) {
          pointerHover(el);
          await sleepMs(24);
        }
      }
      return root;
    }
    let y = fromY;
    let m = fromM;
    let d = fromD;
    const lastDayInMonth = function (yy, mm) {
      return new Date(yy, mm, 0).getDate();
    };
    while ((y < toY || (y === toY && m < toM)) && !stopNow()) {
      root = await showMonth(root, y, m);
      for (let day = d; day <= lastDayInMonth(y, m); day++) {
        if (stopNow()) return root;
        const el = getCell(root, y, m, day);
        if (el) {
          pointerHover(el);
          await sleepMs(24);
        }
      }
      m += 1;
      if (m > 12) {
        m = 1;
        y += 1;
      }
      d = 1;
    }
    root = await showMonth(root, toY, toM);
    for (let day = 1; day <= toD && !stopNow(); day++) {
      const el = getCell(root, toY, toM, day);
      if (el) {
        pointerHover(el);
        await sleepMs(24);
      }
    }
    return root;
  }

  function findExtraPersonsInput() {
    let node = document.querySelector('input[name="wpbs-input-1-11"]');
    if (node) return node;
    node = document.querySelector('input[type="number"][data-display-value="Liczba dodatkowych osób"]');
    if (node) return node;
    node = document.querySelector('.wpbs-form-field-product_number input[type="number"]');
    return node || null;
  }

  async function waitForExtraPersonsInput(maxMs) {
    const start = Date.now();
    while (Date.now() - start < maxMs) {
      const el = findExtraPersonsInput();
      if (el) return el;
      await sleepMs(ercodingIntervalMs);
    }
    return null;
  }

  async function prefillExtraPersonsBeforeCalendar(guestsString) {
    if (stopNow()) return;
    if (!guestsString) return;
    const totalPeople = computeTotalPeopleFromGuestsString(guestsString);
    if (totalPeople === null) return;
    let extra = totalPeople - 3;
    if (extra < 0) extra = 0;
    const inputEl = await waitForExtraPersonsInput(12000);
    if (!inputEl) return;
    const maxAttr = parseInt(inputEl.getAttribute('max') || '3', 10);
    if (!isNaN(maxAttr)) {
      if (extra > maxAttr) extra = maxAttr;
    }
    const previousValue = inputEl.value;
    if (String(previousValue) !== String(extra)) {
      inputEl.value = String(extra);
      fireChange(inputEl);
      inputEl.dispatchEvent(new KeyboardEvent('keyup', { bubbles: true }));
    }
    await sleepMs(350);
  }

  async function clickAndConfirmCheckin(root, y, m, d) {
    const cell = getCell(root, y, m, d);
    if (!cell) return { ok: false, root: root };
    pointerClick(cell);
    await sleepMs(600);
    let newRoot = await waitForRerender(root, 3000);
    let confirmed = isFirstSelected(newRoot, y, m, d);
    if (!confirmed) {
      pointerClick(getCell(newRoot, y, m, d));
      await sleepMs(600);
      newRoot = await waitForRerender(newRoot, 3000);
      confirmed = isFirstSelected(newRoot, y, m, d);
    }
    return { ok: confirmed, root: newRoot };
  }

  async function clickAndConfirmCheckout(root, y, m, d) {
    const cell = getCell(root, y, m, d);
    if (!cell) return { ok: false, root: root };
    pointerHover(cell);
    await sleepMs(120);
    pointerClick(cell);
    await sleepMs(600);
    let newRoot = await waitForRerender(root, 3000);
    let confirmed = isLastSelected(newRoot, y, m, d);
    if (!confirmed) {
      pointerHover(getCell(newRoot, y, m, d));
      await sleepMs(120);
      pointerClick(getCell(newRoot, y, m, d));
      await sleepMs(600);
      newRoot = await waitForRerender(newRoot, 3000);
      confirmed = isLastSelected(newRoot, y, m, d);
    }
    return { ok: confirmed, root: newRoot };
  }

  async function selectRangeLikeHuman(ci, co) {
    if (stopNow()) return false;
    let root = await waitForCalendarReady(20000);
    if (!root || stopNow()) return false;

    root = await showMonth(root, ci.yearNumber, ci.monthNumber);
    if (stopNow()) return false;
    await sleepMs(600);
    if (stopNow()) return false;

    const checkinResult = await clickAndConfirmCheckin(root, ci.yearNumber, ci.monthNumber, ci.dayNumber);
    if (!checkinResult.ok || stopNow()) return false;
    root = checkinResult.root;

    root = await hoverPathAcross(
      root,
      ci.yearNumber,
      ci.monthNumber,
      ci.dayNumber,
      co.yearNumber,
      co.monthNumber,
      co.dayNumber,
    );
    if (stopNow()) return true;
    await sleepMs(300);
    if (stopNow()) return true;

    if (co.yearNumber !== ci.yearNumber || co.monthNumber !== ci.monthNumber) {
      root = await showMonth(root, co.yearNumber, co.monthNumber);
      if (stopNow()) return true;
      await sleepMs(450);
      if (stopNow()) return true;
    }

    const checkoutResult = await clickAndConfirmCheckout(root, co.yearNumber, co.monthNumber, co.dayNumber);
    if (!checkoutResult.ok) return false;
    return true;
  }

  async function mainRun() {
    const payload = getUrlRangeAndGuests();
    if (!payload) return;
    showOverlay();
    await prefillExtraPersonsBeforeCalendar(payload.guests);
    if (stopNow()) return;
    let tries = 0;
    let ok = false;
    while (tries < 3 && !ok && !stopNow()) {
      ok = await selectRangeLikeHuman(payload.ci, payload.co);
      if (ok || stopNow()) break;
      tries += 1;
      await sleepMs(1200);
    }
    if (!window.__ercodingDatesSelectedObserver) {
      const t = document.querySelector('.wpbs-main-wrapper-calendar-1');
      if (t && t.classList.contains('wpbs-dates-selected')) {
        hideOverlaySmoothly();
      }
    }
  }

  function start() {
    if (stopNow()) return;
    const paramsObject = new URLSearchParams(window.location.search);
    const hasCheckin = !!paramsObject.get('checkin');
    const hasCheckout = !!paramsObject.get('checkout');
    if (!hasCheckin || !hasCheckout) return;
    mainRun();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', start, { once: true });
  } else {
    start();
  }
})();
