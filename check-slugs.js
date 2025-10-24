#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Get all blog post slugs from directory structure
const blogDir = path.join(__dirname, 'blog');
const blogSlugs = fs.readdirSync(blogDir)
  .filter(file => fs.statSync(path.join(blogDir, file)).isDirectory())
  .map(dir => dir);

console.log(`Found ${blogSlugs.length} blog posts in /blog directory\n`);
console.log('Blog slugs:');
blogSlugs.forEach(slug => console.log(`  - ${slug}`));

// Get all slugs from Hashnode export
const hashnodeFile = path.join(__dirname, 'hashnode', 'export-articles.json');
const hashnodeData = JSON.parse(fs.readFileSync(hashnodeFile, 'utf8'));
const hashnodeSlugs = hashnodeData.posts.map(post => post.slug).filter(Boolean);

console.log(`\n\nFound ${hashnodeSlugs.length} articles in Hashnode export\n`);
console.log('Hashnode slugs:');
hashnodeSlugs.forEach(slug => console.log(`  - ${slug}`));

// Find matching slugs
const matching = blogSlugs.filter(slug => hashnodeSlugs.includes(slug));
const onlyInBlog = blogSlugs.filter(slug => !hashnodeSlugs.includes(slug));
const onlyInHashnode = hashnodeSlugs.filter(slug => !blogSlugs.includes(slug));

console.log(`\n\n=== SUMMARY ===`);
console.log(`Matching slugs: ${matching.length}`);
if (matching.length > 0) {
  console.log('  Matches:');
  matching.forEach(slug => console.log(`    - ${slug}`));
}

console.log(`\nOnly in blog directory: ${onlyInBlog.length}`);
if (onlyInBlog.length > 0) {
  onlyInBlog.forEach(slug => console.log(`  - ${slug}`));
}

console.log(`\nOnly in Hashnode export: ${onlyInHashnode.length}`);
if (onlyInHashnode.length > 0) {
  onlyInHashnode.forEach(slug => console.log(`  - ${slug}`));
}
