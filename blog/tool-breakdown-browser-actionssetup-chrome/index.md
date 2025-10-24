---
title: Tool Breakdown: browser-actions/setup-chrome
date: "2025-01-20T18:43:56.205Z"
description: "In this new series, \"Tool Breakdown\", I'm walking through the core mechanics of the tools I use in various projects. I'm starting with a deep dive into a critical component of the browser-actions/setup-chrome Github action. After encountering version..."
tags:
---

In this new series, "Tool Breakdown", I'm walking through the core mechanics of the tools I use in various projects. I'm starting with a deep dive into a critical component of the [`browser-actions/setup-chrome`](https://github.com/browser-actions/setup-chrome) Github action. After encountering version mismatches between Google Chrome and Chromedriver in my CI pipeline, I investigated how this tool actually works. Understanding its mechanics is particularly valuable when debugging version conflicts or customizing the installation process for specific CI/CD requirements.

This article focuses on how the tool downloads, unpacks, and installs both Chrome and its driver. If you're looking for the complete code, you can find it in the accompanying repository here: [https://github.com/alvincrespo/chrome-installer](https://github.com/alvincrespo/chrome-installer).

## A simple bash script

Before we examine the Github action's implementation, let's look at a bash script that performs the same core operations. This script demonstrates the fundamental process for downloading and installing Google Chrome on Ubuntu/Debian-based systems.

```bash
#!/bin/bash

cd /tmp

# Create tmp directory to hold .deb file
mkdir -p /tmp/deb-LGbDgE && cd /tmp/deb-LGbDgE

# Retrieve the stable .deb file and name it google-chrome.deb
wget https://dl.google.com/linux/direct/google-chrome-stable_current_amd64.deb -O google-chrome.deb

# Extract the contents of the .deb file
# ar is a utility specifically designed to work with Debian packages
ar x google-chrome.deb

# Create tmp directory to hold the extracted contents fo the data.tar.xz file
mkdir -p /tmp/chrome-Epds2F && cd /tmp/chrome-Epds2F

# Extracts the contents of data.tar.xz
tar -xf /tmp/deb-LGbDgE/data.tar.xz --directory /tmp/chrome-Epds2F --strip-components 4 ./opt/google

# verify chrome version
./chrome --version
```

The installation process follows three main steps:

1. Download the stable Google Chrome Debian package. This package contains everything needed for a complete Chrome installation.
    
2. Extract the data.tar.xz file from the downloaded Debian package using the [ar](https://manpages.debian.org/stretch/binutils/ar.1.en.html) utility. The ar utility is specifically designed for handling .deb packages and maintaining their integrity during extraction.
    
3. Extract the Google Chrome executable from data.tar.xz. This final step places the Chrome binary in a location where it can be executed directly.
    

Note that this script requires root or sudo privileges to perform system-level operations. The script also implements basic security practices by using randomly-named temporary directories and cleaning up after execution.

## A Node.js/JavaScript script

The below script is a translation of the bash script above into JavaScript, following the same strategy used in `browser-actions/setup-chrome`. This script extracts the logic in [downloadBrowser](https://github.com/browser-actions/setup-chrome/blob/master/src/channel_linux.ts#L35-L59) and [installBrowser](https://github.com/browser-actions/setup-chrome/blob/master/src/channel_linux.ts#L61-L92) and combines them so you can easily follow the strategy of downloading, extracting and installing the Google Chrome browser.

```javascript
// First, install required packages inside the container:
// npm init -y && npm pkg set type=module
// npm install @actions/tool-cache @actions/exec
//
// Then, run the script using Node.js:
// node main.js

import * as tc from '@actions/tool-cache';
import * as exec from '@actions/exec';
import fs from 'fs/promises';
import path from 'path';
import os from 'os';

// Step 1: Set up the URL for Chrome stable
const chromeUrl = 'https://dl.google.com/linux/direct/google-chrome-stable_current_amd64.deb';

// Step 2: Download Chrome
const archive = await tc.downloadTool(chromeUrl);
console.log('Downloaded Chrome to:', archive);

// Step 3: Create temporary directories
const tmpdir = await fs.mkdtemp(path.join(os.tmpdir(), 'deb-'));
const extdir = await fs.mkdtemp(path.join(os.tmpdir(), 'chrome-'));
console.log('Temporary directory:', tmpdir);
console.log('Extraction directory:', extdir);

// Step 4: Extract the .deb package using ar
await exec.exec('ar', ['x', archive], { cwd: tmpdir });

// Step 5: List contents of tmpdir to see what ar extracted
const tmpContents = await fs.readdir(tmpdir);
console.log('Contents after ar extraction:', tmpContents);

// Step 6: Extract data.tar.xz using tar
await exec.exec('tar', [
    '-xf',
    path.join(tmpdir, 'data.tar.xz'),
    '--directory',
    extdir,
    '--strip-components',
    '4',
    './opt/google'
]);

// Step 7: List the extracted Chrome files
const chromeFiles = await fs.readdir(extdir);
console.log('Extracted Chrome files:', chromeFiles);

// Step 8: Remove the google-chrome symlink (if it exists)
try {
    await fs.unlink(path.join(extdir, 'google-chrome'));
    console.log('Removed google-chrome symlink');
} catch (error) {
    console.log('No symlink to remove or error:', error.message);
}

// Step 9: Examine the final structure
const finalFiles = await fs.readdir(extdir);
console.log('Final Chrome installation files:', finalFiles);
```

Similar to our bash implementation, this Node.js script follows the same three core steps:

1. Download the stable Debian package using the `@actions/tool-cache` utility
    
2. Extract the Debian package using the `ar` utility
    
3. Extract the Google Chrome executable from the resulting data.tar.xz file
    

While this JavaScript implementation may appear more verbose than its bash counterpart, it offers significant advantages in terms of maintainability and extensibility. The `browser-actions/setup-chrome` action leverages these benefits to:

* Detect and adapt to different operating systems dynamically
    
* Map dependencies based on the target operating system
    
* Handle version resolution and compatibility checks
    
* Provide detailed logging and error handling
    
* Implement cleanup and security measures
    

## Conclusion and Followup

In this article, we've explored the fundamental approach to downloading and installing Google Chrome through both bash and Node.js implementations. These examples demonstrate the core functionality that powers the `browser-actions/setup-chrome` GitHub action. By understanding these mechanics, you're better equipped to debug version conflicts and customize the installation process for your specific needs. This exploration also illustrates a broader principle in software development: examining source code not only resolves immediate technical challenges but often reveals valuable insights into software architecture and implementation patterns.

In the next article, we’ll go through and look at how the driver itself is also installed and verifying that the driver and chrome version match. Until then, If you have any questions or need clarification, feel free to [**reach out**](https://docs.google.com/forms/d/e/1FAIpQLSd3FJbsjj8kqY3HF2HixnwsNQ2VyQYQNomasGQBIq0r6FAMJQ/viewform)!