// Verifies that every locale file has exactly the same keys as messages/en.json.
import { readFileSync, readdirSync } from 'node:fs';

const flatten = (obj, prefix = '') =>
  Object.entries(obj).flatMap(([k, v]) =>
    v && typeof v === 'object' ? flatten(v, `${prefix}${k}.`) : [`${prefix}${k}`],
  );

const base = new Set(flatten(JSON.parse(readFileSync('messages/en.json', 'utf8'))));
let ok = true;
for (const file of readdirSync('messages').filter((f) => f !== 'en.json')) {
  const keys = new Set(flatten(JSON.parse(readFileSync(`messages/${file}`, 'utf8'))));
  const missing = [...base].filter((k) => !keys.has(k));
  const extra = [...keys].filter((k) => !base.has(k));
  if (missing.length || extra.length) {
    ok = false;
    console.error(`${file}: missing ${missing.length}, extra ${extra.length}`);
    missing.forEach((k) => console.error(`  - missing ${k}`));
    extra.forEach((k) => console.error(`  + extra   ${k}`));
  }
}
console.log(ok ? `messages OK (${base.size} keys)` : 'messages out of sync');
process.exit(ok ? 0 : 1);
