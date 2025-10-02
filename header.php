<?php

if (is_woocommerce_activated()) {
    global $woocommerce;
    $cart_items_number = $woocommerce->cart->get_cart_contents_count();
}

$global_phone_number = get_field("global_phone_number", "options");
$global_logo = get_field("global_logo", "options");
$theme_sign = get_field("theme_sign", "options");
$global_email = get_field("global_email", "options");
$global_terms_and_conditions = get_field("global_terms_and_conditions", "options");
$global_privacy_policy = get_field("global_privacy_policy", "options");
$global_social_media = get_field("global_social_media", "options");
$header_button = get_field("header_button", "options");

$header_button_before_icon = get_field("header_button_before_icon", "options");
$header_button_after_icon = get_field("header_button_after_icon", "options");

$body_classes = get_body_class();
?>

<!DOCTYPE html>
<html lang="<?php bloginfo('language'); ?>">
    <head>
        <meta charset="<?php bloginfo('charset'); ?>" />
        <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no, maximum-scale=1" />
        <link href="https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap" rel="stylesheet" />
        <?php wp_head(); ?>
    </head>

    <body <?php if (!is_front_page()) { body_class('theme-subpage'); } else { body_class('theme-frontpage'); } ?>>
        <div class="preloader">
            <div class="preloader__logo"><?php if (!empty($theme_sign)) { echo wp_get_attachment_image($theme_sign, 'full', '', ['class' => '']); } else { echo ''; } ?></div>
        </div>
        <header class="header <?php if (!is_front_page()) { echo 'header--subpage'; } ?>">
            <div class="container">
                <nav class="nav <?php if (!is_front_page()) { echo 'nav--subpage'; } ?>">
                    <a href="/" class="nav__logo <?php if (!is_front_page()) { echo 'nav__logo--subpage'; } ?>">
                        <?php if (!empty($global_logo)) { echo wp_get_attachment_image($global_logo, 'full', '', ['class' => '']); } else { echo 'Logo'; } ?>
                    </a>
                    <div class="nav__content <?php if (!is_front_page()) { echo 'nav__content--subpage'; } ?>">
                        <?php $menu_class = is_front_page() ? 'nav__menu' : 'nav__menu nav__menu--subpage'; echo wp_nav_menu([ 'theme_location' => 'Navigation', 'container' => 'ul', 'menu_class' => $menu_class, ]); ?> <?php if (!empty($global_social_media)): ?>
                        <ul class="social-media nav__social-media <?php if (!is_front_page()) { echo 'nav__social-media--subpage'; } ?>">
                            <?php foreach ($global_social_media as $key => $item): ?>
                            <li>
                                <a href="<?php echo esc_url_raw($item['link']); ?>" target="_blank"><?php if (!empty($item['icon'])) { echo wp_get_attachment_image($item['icon'], 'large', '', ['class' => '']); } ?></a>
                            </li>
                            <?php endforeach; ?>
                        </ul>
                        <?php endif; ?> <?php if(!empty($header_button)):?>
                        <a href="<?php echo esc_html($header_button['url']);?>" class="nav__button button mobile-only"><?php echo esc_html($header_button['title']);?></a>
                        <?php endif;?>
                        <div class="hamburger nav__hamburger <?php if (!is_front_page()) { echo 'nav__hamburger--subpage'; } ?>">
                            <span></span>
                            <span></span>
                            <span></span>
                            <span></span>
                        </div>
                    </div>
                </nav>
            </div>
        </header>
    

