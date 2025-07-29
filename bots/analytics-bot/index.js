const fs = require('fs');
function main() {
  const entry = `| ${new Date().toISOString().slice(0,10)} | test | 1 | tx123 | bot |`;
  fs.appendFileSync('../../REVENUE.md', `\n${entry}`);
  console.log('appended revenue event');
}
if (require.main === module) main();
