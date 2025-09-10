import $ from 'jquery';

document.addEventListener('DOMContentLoaded', function () {
  const sliderElement = document.querySelector('.cta-hero__wrapper');
  if (!sliderElement) return;

  const $slider = jQuery(sliderElement);
  if ($slider.length && typeof $slider.slick === 'function') {
    $slider.slick({
      dots: false,
      arrows: false,
      infinite: true,
      speed: 850,
      slidesToShow: 1,
      slidesToScroll: 1,
      autoplay: true,
      autoplaySpeed: 5000,
      swipe: false,
      pauseOnHover: false,
      pauseOnFocus: false,
      draggable: false,
      cssEase: 'ease-out',
      fade: true,
      responsive: [
        {
          breakpoint: 1100,
          settings: { slidesToShow: 1 },
        },
        {
          breakpoint: 700,
          settings: { slidesToShow: 1 },
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

  const heroImage = document.querySelector('.cta-hero__image img');
  if (heroImage) {
    window.addEventListener('scroll', function () {
      const scrollPosition = window.scrollY;
      heroImage.classList.toggle('scrolled', scrollPosition > 50);
    });
  }
});
