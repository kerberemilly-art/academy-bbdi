const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'src', 'pages');
const cssFile = path.join(srcDir, 'AdminTrainings.css');
const moduleFile = path.join(srcDir, 'AdminTrainings.module.css');
const jsxFile = path.join(srcDir, 'AdminTrainings.jsx');

if (fs.existsSync(cssFile)) {
  fs.renameSync(cssFile, moduleFile);
  
  let content = fs.readFileSync(jsxFile, 'utf8');
  content = content.replace(/import '\.\/AdminTrainings\.css';/, "import styles from './AdminTrainings.module.css';");
  
  const cssContent = fs.readFileSync(moduleFile, 'utf8');
  const classMatches = [...cssContent.matchAll(/\.([a-zA-Z0-9_-]+)/g)];
  const classes = [...new Set(classMatches.map(m => m[1]))];
  
  classes.forEach(cls => {
    // Replace exact className="something"
    const regex1 = new RegExp(`className="${cls}"`, 'g');
    content = content.replace(regex1, `className={styles['${cls}']}`);
    
    // Replace className={'something'}
    const regex2 = new RegExp(`className={'${cls}'}`, 'g');
    content = content.replace(regex2, `className={styles['${cls}']}`);
  });

  fs.writeFileSync(jsxFile, content, 'utf8');
  console.log('CSS Modules converted for AdminTrainings');
}
