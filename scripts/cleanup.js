/* eslint-disable */
const fs = require('fs');
const path = require('path');

const mode = (process.argv[2] || 'preview').toLowerCase(); // 'preview' or 'apply'
const root = process.cwd();
const cfg = require(path.join(root, 'cleanup-keep.json'));

const keepDirs = new Set(cfg.keepDirs || []);
const keepFiles = new Set(cfg.keepFiles || []);
const ignored = new Set(cfg.ignoredDirs || []);
const toDelete = [];

function isDir(p){ try{ return fs.statSync(p).isDirectory(); }catch{ return false; } }
function isFile(p){ try{ return fs.statSync(p).isFile(); }catch{ return false; } }

// 1) Root-level directories: delete any not in keepDirs/ignored
for (const entry of fs.readdirSync(root)){
  const full = path.join(root, entry);
  if (isDir(full)){
    if (ignored.has(entry)) continue;
    if (!keepDirs.has(entry)){
      toDelete.push({ type:'dir', path: full });
    }
  }
}

// 2) Root-level files: delete legacy .html that are not in keepFiles
for (const entry of fs.readdirSync(root)){
  const full = path.join(root, entry);
  if (isFile(full)){
    const ext = path.extname(entry).toLowerCase();
    if (ext === '.html' && !keepFiles.has(entry)){
      toDelete.push({ type:'file', path: full });
    }
  }
}

// Never touch assets/ (images, css, js), data/, partials/ etc.
// The keep list preserves all product images, logos, CSS/JS by design.

if (!toDelete.length){
  console.log('  Nothing to delete. Repo already clean.');
  process.exit(0);
}

console.log(`  Cleanup ${mode.toUpperCase()} — ${toDelete.length} item(s) will be removed:`);
for (const item of toDelete){
  console.log(`  - ${item.type.toUpperCase()}: ${path.relative(root, item.path)}`);
}

if (mode === 'apply'){
  for (const item of toDelete){
    try{
      if (item.type === 'dir'){
        fs.rmSync(item.path, { recursive: true, force: true });
      } else {
        fs.rmSync(item.path, { force: true });
      }
    }catch(e){
      console.error('Failed to remove', item.path, e.message);
    }
  }
  console.log('  Cleanup applied. Commit the deletions.');
} else {
  console.log('\n(Preview only) To apply deletions, run: npm run cleanup:apply');
}
