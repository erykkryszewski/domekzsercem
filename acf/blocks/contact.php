<?php
$url = "http://" . $_SERVER["SERVER_NAME"] . $_SERVER["REQUEST_URI"];
$background = get_field("background");
$section_id = get_field("section_id");

$content = get_field("content");
$button = get_field("button");
$map = get_field("map");

$allowed_stuff = [
    "iframe" => [
        "src" => true,
        "width" => true,
        "height" => true,
        "frameborder" => true,
        "style" => true,
        "allow" => true,
        "allowfullscreen" => true,
        "loading" => true,
        "referrerpolicy" => true,
    ],
];
?>

<?php if (!empty($map)): ?>
<div class="contact <?php if ($background == 'true') { echo 'contact--background'; } ?>"
>
    <?php if (!empty($section_id)): ?>
    <div class="section-id" id="<?php echo esc_html($section_id); ?>"></div>
    <?php endif; ?>
    <div class="container">
        <div class="row">
            <div class="col-lg-6 col-xl-4">
                <div class="contact__details">
                    <?php if (!empty($content)): ?>
                    <div class="contact__content"><?php echo apply_filters('the_title', $content); ?></div>
                    <?php endif; ?> <?php if (!empty($button)): ?>
                    <a class="contact__button button" href="<?php echo esc_html($button['url'],); ?>"
                    >
                        <?php echo esc_html($button['title']); ?>
                    </a>
                    <?php endif; ?>
                </div>
            </div>
            <div class="col-lg-6 col-xl-8">
                <div class="contact__map">
                    <div class="contact__iframe"><?php echo wp_kses($map, $allowed_stuff); ?></div>
                </div>
            </div>
        </div>
    </div>
</div>
<?php endif; ?>
