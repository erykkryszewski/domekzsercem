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
  $('.preloader').fadeOut(100);

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
import './blocks/blank-button';
import './blocks/blank-image';
import './blocks/blog-archive';
import './blocks/border-divider';
import './blocks/button-banner';
import './blocks/contact';
import './blocks/counter';
import './blocks/cta-hero';
import './blocks/cta';
import './blocks/decorated-text';
import './blocks/faq';
import './blocks/gallery';
import './blocks/hero-slider';
import './blocks/icons';
import './blocks/iframe';
import './blocks/list';
import './blocks/logos';
import './blocks/map';
import './blocks/motto-bar';
import './blocks/numbers';
import './blocks/offer';
import './blocks/products';
import './blocks/program';
import './blocks/section-title';
import './blocks/shortcode';
import './blocks/stats';
import './blocks/subpage-hero';
import './blocks/team';
import './blocks/testimonials';
import './blocks/text-image-decorated';
import './blocks/text-images';
import './blocks/text-with-image';
import './blocks/thank-you';
import './blocks/three-boxes';
import './blocks/three-columns-content';
import './blocks/three-images';
import './blocks/two-buttons';
import './blocks/two-columns-list';
import './blocks/two-columns-text';
import './blocks/two-images';
import './blocks/wyswig-content';
/* @blocks:end */

import './sections/header';
import './sections/navigation';
import './sections/main';

import './components/spacer';
import './components/popup';
import './components/animated-number';
import './components/form';
import './components/phone-number';
