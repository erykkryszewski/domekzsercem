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
});
