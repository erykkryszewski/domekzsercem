<?php

/**
 * ACF Block: Border divider
 *
 *
 * @package vimarstarter
 * @license GPL-3.0-or-later
 */

$url = 'http://' . $_SERVER['SERVER_NAME'] . $_SERVER['REQUEST_URI'];
$background = get_field('background');
$section_id = get_field('section_id');

$direction = get_field('direction');
?>

<div class="container">
  <div class="border-divider"></div>
</div>