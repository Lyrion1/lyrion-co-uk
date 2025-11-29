const fs = require('fs');
const path = require('path');

const stamp = {
  time: new Date().toISOString(),
  branch: process.env.BRANCH || process.env.GIT_BRANCH || '',
  commit: (process.env.COMMIT_REF || process.env.GITHUB_SHA || '').slice(0, 8),
  site: process.env.URL || '',
};

try {
  fs.writeFileSync(path.join(process.cwd(), 'version.json'), JSON.stringify(stamp, null, 2));
  console.log('Wrote version.json:', stamp);
} catch (err) {
  console.error('Failed to write version.json:', err.message);
  process.exit(1);
}
