const fs = require('fs');
const path = require('path');

const SRC_DIR = './src';
const TEMPLATES_DIR = './templates';
const DIST_DIR = './dist';

const TEMPLATE_START_MARKER = '// === PART START ===';
const TEMPLATE_END_MARKER = '// === PART END ===';
const TEMPLATE_INSERT_START = '// === TEMPLATE START ===';
const TEMPLATE_INSERT_END = '// === TEMPLATE END ===';

// Получаем имя самого нового шаблона
function getLatestTemplateFile() {
  const templateFiles = fs.readdirSync(TEMPLATES_DIR)
  .filter(f => f.endsWith('.js'))
  .map(filename => ({
    name: filename,
    mtime: fs.statSync(path.join(TEMPLATES_DIR, filename)).mtimeMs
  }));

  if (templateFiles.length === 0) {
    throw new Error('Нет файлов шаблонов в папке templates');
  }

  templateFiles.sort((a, b) => b.mtime - a.mtime); // Последний по дате вверх

  return templateFiles[0].name;
}

// Читаем и извлекаем шаблонную часть
function extractTemplate(templatePath) {
  const fullPath = path.join(TEMPLATES_DIR, templatePath);
  const content = fs.readFileSync(fullPath, 'utf-8');
  const match = content.match(new RegExp(`${TEMPLATE_START_MARKER}[\\s\\S]*?${TEMPLATE_END_MARKER}`));

  if (!match) {
    throw new Error(`❌ Шаблонные границы не найдены в ${templatePath}`);
  }

  return match[0]
  .replace(TEMPLATE_START_MARKER, '')
  .replace(TEMPLATE_END_MARKER, '')
  .trim();
}

// Сборка
fs.mkdirSync(DIST_DIR, { recursive: true });

const latestTemplateFile = getLatestTemplateFile();
console.log(`📦 Используется шаблон: ${latestTemplateFile}`);

const templateCode = extractTemplate(latestTemplateFile);

const files = fs.readdirSync(SRC_DIR).filter(f => f.endsWith('.js'));

files.forEach(filename => {
  const srcPath = path.join(SRC_DIR, filename);
  const content = fs.readFileSync(srcPath, 'utf-8');

  const newContent = content.replace(
    new RegExp(`${TEMPLATE_INSERT_START}[\\s\\S]*?${TEMPLATE_INSERT_END}`, 'm'),
    `${TEMPLATE_INSERT_START}\n${templateCode}\n${TEMPLATE_INSERT_END}`
  );

  const distPath = path.join(DIST_DIR, filename.replace('.js', '_fin.js'));
  fs.writeFileSync(distPath, newContent);
  console.log(`✅ Обновлён: ${distPath}`);
});
