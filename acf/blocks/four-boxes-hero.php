<?php
$url = "http://" . $_SERVER["SERVER_NAME"] . $_SERVER["REQUEST_URI"];
$section_id = get_field("section_id");

$left_box_image = get_field("left_box_image");
$left_box_iframe = get_field("left_box_iframe");
$left_box_title = get_field("left_box_title");
$left_box_text = get_field("left_box_text");

$mid_box_image = get_field("mid_box_image");
$mid_box_title = get_field("mid_box_title");

$right_up_box_image = get_field("right_up_box_image");
$right_up_box_text = get_field("right_up_box_text");

$right_down_box_image = get_field("right_down_box_image");
?>

<div class="four-boxes-hero">
    <?php if (!empty($section_id)): ?>
    <div class="section-id" id="<?php echo esc_html($section_id); ?>"></div>
    <?php endif; ?>
    <div class="container">
        <div class="four-boxes-hero__wrapper">
            <?php if (!empty($left_box_image)): ?>
            <div class="four-boxes-hero__column four-boxes-hero__column--left">
                <div class="four-boxes-hero__image"><?php echo wp_get_attachment_image($left_box_image, 'large', '', [ 'class' => 'object-fit-cover', ]); ?></div>
            </div>
            <?php endif; ?> <?php if (!empty($mid_box_image)): ?>
            <div class="four-boxes-hero__column four-boxes-hero__column--mid"></div>
            <?php endif; ?>
            <div class="four-boxes-hero__column four-boxes-hero__column--right"><?php if (!empty($left_box_image)): ?> <?php endif; ?> <?php if (!empty($left_box_image)): ?> <?php endif; ?></div>
        </div>
    </div>
</div>
