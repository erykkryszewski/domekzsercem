<?php
$url = 'http://' . $_SERVER['SERVER_NAME'] . $_SERVER['REQUEST_URI'];
$logos = get_field('logos');
$section_id = get_field('section_id');
$background = get_field('background');

$data_speed = get_field('speed');
?>

<?php if (is_array($logos) && count($logos) > 0): ?>
<div class="logos <?php if ($background === 'true') {
  echo 'logos--background';
} ?>">
  <?php if (!empty($section_id)): ?>
  <div class="section-id" id="<?php echo esc_html($section_id); ?>"></div>
  <?php endif; ?>
  <div class="container-fluid">
    <div class="logos__wrapper">
      <div class="logos__viewport">
        <div class="logos__items" data-speed="<?php if (!empty($data_speed)) {
          echo esc_html($data_speed);
        } else {
          echo '100';
        } ?>">
          <?php
          $shuffled_1 = $logos;
          shuffle($shuffled_1);
          ?>
          <?php foreach ($shuffled_1 as $item): ?>
          <?php if (!empty($item['image'])): ?>
          <div class="logos__image">
            <?php echo wp_get_attachment_image($item['image'], 'full', '', [
              'loading' => 'eager',
              'decoding' => 'async',
            ]); ?>
          </div>
          <?php endif; ?>
          <?php endforeach; ?>
        </div>
      </div>
    </div>
  </div>
</div>
<?php endif; ?>
