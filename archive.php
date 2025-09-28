<?php

get_header();
global $post;

// Get the current page number
$current_blog_page = get_query_var("paged") ? get_query_var("paged") : 1;

$args = [
    "post_type" => "promocje",
    "post_status" => "publish",
    "posts_per_page" => 12,
    "orderby" => "title",
    "paged" => $current_blog_page,
];

$global_logo = get_field("global_logo", "options");
$archive_title = get_the_archive_title();
$title_parts = explode(":", $archive_title);
$page_title = wp_strip_all_tags(end($title_parts));

$query = new WP_Query($args);
?>

<main id="main" class="main <?php if (!is_front_page()) { echo 'main--subpage'; } ?>"
>
    <div class="main__wrapper">
        <div class="main__column main__column--left">
            <div class="section-title">
                <div class="container">
                    <div class="section-title__wrapper section-title__wrapper--decorated">
                        <h1>Promocje cykliczne i jednorazowe:</h1>
                        <p>
                            Przez cały rok dostępnych jest wiele promocji - od spontanicznych “last minute”, przez coroczne “workation” i inne. Każda z promocji jest starannie opisana i gwarantuje nie tylko niższą cenę ale czasem takżei
                            dodatkowe atrakcje niedostępne w tradycyjnej ofercie. Sprawdź, czy znajeziesz tu cos dla siebie!
                        </p>
                    </div>
                </div>
            </div>
            <?php if ($query->have_posts()): ?>
            <div class="theme-blog theme-blog--courses">
                <div class="container">
                    <div class="theme-blog__wrapper theme-blog__wrapper--courses">
                        <div class="row">
                            <?php while ($query->have_posts()): $query->the_post(); ?>
                            <div class="col-12 col-md-6 col-lg-4 theme-blog__column theme-blog__column--courses">
                                <div class="theme-blog__item theme-blog__item--courses">
                                    <div class="theme-blog__image theme-blog__image--courses">
                                        <a href="<?php the_permalink(); ?>" class="cover"></a>
                                        <?php echo wp_get_attachment_image(get_post_thumbnail_id(), 'full', '', [ 'class' => 'object-fit-contain', ]); ?>
                                    </div>
                                    <div class="theme-blog__content theme-blog__content--courses">
                                        <div>
                                            <a href="<?php the_permalink(); ?>" class="theme-blog__title"><?php the_title(); ?></a>
                                            <?php $excerpt = get_the_excerpt(); $content = get_the_content(); if (!empty($excerpt)) { echo ' <p>' . mb_substr($excerpt, 0, 150) . (mb_strlen($excerpt) > 150 ? '...' : '') . '</p> '; } elseif (empty($excerpt) && !empty($content)) { $contentText = strip_tags($content); echo ' <p>' . mb_substr($contentText, 0, 150) . (mb_strlen($contentText) > 150 ? '...' : '') . '</p> '; } ?>
                                        </div>
                                        <a href="<?php the_permalink(); ?>" class="theme-blog__button button">
                                            <?php _e('Czytaj więcej', 'ercodingtheme',); ?>
                                        </a>
                                    </div>
                                </div>
                            </div>
                            <?php endwhile; ?>
                        </div>
                    </div>
                    <div class="pagination mt-5">
                        <?php echo paginate_links([ 'base' => str_replace(999999999, '%#%', esc_url(get_pagenum_link(999999999))), 'current' => max(1, get_query_var('paged')), 'format' => '?paged=%#%', 'total' => $query->max_num_pages, 'show_all' => false, 'type' => 'list', 'end_size' => 2, 'mid_size' => 1, 'prev_next' => true, 'prev_text' => '', 'next_text' => '', 'add_args' => false, 'add_fragment' => '', ]); ?>
                    </div>
                    <?php wp_reset_postdata(); ?>
                </div>
            </div>
            <?php endif; ?>
        </div>
        <div class="main__column main__column--right">
            <div class="booking-box">
                <div class="booking-box__intro">
                    <h4 class="booking-box__title">💵 Cena zawiera wszystkie opłaty!</h4>
                </div>

                <form class="booking-box__form" method="get" action="/zarezerwuj/" data-price-per-night="<?php echo esc_attr($price_per_night,); ?>"
                    data-discount-name="<?php echo esc_attr($discount_name); ?>"
                    data-discount-amount="<?php echo esc_attr($discount_amount); ?>"
                >
                    <div class="booking-box__dates">
                        <div class="booking-box__date" data-focus="checkin">
                            <label class="booking-box__label" for="checkin">Zameldowanie:</label>
                            <input type="date" id="checkin" name="checkin" class="booking-box__input" required />
                        </div>
                        <div class="booking-box__date" data-focus="checkout">
                            <label class="booking-box__label" for="checkout">Wymeldowanie:</label>
                            <input type="date" id="checkout" name="checkout" class="booking-box__input" required />
                        </div>
                    </div>

                    <div class="booking-box__guests">
                        <label class="booking-box__label" for="guests">Goście:</label>
                        <select id="guests" name="guests" class="booking-box__select">
                            <option value="1-dorosly">1 dorosły</option>
                            <option value="2-doroslych" selected>2 dorosłych</option>
                            <option value="3-doroslych">3 dorosłych</option>
                            <option value="4-doroslych">4 dorosłych</option>
                            <option value="1-dorosly-1-dziecko">1 dorosły + 1 dziecko</option>
                            <option value="2-doroslych-1-dziecko">2 dorosłych + 1 dziecko</option>
                            <option value="2-doroslych-2-dzieci">2 dorosłych + 2 dzieci</option>
                            <option value="2-doroslych-dziecko-pies">2 dorosłych + dziecko + pies</option>
                            <option value="2-doroslych-2-dzieci-pies">2 dorosłych + 2 dzieci + pies</option>
                        </select>
                    </div>

                    <div class="booking-box__summary">
                        <div class="booking-box__line">
                            <span class="booking-box__text" data-nights-text>—</span>
                            <span class="booking-box__price" data-nights-price>—</span>
                        </div>
                        <div class="booking-box__line" data-discount-row>
                            <span class="booking-box__text" data-discount-name><?php echo esc_html($discount_name); ?></span>
                            <span class="booking-box__price" data-discount-amount>-<?php echo esc_html(number_format($discount_amount, 0, ',', ' '),); ?> zł</span>
                        </div>
                        <div class="booking-box__total">
                            <span class="booking-box__total-label">RAZEM:</span>
                            <span class="booking-box__total-price" data-total>—</span>
                        </div>
                        <p class="booking-box__note">To będzie wspaniały wyjazd! Na co czekasz?</p>
                    </div>

                    <input type="hidden" name="nights" value="" data-nights-input />
                    <input type="hidden" name="price_per_night" value="<?php echo esc_attr($price_per_night); ?>" />
                    <input type="hidden" name="discount_name" value="<?php echo esc_attr($discount_name); ?>" />
                    <input type="hidden" name="discount_amount" value="<?php echo esc_attr($discount_amount); ?>" />
                    <input type="hidden" name="total" value="" data-total-input />

                    <div class="booking-box__actions">
                        <button type="submit" class="button booking-box__button">Rezerwuj</button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</main>
<?php get_footer(); ?>
