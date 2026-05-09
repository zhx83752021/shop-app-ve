const fs = require('fs');
const path = require('path');
const viewsDir = 'e:/shop-app-ve/frontend/src/views';
const files = fs.readdirSync(viewsDir).filter(f => f.endsWith('.vue'));
let count = 0;
files.forEach(file => {
  const filePath = path.join(viewsDir, file);
  let content = fs.readFileSync(filePath, 'utf8');
  if (['Layout.vue', 'HomePage.vue', 'CartPage.vue', 'ProfilePage.vue', 'DiscoverPage.vue'].includes(file)) return;
  const regex = /<template>\s*<div\s+class=\"([^\"]*max-w-md\s+mx-auto[^\"]*)\"/;
  const match = content.match(regex);
  if (match) {
    let classes = match[1];
    if (!classes.includes('w-full')) {
      let newClasses = 'w-full ' + classes;
      content = content.replace(classes, newClasses);
      fs.writeFileSync(filePath, content);
      count++;
      console.log('Fixed ' + file);
    }
  }
});
console.log('Total fixed: ' + count);
