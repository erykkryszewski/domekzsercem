document.addEventListener('DOMContentLoaded', function () {
  const homepageFormElement = document.querySelector('.booking-box__form');

  function formatPln(n) {
    const s = Math.round(n).toString();
    return s.replace(/\B(?=(\d{3})+(?!\d))/g, ' ') + ' zł';
  }

  function getTodayIso() {
    const nowDate = new Date();
    const y = nowDate.getFullYear();
    const m = String(nowDate.getMonth() + 1).padStart(2, '0');
    const d = String(nowDate.getDate()).padStart(2, '0');
    return y + '-' + m + '-' + d;
  }

  function sleepMs(ms) {
    return new Promise(function (resolve) {
      setTimeout(resolve, ms);
    });
  }

  function waitForElement(selector, maxMs) {
    return new Promise(function (resolve) {
      const startTime = Date.now();
      function tick() {
        const node = document.querySelector(selector);
        if (node) {
          resolve(node);
          return;
        }
        if (Date.now() - startTime > maxMs) {
          resolve(null);
          return;
        }
        requestAnimationFrame(tick);
      }
      tick();
    });
  }

  function parseQueryParams() {
    let query = window.location.search || '';
    if (query.startsWith('?')) query = query.slice(1);
    let out = {};
    if (!query) return out;
    query.split('&').forEach(function (pair) {
      if (!pair) return;
      let parts = pair.split('=');
      let key = decodeURIComponent(parts[0] || '').trim();
      let val = decodeURIComponent((parts[1] || '').replace(/\+/g, ' ')).trim();
      if (!key) return;
      out[key] = val;
    });
    return out;
  }

  function parseGuestsString(guestsString) {
    if (!guestsString) return { totalPersons: 2, adults: 2, children: 0 };
    let tokens = guestsString.split('-').map(function (t) {
      return t.trim().toLowerCase();
    });
    let lastNumberValue = null;
    let adultsCountValue = 0;
    let childrenCountValue = 0;
    for (let i = 0; i < tokens.length; i++) {
      let t = tokens[i];
      if (/^\d+$/.test(t)) {
        lastNumberValue = parseInt(t, 10);
        continue;
      }
      if (t.indexOf('dorosly') === 0 || t.indexOf('dorosłych') === 0 || t.indexOf('doroslych') === 0) {
        let n = 1;
        if (lastNumberValue !== null) n = lastNumberValue;
        adultsCountValue += n;
        lastNumberValue = null;
        continue;
      }
      if (t.indexOf('dziec') === 0) {
        let n = 1;
        if (lastNumberValue !== null) n = lastNumberValue;
        childrenCountValue += n;
        lastNumberValue = null;
        continue;
      }
      if (t.indexOf('pies') === 0 || t.indexOf('psa') === 0) {
        lastNumberValue = null;
        continue;
      }
      lastNumberValue = null;
    }
    let total = adultsCountValue + childrenCountValue;
    if (total <= 0) total = 2;
    return { totalPersons: total, adults: adultsCountValue, children: childrenCountValue };
  }

  function monthNamePl(n) {
    const names = [
      '',
      'Styczeń',
      'Luty',
      'Marzec',
      'Kwiecień',
      'Maj',
      'Czerwiec',
      'Lipiec',
      'Sierpień',
      'Wrzesień',
      'Październik',
      'Listopad',
      'Grudzień',
    ];
    return names[n] || '';
  }

  async function ensureMonthVisibleByText(targetYear, targetMonth) {
    const selectNode = await waitForElement('.wpbs-select-container select[name="wpbs-month-selector-dropdown"]', 8000);
    if (!selectNode) return false;
    let desiredText = monthNamePl(targetMonth) + ' ' + String(targetYear);
    let desiredValue = null;
    for (let i = 0; i < selectNode.options.length; i++) {
      const opt = selectNode.options[i];
      const txt = (opt.text || '').trim();
      if (txt === desiredText) {
        desiredValue = opt.value;
        break;
      }
    }
    if (desiredValue === null && selectNode.options.length > 0) {
      for (let i = 0; i < selectNode.options.length; i++) {
        const opt = selectNode.options[i];
        const ts = parseInt(opt.value, 10);
        if (!isNaN(ts)) {
          const dt = new Date(ts * 1000);
          const y = dt.getUTCFullYear();
          const m = dt.getUTCMonth() + 1;
          if (y === targetYear && m === targetMonth) {
            desiredValue = opt.value;
            break;
          }
        }
      }
    }
    if (desiredValue === null) return false;
    if (selectNode.value !== desiredValue) {
      selectNode.value = desiredValue;
      const ev = new Event('change', { bubbles: true });
      selectNode.dispatchEvent(ev);
      await sleepMs(200);
    }
    return true;
  }

  async function clickBookableDate(year, month, day) {
    let selector =
      '.wpbs-date.wpbs-is-bookable[data-year="' +
      String(year) +
      '"][data-month="' +
      String(month) +
      '"][data-day="' +
      String(day) +
      '"]';
    let node = document.querySelector(selector);
    if (!node) {
      await sleepMs(120);
      node = document.querySelector(selector);
    }
    if (!node) return false;
    let e1 = new MouseEvent('mousedown', { bubbles: true });
    let e2 = new MouseEvent('mouseup', { bubbles: true });
    let e3 = new MouseEvent('click', { bubbles: true });
    node.dispatchEvent(e1);
    node.dispatchEvent(e2);
    node.dispatchEvent(e3);
    await sleepMs(120);
    return true;
  }

  async function selectCalendarRange(checkinIso, checkoutIso) {
    const inDate = new Date(checkinIso);
    const outDate = new Date(checkoutIso);
    if (isNaN(inDate.getTime()) || isNaN(outDate.getTime())) return false;
    const iy = inDate.getFullYear();
    const im = inDate.getMonth() + 1;
    const id = inDate.getDate();
    const oy = outDate.getFullYear();
    const om = outDate.getMonth() + 1;
    const od = outDate.getDate();
    let okMonthIn = await ensureMonthVisibleByText(iy, im);
    if (!okMonthIn) return false;
    let okStart = await clickBookableDate(iy, im, id);
    if (!okStart) return false;
    if (oy !== iy || om !== im) {
      let okMonthOut = await ensureMonthVisibleByText(oy, om);
      if (!okMonthOut) return false;
      await sleepMs(120);
    }
    let okEnd = await clickBookableDate(oy, om, od);
    if (!okEnd) return false;
    return true;
  }

  function fillExtraPersons(totalPersons) {
    let input = document.querySelector('input[name="wpbs-input-1-11"]');
    if (!input) return;
    let extra = totalPersons - 3;
    if (extra < 0) extra = 0;
    let maxAttr = parseInt(input.getAttribute('max') || '0', 10);
    if (!isNaN(maxAttr) && maxAttr > 0 && extra > maxAttr) extra = maxAttr;
    input.value = String(extra);
    let ev = new Event('input', { bubbles: true });
    input.dispatchEvent(ev);
    let evc = new Event('change', { bubbles: true });
    input.dispatchEvent(evc);
  }

  async function initBookingPageAutofill() {
    const calendarRoot = await waitForElement('.wpbs-main-wrapper .wpbs-container', 10000);
    const bookingFormRoot = await waitForElement('form.wpbs-form-container', 10000);
    if (!calendarRoot || !bookingFormRoot) return;
    const params = parseQueryParams();
    const checkinStr = params['checkin'] || '';
    const checkoutStr = params['checkout'] || '';
    const guestsStr = params['guests'] || '';
    if (checkinStr && checkoutStr) {
      let tries = 0;
      let ok = false;
      while (tries < 8 && ok === false) {
        ok = await selectCalendarRange(checkinStr, checkoutStr);
        if (ok) break;
        await sleepMs(220);
        tries += 1;
      }
    }
    if (guestsStr) {
      const parsedGuests = parseGuestsString(guestsStr);
      fillExtraPersons(parsedGuests.totalPersons);
    }
  }

  function initHomepageWidget() {
    if (!homepageFormElement) return;

    const checkinInputElement = document.getElementById('checkin');
    const checkoutInputElement = document.getElementById('checkout');
    const nightsTextElement = homepageFormElement.querySelector('[data-nights-text]');
    const nightsPriceElement = homepageFormElement.querySelector('[data-nights-price]');
    const totalElement = homepageFormElement.querySelector('[data-total]');
    const nightsHiddenInputElement = homepageFormElement.querySelector('[data-nights-input]');
    const totalHiddenInputElement = homepageFormElement.querySelector('[data-total-input]');
    const discountRowElement = homepageFormElement.querySelector('[data-discount-row]');
    const discountNameElement = homepageFormElement.querySelector('[data-discount-name]');
    const discountAmountElement = homepageFormElement.querySelector('[data-discount-amount]');
    const pricePerNightValue = Number(homepageFormElement.getAttribute('data-price-per-night') || '0');
    const discountNameValue = String(homepageFormElement.getAttribute('data-discount-name') || '');
    const discountAmountValue = Number(homepageFormElement.getAttribute('data-discount-amount') || '0');

    const todayIsoValue = getTodayIso();
    if (checkinInputElement) {
      checkinInputElement.min = todayIsoValue;
      if (checkinInputElement.value && checkinInputElement.value < todayIsoValue) {
        checkinInputElement.value = todayIsoValue;
      }
    }

    function setMinCheckout() {
      if (!checkinInputElement.value) return;
      const inDate = new Date(checkinInputElement.value);
      const minOut = new Date(inDate.getTime() + 24 * 60 * 60 * 1000);
      const y = minOut.getFullYear();
      const m = String(minOut.getMonth() + 1).padStart(2, '0');
      const d = String(minOut.getDate()).padStart(2, '0');
      checkoutInputElement.min = y + '-' + m + '-' + d;
      if (checkoutInputElement.value && checkoutInputElement.value < checkoutInputElement.min) {
        checkoutInputElement.value = checkoutInputElement.min;
      }
    }

    function recalcSummary() {
      if (!checkinInputElement.value || !checkoutInputElement.value) {
        nightsTextElement.textContent = '—';
        nightsPriceElement.textContent = '—';
        totalElement.textContent = '—';
        nightsHiddenInputElement.value = '';
        totalHiddenInputElement.value = '';
        return;
      }
      const inDate = new Date(checkinInputElement.value);
      const outDate = new Date(checkoutInputElement.value);
      const diffMs = outDate.getTime() - inDate.getTime();
      const nightsCount = Math.round(diffMs / (1000 * 60 * 60 * 24));
      if (nightsCount <= 0) {
        nightsTextElement.textContent = '—';
        nightsPriceElement.textContent = '—';
        totalElement.textContent = '—';
        nightsHiddenInputElement.value = '';
        totalHiddenInputElement.value = '';
        return;
      }
      const baseAmount = nightsCount * pricePerNightValue;
      let discountApplied = 0;
      if (discountAmountValue > 0) discountApplied = discountAmountValue;
      const totalAmount = Math.max(0, baseAmount - discountApplied);
      nightsTextElement.textContent = nightsCount + ' nocy';
      nightsPriceElement.textContent = formatPln(baseAmount);
      discountNameElement.textContent = discountNameValue;
      discountAmountElement.textContent = '-' + formatPln(discountApplied);
      discountRowElement.style.display = discountApplied > 0 ? '' : 'none';
      totalElement.textContent = formatPln(totalAmount);
      nightsHiddenInputElement.value = String(nightsCount);
      totalHiddenInputElement.value = String(totalAmount);
    }

    homepageFormElement.querySelectorAll('.booking-box__date').forEach(function (node) {
      node.addEventListener('click', function () {
        const targetId = node.getAttribute('data-focus');
        const inputNode = document.getElementById(targetId);
        if (!inputNode) return;
        if (typeof inputNode.showPicker === 'function') {
          inputNode.showPicker();
        } else {
          inputNode.focus();
        }
      });
    });

    if (checkinInputElement) {
      checkinInputElement.addEventListener('change', function () {
        setMinCheckout();
        recalcSummary();
      });
    }
    if (checkoutInputElement) {
      checkoutInputElement.addEventListener('change', recalcSummary);
    }

    setMinCheckout();
    recalcSummary();

    let mainWrapperElement = document.querySelector('.main__wrapper');
    let leftColumnElement = document.querySelector('.main__column--left');
    let rightColumnElement = document.querySelector('.main__column--right');
    let bookingBoxElement = document.querySelector('.booking-box');
    if (mainWrapperElement && leftColumnElement && rightColumnElement && bookingBoxElement) {
      let lastStateName = '';

      function isDesktopViewport() {
        let viewportWidthValue = window.innerWidth || document.documentElement.clientWidth || 0;
        if (viewportWidthValue >= 992) return true;
        return false;
      }

      function computeStickyBounds() {
        let wrapperTopValue = mainWrapperElement.getBoundingClientRect().top + window.scrollY;
        let leftTopValue = leftColumnElement.getBoundingClientRect().top + window.scrollY;
        let rightTopValue = rightColumnElement.getBoundingClientRect().top + window.scrollY;
        let wrapperBottomValue = wrapperTopValue + mainWrapperElement.offsetHeight;
        let bookingHeightValue = bookingBoxElement.offsetHeight;
        let startValue = leftTopValue;
        let endValue = wrapperBottomValue - bookingHeightValue - 45;
        return { startValue, endValue, rightTopValue };
      }

      function setAbsoluteTop(topPixelsValue) {
        bookingBoxElement.style.position = 'absolute';
        bookingBoxElement.style.left = '';
        bookingBoxElement.style.top = String(topPixelsValue) + 'px';
        bookingBoxElement.style.width = '';
        bookingBoxElement.classList.remove('is-sticky');
        lastStateName = 'absolute';
      }

      function setFixedSticky() {
        let rightRect = rightColumnElement.getBoundingClientRect();
        let leftPixelsValue = rightRect.left + window.scrollX + 15;
        let widthPixelsValue = rightColumnElement.clientWidth - 30;
        if (widthPixelsValue <= 0) widthPixelsValue = rightColumnElement.clientWidth;
        bookingBoxElement.style.position = 'fixed';
        bookingBoxElement.style.left = String(leftPixelsValue) + 'px';
        bookingBoxElement.style.top = '45px';
        bookingBoxElement.style.width = String(widthPixelsValue) + 'px';
        bookingBoxElement.classList.add('is-sticky');
        lastStateName = 'fixed';
      }

      function updateStickyPosition() {
        if (!isDesktopViewport()) {
          setAbsoluteTop(30);
          return;
        }
        let bounds = computeStickyBounds();
        let scrollTopValue = window.scrollY;
        if (scrollTopValue < bounds.startValue) {
          setAbsoluteTop(30);
          return;
        }
        if (scrollTopValue >= bounds.startValue && scrollTopValue <= bounds.endValue) {
          if (lastStateName !== 'fixed') setFixedSticky();
          return;
        }
        let topInsideRightColumnValue = bounds.endValue - bounds.rightTopValue;
        if (topInsideRightColumnValue < 0) topInsideRightColumnValue = 0;
        setAbsoluteTop(topInsideRightColumnValue);
      }

      function ensureErrorMessageNode() {
        let containerNode = homepageFormElement.querySelector('.booking-box__actions');
        if (!containerNode) return null;
        let existingNode = homepageFormElement.querySelector('.booking-box__error');
        if (existingNode) return existingNode;
        let messageNode = document.createElement('div');
        messageNode.className = 'booking-box__error';
        messageNode.style.marginBottom = '12px';
        messageNode.style.padding = '10px 12px';
        messageNode.style.border = '1px solid #c00';
        messageNode.style.background = '#ffecec';
        messageNode.style.color = '#900';
        messageNode.style.fontWeight = '600';
        containerNode.parentNode.insertBefore(messageNode, containerNode);
        return messageNode;
      }

      homepageFormElement.addEventListener('submit', function (ev) {
        const todayIso = getTodayIso();
        const checkinValue = checkinInputElement ? checkinInputElement.value : '';
        if (!checkinValue || checkinValue < todayIso) {
          ev.preventDefault();
          const msgNode = ensureErrorMessageNode();
          if (msgNode) {
            msgNode.textContent = 'Data zameldowania nie może być wcześniejsza niż dzisiaj.';
          }
        }
      });

      window.addEventListener('scroll', updateStickyPosition, { passive: true });
      window.addEventListener('resize', updateStickyPosition);
      updateStickyPosition();
    }
  }

  initHomepageWidget();
  initBookingPageAutofill();
});
