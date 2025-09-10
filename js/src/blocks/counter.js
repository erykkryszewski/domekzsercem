document.addEventListener('DOMContentLoaded', function () {
  let counterElement = document.querySelector('.counter');
  if (!counterElement) return;

  let timeWrapper = counterElement.querySelector('.counter__time-wrapper');
  if (!timeWrapper) return;

  let countdownDate = new Date(timeWrapper.getAttribute('id')).getTime();

  let elements = {
    day: counterElement.querySelector('.counter__day'),
    hour: counterElement.querySelector('.counter__hour'),
    minute: counterElement.querySelector('.counter__minute'),
    second: counterElement.querySelector('.counter__second'),
  };

  function fadeOut(element, duration) {
    if (!element) return;
    element.style.transitionProperty = 'opacity';
    element.style.transitionDuration = duration + 'ms';
    element.style.opacity = '1';
    element.offsetHeight;
    element.style.opacity = '0';
    function onEnd(e) {
      if (e.propertyName !== 'opacity') return;
      element.removeEventListener('transitionend', onEnd);
      element.style.display = 'none';
      element.style.removeProperty('opacity');
      element.style.removeProperty('transition-property');
      element.style.removeProperty('transition-duration');
    }
    element.addEventListener('transitionend', onEnd);
  }

  function setText(el, value) {
    if (el) el.textContent = String(value);
  }

  let intervalId = setInterval(function () {
    let now = new Date().getTime();
    let distance = countdownDate - now;

    if (distance < 0) {
      setText(elements.day, '0');
      setText(elements.hour, '0');
      setText(elements.minute, '0');
      setText(elements.second, '0');
      fadeOut(counterElement, 600);
      clearInterval(intervalId);
      return;
    }

    let days = Math.floor(distance / (1000 * 60 * 60 * 24));
    let hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    let minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    let seconds = Math.floor((distance % (1000 * 60)) / 1000);

    setText(elements.day, days >= 0 ? days : '0');
    setText(elements.hour, hours >= 0 ? hours : '0');
    setText(elements.minute, minutes >= 0 ? minutes : '0');
    setText(elements.second, seconds >= 0 ? seconds : '0');

    if (days === 0 && hours === 0 && minutes === 0 && seconds === 0) {
      fadeOut(counterElement, 600);
      clearInterval(intervalId);
    }
  }, 1000);
});
