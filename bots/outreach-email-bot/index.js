const fs = require('fs');
function main() {
  const txt = fs.readFileSync('../../OUTREACH_LOG.md', 'utf8');
  console.log('loaded templates', txt.length);
  // TODO: send emails
}
if (require.main === module) main();
