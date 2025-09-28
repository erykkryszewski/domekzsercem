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
?>

<main id="main" class="main main--subpage">
    <?php if (have_posts()): ?> <?php while (have_posts()): the_post(); ?> <?php if (get_post_type() == 'promocje'): ?>

    <!-- CPT -->
    <?php if (!empty(get_post_thumbnail_id($post->ID))): ?>
    <div class="single-blog-post__image"><?php echo wp_get_attachment_image(get_post_thumbnail_id($post->ID), 'full', '', [ 'class' => 'object-fit-cover', ]); ?></div>
    <?php endif; ?>
    <h2><?php the_title(); ?></h2>
    <p><?php the_content(); ?></p>
    <div class="single-course"><?php the_content(); ?></div>

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
