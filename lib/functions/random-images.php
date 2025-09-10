<?php

function ercoding_random_images_config()
{
  $config = [
    'default_category' => 'nature',
    'keywords' => [
      'city' => 'city skyline urban architecture street night',
      'office' => 'office workspace coworking desk business meeting',
      'product' => 'product studio minimal mockup object',
      'woman' => 'woman portrait people',
      'man' => 'man portrait people',
      'nature' => 'nature landscape forest mountain river',
      'computer' => 'computer laptop pc keyboard programming code technology desk',
      'laptop' => 'laptop notebook keyboard programming code technology',
      'coding' => 'programming code developer laptop computer',
      'technology' => 'technology electronics gadget computer',
    ],
    'default_size' => [1600, 900],
  ];
  if (function_exists('get_field')) {
    $def = get_field('random_images_default', 'option');
    if ($def) {
      $config['default_category'] = sanitize_title($def);
    }
    $pex = get_field('pexels_api_key', 'option');
    if ($pex) {
      $config['pexels_api_key'] = trim($pex);
    }
  }
  if (!isset($config['pexels_api_key']) && defined('PEXELS_API_KEY')) {
    $config['pexels_api_key'] = PEXELS_API_KEY;
  }
  return apply_filters('ercoding_random_images_config', $config);
}

function ercoding_query_from_category($cat)
{
  $cfg = ercoding_random_images_config();
  $key = sanitize_title((string) $cat);
  if (isset($cfg['keywords'][$key])) {
    return $cfg['keywords'][$key];
  }
  if ($key === '') {
    return $cfg['keywords'][$cfg['default_category']] ?? $cfg['default_category'];
  }
  $syn = [
    'car' => 'car automobile vehicle auto cars',
    'dog' => 'dog puppy dogs canine',
    'cat' => 'cat kitten cats feline',
    'food' => 'food meal dish cuisine cooking',
    'sport' => 'sport sports athlete training',
  ];
  if (isset($syn[$key])) {
    return $syn[$key];
  }
  return $key;
}

function ercoding_resolve_size_dims($size)
{
  if (is_array($size)) {
    if (isset($size[0]) && isset($size[1])) {
      return [absint($size[0]), absint($size[1])];
    }
    $cfg = ercoding_random_images_config();
    return $cfg['default_size'];
  }
  if (is_string($size)) {
    if ($size === 'thumbnail') {
      return [get_option('thumbnail_size_w'), get_option('thumbnail_size_h')];
    }
    if ($size === 'medium') {
      return [get_option('medium_size_w'), get_option('medium_size_h')];
    }
    if ($size === 'large') {
      return [get_option('large_size_w'), get_option('large_size_h')];
    }
    $add = wp_get_additional_image_sizes();
    if (isset($add[$size])) {
      return [$add[$size]['width'], $add[$size]['height']];
    }
  }
  $cfg = ercoding_random_images_config();
  return $cfg['default_size'];
}

function ercoding_is_attachment_like($v)
{
  if (is_numeric($v)) {
    return true;
  }
  if (is_array($v) && (isset($v['ID']) || isset($v['id']))) {
    return true;
  }
  if (is_object($v) && isset($v->ID)) {
    return true;
  }
  return false;
}

function ercoding_build_img_attrs($attrs)
{
  $out = '';
  foreach ($attrs as $k => $v) {
    if ($v === null || $v === false) {
      continue;
    }
    $out .= ' ' . esc_attr($k) . '="' . esc_attr($v) . '"';
  }
  return $out;
}

function ercoding_cache_key($cat, $w, $h, $seed)
{
  return 'erc_img_' . md5(strtolower((string) $cat) . '|' . $w . '|' . $h . '|' . (string) $seed);
}

function ercoding_cache_dir()
{
  $up = wp_get_upload_dir();
  $dir = trailingslashit($up['basedir']) . 'ercoding-random';
  if (!is_dir($dir)) {
    wp_mkdir_p($dir);
  }
  return $dir;
}

function ercoding_ext_from_ctype($ctype)
{
  $ctype = strtolower((string) $ctype);
  if (strpos($ctype, 'image/png') === 0) {
    return 'png';
  }
  if (strpos($ctype, 'image/webp') === 0) {
    return 'webp';
  }
  return 'jpg';
}

function ercoding_cache_get($key)
{
  $meta = get_transient($key);
  if (!$meta || empty($meta['path']) || empty($meta['ctype'])) {
    return false;
  }
  if (!file_exists($meta['path'])) {
    return false;
  }
  return $meta;
}

function ercoding_cache_set($key, $ctype, $body, $ttl = 86400)
{
  $ext = ercoding_ext_from_ctype($ctype);
  $path = trailingslashit(ercoding_cache_dir()) . $key . '.' . $ext;
  if (!file_exists($path)) {
    file_put_contents($path, $body);
  }
  set_transient($key, ['path' => $path, 'ctype' => $ctype], $ttl);
  return ['path' => $path, 'ctype' => $ctype];
}

function ercoding_fetch($url, $headers = [])
{
  $res = wp_remote_get($url, ['timeout' => 15, 'redirection' => 5, 'sslverify' => false, 'headers' => $headers]);
  if (is_wp_error($res)) {
    return false;
  }
  $code = (int) wp_remote_retrieve_response_code($res);
  $body = wp_remote_retrieve_body($res);
  $ctype = wp_remote_retrieve_header($res, 'content-type');
  if ($code !== 200 || empty($body)) {
    return false;
  }
  return ['body' => $body, 'ctype' => $ctype ?: 'image/jpeg'];
}

function ercoding_fetch_from_pexels($query, $w, $h, $seed)
{
  $cfg = ercoding_random_images_config();
  if (empty($cfg['pexels_api_key'])) {
    return false;
  }
  $q = trim($query);
  if ($q === '') {
    $q = $cfg['default_category'];
  }
  $url = add_query_arg(
    [
      'query' => $q,
      'orientation' => 'landscape',
      'size' => 'large',
      'per_page' => 40,
    ],
    'https://api.pexels.com/v1/search',
  );
  $api = wp_remote_get($url, ['timeout' => 12, 'headers' => ['Authorization' => $cfg['pexels_api_key']]]);
  if (is_wp_error($api)) {
    return false;
  }
  $code = (int) wp_remote_retrieve_response_code($api);
  if ($code !== 200) {
    return false;
  }
  $data = json_decode(wp_remote_retrieve_body($api), true);
  if (!is_array($data) || empty($data['photos'])) {
    return false;
  }
  $photos = $data['photos'];
  $idx = hexdec(substr(md5((string) ($seed ?: $q)), 0, 8)) % max(1, count($photos));
  $photo = $photos[$idx];
  $src = '';
  if (!empty($photo['src']['large2x'])) {
    $src = $photo['src']['large2x'];
  } elseif (!empty($photo['src']['original'])) {
    $src = $photo['src']['original'];
  } elseif (!empty($photo['src']['large'])) {
    $src = $photo['src']['large'];
  }
  if (!$src) {
    return false;
  }
  $res = ercoding_fetch($src);
  if ($res) {
    $res['provider'] = 'pexels';
  }
  return $res;
}

function ercoding_build_fallback_urls($query, $w, $h, $seed)
{
  $tags = preg_replace('/\s+/', ',', trim($query));
  $s = $seed ? $seed : wp_generate_password(8, false, false);
  $urls = [];
  if ($tags !== '') {
    $urls[] = 'https://loremflickr.com/' . $w . '/' . $h . '/' . rawurlencode($tags) . '?lock=' . rawurlencode($s);
  }
  if ($tags === '') {
    $urls[] = 'https://picsum.photos/seed/' . rawurlencode($s) . '/' . $w . '/' . $h;
  }
  return $urls;
}

function ercoding_random_image_proxy()
{
  $cfg = ercoding_random_images_config();
  $cat = isset($_GET['cat']) ? sanitize_text_field(wp_unslash($_GET['cat'])) : '';
  $w = isset($_GET['w']) ? absint($_GET['w']) : 1200;
  $h = isset($_GET['h']) ? absint($_GET['h']) : 800;
  $seed = isset($_GET['seed']) ? sanitize_text_field(wp_unslash($_GET['seed'])) : '';
  if ($w < 1 || $h < 1) {
    $w = 1200;
    $h = 800;
  }
  $key = ercoding_cache_key($cat ?: $cfg['default_category'], $w, $h, $seed);
  $cached = ercoding_cache_get($key);
  if ($cached) {
    nocache_headers();
    header('Content-Type: ' . $cached['ctype']);
    header('Content-Length: ' . filesize($cached['path']));
    header('Cache-Control: public, max-age=86400');
    header('X-Ercoding-Provider: cache');
    readfile($cached['path']);
    wp_die();
  }
  $q = ercoding_query_from_category($cat);
  $ok = false;
  if (!empty($cfg['pexels_api_key'])) {
    $ok = ercoding_fetch_from_pexels($q, $w, $h, $seed);
  }
  if (!$ok) {
    $fallbacks = ercoding_build_fallback_urls($q, $w, $h, $seed);
    foreach ($fallbacks as $u) {
      $try = ercoding_fetch($u);
      if ($try) {
        $try['provider'] = strpos($u, 'loremflickr.com') !== false ? 'loremflickr' : 'picsum';
        $ok = $try;
        break;
      }
    }
  }
  if (!$ok) {
    $ok = ercoding_fetch_from_commons($q, $w, $h, $seed);
  }
  if (!$ok) {
    status_header(502);
    wp_die();
  }
  $meta = ercoding_cache_set($key, $ok['ctype'], $ok['body'], 86400);
  nocache_headers();
  header('Content-Type: ' . $meta['ctype']);
  header('Content-Length: ' . strlen($ok['body']));
  header('Cache-Control: public, max-age=86400');
  if (!empty($ok['provider'])) {
    header('X-Ercoding-Provider: ' . $ok['provider']);
  }
  echo $ok['body'];
  wp_die();
}

add_action('wp_ajax_ercoding_random_image', 'ercoding_random_image_proxy');
add_action('wp_ajax_nopriv_ercoding_random_image', 'ercoding_random_image_proxy');

function ercoding_get_image($source = null, $size = 'full', $attr = [])
{
  if (is_array($size) && !isset($size[0]) && !isset($size[1])) {
    $attr = $size;
    $size = 'full';
  }
  if (!ercoding_is_attachment_like($source) && is_array($source) && isset($source[0]) && isset($source[1])) {
    $size = $source;
    $source = null;
  }
  if (ercoding_is_attachment_like($source)) {
    $id = is_numeric($source)
      ? absint($source)
      : (is_array($source)
        ? absint($source['ID'] ?? ($source['id'] ?? 0))
        : 0);
    return wp_get_attachment_image($id, $size, false, $attr);
  }
  $cfg = ercoding_random_images_config();
  [$w, $h] = ercoding_resolve_size_dims($size);
  $cat = is_string($source) && $source !== '' ? $source : $cfg['default_category'];
  $seed = isset($attr['seed']) ? $attr['seed'] : '';
  unset($attr['seed']);
  $src = add_query_arg(
    [
      'action' => 'ercoding_random_image',
      'cat' => $cat,
      'w' => $w,
      'h' => $h,
      'seed' => $seed,
    ],
    admin_url('admin-ajax.php'),
  );
  if (!isset($attr['width'])) {
    $attr['width'] = $w;
  }
  if (!isset($attr['height'])) {
    $attr['height'] = $h;
  }
  if (!isset($attr['alt'])) {
    $attr['alt'] = '';
  }
  if (!isset($attr['loading'])) {
    $attr['loading'] = 'lazy';
  }
  if (!isset($attr['decoding'])) {
    $attr['decoding'] = 'async';
  }
  if (!isset($attr['class'])) {
    $attr['class'] = '';
  }
  $attr['class'] = trim($attr['class'] . ' is-random-image');
  return '<img src="' . esc_url($src) . '"' . ercoding_build_img_attrs($attr) . ' />';
}

function ercoding_fetch_from_commons($query, $w, $h, $seed)
{
  $q = trim($query);
  if ($q === '') {
    $q = ercoding_random_images_config()['default_category'];
  }
  $url = add_query_arg(
    [
      'action' => 'query',
      'format' => 'json',
      'prop' => 'imageinfo',
      'iiprop' => 'url',
      'iiurlwidth' => $w,
      'iiurlheight' => $h,
      'generator' => 'search',
      'gsrsearch' => $q,
      'gsrlimit' => 40,
      'gsrnamespace' => 6,
    ],
    'https://commons.wikimedia.org/w/api.php',
  );
  $res = wp_remote_get($url, ['timeout' => 12, 'redirection' => 3, 'sslverify' => true]);
  if (is_wp_error($res)) {
    return false;
  }
  $code = (int) wp_remote_retrieve_response_code($res);
  if ($code !== 200) {
    return false;
  }
  $data = json_decode(wp_remote_retrieve_body($res), true);
  if (!is_array($data) || empty($data['query']['pages'])) {
    return false;
  }
  $pages = array_values($data['query']['pages']);
  $idx = hexdec(substr(md5((string) ($seed ?: $q)), 0, 8)) % max(1, count($pages));
  $info = $pages[$idx]['imageinfo'][0] ?? null;
  if (!$info) {
    return false;
  }
  $src = $info['thumburl'] ?? ($info['url'] ?? '');
  if (!$src) {
    return false;
  }
  $out = ercoding_fetch($src);
  if ($out) {
    $out['provider'] = 'commons';
  }
  return $out;
}
