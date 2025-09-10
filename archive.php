<?php 

get_header();
global $post;

// Get the current page number
$current_blog_page = get_query_var('paged') ? get_query_var('paged') : 1;

$args = array( 
  'post_type' => 'kursy', 
  'post_status' => 'publish',
  'posts_per_page' => 12,  
  'orderby' => 'title',
  'paged' => $current_blog_page
);

$global_logo = get_field('global_logo', 'options');
$archive_title = get_the_archive_title();
$title_parts = explode(':', $archive_title);
$page_title = wp_strip_all_tags(end($title_parts));

$query = new WP_Query($args);

?>

<main id="main" class="main <?php if(!is_front_page()) { echo 'main--subpage'; }?>">
  <div class="subpage-hero">
    <div class="subpage-hero__background subpage-hero__background--plain"></div>
    <div class="container">
      <div class="subpage-hero__wrapper">
        <h1 class="subpage-hero__title"><?php echo apply_filters('the_title', $page_title);?></h1>
      </div>
    </div>
  </div>
  <div class="spacer" style="height: 90px"></div>
  <div class="section-title">
    <div class="container">
      <div class="section-title__wrapper section-title__wrapper--decorated">
        <h2>Lorem ipsum dolor sit amet.</h2>
        <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Nihil voluptas amet reiciendis consequuntur praesentium est laudantium iure veniam voluptatem maxime! </p>
      </div>
    </div>
  </div>
  <?php if($query->have_posts()):?>
    <div class="theme-blog theme-blog--courses">
      <div class="container">
        <div class="theme-blog__wrapper theme-blog__wrapper--courses">
          <div class="row">
            <?php while ($query->have_posts()) : $query->the_post(); ?>
              <div class="col-12 col-md-6 col-lg-4 theme-blog__column theme-blog__column--courses">
                <div class="theme-blog__item theme-blog__item--courses">
                  <div class="theme-blog__image theme-blog__image--courses">
                    <a href="<?php the_permalink();?>" class="cover"></a>
                    <?php echo wp_get_attachment_image(get_post_thumbnail_id(), 'full', '', ["class" => "object-fit-contain"]); ?>
                  </div>
                  <div class="theme-blog__content theme-blog__content--courses">
                    <div>
                      <a href="<?php the_permalink(); ?>" class="theme-blog__title"><?php the_title(); ?></a>
                      <?php
                      $excerpt = get_the_excerpt();
                      $content = get_the_content();

                      if (!empty($excerpt)) {
                        echo '<p>' . mb_substr($excerpt, 0, 150) . (mb_strlen($excerpt) > 150 ? '...' : '') . '</p>';
                      } elseif (empty($excerpt) && !empty($content)) {
                        $contentText = strip_tags($content);
                        echo '<p>' . mb_substr($contentText, 0, 150) . (mb_strlen($contentText) > 150 ? '...' : '') . '</p>';
                      }
                      
                    ?>
                    </div>
                      <a href="<?php the_permalink(); ?>" class="theme-blog__button button"><?php _e('Czytaj więcej', 'ercodingtheme'); ?></a>
                  </div>
                </div>
              </div>
            <?php endwhile; ?>
          </div>
        </div>
        <div class="pagination mt-5">
          <?php
            echo paginate_links(array(
              'base'         => str_replace(999999999, '%#%', esc_url(get_pagenum_link(999999999))),
              'current'      => max(1, get_query_var('paged')),
              'format'       => '?paged=%#%',
              'total'        => $query->max_num_pages, // Use max_num_pages from the custom query
              'show_all'     => false,
              'type'         => 'list',
              'end_size'     => 2,
              'mid_size'     => 1,
              'prev_next'    => true,
              'prev_text'    => '',
              'next_text'    => '',
              'add_args'     => false,
              'add_fragment' => '',
            ));
          ?>
        </div>
        <?php wp_reset_postdata(); ?>
      </div>
    </div>
  <?php endif;?>
  <div class="spacer spacer--small" style="height: 40px"></div>
  <div class="cta">
    <div class="container">
      <div class="cta__wrapper">
        <h2 class="cta__title">Zapoznaj się z naszą ofertą!</h2>
        <p></p>
        <div>
          <a href="/kontakt/" class="cta__button button">Skontaktuj się</a>
        </div>
      </div>
    </div>
  </div>
</main>
<?php get_footer(); ?>
