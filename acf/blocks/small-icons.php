<?php
$url = "http://" . $_SERVER["SERVER_NAME"] . $_SERVER["REQUEST_URI"];
$section_id = get_field("section_id");
$icons = get_field("icons");
?>

<?php if (!empty($icons)): ?>
<div class="small-icons">
    <?php if (!empty($section_id)): ?>
    <div class="section-id" id="<?php echo esc_html($section_id); ?>"></div>
    <?php endif; ?>
    <div class="container">
        <div class="small-icons__wrapper">
            <?php foreach ($icons as $key => $item): ?>
            <div class="small-icons__item">
                <div class="small-icons__icon"><?php echo wp_get_attachment_image($item['image'], 'large', '', ['class' => '']); ?></div>
                <div><?php echo esc_html($item['text']); ?></div>
            </div>
            <div class="small-icons__item">
                <div class="small-icons__icon">
                    <?php echo wp_get_attachment_image($item['image'], 'large', '', [ 'class' => '', ]); ?>
                </div>
                <div><?php echo esc_html($item['text']); ?></div>
            </div>
            <div class="small-icons__item">
                <div class="small-icons__icon">
                    <?php echo wp_get_attachment_image($item['image'], 'large', '', [ 'class' => '', ]); ?>
                </div>
                <div><?php echo esc_html($item['text']); ?></div>
            </div>
            <div class="small-icons__item">
                <div class="small-icons__icon">
                    <?php echo wp_get_attachment_image($item['image'], 'large', '', [ 'class' => '', ]); ?>
                </div>
                <div><?php echo esc_html($item['text']); ?></div>
            </div>
            <?php endforeach; ?>
        </div>
    </div>
</div>
<?php endif; ?>
