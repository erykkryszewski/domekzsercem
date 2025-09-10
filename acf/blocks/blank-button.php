<?php

$url = 'http://' . $_SERVER['SERVER_NAME'] . $_SERVER['REQUEST_URI'];
$background = get_field('background');
$section_id = get_field('section_id');

$button = get_field('button');
$centered = get_field('centered');
$button_before_icon = get_field('button_before_icon');
$button_after_icon = get_field('button_after_icon');
?>

<?php if (!empty($button)): ?>
<div class="blank-button <?php if ($centered == 'true') { echo 'blank-button--centered'; } ?> <?php if ($background == 'true') { echo 'blank-button--background'; } ?>">
  <?php if (!empty($section_id)): ?>
  <div class="section-id" id="<?php echo esc_html($section_id); ?>"></div>
  <?php endif; ?>
  <div class="container">
    <a href="<?php echo esc_html($button['url']); ?>" class="blank-button__button button" target="<?php echo esc_html($button['target']); ?>">
      <?php if (!empty($button_before_icon)): ?>
      <span class="button__icon button__icon--before">
        <?php echo wp_get_attachment_image($button_before_icon, 'full', '', [
          'loading' => 'eager',
          'decoding' => 'async',
        ]); ?>
      </span>
      <?php endif; ?>
      <?php echo esc_html($button['title']); ?>
      <?php if (!empty($button_after_icon)): ?>
      <span class="button__icon button__icon--after">
        <?php echo wp_get_attachment_image($button_after_icon, 'full', '', [
          'loading' => 'eager',
          'decoding' => 'async',
        ]); ?>
      </span>
      <?php endif; ?>
    </a>
  </div>
</div>
<?php endif; ?>