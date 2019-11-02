---
title: Fixing image orientation on mobile camera uploads
date: "2019-11-02T06:54:00.000Z"
description: Ever run into an issue trying to fix image orientation when uploading an image that was taken with the camera on a mobile device directly? Yeah, I ran into this issue this week...not fun.
tags: javascript,exif,orientation,mobile
---

Ever run into an issue trying to fix image orientation when uploading an image that was taken with the camera on a mobile device directly Yeah, I ran into this issue this week...not fun.

After doing some research this week around the issue, I found a pretty simple solution using [`blueimp-load-image`](https://www.npmjs.com/package/blueimp-load-image) package. This package handles a bunch of issues related to handling images that are taken using the camera and directly uploaded to your web app.

So let's start with understanding the issue.

## The problem

The only time you run into this specific issue is when a user tries to upload a photo taken during the user experience. The story is usually:

- User visits app
- User clicks "upload image"
- User selects camera on phone
- User takes picture
- User confirms this is the picture they want to use

If you create the image blob and set it to the source of an `<img>` then you get an incorrect orientation of that image.

In my case, if I took the photo vertically - then it would appear sideways on the page.

## Background on the issue

TL;DR - browsers don't handle the EXIF data provided by the phone.

For more information you can check out this excellent resources:

[EXIF Orientation Handling Is a Ghetto](https://www.daveperrett.com/articles/2012/07/28/exif-orientation-handling-is-a-ghetto/)

[JS Client-Side Exif Orientation: Rotate and Mirror JPEG Images](https://stackoverflow.com/questions/20600800/js-client-side-exif-orientation-rotate-and-mirror-jpeg-images)

[Handle image rotation on mobile](https://medium.com/wassa/handle-image-rotation-on-mobile-266b7bd5a1e6)

## How does [blueimp-load-image](https://www.npmjs.com/package/blueimp-load-image) address the issue

[Sebastian](https://github.com/blueimp) has done an excellent job at taking the EXIF data and auto handling these scenarios for you.

For example, `Orientation` is figured out through the exif-map functionality [here](https://github.com/blueimp/JavaScript-Load-Image/commit/f4d13a35879add68013300ab92888954363c711).

On top of figuring this out for you, they have provided an easy to use [API](https://github.com/blueimp/JavaScript-Load-Image/blob/455a28c68dc1cd1046e8c458cc0f5027ed7ac03f/test/test.js#L564-L572).

## Usage Example

First, install the package:

```shell
yarn add blueimp-load-image
```

Next, import the package int your JS:

```javascript
import loadImage from "blueimp-load-image"
```

Finally, to ensure orientation is fixed:

```javascript
const handleFileChange = ({ target: { files } }) => {
  const file = files.item(0)

  loadImage(
    file,
    img => {
      document.getElementById("uploaded-image").appendChild(img)
    },
    { maxWidth: 125, orientation: true }
  )
}
```

Note that I'm setting `orientation` to `true`as part `loadImage`'s 2nd parameter object. I've also included a `maxWidth` of 125 for my use case. For more options, check out the docs [here](https://github.com/blueimp/JavaScript-Load-Image#options).

<hr>

Alright folks, that's all I have for today. If you found this helpful, have feedback or are interested in a quick chat - hit me up at <a href="https://twitter.com/alvincrespo" target="_blank" rel="noopener noreferrer">@alvincrespo</a>.
