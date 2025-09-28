<?php
$url='http://'.$_SERVER['SERVER_NAME'].$_SERVER['REQUEST_URI'];
$section_id=get_field('section_id');
$title=get_field('title');
$subtitle=get_field('subtitle');
$text=get_field('text');
?>
<div class="static-gallery">
	<?php if(!empty($section_id)):?><div class="section-id" id="<?php echo esc_html($section_id);?>"></div><?php endif;?>
	<div class="container">
		<div class="static-gallery__wrapper">
			<?php if(!empty($title)):?><h2 class="static-gallery__title"><?php echo apply_filters('the_title',$title);?></h2><?php endif;?>
			<?php if(!empty($subtitle)):?><h3 class="static-gallery__subtitle"><?php echo apply_filters('the_title',$subtitle);?></h3><?php endif;?>
			<?php if(!empty($text)):?><?php echo apply_filters('acf_the_content',str_replace('&nbsp;',' ',$text));?><?php endif;?>
		</div>
	</div>
</div>
