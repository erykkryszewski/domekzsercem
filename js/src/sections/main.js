document.addEventListener('DOMContentLoaded', function () {
  let header = document.querySelector('.header');
  let footer = document.querySelector('.footer');
  let main = document.querySelector('main#main');
  let body = document.body;

  let headerHeight = header ? header.offsetHeight : 0;
  let footerHeight = footer ? footer.offsetHeight + 60 : 60;
  let footerHeightWithAdminBar = footer ? footer.offsetHeight + 60 + 32 : 92;

  if (!main) return;

  if (body.classList.contains('admin-bar')) {
    main.style.minHeight = 'calc(100vh - ' + footerHeightWithAdminBar + 'px)';
    main.style.paddingTop = headerHeight + 'px';
  } else {
    main.style.minHeight = 'calc(100vh - ' + footerHeight + 'px)';
    main.style.paddingTop = headerHeight + 'px';
  }

  const mainElement = document.querySelector('main');
  if (!mainElement) return;
  if (mainElement.querySelector('.main__wrapper')) return;
  if (mainElement.querySelector('.booking-form')) return;

  const bookingBoxElement = mainElement.querySelector('.booking-box');
  if (!bookingBoxElement) return;

  const fourBoxesHeroElement = mainElement.querySelector('.four-boxes-hero');

  const mainWrapperElement = document.createElement('div');
  mainWrapperElement.className = 'main__wrapper';

  const mainColumnLeftElement = document.createElement('div');
  mainColumnLeftElement.className = 'main__column main__column--left';

  const mainColumnRightElement = document.createElement('div');
  mainColumnRightElement.className = 'main__column main__column--right';

  mainWrapperElement.appendChild(mainColumnLeftElement);
  mainWrapperElement.appendChild(mainColumnRightElement);

  const childrenArray = Array.prototype.slice.call(mainElement.children);
  let startIndex = 0;

  if (fourBoxesHeroElement) {
    startIndex = childrenArray.indexOf(fourBoxesHeroElement) + 1;
  } else if (childrenArray[0] && childrenArray[0].classList && childrenArray[0].classList.contains('section-title')) {
    startIndex = 1;
  }

  let endIndex = childrenArray.indexOf(bookingBoxElement);
  if (endIndex === -1) endIndex = childrenArray.length;

  const leftGroupElements = [];
  for (let i = startIndex; i < endIndex; i++) {
    const currentChildElement = childrenArray[i];
    if (
      currentChildElement &&
      currentChildElement !== mainWrapperElement &&
      currentChildElement !== bookingBoxElement
    ) {
      leftGroupElements.push(currentChildElement);
    }
  }

  if (fourBoxesHeroElement && fourBoxesHeroElement.nextSibling) {
    mainElement.insertBefore(mainWrapperElement, fourBoxesHeroElement.nextSibling);
  } else if (
    childrenArray[0] &&
    childrenArray[0].classList &&
    childrenArray[0].classList.contains('section-title') &&
    childrenArray[0].nextSibling
  ) {
    mainElement.insertBefore(mainWrapperElement, childrenArray[0].nextSibling);
  } else if (childrenArray.length > 0) {
    mainElement.insertBefore(mainWrapperElement, childrenArray[0]);
  } else {
    mainElement.appendChild(mainWrapperElement);
  }

  leftGroupElements.forEach(function (nodeElement) {
    if (nodeElement.parentNode === mainElement) mainColumnLeftElement.appendChild(nodeElement);
  });

  if (bookingBoxElement.parentNode === mainElement) {
    mainColumnRightElement.appendChild(bookingBoxElement);
  } else if (!mainColumnRightElement.contains(bookingBoxElement)) {
    mainColumnRightElement.appendChild(bookingBoxElement);
  }
});
