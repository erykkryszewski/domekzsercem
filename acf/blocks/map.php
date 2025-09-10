<?php
$url = 'http://' . $_SERVER['SERVER_NAME'] . $_SERVER['REQUEST_URI'];
$section_id = get_field('section_id');
$background = get_field('background');
$map_iframe = get_field('map_iframe');
$map_desktop_height = get_field('map_desktop_height');
$full_width = get_field('full_width');

$allowed_stuff = [
  'iframe' => [
    'src' => true,
    'width' => true,
    'height' => true,
    'frameborder' => true,
    'style' => true,
    'allow' => true,
    'allowfullscreen' => true,
    'loading' => true,
    'referrerpolicy' => true,
  ],
];
?>

<?php if (!empty($map_iframe)): ?>
<div class="map <?php if ($background == 'true') {
  echo 'map--background';
} ?>">
  <?php if (!empty($section_id)): ?>
  <div class="section-id" id="<?php echo esc_html($section_id); ?>"></div>
  <?php endif; ?>
  <div class="<?php if ($full_width == 'true') {
    echo 'container-fluid';
  } else {
    echo 'container';
  } ?>">
    <div class="map__content" style="height:<?php echo esc_html($map_desktop_height); ?>px">
      <?php echo wp_kses($map_iframe, $allowed_stuff); ?>
    </div>
  </div>
</div>
<?php endif; ?>
