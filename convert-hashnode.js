const fs = require('fs');
const path = require('path');

// Read the Hashnode export
const exportPath = path.join(__dirname, 'hashnode', 'export-articles.json');
const data = JSON.parse(fs.readFileSync(exportPath, 'utf8'));

// Get the first post (index 0)
const post = data.posts[0];

// Extract relevant fields
const { title, dateAdded, brief, slug, contentMarkdown } = post;

// Create the blog directory
const blogDir = path.join(__dirname, 'blog', slug);
if (!fs.existsSync(blogDir)) {
  fs.mkdirSync(blogDir, { recursive: true });
}

// Generate YAML frontmatter
const frontmatter = `---
title: ${title}
date: "${dateAdded}"
description: ${brief}
tags:
---
`;

// Combine frontmatter + content
const markdown = frontmatter + '\n' + contentMarkdown;

// Write the markdown file
const indexPath = path.join(blogDir, 'index.md');
fs.writeFileSync(indexPath, markdown, 'utf8');

console.log(`✓ Created: ${indexPath}`);
console.log(`  Title: ${title}`);
console.log(`  Date: ${dateAdded}`);
console.log(`  Slug: ${slug}`);
