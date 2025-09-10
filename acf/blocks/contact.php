<?php
$url = 'http://' . $_SERVER['SERVER_NAME'] . $_SERVER['REQUEST_URI'];
$background = get_field('background');
$section_id = get_field('section_id');

$text = get_field('text');
$form_id = get_field('form_id');
$image = get_field('image');

$global_phone_number = get_field('global_phone_number', 'options');
$global_email = get_field('global_email', 'options');
$global_social_media = get_field('global_social_media', 'options');
$global_opening_hours = get_field('global_opening_hours', 'options');
?>

<?php if (!empty($form_id)): ?>
<div class="contact <?php if ($background == 'true') {
  echo 'contact--background';
} ?>">
  <?php if (!empty($section_id)): ?>
  <div class="section-id" id="<?php echo esc_html($section_id); ?>"></div>
  <?php endif; ?>
  <div class="container">
    <div class="row">
      <div class="col-lg-6 col-xl-5">
        <div class="contact__details">
          <?php if (!empty($image)): ?>
          <div class="contact__image">
            <?php echo wp_get_attachment_image($image, 'full', '', ['class' => 'object-fit-cover']); ?>
            <div class="contact__image-decorator"></div>
          </div>
          <?php endif; ?>
          <?php if (!empty($text)): ?>
          <?php echo apply_filters('acf_the_content', str_replace('&nbsp;', ' ', $text)); ?>
          <?php endif; ?>
          <?php if (!empty($global_phone_number)): ?>
          <a class="contact__phone ercodingtheme-phone-number"
            href="tel:<?php echo esc_html($global_phone_number); ?>">Tel:
            <?php echo esc_html($global_phone_number); ?></a>
          <?php endif; ?>
          <?php if (!empty($global_email)): ?>
          <a class="contact__email" href="mailto:<?php echo esc_html($global_email); ?>">Mail:
            <?php echo esc_html($global_email); ?></a>
          <?php endif; ?>
          <!-- <?php if (!empty($global_opening_hours)): ?>
              <h4 class="contact__subtitle"><?php esc_html_e('Godziny otwarcia:', 'ercodingtheme'); ?></h4>
              <div class="opening-hours contact__opening-hours">
                <?php echo apply_filters('acf_the_content', $global_opening_hours); ?>
              </div>
            <?php endif; ?> -->
          <h4 class="contact__subtitle"><?php esc_html_e('Obserwuj nas:', 'ercodingtheme'); ?></h4>
          <?php if (!empty($global_social_media)): ?>
          <div class="social-media contact__social-media">
            <?php foreach ($global_social_media as $key => $item): ?>
            <a href="<?php echo esc_url_raw($item['link']); ?>" target="_blank">
              <?php if (!empty($item['icon'])): ?>
              <?php echo wp_get_attachment_image($item['icon'], 'full', '', ['class' => 'object-fit-contain']); ?>
              <?php endif; ?>
            </a>
            <?php endforeach; ?>
          </div>
          <?php endif; ?>
        </div>
      </div>
      <div class="col-lg-6 col-xl-7">
        <div class="contact__form ercoding-form">
          <?php echo gravity_form($form_id, false, false, false, '', false, 11); ?>
        </div>
      </div>
    </div>
  </div>
</div>
<?php endif; ?>
