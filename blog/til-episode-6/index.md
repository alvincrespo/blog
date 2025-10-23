---
title: TIL - Episode 6. Setting up Vue and Storybook.
date: "2019-12-30T07:21:00.000Z"
description: Curious how you can go about setting up your Vue app with Storybook? Let me show you how easy it is.
tags: vuejs,vue,storybook,javascript
---

Today I was working on a project with a fairly complex development process. It was taking me
longer than I wanted to develop a feature, so I bypassed the current process in favor of
isolating the development of my component using [Storybook](https://storybook.js.org/).

If you're not familiar with Storybook, check it out! It's a way of developing your
components in isolation of your app code.

Anyways, let's cut to the chase.

To get up and running quickly, all you need to do is run:

```shell
npx -p @storybook/cli sb init --type vue
```

This will essentially get you up and going quickly. If you run into any issues, you can
follow their manual guid [here](https://storybook.js.org/docs/guides/guide-vue/#manual-setup).

Once you have everything installed and set up, you can run:

```shell
npm run storybook
```

This will run storybook's server, so you can start checking out your components quickly.

To write a story, you can basically write the following:

```javascript
// stories/MyComponent.stories.js

import Vue from "vue"

// The component to be tested
import MyComponent from "../src/components/my-component"

// Import  and initialize any nested components
import MyNestedComponent from "../src/components/my-nested-component"

Vue.component("MyNestedComponent", MyNestedComponent)

export default {
  title: "My Component",
}

// Data to be passed to component
const params = { query: { page: 1 } }

export const base = () => ({
  components: { MyComponent },
  template: '<my-component :params="params" @change="update"></my-component>',
  props: {
    params: {
      default: params,
    },
  },
  methods: {
    update: function() {
      console.log("Update")
    },
  },
})
```

🎉🎉🎉 We have a story!

**Bonus Round!**

Do you use SASS in your project? Easy peasy.

First, create a `webpack.config.js` file:

```javascript
// .storybook/webpack.config.js

module.exports = async ({ config, mode }) => {}
```

Next, create a rule to scan for .scss files and use the appropriate loaders:

```javascript
const path = require("path")

module.exports = async ({ config, mode }) => {
  config.module.rules.push({
    test: /\.scss$/,
    use: ["style-loader", "css-loader", "sass-loader"],
    include: path.resolve(__dirname, "../"),
  })

  return config
}
```

Finally, import your main.scss file in your story:

```javascript
// stories/MyComponent.stories.js

import Vue from "vue"
import MyComponent from "../src/components/my-component"

export default {
  title: "My Component",
}

export const base = () => ({
  components: { MyComponent },
  template: "<my-component></my-component>",
})
```

🎆🎆🎆 Now your components will look oh so sweeeet!

Alright! Thank you for reading my learnings from today. Did you learn something new? Anything here
that I got wrong or can improve on? Let me know at [@alvincrespo](https://twitter.com/alvincrespo).

Cheers!
