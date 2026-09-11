import fs from 'fs';
import path from 'path';
const root = 'd:/cursor_develop/Linsy_risk_bill/frontend';
function w(rel, content) {
  const p = path.join(root, rel);
  fs.mkdirSync(path.dirname(p), { recursive: true });
  fs.writeFileSync(p, content, 'utf8');
  console.log('wrote', rel);
}
