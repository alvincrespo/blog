---
title: TIL - Episode 7. Utilizing Vue watchers for async data.
date: "2019-12-31T20:00:00.000Z"
description: "Today I was trying to figure out why a passed in prop that I was setting on data for a component wasn't being set. Check this out: // my-component.vue  export default {   props: [\"rating\"],   data() {     return {       rating: this.rating,     }   }..."
tags:
---


Today I was trying to figure out why a passed in prop that I was setting on data for a component wasn't being set.

Check this out:

```javascript
// my-component.vue

export default {
  props: ["rating"],
  data() {
    return {
      rating: this.rating,
    }
  },
  computed: {
    normalizedRating: function() {
      return this.rating * 100
    },
  },
}
```

At first glance, this looks great right? Well, not necessarily. It depends on **rating** is being loaded.

If it's an asynchronous call to your API - this code won't work. When the component is mounted, `this.rating` will be undefined.

To fix this, we need to add a watcher:

```javascript
// my-component.vue

export default {
  props: ["rating"],
  data() {
    return {
      rating: this.rating,
    }
  },
  watch: {
    rating: {
      deep: false,
      handler(val) {
        this.rating = val
      },
    },
  },
  computed: {
    normalizedRating: function() {
      return this.rating * 100
    },
  },
}
```

🎆 It now works! This is because when the parent component finally loads in the rating - our component will react to it.

So, whats a watcher anyways?

> Watch an expression or a computed function on the Vue instance for changes.
>
> [vm.\$watch](https://vuejs.org/v2/api/#vm-watch) API

TL;DR - the handler will get called when this value changes.

The guide states:

> In this case, using the watch option allows us to perform an asynchronous operation (accessing an API), limit how often we perform that operation, and set intermediary states until we get a final answer.
>
> [Watchers Guide](https://vuejs.org/v2/guide/computed.html)

Alright! Thank you for reading my learnings from today. Did you learn something new? Anything here
that I got wrong or can improve on? Let me know at [@alvincrespo](https://twitter.com/alvincrespo).

Cheers!
