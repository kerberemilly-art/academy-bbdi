const fs = require('fs');
const path = require('path');
const jsxFile = path.join(__dirname, 'src', 'pages', 'AdminTrainings.jsx');
let content = fs.readFileSync(jsxFile, 'utf8');

content = content.replace(/import styles from '\.\/AdminTrainings\.module\.css';/, "import './AdminTrainings.css';");
content = content.replace(/className=\{styles\['(.*?)'\]\}/g, 'className="$1"');

fs.writeFileSync(jsxFile, content, 'utf8');

const modFile = path.join(__dirname, 'src', 'pages', 'AdminTrainings.module.css');
const cssFile = path.join(__dirname, 'src', 'pages', 'AdminTrainings.css');
if (fs.existsSync(modFile)) fs.renameSync(modFile, cssFile);
console.log('Reverted CSS modules');
