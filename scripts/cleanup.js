/* eslint-disable */
const fs = require('fs');
const path = require('path');

const mode = (process.argv[2] || 'preview').toLowerCase(); // 'preview' or 'apply'
const root = process.cwd();

// Load configuration with error handling
const configPath = path.join(root, 'cleanup-keep.json');
let cfg;
try {
  cfg = require(configPath);
} catch (e) {
  console.error(`Error loading config file '${configPath}': ${e.message}`);
  process.exit(1);
}

const keepDirs = new Set(cfg.keepDirs || []);
const keepFiles = new Set(cfg.keepFiles || []);
const ignored = new Set(cfg.ignoredDirs || []);
const toDelete = [];

function isDir(p) {
  return fs.existsSync(p) && fs.statSync(p).isDirectory();
}

function isFile(p) {
  return fs.existsSync(p) && fs.statSync(p).isFile();
}

// Read root directory once with error handling
let entries;
try {
  entries = fs.readdirSync(root);
} catch (e) {
  console.error(`Error reading directory '${root}': ${e.message}`);
  process.exit(1);
}

// Process entries: directories and files
for (const entry of entries) {
  const full = path.join(root, entry);
  
  if (isDir(full)) {
    // Skip ignored directories, delete those not in keepDirs
    if (ignored.has(entry)) continue;
    if (!keepDirs.has(entry)) {
      toDelete.push({ type: 'dir', path: full });
    }
  } else if (isFile(full)) {
    // Delete legacy .html files not in keepFiles
    const ext = path.extname(entry).toLowerCase();
    if (ext === '.html' && !keepFiles.has(entry)) {
      toDelete.push({ type: 'file', path: full });
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
