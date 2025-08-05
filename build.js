const fs = require('fs');
const path = require('path');

const TEMPLATE_FILE = './templateVK0.js';
const TEMPLATE_START_MARKER = '// === PART START ===';
const TEMPLATE_END_MARKER = '// === PART END ===';

const INSERTION_START = '// === TEMPLATE START ===';
const INSERTION_END = '// === TEMPLATE END ===';

const SRC_DIR = './src';
const DIST_DIR = './build';
const FILE_SUFFIX = '_fin';

const files = fs.readdirSync(SRC_DIR).filter(file => file.endsWith('.js'));

// 1. Чтение и извлечение шаблона
const fullTemplate = fs.readFileSync(TEMPLATE_FILE, 'utf-8');

const templateRegex = new RegExp(
  `${TEMPLATE_START_MARKER}[\\s\\S]*?${TEMPLATE_END_MARKER}`,
  'gm'
);

const match = fullTemplate.match(templateRegex);

if (!match) {
  console.error('❌ Не найдены маркеры в template.js');
  process.exit(1);
}

// Обрезаем маркеры, чтобы не вставлять их
const templateCode = match[0]
.replace(TEMPLATE_START_MARKER, '')
.replace(TEMPLATE_END_MARKER, '')
.trim();

files.forEach(filename => {
  const filePath = path.join(SRC_DIR, filename);
  let fileContent = fs.readFileSync(filePath, 'utf-8');

  const insertionRegex = new RegExp(
    `${INSERTION_START}[\\s\\S]*?${INSERTION_END}`,
    'gm'
  );

  if (fileContent.match(insertionRegex)) {
    // Вставляем шаблон **без оборачивающих комментариев**
    fileContent = fileContent.replace(insertionRegex, templateCode);
  } else {
    console.warn(`⚠️ Маркеры вставки не найдены в ${filename}`);
    return;
  }

  // Создаём новое имя: acc1.js → acc1_fin.js
  const parsed = path.parse(filename);
  const newFileName = `${parsed.name}${FILE_SUFFIX}${parsed.ext}`;
  const outputPath = path.join(DIST_DIR, newFileName);

  fs.writeFileSync(outputPath, fileContent, 'utf-8');
  console.log(`✅ Файл ${filename} → ${newFileName}`);
});
