<?php

/**
 * This file contains single post content
 *
 * @package ercodingtheme
 * @license GPL-3.0-or-later
 */

get_header();
global $post;

$post = get_post();
$page_id = $post->ID;

$left_column_content = get_field("left_column_content", $page_id);
$right_up_content = get_field("right_up_content", $page_id);
$left_down_column = get_field("left_down_column", $page_id);
$right_down_content = $left_down_column;
$button = get_field("button", $page_id);

$wyswig_content = get_field("content", $page_id);
?>

<main id="main" class="main main--subpage">
    <?php if (have_posts()): ?> <?php while (have_posts()): the_post(); ?> <?php if (get_post_type() == 'promocje'): ?>

    <!-- CPT -->
    <div class="promotion">
        <div class="container">
            <div class="promotion__wrapper">
                <?php if (!empty(get_post_thumbnail_id($post->ID))): ?>
                <div class="promotion__image"><?php echo wp_get_attachment_image(get_post_thumbnail_id($post->ID), 'full', '', [ 'class' => 'object-fit-cover', ]); ?></div>
                <?php endif; ?>
                <div class="promotion__content">
                    <h1><?php the_title(); ?></h1>
                    <p><?php the_content(); ?></p>
                </div>
            </div>
        </div>
    </div>

    <div class="two-box-promo">
        <?php if (!empty($section_id)): ?>
        <div class="section-id" id="<?php echo esc_html($section_id); ?>"></div>
        <?php endif; ?>
        <div class="container">
            <div class="two-box-promo__wrapper">
                <?php if (!empty($left_column_content)): ?>
                <div class="two-box-promo__column two-box-promo__column--left"><?php echo apply_filters('the_title', $left_column_content); ?></div>
                <?php endif; ?> <?php if (!empty($right_up_content)): ?>
                <div class="two-box-promo__column two-box-promo__column--right">
                    <div class="two-box-promo__info">
                        <?php foreach ($right_up_content as $key => $item): ?>
                        <div class="two-box-promo__item">
                            <div class="two-box-promo__days">
                                <?php echo apply_filters('the_title', $item['days'],); ?>
                            </div>
                            <div class="two-box-promo__discount"><?php echo apply_filters('the_title', $item['discount']); ?></div>
                        </div>
                        <?php endforeach; ?>
                    </div>
                    <div class="two-box-promo__cta">
                        <div class="two-box-promo__encourage-text">
                            <?php echo apply_filters('the_title', $right_down_content,); ?>
                        </div>
                        <?php if (!empty($button)): ?>
                        <a href="<?php echo esc_html($button['url'],); ?>"
                            class="button two-box-promo__button"
                        >
                            <?php echo esc_html($button['title']); ?>
                        </a>
                        <?php endif; ?>
                    </div>
                </div>
                <?php endif; ?>
            </div>
            <?php if (!empty($wyswig_content)): ?>
            <div class="wyswig-content mt-4">
                <div class="container">
                    <div class="wyswig-content__wrapper">
                        <?php echo apply_filters('the_title', $wyswig_content,); ?>
                    </div>
                </div>
            </div>
            <?php endif; ?>
        </div>
    </div>

    <?php else: ?>

    <!-- BLOG -->
    <div class="subpage-hero">
        <div class="subpage-hero__background subpage-hero__background--plain"></div>
        <div class="container">
            <div class="subpage-hero__wrapper">
                <h1 class="subpage-hero__title subpage-hero__title--white">
                    <?php echo apply_filters('the_title', 'Blog',); ?>
                </h1>
            </div>
        </div>
    </div>
    <div class="single-blog-post">
        <div class="container">
            <div class="row">
                <div class="col-12 col-lg-10 offset-lg-1">
                    <div class="single-blog-post__content">
                        <?php if (!empty(get_post_thumbnail_id($post->ID))): ?>
                        <div class="single-blog-post__image"><?php echo wp_get_attachment_image(get_post_thumbnail_id($post->ID), 'full', '', [ 'class' => 'object-fit-cover', ]); ?></div>
                        <?php endif; ?>
                        <h2><?php the_title(); ?></h2>
                        <p><?php the_content(); ?></p>
                    </div>
                    <div class="single-blog-post__info">
                        <h4 class="single-blog-post__author-name"><?php echo esc_html($author_name); ?></h4>
                        <span class="single-blog-post__author-position"><?php echo esc_html($author_position); ?></span>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <?php endif; ?> <?php endwhile; ?> <?php endif; ?>
</main>
<?php get_footer(); ?>
