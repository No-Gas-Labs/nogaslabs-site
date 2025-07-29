function main() {
  const lines = [
    'Freedom starts with zero gas fees.',
    'Imagine blockchain for all.',
    'America\'s Got Problems — let\'s fix them.'
  ];
  console.log(lines[Math.floor(Math.random()*lines.length)]);
}
if (require.main === module) main();
