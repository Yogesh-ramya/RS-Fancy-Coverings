import { execSync } from 'child_process';
import process from 'process';

try {
  // 1. Add all changes
  execSync('git add .');

  // 2. Get the list of changed files
  const status = execSync('git status --porcelain').toString();
  
  if (!status.trim()) {
    console.log('No changes to sync.');
    process.exit(0);
  }

  // Extract filenames and clean them up
  const files = status.split('\n')
    .filter(line => line.trim())
    .map(line => {
      const parts = line.trim().split(/\s+/);
      const filePath = parts[parts.length - 1];
      return filePath.split('/').pop(); // Just the filename
    })
    .filter((v, i, a) => a.indexOf(v) === i) // Unique
    .slice(0, 5) // Limit to first 5 files
    .join(', ');

  const message = `Update: ${files}${status.split('\n').filter(l => l.trim()).length > 5 ? '...' : ''}`;

  // 3. Commit and Push
  console.log(`\n🚀 Committing changes: "${message}"`);
  execSync(`git commit -m "${message}"`, { stdio: 'inherit' });
  
  console.log('📤 Pushing to GitHub...');
  execSync('git push', { stdio: 'inherit' });
  
  console.log('\n✅ Successfully synced!');
} catch (error) {
  console.error('\n❌ Sync failed:', error.message);
  process.exit(1);
}
