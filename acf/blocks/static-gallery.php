<?php
$url = "http://" . $_SERVER["SERVER_NAME"] . $_SERVER["REQUEST_URI"];
$section_id = get_field("section_id");
$gallery = get_field("gallery");
?>

<?php if (!empty($gallery)): ?>
<div class="static-gallery">
    <?php if (!empty($section_id)): ?>
    <div class="section-id" id="<?php echo esc_html($section_id); ?>"></div>
    <?php endif; ?>
    <div class="container">
        <div class="static-gallery__wrapper"><?php foreach ($gallery as $key => $item): ?> <?php endforeach; ?></div>
    </div>
</div>
<?php endif; ?>
