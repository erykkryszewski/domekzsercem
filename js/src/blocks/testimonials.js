import $ from 'jquery';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

document.addEventListener('DOMContentLoaded', function () {
  const sliderElement = document.querySelector('.testimonials__slider');
  if (!sliderElement) return;

  const $slider = jQuery(sliderElement);
  if ($slider.length && typeof $slider.slick === 'function') {
    $slider.slick({
      dots: true,
      arrows: false,
      infinite: true,
      speed: 550,
      slidesToShow: 1,
      slidesToScroll: 1,
      autoplay: false,
      autoplaySpeed: 5000,
      cssEase: 'ease-out',
      fade: true,
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

  ScrollTrigger.matchMedia({
    '(min-width: 768px)': function () {
      gsap.fromTo(
        '.testimonials__image-decorator',
        { left: 0, top: 0, opacity: 0 },
        {
          left: -30,
          top: -30,
          opacity: 1,
          duration: 1.5,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: '.testimonials__slider',
            start: 'top 70%',
            toggleActions: 'play none none none',
          },
        },
      );
    },
    '(max-width: 767px)': function () {
      gsap.fromTo(
        '.testimonials__image-decorator',
        { left: 0, top: 0, opacity: 0 },
        {
          left: -15,
          top: -15,
          opacity: 1,
          duration: 1.5,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: '.testimonials__slider',
            start: 'top 80%',
            toggleActions: 'play none none none',
          },
        },
      );
    },
  });
});
