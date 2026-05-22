const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'src');
const dataDir = path.join(srcDir, 'data');
const apiDir = path.join(srcDir, 'api');

if (!fs.existsSync(apiDir)) {
  fs.mkdirSync(apiDir);
}

const filesToMove = [
  'backendSync.js',
  'trainingAdminApi.js',
  'progressStorage.js',
  'certificateStorage.js',
  'usersStorage.js'
];

filesToMove.forEach(file => {
  const oldPath = path.join(dataDir, file);
  const newPath = path.join(apiDir, file);
  if (fs.existsSync(oldPath)) {
    fs.renameSync(oldPath, newPath);
    console.log('Moved ' + file);
  }
});

function updateImports(dir) {
  const files = fs.readdirSync(dir);
  files.forEach(file => {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      updateImports(fullPath);
    } else if (fullPath.endsWith('.jsx') || fullPath.endsWith('.js')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      let changed = false;
      
      filesToMove.forEach(movedFile => {
        const basename = movedFile.replace('.js', '');
        
        // Handle ../data/basename -> ../api/basename
        const regex1 = new RegExp(`from ['"]\\.\\./data/${basename}['"]`, 'g');
        if (regex1.test(content)) {
          content = content.replace(regex1, `from '../api/${basename}'`);
          changed = true;
        }
        
        // Handle ./basename inside src/data -> ../api/basename
        if (dir === dataDir) {
          const regex2 = new RegExp(`from ['"]\\./${basename}['"]`, 'g');
          if (regex2.test(content)) {
            content = content.replace(regex2, `from '../api/${basename}'`);
            changed = true;
          }
        }

        // Handle ../../data/basename if any
        const regex3 = new RegExp(`from ['"]\\.\\./\\.\\./data/${basename}['"]`, 'g');
        if (regex3.test(content)) {
          content = content.replace(regex3, `from '../../api/${basename}'`);
          changed = true;
        }
      });
      
      if (changed) {
        fs.writeFileSync(fullPath, content, 'utf8');
        console.log('Updated imports in ' + fullPath);
      }
    }
  });
}

updateImports(srcDir);
console.log('Done.');
