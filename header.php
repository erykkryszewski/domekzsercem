<?php

if (is_woocommerce_activated()) {
  global $woocommerce;
  $cart_items_number = $woocommerce->cart->get_cart_contents_count();
}

$global_phone_number = get_field('global_phone_number', 'options');
$global_logo = get_field('global_logo', 'options');
$theme_sign = get_field('theme_sign', 'options');
$global_email = get_field('global_email', 'options');
$global_terms_and_conditions = get_field('global_terms_and_conditions', 'options');
$global_privacy_policy = get_field('global_privacy_policy', 'options');
$global_social_media = get_field('global_social_media', 'options');
$header_button = get_field('header_button', 'options');

$header_button_before_icon = get_field('header_button_before_icon', 'options');
$header_button_after_icon = get_field('header_button_after_icon', 'options');

$body_classes = get_body_class();
?>

<!DOCTYPE html>
<html lang="<?php bloginfo('language'); ?>">

<head>
  <meta charset="<?php bloginfo('charset'); ?>" />
  <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no, maximum-scale=1" />
  <link href="https://fonts.googleapis.com/css2?family=Figtree:ital,wght@0,300..900;1,300..900&display=swap"
    rel="stylesheet">
  <?php wp_head(); ?>
</head>

<body <?php if (!is_front_page()) {
  body_class('theme-subpage');
} else {
  body_class('theme-frontpage');
} ?>>
  <div class="preloader">
    <div class="preloader__logo">
      <?php if (!empty($theme_sign)) {
        echo wp_get_attachment_image($theme_sign, 'full', '', ['class' => '']);
      } else {
        echo '';
      } ?>
    </div>
  </div>
  <header class="header <?php if (!is_front_page()) {
    echo 'header--subpage';
  } ?>">
    <div class="top-bar">
      <div class="container">
        <div class="top-bar__wrapper">
          <div class="top-bar__content top-bar__content--left">
            <a href="tel:<?php echo esc_html($global_phone_number); ?>"
              class="top-bar__phone ercodingtheme-phone-number"><?php echo esc_html($global_phone_number); ?></a>
            <a href="mailto:<?php echo esc_html($global_email); ?>"
              class="top-bar__email"><?php echo esc_html($global_email); ?></a>
          </div>
          <?php if (!empty($global_social_media)): ?>
          <div class="top-bar__content top-bar__content--right">
            <ul class="social-media top-bar__social-media <?php if (!is_front_page()) {
              echo 'top-bar__social-media--subpage';
            } ?>">
              <?php foreach ($global_social_media as $key => $item): ?>
              <li>
                <a href="<?php echo esc_url_raw($item['link']); ?>" target="_blank">
                  <?php if (!empty($item['icon'])) {
                    echo wp_get_attachment_image($item['icon'], 'large', '', ['class' => '']);
                  } ?>
                </a>
              </li>
              <?php endforeach; ?>
            </ul>
          </div>
          <?php endif; ?>
        </div>
      </div>
    </div>
    <div class="container">
      <nav class="nav <?php if (!is_front_page()) {
        echo 'nav--subpage';
      } ?>">
        <a href="/" class="nav__logo <?php if (!is_front_page()) {
          echo 'nav__logo--subpage';
        } ?>">
          <?php if (!empty($global_logo)) {
            echo wp_get_attachment_image($global_logo, 'full', '', ['class' => '']);
          } else {
            echo 'Logo';
          } ?>
        </a>
        <div class="nav__content <?php if (!is_front_page()) {
          echo 'nav__content--subpage';
        } ?>">
          <?php
          $menu_class = is_front_page() ? 'nav__menu' : 'nav__menu nav__menu--subpage';
          echo wp_nav_menu(['theme_location' => 'Navigation', 'container' => 'ul', 'menu_class' => $menu_class]);
          ?>
          <?php if (is_woocommerce_activated()): ?>
          <div class="nav__shop-elements <?php if (!is_front_page()) {
            echo 'nav__shop-elements--subpage';
          } ?>">
            <a class="nav__cart-icon <?php if (!is_front_page()) {
              echo 'nav__cart-icon--subpage';
            } ?>" href="/koszyk">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">
                <defs>
                  <style>
                  .cls-1 {
                    fill: #231f20
                  }
                  </style>
                </defs>
                <g id="cart">
                  <path class="cls-1"
                    d="M29.46 10.14A2.94 2.94 0 0 0 27.1 9H10.22L8.76 6.35A2.67 2.67 0 0 0 6.41 5H3a1 1 0 0 0 0 2h3.41a.68.68 0 0 1 .6.31l1.65 3 .86 9.32a3.84 3.84 0 0 0 4 3.38h10.37a3.92 3.92 0 0 0 3.85-2.78l2.17-7.82a2.58 2.58 0 0 0-.45-2.27zM28 11.86l-2.17 7.83A1.93 1.93 0 0 1 23.89 21H13.48a1.89 1.89 0 0 1-2-1.56L10.73 11H27.1a1 1 0 0 1 .77.35.59.59 0 0 1 .13.51z" />
                  <circle class="cls-1" cx="14" cy="26" r="2" />
                  <circle class="cls-1" cx="24" cy="26" r="2" />
                </g>
              </svg>
              <span id="mini-cart-count"><?php echo esc_html($cart_items_number); ?></span>
            </a>
          </div>
          <?php endif; ?>
          <?php if (!empty($header_button)): ?>
          <a href="<?php echo esc_html($header_button['url']); ?>" class="button nav__button <?php if (
  !is_front_page()
) {
  echo 'nav__button--subpage';
} ?>" target="<?php echo esc_html($header_button['target']); ?>">

            <?php if (!empty($header_button_before_icon)): ?>
            <span class="button__icon button__icon--before">
              <?php echo wp_get_attachment_image($header_button_before_icon, 'full', '', [
                'loading' => 'eager',
                'decoding' => 'async',
              ]); ?>
            </span>
            <?php endif; ?>
            <?php echo esc_html($header_button['title']); ?>
            <?php if (!empty($header_button_after_icon)): ?>
            <span class="button__icon button__icon--after">
              <?php echo wp_get_attachment_image($header_button_after_icon, 'full', '', [
                'loading' => 'eager',
                'decoding' => 'async',
              ]); ?>
            </span>
            <?php endif; ?>

          </a>
          <?php endif; ?>
          <div class="hamburger nav__hamburger <?php if (!is_front_page()) {
            echo 'nav__hamburger--subpage';
          } ?>">
            <span></span>
            <span></span>
            <span></span>
            <span></span>
          </div>
        </div>
      </nav>
    </div>
  </header>