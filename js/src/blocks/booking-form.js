(function () {
  'use strict';

  function sleepMs(millisecondsNumber) {
    return new Promise(function (resolveFunction) {
      setTimeout(resolveFunction, millisecondsNumber);
    });
  }

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

  function getUrlRange() {
    const paramsObject = new URLSearchParams(window.location.search);
    const checkinString = paramsObject.get('checkin');
    const checkoutString = paramsObject.get('checkout');
    if (!checkinString || !checkoutString) return null;
    const ci = parseYmd(checkinString);
    const co = parseYmd(checkoutString);
    if (!ci || !co) return null;
    return { ci: ci, co: co };
  }

  function getCalendarRoot() {
    return document.querySelector('.wpbs-container.wpbs-visible');
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
      new PointerEvent('pointerenter', {
        bubbles: true,
        cancelable: true,
        pointerType: 'mouse',
        clientX: cx,
        clientY: cy,
      }),
    );
    el.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true, cancelable: true, clientX: cx, clientY: cy }));
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
    return n.classList.contains('wpbs-selected-first') || n.classList.contains('wpbs-date-selected');
  }

  function isLastSelected(root, y, m, d) {
    const n = root && getCell(root, y, m, d);
    if (!n) return false;
    return n.classList.contains('wpbs-selected-last');
  }

  async function waitForCalendarReady(maxMs) {
    const start = Date.now();
    while (Date.now() - start < maxMs) {
      const root = getCalendarRoot();
      if (root && root.querySelector('.wpbs-date')) return root;
      await sleepMs(120);
    }
    return null;
  }

  async function waitForRerender(oldRoot, maxMs) {
    const start = Date.now();
    while (Date.now() - start < maxMs) {
      const nowRoot = getCalendarRoot();
      if (nowRoot && nowRoot !== oldRoot) return nowRoot;
      await sleepMs(120);
    }
    return getCalendarRoot() || oldRoot;
  }

  async function showMonth(root, y, m) {
    if (isTargetMonthShown(root, y, m)) return root;
    const sel = getMonthSelect(root);
    if (sel) {
      const opt = findSelectOptionFor(root, y, m);
      if (opt) {
        sel.value = opt.value;
        fireChange(sel);
        await sleepMs(900);
        root = await waitForRerender(root, 4000);
        if (isTargetMonthShown(root, y, m)) return root;
      }
    }
    const nextBtn = root.querySelector('.wpbs-calendar-header .wpbs-next');
    const prevBtn = root.querySelector('.wpbs-calendar-header .wpbs-prev');
    let guard = 0;
    while (!isTargetMonthShown(root, y, m) && guard < 48) {
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
      await sleepMs(900);
      root = await waitForRerender(root, 3000);
    }
    return root;
  }

  async function hoverPathAcross(root, fromY, fromM, fromD, toY, toM, toD) {
    if (fromY === toY && fromM === toM) {
      const startDay = Math.min(fromD, toD);
      const endDay = Math.max(fromD, toD);
      for (let day = startDay; day <= endDay; day++) {
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
    while (y < toY || (y === toY && m < toM)) {
      root = await showMonth(root, y, m);
      for (let day = d; day <= lastDayInMonth(y, m); day++) {
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
    for (let day = 1; day <= toD; day++) {
      const el = getCell(root, toY, toM, day);
      if (el) {
        pointerHover(el);
        await sleepMs(24);
      }
    }
    return root;
  }

  async function selectRangeLikeHuman(ci, co) {
    let root = await waitForCalendarReady(20000);
    if (!root) return false;

    root = await showMonth(root, ci.yearNumber, ci.monthNumber);
    await sleepMs(900);

    const startCell = getCell(root, ci.yearNumber, ci.monthNumber, ci.dayNumber);
    if (!startCell) return false;

    pointerClick(startCell);
    await sleepMs(900);
    root = await waitForRerender(root, 4000);

    if (!isFirstSelected(root, ci.yearNumber, ci.monthNumber, ci.dayNumber)) {
      pointerClick(getCell(root, ci.yearNumber, ci.monthNumber, ci.dayNumber));
      await sleepMs(900);
      root = await waitForRerender(root, 4000);
    }

    root = await hoverPathAcross(
      root,
      ci.yearNumber,
      ci.monthNumber,
      ci.dayNumber,
      co.yearNumber,
      co.monthNumber,
      co.dayNumber,
    );
    await sleepMs(300);

    if (co.yearNumber !== ci.yearNumber || co.monthNumber !== ci.monthNumber) {
      root = await showMonth(root, co.yearNumber, co.monthNumber);
      await sleepMs(600);
    }

    const endCell = getCell(root, co.yearNumber, co.monthNumber, co.dayNumber);
    if (!endCell) return false;

    pointerHover(endCell);
    await sleepMs(120);
    pointerClick(endCell);
    await sleepMs(900);
    root = await waitForRerender(root, 4000);

    if (!isLastSelected(root, co.yearNumber, co.monthNumber, co.dayNumber)) {
      pointerHover(endCell);
      await sleepMs(120);
      pointerClick(endCell);
      await sleepMs(900);
      root = await waitForRerender(root, 4000);
    }

    return (
      isFirstSelected(root, ci.yearNumber, ci.monthNumber, ci.dayNumber) &&
      isLastSelected(root, co.yearNumber, co.monthNumber, co.dayNumber)
    );
  }

  async function mainRun() {
    const range = getUrlRange();
    if (!range) return;

    let tries = 0;
    let ok = false;
    while (tries < 3 && !ok) {
      ok = await selectRangeLikeHuman(range.ci, range.co);
      if (ok) break;
      tries += 1;
      await sleepMs(1200);
    }

    if (!ok) {
      const root = getCalendarRoot();
      if (root) {
        const sel = getMonthSelect(root);
        if (sel) {
          const current = sel.value;
          for (let i = 0; i < sel.options.length; i++) {
            if (sel.options[i].value !== current) {
              sel.value = sel.options[i].value;
              fireChange(sel);
              break;
            }
          }
          await sleepMs(900);
          sel.value = current;
          fireChange(sel);
          await sleepMs(900);
        }
      }
      await selectRangeLikeHuman(range.ci, range.co);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', mainRun, { once: true });
  } else {
    mainRun();
  }
})();
