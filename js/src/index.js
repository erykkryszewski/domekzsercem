/**
 * External dependencies
 */
import $ from 'jquery';
import 'slick-carousel';
import '@fancyapps/fancybox';
// import AOS from 'aos';
// import { gsap } from "gsap";
// import { ScrollTrigger } from 'gsap/ScrollTrigger';
// import 'parallax-js';

// AOS.init();

window.addEventListener('load', function () {
  // AOS.refresh();
  $('.preloader').fadeOut(400);

  if ($('.products__elements').length > 0 && window.innerWidth < 768) {
    $('html, body')
      .delay(200)
      .animate(
        {
          scrollTop: $('.products__elements').offset().top,
        },
        1000,
      );
  }
});

document.addEventListener('DOMContentLoaded', function () {
  // smooth scroll for anchors if not on product pages
  $(document).on('click', 'a[href^="#"]', function (event) {
    event.preventDefault();
    if (window.location.href.indexOf('produkt') === -1 && window.location.href.indexOf('product') === -1) {
      $('html, body').animate(
        {
          scrollTop: $($.attr(this, 'href')).offset().top,
        },
        650,
      );
    }
  });

  // fix auto sizes attr in images
  $('img[sizes^="auto,"]').each(function () {
    let $img = $(this);
    let sizes = $img.attr('sizes').replace(/^auto,\s*/, '');
    $img.attr('sizes', sizes);
  });

  // cleanup
  $('img[title]').removeAttr('title');
  $('p:empty').remove();

  // empty pages redirect for not logged in users
  let bodyElement = document.body;
  let mainElement = document.querySelector('main#main');
  if (!bodyElement.classList.contains('logged-in')) {
    if (mainElement && mainElement.innerHTML.trim() === '') {
      window.location.href = '/';
    }
  }
});

/* imports */

import './global/recaptcha';
import './global/zoom';

/* @blocks:start */
import './blocks/contact';
import './blocks/text-with-image';
import './blocks/border-divider';
import './blocks/icons';
import './blocks/gallery';
import './blocks/section-title';
import './blocks/wyswig-content';
import './blocks/blank-button';
import './blocks/four-boxes-hero';
import './blocks/small-icons';
import './blocks/two-columns-icons';
import './blocks/two-box-promo';
import './blocks/static-gallery';
import './blocks/booking-form';
/* @blocks:end */

import './sections/header';
import './sections/navigation';
import './sections/main';

import './components/spacer';
import './components/popup';
import './components/animated-number';
import './components/form';
import './components/phone-number';
import './components/booking-box';

