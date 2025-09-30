<?php
$url = "http://" . $_SERVER["SERVER_NAME"] . $_SERVER["REQUEST_URI"];
$section_id = get_field("section_id");

$left_column_content = get_field("left_column_content");
$right_up_content = get_field("right_up_content");
$left_down_column = get_field("left_down_column");
$right_down_column = $left_down_column;
$button = get_field("button");
?>

<div class="two-box-promo">
    <?php if (!empty($section_id)): ?>
    <div class="section-id" id="<?php echo esc_html($section_id); ?>"></div>
    <?php endif; ?>
    <div class="container">
        <div class="two-box-promo__wrapper">
            <?php if (!empty($left_column_content)): ?>
            <div class="two-box-promo__column two-box-promo__column--left"><?php echo apply_filters('the_title', $left_column_title); ?></div>
            <?php endif; ?> <?php if (!empty($right_up_content)): ?>
            <div class="two-box-promo__column two-box-promo__column--right">
                <div class="two-box-promo__info">
                    <?php foreach ($right_up_content as $key => $item): ?>
                    <div class="two-box-promo__item">
                        <div class="two-box-promo__days"><?php echo apply_filters('the_title', $item['days']); ?></div>
                        <div class="two-box-promo__discount"><?php echo apply_filters('the_title', $item['discount']); ?></div>
                    </div>
                    <?php endforeach; ?>
                </div>
            </div>
            <?php endif; ?>
        </div>
    </div>
</div>
