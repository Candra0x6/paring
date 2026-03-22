const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, 'components/ui');

fs.readdirSync(dir).forEach(file => {
  if (file.endsWith('.tsx')) {
    const filePath = path.join(dir, file);
    let content = fs.readFileSync(filePath, 'utf8');
    if (!content.includes('"use client"') && !content.includes("'use client'")) {
      content = '"use client";\n\n' + content;
      fs.writeFileSync(filePath, content);
      console.log(`Added use client to ${file}`);
    }
  }
});
