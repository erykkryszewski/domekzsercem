document.addEventListener('DOMContentLoaded', function () {
  const formElement = document.querySelector('.booking-box__form');
  if (!formElement) return;

  const checkinInputElement = document.getElementById('checkin');
  const checkoutInputElement = document.getElementById('checkout');
  const nightsTextElement = formElement.querySelector('[data-nights-text]');
  const nightsPriceElement = formElement.querySelector('[data-nights-price]');
  const totalElement = formElement.querySelector('[data-total]');
  const nightsHiddenInputElement = formElement.querySelector('[data-nights-input]');
  const totalHiddenInputElement = formElement.querySelector('[data-total-input]');
  const discountRowElement = formElement.querySelector('[data-discount-row]');
  const discountNameElement = formElement.querySelector('[data-discount-name]');
  const discountAmountElement = formElement.querySelector('[data-discount-amount]');

  const pricePerNightValue = Number(formElement.getAttribute('data-price-per-night') || '0');
  const discountNameValue = String(formElement.getAttribute('data-discount-name') || '');
  const discountAmountValue = Number(formElement.getAttribute('data-discount-amount') || '0');

  function formatPln(n) {
    const s = Math.round(n).toString();
    return s.replace(/\B(?=(\d{3})+(?!\d))/g, ' ') + ' zł';
  }

  function setMinCheckout() {
    if (!checkinInputElement.value) return;
    const inDate = new Date(checkinInputElement.value);
    const minOut = new Date(inDate.getTime() + 24 * 60 * 60 * 1000);
    const y = minOut.getFullYear();
    const m = String(minOut.getMonth() + 1).padStart(2, '0');
    const d = String(minOut.getDate()).padStart(2, '0');
    checkoutInputElement.min = `${y}-${m}-${d}`;
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

  formElement.querySelectorAll('.booking-box__date').forEach(function (node) {
    node.addEventListener('click', function () {
      const targetId = node.getAttribute('data-focus');
      const inputNode = document.getElementById(targetId);
      if (inputNode) inputNode.showPicker ? inputNode.showPicker() : inputNode.focus();
    });
  });

  checkinInputElement.addEventListener('change', function () {
    setMinCheckout();
    recalcSummary();
  });
  checkoutInputElement.addEventListener('change', recalcSummary);

  setMinCheckout();
  recalcSummary();

  // sticky

  let mainWrapperElement = document.querySelector('.main__wrapper');
  let leftColumnElement = document.querySelector('.main__column--left');
  let rightColumnElement = document.querySelector('.main__column--right');
  let bookingBoxElement = document.querySelector('.booking-box');
  if (!mainWrapperElement || !leftColumnElement || !rightColumnElement || !bookingBoxElement) return;

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

  window.addEventListener('scroll', updateStickyPosition, { passive: true });
  window.addEventListener('resize', updateStickyPosition);
  updateStickyPosition();
});
