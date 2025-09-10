import $ from 'jquery';

document.addEventListener('DOMContentLoaded', function () {
  const sliderElement = document.querySelector('.hero-slider__wrapper');
  if (!sliderElement) return;

  const $slider = jQuery(sliderElement);
  if ($slider.length && typeof $slider.slick === 'function') {
    $slider.slick({
      dots: false,
      arrows: false,
      infinite: true,
      speed: 750,
      slidesToShow: 1,
      slidesToScroll: 1,
      autoplay: true,
      autoplaySpeed: 4500,
      swipe: true,
      pauseOnHover: true,
      pauseOnFocus: true,
      cssEase: 'ease-out',
      responsive: [
        {
          breakpoint: 1100,
          settings: {
            slidesToShow: 1,
          },
        },
        {
          breakpoint: 700,
          settings: {
            slidesToShow: 1,
          },
        },
      ],
    });
  }

  const prevArrow = document.querySelector('.slick-prev');
  const nextArrow = document.querySelector('.slick-next');
  const dotButtons = document.querySelectorAll('ul.slick-dots > li > button');
  if (prevArrow) prevArrow.textContent = '';
  if (nextArrow) nextArrow.textContent = '';
  dotButtons.forEach(function (btn) {
    btn.textContent = '';
  });
});
