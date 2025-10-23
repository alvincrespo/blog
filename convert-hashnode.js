const fs = require('fs');
const path = require('path');

// Read the Hashnode export
const exportPath = path.join(__dirname, 'hashnode', 'export-articles.json');
const data = JSON.parse(fs.readFileSync(exportPath, 'utf8'));

// Get the first post (index 0)
const post = data.posts[0];

// Extract relevant fields
let { title, dateAdded, brief, slug, contentMarkdown } = post;

// Sanitize description: remove newlines and escape quotes
const description = brief.replace(/\n/g, ' ').replace(/"/g, '\\"');

// Fix Hashnode image format: remove align="center" attribute
const fixedContent = contentMarkdown.replace(/ align="center"/g, '');

// Create the blog directory
const blogDir = path.join(__dirname, 'blog', slug);
if (!fs.existsSync(blogDir)) {
  fs.mkdirSync(blogDir, { recursive: true });
}

// Generate YAML frontmatter
const frontmatter = `---
title: ${title}
date: "${dateAdded}"
description: "${description}"
tags:
---
`;

// Combine frontmatter + content
const markdown = frontmatter + '\n' + fixedContent;

// Write the markdown file
const indexPath = path.join(blogDir, 'index.md');
fs.writeFileSync(indexPath, markdown, 'utf8');

console.log(`✓ Created: ${indexPath}`);
console.log(`  Title: ${title}`);
console.log(`  Date: ${dateAdded}`);
console.log(`  Slug: ${slug}`);
