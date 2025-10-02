<?php
$url = "http://" . $_SERVER["SERVER_NAME"] . $_SERVER["REQUEST_URI"];
$section_id = get_field("section_id");

$left_column_title = get_field("left_column_title");
$right_column_title = get_field("right_column_title");
$left_column_icons = get_field("left_column_icons");
$right_column_icons = get_field("right_column_icons");
?>

<div class="two-columns-icons">
    <?php if (!empty($section_id)): ?>
    <div class="section-id" id="<?php echo esc_html($section_id); ?>"></div>
    <?php endif; ?>
    <div class="container">
        <div class="two-columns-icons__wrapper">
            <div class="row">
                <?php if (!empty($left_column_icons)): ?>
                <div class="col-md-6">
                    <div class="two-columns-icons__content two-columns-icons__content--left">
                        <h3><?php echo esc_html($left_column_title); ?></h3>
                        <?php foreach ($left_column_icons as $key => $item): ?>
                        <div class="two-columns-icons__item">
                            <?php if (!empty($item['image'])): ?>
                            <div class="two-columns-icons__image">
                                <?php echo wp_get_attachment_image($item['image'], 'large', '', ['class' => ''],); ?>
                            </div>
                            <?php endif; ?> <?php echo apply_filters('acf_the_content', $item['text']); ?>
                        </div>
                        <?php endforeach; ?>
                    </div>
                </div>
                <?php endif; ?> <?php if (!empty($right_column_icons)): ?>
                <div class="col-md-6">
                    <div class="two-columns-icons__content two-columns-icons__content--right">
                        <h3><?php echo esc_html($right_column_title); ?></h3>
                        <?php foreach ($right_column_icons as $key => $item): ?>
                        <div class="two-columns-icons__item">
                            <?php if (!empty($item['image'])): ?>
                            <div class="two-columns-icons__image">
                                <?php echo wp_get_attachment_image($item['image'], 'large', '', ['class' => ''],); ?>
                            </div>
                            <?php endif; ?> <?php echo apply_filters('acf_the_content', $item['text']); ?>
                        </div>
                        <?php endforeach; ?>
                    </div>
                </div>
                <?php endif; ?>
            </div>
        </div>
    </div>
</div>
