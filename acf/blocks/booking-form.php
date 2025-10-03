<?php
$url = "http://" . $_SERVER["SERVER_NAME"] . $_SERVER["REQUEST_URI"];
$section_id = get_field("section_id");
$form_shortcode = get_field("form_shortcode");
?>

<?php if (!empty($form_shortcode)): ?>
<div class="payment">
    <?php if (!empty($section_id)): ?>
    <div class="section-id" id="<?php echo esc_html($section_id); ?>"></div>
    <?php endif; ?>
    <div class="container">
        <div class="payment__form"><?php echo do_shortcode($form_shortcode); ?></div>
    </div>
</div>
<?php endif; ?>
