import $ from 'jquery';

document.addEventListener('DOMContentLoaded', function () {
  const sliderElement = document.querySelector('.gallery__slider');
  if (!sliderElement) return;

  const $slider = jQuery(sliderElement);
  if ($slider.length && typeof $slider.slick === 'function') {
    $slider.slick({
      dots: false,
      arrows: false,
      infinite: false,
      speed: 550,
      slidesToShow: 4,
      slidesToScroll: 1,
      autoplay: true,
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
            slidesToShow: 3,
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
