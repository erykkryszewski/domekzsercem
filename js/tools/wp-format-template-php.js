#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const normalizeLF = (s) => s.replace(/\r\n?/g, '\n');

function collapsePhpBlockNewlines(str) {
  return str.replace(/<\?php([\s\S]*?)\?>/g, (m, inner) => {
    let s = inner;
    s = s.replace(/-\>\s*\n\s*/g, '->').replace(/::\s*\n\s*/g, '::');
    s = s.replace(/([=!<>]=?=?)\s*\n\s*/g, '$1 ');
    s = s.replace(/(&&|\|\|)\s*\n\s*/g, '$1 ');
    s = s.replace(/\s*\n\s*/g, ' ');
    s = s.replace(/\s{2,}/g, ' ');
    s = s.replace(/\(\s+/g, '(').replace(/\s+\)/g, ')');
    s = s.replace(/\s+:/g, ' :').replace(/\s+;/g, ';');
    return `<?php${s}?>`;
  });
}

function collapseInlinePhpWhitespaceInAttrs(html) {
  return html.replace(/=(["'])([^"']*<\?php[\s\S]*?\?>[^"']*)\1/g, (m, q, inner) => {
    const collapsed = inner
      .replace(/-\>\s*\n\s*/g, '->')
      .replace(/::\s*\n\s*/g, '::')
      .replace(/\s*\n\s*/g, ' ')
      .replace(/\s{2,}/g, ' ');
    return `=${q}${collapsed}${q}`;
  });
}

function collapseMultilineAttributes(html, maxLen = 240) {
  return html.replace(/<([a-zA-Z][\w:-]*)(\s+[^>]*?)>/g, (m, tag, attrs) => {
    if (!/\n/.test(attrs)) return m;
    const oneLine = `<${tag}${attrs.replace(/\s*\n\s*/g, ' ').replace(/\s{2,}/g, ' ')}>`;
    return oneLine.length <= maxLen ? oneLine : m;
  });
}

function encodePhpRightAfterTagName(html) {
  const map = [];
  let idx = 0;
  const out = html.replace(/<([a-zA-Z][\w:-]*)\s*<\?php([\s\S]*?)\?>/g, (m, tag, php) => {
    const token = `__PHPATTR_${idx++}__`;
    map.push([token, `<?php${php}?>`]);
    return `<${tag} __phpattrs__="${token}"`;
  });
  return { html: out, map };
}
function restorePhpRightAfterTagName(html, map) {
  let out = html;
  for (const [token, php] of map) {
    out = out.replace(new RegExp(`\\s__phpattrs__="${token}"`, 'g'), ` ${php}`);
  }
  return out;
}

function addPartialShims(html) {
  const hasOpenBody = /<body\b/i.test(html);
  const hasCloseBody = /<\/body>/i.test(html);
  const hasOpenHtml = /<html\b/i.test(html);
  const hasCloseHtml = /<\/html>/i.test(html);
  let prefix = '';
  const added = { openHtml: false, openBody: false };
  if (hasCloseHtml && !hasOpenHtml) {
    prefix += '<html data-wp-shim>';
    added.openHtml = true;
  }
  if (hasCloseBody && !hasOpenBody) {
    prefix += '<body data-wp-shim>';
    added.openBody = true;
  }
  return { html: prefix ? prefix + html : html, added };
}
function removePartialShims(html, added) {
  let out = html;
  if (added.openBody) {
    out = out.replace(/<body\b[^>]*data-wp-shim[^>]*>/i, '');
  }
  if (added.openHtml) {
    out = out.replace(/<html\b[^>]*data-wp-shim[^>]*>/i, '');
  }
  return out;
}

function encodeIgnoreBlocks(input) {
  const patterns = [
    {
      start: /<!--\s*(?:stop-formatting|wpfmt-ignore-start)\s*-->/i,
      end: /<!--\s*(?:start-formatting|wpfmt-ignore-end)\s*-->/i,
      wrap: (t) => `<!-- ${t} -->`,
    },
    {
      start: /\/\*\s*(?:stop-formatting|wpfmt-ignore-start)\s*\*\//i,
      end: /\/\*\s*(?:start-formatting|wpfmt-ignore-end)\s*\*\//i,
      wrap: (t) => `/* ${t} */`,
    },
    {
      start: /\/\/\s*(?:stop-formatting|wpfmt-ignore-start)\b[^\n]*\n?/i,
      end: /\/\/\s*(?:start-formatting|wpfmt-ignore-end)\b[^\n]*\n?/i,
      wrap: (t) => `/* ${t} */`,
    },
    {
      start: /\b(?:stop-formatting|wpfmt-ignore-start)\b/i,
      end: /\b(?:start-formatting|wpfmt-ignore-end)\b/i,
      wrap: (t) => `<!-- ${t} -->`,
    },
  ];
  let out = input;
  const map = [];
  let idx = 0;
  let cursor = 0;
  while (true) {
    let found = null;
    for (const p of patterns) {
      const sub = out.slice(cursor);
      const m = p.start.exec(sub);
      if (m) {
        const absIdx = cursor + m.index;
        if (!found || absIdx < found.absIdx) {
          found = { p, m, absIdx, startLen: m[0].length };
        }
      }
    }
    if (!found) break;
    const startIdx = found.absIdx;
    const afterStart = startIdx + found.startLen;
    const subAfter = out.slice(afterStart);
    const mend = found.p.end.exec(subAfter);
    let endIdx, endLen;
    if (mend) {
      endIdx = afterStart + mend.index;
      endLen = mend[0].length;
    } else {
      endIdx = out.length;
      endLen = 0;
    }
    const original = out.slice(startIdx, endIdx + endLen);
    const token = `__WPFMT_IGNORE_${idx++}__`;
    const replacement = found.p.wrap(token);
    out = out.slice(0, startIdx) + replacement + out.slice(endIdx + endLen);
    cursor = startIdx + replacement.length;
    map.push({ token, original });
  }
  return { html: out, map };
}
function restoreIgnoreBlocks(input, map) {
  let out = input;
  for (const { token, original } of map) {
    const re = new RegExp(`<!--\\s*${token}\\s*-->|/\\*\\s*${token}\\s*\\*/`, 'g');
    out = out.replace(re, original);
  }
  return out;
}

function looksLikeHeaderWithUnclosedRoots(html) {
  const hasOpen = /<html\b|<body\b/i.test(html);
  const hasClose = /<\/html>|<\/body>/i.test(html);
  return hasOpen && !hasClose;
}

async function loadPrettier() {
  return (await eval("import('prettier')")).default;
}

(async () => {
  const file = process.argv[2];
  if (!file) {
    process.exit(2);
  }
  const abs = path.resolve(file);
  const rel = path.relative(process.cwd(), abs).replace(/\\/g, '/');
  const base = path.basename(abs);
  const isBlocks = /(^|\/)acf\/blocks\/[^/]+\.php$/.test(rel);
  const isRootPhp = /^[^/]+\.php$/.test(rel) && base !== 'functions.php';
  if (!(isBlocks || isRootPhp)) process.exit(0);

  const raw = fs.readFileSync(abs, 'utf8');
  const prettier = await loadPrettier();

  let preamble = '';
  let body = raw;
  if (raw.startsWith('<?php')) {
    const end = raw.indexOf('?>');
    if (end !== -1) {
      preamble = raw.slice(0, end + 2);
      body = raw.slice(end + 2);
    }
  }

  let out = '';
  if (preamble) {
    const fmtPhp = await prettier.format(normalizeLF(preamble), {
      parser: 'php',
      plugins: [require.resolve('@prettier/plugin-php')],
      printWidth: 100,
      tabWidth: 4,
    });
    out += fmtPhp.trimEnd() + '\n\n';
  }

  if (body) {
    let html = normalizeLF(body).replace(/^\s+/, '');

    const skipHtmlFormattingCompletely = base.toLowerCase() === 'header.php' || looksLikeHeaderWithUnclosedRoots(html);

    if (skipHtmlFormattingCompletely) {
      html = collapsePhpBlockNewlines(html);
      out += html;
    } else {
      const encIgnored = encodeIgnoreBlocks(html);
      html = encIgnored.html;
      const ignoreMap = encIgnored.map;
      const encodedObj = encodePhpRightAfterTagName(html);
      html = encodedObj.html;
      const phpMap = encodedObj.map;
      const shimmedObj = addPartialShims(html);
      const shimmed = shimmedObj.html;
      const added = shimmedObj.added;

      let formatted;
      try {
        formatted = await prettier.format(shimmed, {
          parser: 'html',
          embeddedLanguageFormatting: 'off',
          htmlWhitespaceSensitivity: 'ignore',
          printWidth: 240,
          tabWidth: 4,
        });
      } catch (err) {
        formatted = shimmed;
      }

      let restored = restorePhpRightAfterTagName(formatted, phpMap);
      restored = removePartialShims(restored, added);
      restored = collapsePhpBlockNewlines(restored);
      restored = collapseInlinePhpWhitespaceInAttrs(restored);
      restored = collapseMultilineAttributes(restored, 240);
      restored = restoreIgnoreBlocks(restored, ignoreMap);
      out += restored;
    }
  }

  fs.writeFileSync(abs, out, 'utf8');
})().catch(() => {
  process.exit(1);
});
