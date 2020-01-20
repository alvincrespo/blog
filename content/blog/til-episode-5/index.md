---
title: TIL - Episode 5. Fetching local data with GatsbyJS.
date: "2019-12-29T07:20:00.000Z"
description: Presenting local data in your GatbsyJS site is simple once you know how sourcing and querying data works within the GatsbyJS plugin echosystem.
tags: gatsbyjs,sourcing data,querying data
---

Update: If you're looking for code, checkout the testimonials history for my personal site [here](https://github.com/alvincrespo/groggy/pulls?utf8=%E2%9C%93&q=is%3Apr+is%3Aclosed+testimonial).

Today I was working on getting testimonials on my personal site, to do this I had to learn about
["sourcing"](https://www.gatsbyjs.org/docs/recipes/sourcing-data), ["transforming"](https://www.gatsbyjs.org/docs/recipes/transforming-data) and ["querying"](https://www.gatsbyjs.org/docs/recipes/querying-data) data in GatsbyJs. It took a couple of steps, but I was eventually able to get to a point where I could manage this data as a separate file.

The [first step](https://github.com/alvincrespo/groggy/commit/cb561b043384a3dac6319ada17456e0c06dc9f57) in this process was following along in the ["Sourcing Data"](https://www.gatsbyjs.org/docs/recipes/sourcing-data) guide.

The TL;DR here is that we use the [`sourceData`](https://www.gatsbyjs.org/docs/node-apis/#sourceNodes) Gatsby Node API to manually create some data that can be queried. We use this method along with [`createNode`](https://www.gatsbyjs.org/docs/actions/#createNode) to add a node to the data.

Sample code:

```javascript
// gatsby-node.js

exports.sourceNodes = ({ actions, createNodeId, createContentDigest }) => {
  const testimonials = [
    { cite: "Some Author", quote: "Some Quote" },
    { cite: "Some Author 2", quote: "Some Quote 2" },
  ]

  testimonials.forEach(testimonial => {
    const node = {
      cite: testimonial.cite,
      quote: testimonial.quote,
      id: createNodeId(`Testimonial-${testimonial.cite}`),
      internal: {
        type: "Testimonial",
        contentDigest: createContentDigest(testimonial),
      },
    }
    actions.createNode(node)
  })
}
```

```javascript
// src/pages/testimonials.js

import React from "react"
import { graphql } from "gatsby"

const Testimonials = ({ data }) => {
  const {
    allTestimonial: { nodes: testimonials },
  } = data;

  return (
    {testimonials.map(t => (
        <blockquote
          cite={t.cite}
          dangerouslySetInnerHTML={{ __html: t.quote }}
        ></blockquote>
    ))}
  );
}

export const query = graphql`
  query {
    allTestimonial {
      nodes {
        id
        cite
        quote
      }
    }
  }
`
```

The [second step](https://github.com/alvincrespo/groggy/commit/ce1ec1ebd775dd6fa2ef8e123b7a92d785e5b9b9) in the process is moving this data outside to a file. To do that we need to [source](https://www.gatsbyjs.org/docs/recipes/sourcing-data) some files and then [transform](https://www.gatsbyjs.org/docs/recipes/transforming-data) them.

A sourcing plugin "fetch[es] data from their source".

A transformer plugin essentially "take[s] data fetched using source plugins, and process it into something more usable".

For my purpose, I went with [`gatsby-source-filesystem`](https://www.gatsbyjs.org/packages/gatsby-source-filesystem/) and [`gatsby-transformer-json`](https://www.gatsbyjs.org/packages/gatsby-transformer-json/).

Sample code:

```shell
yarn add gatsby-transformer-json gatsby-source-filesystem
```

```javascript
// gatsby-config.js

`gatsby-transformer-json`,
{
  resolve: `gatsby-source-filesystem`,
  options: {
    name: `data`,
    path: `${__dirname}/src/data`,
    ignore: [`**/\.*`], // ignore files starting with a dot
  },
},
```

```javascript
// src/pages/testimonials.js

export const query = graphql`
  query {
    allTestimonialsJson {
      edges {
        node {
          id
          cite
          quote
        }
      }
    }
  }
```

🎉🎉🎉 We have a nice GraphQL implementation of fetching testimonials!

Alright! Thank you for reading my learnings from today. Did you learn something new? Anything here
that I got wrong or can improve on? Let me know at [@alvincrespo](https://twitter.com/alvincrespo).

Cheers!
