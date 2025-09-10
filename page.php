<?php

get_header();
the_post();

$url = 'http://' . $_SERVER['SERVER_NAME'] . $_SERVER['REQUEST_URI'];
$subpage_hero = get_field('subpage_hero', 'options');
?>

<main id="main" class="main <?php if (!is_front_page()) {
  echo 'main--subpage';
} ?> <?php if (strpos($url, 'polityka-prywatnosci') !== false || strpos($url, 'regulamin') !== false) {
   echo 'main--rules-page';
 } ?>">
  <div class="subpage-hero">
    <div class="section-id" id="start"></div>
    <div class="subpage-hero__background">
      <?php if (!empty($subpage_hero)): ?>
      <?php echo wp_get_attachment_image($subpage_hero, 'full', '', ['class' => 'object-fit-cover']); ?>
      <?php endif; ?>
      <div class="subpage-hero__overlay"></div>
    </div>
    <div class="container">
      <div class="subpage-hero__wrapper">
        <h1 class="subpage-hero__title <?php if (!empty($subpage_hero)) {
          echo 'subpage-hero__title--white';
        } ?>">
          <?php echo apply_filters('the_title', get_the_title()); ?></h1>
      </div>
    </div>
  </div>


  <?php the_content(); ?>
</main>
<?php get_footer(); ?>
