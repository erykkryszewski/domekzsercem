import $ from 'jquery';

document.addEventListener('DOMContentLoaded', function () {
  const sliderElements = document.querySelectorAll('.gallery__slider');

  if (!sliderElements.length) return;

  sliderElements.forEach(function (sliderElement) {
    const $slider = $(sliderElement);

    if ($slider.length && typeof $slider.slick === 'function') {
      $slider.slick({
        dots: true,
        arrows: true,
        infinite: false,
        speed: 550,
        slidesToShow: 2,
        slidesToScroll: 1,
        autoplay: false,
        autoplaySpeed: 5000,
        pauseOnHover: false,
        pauseOnDotsHover: false,
        pauseOnFocus: false,
        cssEase: 'ease-out',
        swipe: false,
        draggable: false,
        responsive: [
          {
            breakpoint: 1100,
            settings: {
              slidesToShow: 2,
            },
          },
          {
            breakpoint: 700,
            settings: {
              slidesToShow: 2,
            },
          },
        ],
      });

      // Clear arrow and dot button text **within this slider**
      const prevArrow = sliderElement.querySelector('.slick-prev');
      const nextArrow = sliderElement.querySelector('.slick-next');
      const dotButtons = sliderElement.querySelectorAll('ul.slick-dots > li > button');

      if (prevArrow) prevArrow.textContent = '';
      if (nextArrow) nextArrow.textContent = '';
      dotButtons.forEach(function (btn) {
        btn.textContent = '';
      });
    }
  });
});
