<?php
$url = 'http://' . $_SERVER['SERVER_NAME'] . $_SERVER['REQUEST_URI'];
$section_id = get_field('section_id');
$background = get_field('background');
$content = get_field('content');
$image = get_field('image');
$image_class = get_field('image_class');
$image_size = get_field('image_size');
$direction = get_field('direction');
$button = get_field('button');
$button_full_width = get_field('button_full_width');
?>

<div class="text-with-image <?php if ('true' == $background) {
  echo 'text-with-image--background';
} ?>">
  <?php if (!empty($section_id)): ?>
  <div class="section-id" id="<?php echo esc_html($section_id); ?>"></div>
  <?php endif; ?>
  <div class="container">
    <div class="row text-with-image__row <?php if ('reverse' == $direction) {
      echo 'text-with-image__row--reverse';
    } ?>">
      <div class="col-12 col-md-6">
        <?php if (!empty($content)): ?>
        <div class="text-with-image__content">
          <?php echo apply_filters('the_title', $content); ?>
        </div>
        <?php endif; ?>
        <?php if (!empty($button)): ?>
        <a href="<?php echo esc_html($button['url']); ?>" class="button text-with-image__button <?php if (
  'true' == $button_full_width
) {
  echo 'button--full-width';
} ?>" target="<?php echo esc_html($button['target']); ?>"><?php echo esc_html($button['title']); ?></a>
        <?php endif; ?>
      </div>
      <?php if (!empty($image)): ?>
      <div class="col-12 col-md-6">
        <div class="text-with-image__picture <?php if ('reverse' == $direction) {
          echo 'text-with-image__picture--reverse';
        } ?> <?php if ('big' == $image_size) {
   echo 'text-with-image__picture--big';
 } ?>">



          <?php echo ercoding_get_image('programmer', 'large', [
            'class' => 'object-fit-cover',
            'seed' => 'programmer1',
          ]); ?>


        </div>
      </div>
      <?php endif; ?>
    </div>
  </div>
</div>