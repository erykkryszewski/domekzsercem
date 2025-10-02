<?php

$global_phone_number = get_field("global_phone_number", "options");
$global_logo = get_field("global_logo", "options");
$global_email = get_field("global_email", "options");
$global_address = get_field("global_address", "options");
$global_social_media = get_field("global_social_media", "options");
$newsletter_shortcode = get_field("newsletter_shortcode", "options");
$cookies_text = get_field("cookies_text", "options");
$google_analytics_code = get_field("google_analytics_code", "options");

$footer_second_column_content = get_field("footer_second_column_content", "options");
$footer_third_column_content = get_field("footer_third_column_content", "options");
?>


    
        <footer class="footer <?php if (is_front_page()) { echo 'footer--homepage'; } ?>">
            <div class="container">
                <div class="footer__wrapper">
                    <div class="row">
                        <?php if (!empty($footer_second_column_content)): ?>
                        <div class="col-12 col-lg-3">
                            <div class="footer__column"><?php echo apply_filters('the_title', $footer_second_column_content); ?></div>
                        </div>
                        <?php endif; ?> <?php if (!empty($footer_third_column_content)): ?>
                        <div class="col-12 col-lg-3">
                            <div class="footer__column"><?php echo apply_filters('the_title', $footer_third_column_content); ?></div>
                        </div>
                        <?php endif; ?>
                        <div class="col-12 col-lg-4 offset-lg-2">
                            <div class="footer__column">
                                <p><strong>Kontakt</strong></p>
                                <p>Oskar Luberda</p>
                                <?php if (!empty($global_phone_number)): ?>
                                <a href="tel:<?php echo esc_html($global_phone_number,); ?>" class="footer__phone ercodingtheme-phone-number">Tel: <?php echo esc_html($global_phone_number); ?></a>
                                <?php endif; ?> <?php if (!empty($global_email)): ?>
                                <a href="mailto:<?php echo esc_html($global_email); ?>" class="footer__email">Email: <?php echo esc_html($global_email,); ?></a>
                                <?php endif; ?> <?php if (!empty($global_address)): ?>
                                <div class="footer__address">
                                    <span>Adres</span>
                                    <?php echo apply_filters('acf_the_content', $global_address); ?>
                                </div>
                                <?php endif; ?>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="bottom-bar">
                <div class="container">
                    <div class="bottom-bar__wrapper">
                        <p><?php _e('Copyright', 'ercodingtheme'); ?> © <?php echo date('Y'); ?>&nbsp;<?php _e('Domek z Sercem', 'ercodingtheme',); ?></p>
                        <p>
                            Realizacja:
                            <a href="https://realmarketing.pl/" target="_blank">Real Marketing</a>
                        </p>
                    </div>
                </div>
            </div>
        </footer>

        <?php if ($google_analytics_code): ?> <?php echo wp_kses($google_analytics_code, ['script' => ['async' => [], 'src' => []]]); ?> <?php endif; ?>
    </body>
</html>
<?php wp_footer(); ?>
