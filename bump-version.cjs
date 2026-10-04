const fs = require('fs');

const version = '0.3.0';

const files = [
  'package.json',
  'aws-helpers/package.json',
  'common/package.json',
  'errors/package.json',
  'event-manager/package.json',
  'interfaces/package.json',
  'logger/package.json',
  'types/package.json',
  'types-extends/package.json',
  'utils/package.json'
];

for(const file of files) {
  if (fs.existsSync(file)) {
    const data = JSON.parse(fs.readFileSync(file, 'utf8'));
    data.version = version;
    if (data.dependencies) {
      for (const dep in data.dependencies) {
        if (dep.startsWith('@node-yalc/')) {
           data.dependencies[dep] = 'workspace:*';
        }
      }
    }
    fs.writeFileSync(file, JSON.stringify(data, null, 2) + '\n');
  }
}
console.log('Bumped node-yalc packages to ' + version);
