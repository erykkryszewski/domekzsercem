<?php
$url = 'http://' . $_SERVER['SERVER_NAME'] . $_SERVER['REQUEST_URI'];
$section_id = get_field('section_id');
$background = get_field('background');
$title = get_field('title');
$testimonials = get_field('testimonials');
$image_type = get_field('image_type');
?>

<?php if (!empty($testimonials)): ?>
<div class="testimonials <?php if ($background == 'true') {
  echo 'testimonials--background';
} ?>">
  <?php if (!empty($section_id)): ?>
  <div class="section-id" id="<?php echo esc_html($section_id); ?>"></div>
  <?php endif; ?>
  <div class="container">
    <div class="testimonials__wrapper">
      <div class="testimonials__slider">
        <?php foreach ($testimonials as $key => $item): ?>
        <div class="testimonials__item">
          <div class="testimonials__pattern">
            <svg xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id="a" width="87" height="50.232" patternTransform="scale(2)" patternUnits="userSpaceOnUse">
                  <rect width="100%" height="100%" fill="#fff" />
                  <path fill="none" stroke="#eceef4" stroke-linecap="square" d="m0 54.424 14.5-8.373c4.813 2.767 9.705 5.573 14.5 8.37l14.5-8.373V29.303M0 4.193v16.744l-14.5 8.373L0 37.68l14.5-8.374V12.562l29-16.746m43.5 58.6-14.5-8.37v-33.49c-4.795-2.797-9.687-5.603-14.5-8.37m43.5 25.111L87 37.67c-4.795-2.797-24.187-13.973-29-16.74l-14.5 8.373-14.5-8.37v-33.489m72.5 8.365L87 4.183l-14.5-8.37M87 4.183v16.745L58 37.673v16.744m0-66.976V4.185L43.5 12.56c-4.795-2.797-24.187-13.973-29-16.74L0 4.192l-14.5-8.37m29 33.484c4.813 2.767 9.705 5.573 14.5 8.37V54.42" />
                </pattern>
              </defs>
              <rect width="800%" height="800%" fill="url(#a)" transform="translate(0 -.928)" />
            </svg>
          </div>
          <div class="testimonials__content">
            <?php if (!empty($item['image'])): ?>
            <div class="testimonials__image <?php if ($image_type == 'square') {
              echo 'testimonials__image--square';
            } ?>">
              <?php
              $file = get_attached_file($item['image'], 'large');
              $image_class = image_object_fit($file);
              ?>
              <?php echo wp_get_attachment_image($item['image'], 'large', '', [
                'class' => $image_class,
              ]); ?>
              <div class="testimonials__image-decorator <?php if ($image_type == 'square') {
                echo 'testimonials__image-decorator--square';
              } ?>">
              </div>
            </div>
            <?php endif; ?>
            <div>
              <p class="testimonials__text">
                „<?php echo apply_filters('the_title', $item['text']); ?>”
              </p>
              <h3 class="testimonials__name"><?php echo apply_filters('the_title', $item['name']); ?></h3>
              <?php if (!empty($item['role'])): ?>
              <h4 class="testimonials__role"><?php echo apply_filters('the_title', $item['role']); ?></h4>
              <?php endif; ?>
            </div>
          </div>
        </div>
        <?php endforeach; ?>
      </div>
    </div>
  </div>
</div>
<?php endif; ?>