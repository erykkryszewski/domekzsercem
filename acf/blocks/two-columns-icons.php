<?php
$url = "http://" . $_SERVER["SERVER_NAME"] . $_SERVER["REQUEST_URI"];
$section_id = get_field("section_id");

$left_column_title = get_field("left_column_title");
$right_column_title = get_field("right_column_title");
$left_column_icons = get_field("left_column_icons");
$right_column_icons = get_field("right_column_icons");
?>

<div class="small-icons">
    <?php if (!empty($section_id)): ?>
    <div class="section-id" id="<?php echo esc_html($section_id); ?>"></div>
    <?php endif; ?>
    <div class="container">
        <div class="small-icons__wrapper">
            <div class="row">
                <?php if (!empty($left_column_icons)): ?>
                <div class="col-md-6">
                    <div class="small-icons__content">
                        <?php foreach ($left_column_icons as $key => $item): ?>
                        <div class="small-icons__item"><?php echo wp_get_attachment_image($item['image'], 'large', '', ['class' => '']); ?> <?php echo apply_filters('the_title', $left_column_title); ?></div>
                        <?php endforeach; ?>
                    </div>
                </div>
                <?php endif; ?> <?php if (!empty($right_column_icons)): ?>
                <div class="col-md-6">
                    <div class="small-icons__content">
                        <?php foreach ($right_column_icons as $key => $item): ?>
                        <div class="small-icons__item">
                            <?php echo wp_get_attachment_image($item['image'], 'large', '', [ 'class' => '', ]); ?> <?php echo apply_filters('the_title', $right_column_title); ?>
                        </div>
                        <?php endforeach; ?>
                    </div>
                </div>
                <?php endif; ?>
            </div>
        </div>
    </div>
</div>
