document.addEventListener('DOMContentLoaded', function () {
  function arrangeWpbsColumns() {
    const formFieldsElement = document.querySelector('.wpbs-form-fields');
    if (!formFieldsElement) return;

    const processedElement = formFieldsElement.querySelector('.payment__column');
    if (processedElement) return;

    const leftColumnElement = document.createElement('div');
    leftColumnElement.className = 'payment__column payment__column--left';

    const rightColumnElement = document.createElement('div');
    rightColumnElement.className = 'payment__column payment__column--right';

    const rightSelectorsArray = [
      '.payment__discount',
      '.payment__total',
      '.payment__options',
      '.wpbs-form-field-total',
      '.wpbs-form-field-payment_method',
      '.wpbs-form-field-part-payment-applicability',
    ];

    const childrenArray = Array.from(formFieldsElement.children);
    for (let i = 0; i < childrenArray.length; i++) {
      const childElement = childrenArray[i];
      if (!childElement) continue;

      let goesRight = false;
      for (let j = 0; j < rightSelectorsArray.length; j++) {
        const selectorValue = rightSelectorsArray[j];
        if (childElement.matches(selectorValue)) {
          goesRight = true;
          break;
        }
      }

      if (!goesRight) {
        const hasTotal = childElement.querySelector('.wpbs-total-price');
        if (hasTotal) goesRight = true;
      }
      if (!goesRight) {
        const hasPayment = childElement.querySelector('.wpbs-payment-method-label');
        if (hasPayment) goesRight = true;
      }

      if (goesRight) {
        if (rightColumnElement && childElement.parentNode === formFieldsElement)
          rightColumnElement.appendChild(childElement);
      } else {
        if (leftColumnElement && childElement.parentNode === formFieldsElement)
          leftColumnElement.appendChild(childElement);
      }
    }

    if (formFieldsElement) formFieldsElement.innerHTML = '';
    if (formFieldsElement && leftColumnElement) formFieldsElement.appendChild(leftColumnElement);
    if (formFieldsElement && rightColumnElement) formFieldsElement.appendChild(rightColumnElement);
  }

  let scheduleTimeoutId = null;
  function scheduleArrange() {
    if (scheduleTimeoutId) clearTimeout(scheduleTimeoutId);
    scheduleTimeoutId = setTimeout(function () {
      arrangeWpbsColumns();
    }, 0);
  }

  arrangeWpbsColumns();

  const bodyObserver = new MutationObserver(function () {
    const formFieldsElement = document.querySelector('.wpbs-form-fields');
    if (!formFieldsElement) return;
    const hasColumns = formFieldsElement.querySelector('.payment__column');
    if (!hasColumns) scheduleArrange();
  });

  bodyObserver.observe(document.body, { childList: true, subtree: true });
});
