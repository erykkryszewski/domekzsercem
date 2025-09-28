<?php
get_header();
the_post();
?>

<main id="main" class="main <?php if (!is_front_page()) { echo 'main--subpage'; } ?>"
>
    <?php the_content(); ?> <?php get_template_part('template-parts/booking-box'); ?>
</main>
<?php get_footer(); ?>
