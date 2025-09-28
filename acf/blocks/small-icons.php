<?php
$url = "http://" . $_SERVER["SERVER_NAME"] . $_SERVER["REQUEST_URI"];
$section_id = get_field("section_id");

$left_column_title = get_field("left_column_title");
$right_column_title = get_field("right_column_title");
$left_column_icons = get_field("left_column_icons");
$right_column_icons = get_field("right_column_icons");
?>

<?php if (!empty($icons)): ?>
<div class="small-icons">
    <?php if (!empty($section_id)): ?>
    <div class="section-id" id="<?php echo esc_html($section_id); ?>"></div>
    <?php endif; ?>
    <div class="container">
        <div class="small-icons__wrapper">
            <?php foreach ($icons as $key => $item): ?>
            <div class="small-icons__item"><?php echo wp_get_attachment_image($item['image'], 'large', '', ['class' => '']); echo esc_html($item['text']); ?></div>
            <?php endforeach; ?>
        </div>
    </div>
</div>
<?php endif; ?>
