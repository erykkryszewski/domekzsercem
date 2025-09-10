<?php
$url = 'http://' . $_SERVER['SERVER_NAME'] . $_SERVER['REQUEST_URI'];
$section_id = get_field('section_id');
$background = get_field('background');
$shortcode = get_field('shortcode');
?>

<?php if (!empty($shortcode)): ?>
<div class="container">
  <?php echo do_shortcode($shortcode); ?>
</div>
<?php endif; ?>
