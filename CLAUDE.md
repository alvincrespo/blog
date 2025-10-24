# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a **content-first blog repository** containing 24 published blog posts. As of the latest simplification (commit 92220e9), the repository has been stripped of all build infrastructure and now contains only:
- Pure Markdown blog post files with YAML frontmatter
- Associated images and assets
- Full Git history

This design decouples content from any specific presentation framework, making the blog portable and framework-agnostic.

## Repository Structure

```
blog/                    # 24 blog post directories
├── post-slug-name/
│   ├── index.md        # Markdown with YAML frontmatter (title, date, description, tags)
│   └── *.png/jpg       # Associated images (co-located with post)
├── aws-setting-up-a-vpc-from-scratch/
├── til-episode-1/ through til-episode-7/  # TIL (Today I Learned) series
├── ... [other posts]

hashnode/               # Hashnode export archive
└── export-articles.json

LICENSE                 # MIT License (2025)
README.md               # (Currently minimal)
.gitignore            # Standard Node.js/.gatsby patterns
```

## Key Architectural Patterns

### Content Format
Each blog post uses standard Markdown with YAML frontmatter:
```yaml
---
title: Post Title
date: "YYYY-MM-DDTHH:mm:ss.000Z"
description: Brief description for metadata
tags: tag1,tag2,tag3
---

# Markdown content follows...
```

### Asset Co-location
Images and supporting files are stored in the same directory as the blog post's `index.md`. This keeps related content together and simplifies linking (e.g., `![alt text](./image.png)`).

### Framework Independence
There are no build scripts, compilation steps, or framework-specific configuration. The blog is ready to be built with any static site generator (Next.js, Hugo, Jekyll, Astro, etc.) or custom solution.

## Development Commands

### No Current Build/Dev Setup
Since the Gatsby build infrastructure has been removed, there are currently **no npm scripts or build commands** to run. The repository is pure content.

If you need to rebuild the blog with a framework, here are the previous dependencies (now removed):
- **Gatsby.js** (v2.32.12) - Used `gatsby develop` and `gatsby build`
- **Tailwind CSS** - PostCSS-based styling
- **Prettier** - Code formatting

### Adding New Content
To add a new blog post:
1. Create a new directory in `/blog/` with a URL-friendly slug name
2. Add `index.md` with YAML frontmatter (title, date, description, tags)
3. Add associated images to the same directory
4. Commit and push

## Content Topics

The blog covers topics across:
- **Infrastructure & DevOps:** AWS, VPC setup, PostgreSQL, Heroku, CircleCI
- **Serverless:** Serverless Framework setup and deployments
- **Frontend:** React, component management, CSS
- **Backend:** Ruby on Rails
- **Meta:** Technology choices, testing philosophy
- **TIL Series:** "Today I Learned" episodic posts on various technical challenges

## Important Notes

1. **No Tests:** There is no testing infrastructure in this repository.
2. **No Linting:** All code formatting and linting configuration has been removed.
3. **Hashnode Archive:** The `hashnode/` directory contains an export of articles, possibly for backup or multi-platform publishing purposes.
4. **Git as Source of Truth:** The full commit history (starting from very early commits) serves as the version control and archive for all content changes.

## Future Rebuild Considerations

If rebuilding the blog with a framework:
- Previous stack used Gatsby + React + Tailwind CSS
- Remark/MDX ecosystem was used for Markdown processing and syntax highlighting
- Images were optimized through Gatsby Image and gatsby-transformer-sharp
- Consider using Next.js + MDX or Astro as modern alternatives
