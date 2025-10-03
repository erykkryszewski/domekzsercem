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
    <div class="section-title">
        <div class="container">
            <div class="section-title__wrapper section-title__wrapper--decorated">
                <h1 class="section-title__title">Promocje cykliczne i jednorazowe:</h1>
                <p>
                    Przez cały rok dostępnych jest wiele promocji - od spontanicznych “last minute”, przez coroczne “workation” i inne. Każda z promocji jest starannie opisana i gwarantuje nie tylko niższą cenę ale czasem takżei dodatkowe
                    atrakcje niedostępne w tradycyjnej ofercie. Sprawdź, czy znajeziesz tu cos dla siebie!
                </p>
            </div>
        </div>
    </div>
    <div class="main__wrapper">
        <div class="main__column main__column--left">
            <?php if ($query->have_posts()): ?>
            <div class="theme-blog theme-blog--promotion">
                <div class="container">
                    <div class="theme-blog__wrapper theme-blog__wrapper--promotion">
                        <div class="row">
                            <?php while ($query->have_posts()): $query->the_post(); ?>
                            <div class="col-12 theme-blog__column theme-blog__column--promotion">
                                <div class="theme-blog__item theme-blog__item--promotion">
                                    <div class="theme-blog__image theme-blog__image--promotion">
                                        <a href="<?php the_permalink(); ?>" class="cover"></a>
                                        <?php echo wp_get_attachment_image(get_post_thumbnail_id(), 'full', '', [ 'class' => 'object-fit-cover', ]); ?>
                                    </div>
                                    <div class="theme-blog__content theme-blog__content--promotion">
                                        <div>
                                            <a href="<?php the_permalink(); ?>" class="theme-blog__title"><?php the_title(); ?></a>
                                            <?php $excerpt = get_the_excerpt(); $content = get_the_content(); if (!empty($excerpt)) { echo ' <p>' . mb_substr($excerpt, 0, 150) . (mb_strlen($excerpt) > 150 ? '...' : '') . '</p> '; } elseif (empty($excerpt) && !empty($content)) { $contentText = strip_tags($content); echo ' <p>' . mb_substr($contentText, 0, 150) . (mb_strlen($contentText) > 150 ? '...' : '') . '</p> '; } ?>
                                        </div>
                                        <div class="theme-blog__button-wrapper">
                                            <a href="<?php the_permalink(); ?>" class="theme-blog__button button"><?php _e('Czytaj więcej', 'ercodingtheme'); ?></a>
                                        </div>
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
        <div class="main__column main__column--right"><?php get_template_part('template-parts/booking-box'); ?></div>
    </div>
</main>
<?php get_footer(); ?>
