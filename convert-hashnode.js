const fs = require('fs');
const path = require('path');
const https = require('https');

// Read the Hashnode export
const exportPath = path.join(__dirname, 'hashnode', 'export-articles.json');
const data = JSON.parse(fs.readFileSync(exportPath, 'utf8'));

// Get the first post (index 0)
const post = data.posts[0];

// Extract relevant fields
let { title, dateAdded, brief, slug, contentMarkdown, coverImage } = post;

// Sanitize description: remove newlines and escape quotes
const description = brief.replace(/\n/g, ' ').replace(/"/g, '\\"');

// Fix Hashnode image format: remove align="center" attribute
let fixedContent = contentMarkdown.replace(/ align="center"/g, '');

// Create the blog directory
const blogDir = path.join(__dirname, 'blog', slug);
if (!fs.existsSync(blogDir)) {
  fs.mkdirSync(blogDir, { recursive: true });
}

// Helper function to download image
function downloadImage(url, filepath) {
  return new Promise((resolve, reject) => {
    https.get(url, (response) => {
      // Handle redirects
      if (response.statusCode === 301 || response.statusCode === 302) {
        downloadImage(response.headers.location, filepath).then(resolve).catch(reject);
        return;
      }

      if (response.statusCode !== 200) {
        reject(new Error(`HTTP ${response.statusCode}: ${url}`));
        return;
      }

      const fileStream = fs.createWriteStream(filepath);
      response.pipe(fileStream);

      fileStream.on('finish', () => {
        fileStream.close();
        resolve();
      });

      fileStream.on('error', reject);
    }).on('error', reject);
  });
}

// Extract image filename hash from URL
function extractHash(url) {
  const match = url.match(/\/([a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12})\.(png|jpg|jpeg|gif|webp)/i);
  if (match) {
    return `${match[1]}.${match[2]}`;
  }
  return null;
}

// Download images
async function processImages() {
  // Extract content images from markdown
  const imageRegex = /!\[\]\((https:\/\/cdn\.hashnode\.com[^\)]+)\)/g;
  const matches = [...fixedContent.matchAll(imageRegex)];

  for (const match of matches) {
    const url = match[1];
    const filename = extractHash(url);

    if (!filename) {
      console.warn(`  ⚠ Could not extract hash from: ${url}`);
      continue;
    }

    const filepath = path.join(blogDir, filename);

    // Skip if already exists
    if (fs.existsSync(filepath)) {
      console.log(`  ✓ Image already exists: ${filename}`);
    } else {
      try {
        await downloadImage(url, filepath);
        console.log(`  ✓ Downloaded: ${filename}`);
      } catch (err) {
        console.error(`  ✗ Failed to download ${filename}: ${err.message}`);
      }
    }

    // Replace CDN URL with relative path
    fixedContent = fixedContent.replace(url, `./${filename}`);

    // Add small delay between downloads (200ms)
    await new Promise(resolve => setTimeout(resolve, 200));
  }

  // Download cover image
  if (coverImage) {
    const coverUrl = coverImage;
    const extMatch = coverUrl.match(/\.(png|jpg|jpeg|gif|webp)(\?|$)/i);
    const coverExt = (extMatch && extMatch[1]) || 'jpeg';
    const coverFilename = `cover.${coverExt}`;
    const coverPath = path.join(blogDir, coverFilename);

    if (fs.existsSync(coverPath)) {
      console.log(`  ✓ Cover image already exists: ${coverFilename}`);
    } else {
      try {
        await downloadImage(coverUrl, coverPath);
        console.log(`  ✓ Downloaded cover: ${coverFilename}`);
      } catch (err) {
        console.error(`  ✗ Failed to download cover: ${err.message}`);
      }
    }
  }
}

// Main async function
async function main() {
  try {
    // Download images first
    await processImages();

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

    console.log(`\n✓ Created: ${indexPath}`);
    console.log(`  Title: ${title}`);
    console.log(`  Date: ${dateAdded}`);
    console.log(`  Slug: ${slug}`);
  } catch (err) {
    console.error(`✗ Error: ${err.message}`);
    process.exit(1);
  }
}

main();
