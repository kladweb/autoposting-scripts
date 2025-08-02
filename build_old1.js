const fs = require('fs');
const path = require('path');

const TEMPLATE_FILE = './template.js';
const TEMPLATE_START_MARKER = '// === PART START ===';
const TEMPLATE_END_MARKER = '// === PART END ===';

const INSERTION_START = '// === TEMPLATE START ===';
const INSERTION_END = '// === TEMPLATE END ===';

const files = [
  'VK0.js',
];

// 1. Извлекаем часть из template.js
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

// Обрезаем сами маркеры, чтобы не вставлять их в результат
const templateCode = match[0]
.replace(TEMPLATE_START_MARKER, '')
.replace(TEMPLATE_END_MARKER, '')
.trim();

files.forEach(filename => {
  const filePath = path.join('./src', filename);
  let fileContent = fs.readFileSync(filePath, 'utf-8');

  const insertionRegex = new RegExp(
    `${INSERTION_START}[\\s\\S]*?${INSERTION_END}`,
    'gm'
  );

  const newBlock = `${INSERTION_START}\n${templateCode}\n${INSERTION_END}`;

  if (fileContent.match(insertionRegex)) {
    fileContent = fileContent.replace(insertionRegex, newBlock);
  } else {
    console.warn(`⚠️ Маркеры вставки не найдены в ${filename}`);
    return;
  }

  const outputPath = path.join('./dist', filename);
  fs.writeFileSync(outputPath, fileContent, 'utf-8');
  console.log(`✅ Обновлён файл: ${filename}`);
});
