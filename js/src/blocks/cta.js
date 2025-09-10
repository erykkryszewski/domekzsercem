import $ from 'jquery';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

$(document).ready(function () {
  gsap.registerPlugin(ScrollTrigger);

  const cta = $('.cta__wrapper');
  const bg = $('.cta__background');

  gsap.set(cta.children(), { clearProps: 'transform,opacity,filter' });

  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: cta,
      start: 'top 85%',
      once: true,
    },
  });

  tl.from(
    bg,
    {
      scale: 1.08,
      yPercent: 12,
      filter: 'blur(10px)',
      duration: 1.1,
      ease: 'power2.out',
    },
    0,
  )
    .from(
      cta.children(),
      {
        y: 40,
        autoAlpha: 0,
        filter: 'blur(6px)',
        duration: 0.9,
        ease: 'power3.out',
        stagger: 0.12,
      },
      0.06,
    )
    .fromTo(
      cta.find('.cta__button'),
      { scale: 0.98 },
      {
        scale: 1,
        duration: 0.22,
        ease: 'power1.out',
      },
      '-=0.35',
    );
});
