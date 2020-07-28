---
title: Hooking up DatoCMS and Gatsby.js
date: "2020-07-27T06:54:00.000Z"
description:
tags: gatsbyjs,datocms,jamstack,javascript
---

Want to ship landing pages easily? Cool. Let's do it.

Today, I'm going to show you how to use [DatoCMS](https://www.datocms.com/) to manage your content and [Gatsby.js](https://www.gatsbyjs.org/) to run it.

<h1 id="prerequisites">Prerequisites</h1>

Here's what you need to be familiar with:

- <a href="https://javascript.info/" target="_blank" rel="noopener noreferrer">JavaScript</a> (obviously)
- <a href="https://blog.hubspot.com/blog/tabid/6307/bid/7969/what-is-a-cms-and-why-should-you-care.aspx" target="_blank" rel="noopener noreferrer">CMS Concepts</a>
- <a href="https://www.gatsbyjs.org/docs/" target="_blank" rel="noopener noreferrer">Gatsby.js</a>
- <a href="https://reactjs.org/" target="_blank" rel="noopener noreferrer">React</a>
- <a href="https://graphql.org/" target="_blank" rel="noopener noreferrer">GraphQL</a>
- <a href="https://jamstack.wtf/" target="_blank" rel="noopener noreferrer">JAMStack</a>

You just need to know what these things are. You don't need to be an expert.

<h1 id="getting-started">Getting Started</h1>

A couple of things you need to do:

- <a href="https://dashboard.datocms.com/signup" target="_blank">Sign up</a> for DatoCMS
- Setup a Gatsby.js site, follow the quick start guide <a href="https://www.gatsbyjs.org/docs/quick-start/" target="_blank">here</a>

Once, you've got an account and set up your Gatsby site - go to the next section.

<h1 id="the-story">The Story</h1>

Alright, so let's start with the value proposition for why and what we're building:

> My name is Juan. I'm on the market for my next engineering role. I want to stand out in the process, instead of sending out a cover letter I'm going to create a landing page and send that with each job application.

Cool. So, we have a bunch of options out there. We can use Wix, Wordpress, etc... But - nah. We're going to use Gatsby + DatoCMS. Why?

- Cost effective (free packages on all services)
- Easy customization (more control over the code)
- Fast delivery (low learning barrier - we're going JAMStack baby!)

<h1 id="defining-the-data-model">Defining the Data Model</h1>

If you're not familiar with data modeling, I highly recommend checking out <a href="https://www.talend.com/resources/what-is-data-modeling/" target="_blank" rel="noopener noreferrer">Data Modeling: Ensuring Data You Can Trust</a>. It boils down to this:

> An effective data modelling procedure leads to better allocation of human and computational resources, anticipates issues before they arise, bolsters cross-functional communication, and enforces compliance (regulatory and internal) — all while guaranteeing underlying data quality, security, and accessibility.

We're not going to build out anything complicated, but I think this is important in general, so leaving the above in as informational material for you.

Alright - data model time. Here's the data model we're working with:

<ul>
  <li>
    <strong class="font-bold">CoverLetter</strong>
    <ul>
      <li>Attributes
        <ul>
          <li>Company Name (string)</li>
          <li>Job Title (string)</li>
          <li>Slug (string)</li>
          <li>Introduction (text / html)</li>
        </ul>
      </li>
      <li>
        Relationships
        <ul>
          <li>has many <strong class="font-bold">Skill</strong>s</li>
          <li>has many <strong class="font-bold">Frequently Asked Question</strong>s</li>
        </ul>
      </li>
    </ul>
  </li>
  <li>
    <strong class="font-bold">Frequently Asked Question</strong>
    <ul>
      <li>Attributes
        <ul>
          <li>Question (string)</li>
          <li>Answer (string)</li>
        </ul>
      </li>
    </ul>
  </li>
  <li>
    <strong class="font-bold">Icon</strong>
    <ul>
      <li>Attributes
        <ul>
          <li>Name (string)</li>
          <li>SVG (text / html)</li>
        </ul>
      </li>
    </ul>
  </li>
  <li>
    <strong class="font-bold">Skill</strong>
    <ul>
      <li>Attributes
        <ul>
          <li>Name (string)</li>
          <li>Description (text / html)</li>
        </ul>
      </li>
      <li>
        Relationships
        <ul>
          <li>has one <strong class="font-bold">Icon</strong></li>
        </ul>
      </li>
    </ul>
  </li>
</ul>

<h1 id="datocms-setting-up-models">DatoCMS - Setting up Models</h1>

So we have our data model, let's start setting these up in DatoCMS. We're going to navigate to "Settings" in the top nav and click on "Models" in the sidebar.

To move a bit faster, I'm dropping screenshots below of what these models should look like. Feel free to complete this on your end. For more information around how text fields can be displayed within DatoCMS itself and defining relationships - read the next two sections and then come back here to finish this section up.

<h2>Cover Letter</h2>

![Cover Letter](https://alvincrespo-blog.s3.us-east-2.amazonaws.com/hookingup-datocms-gatsby/Screen+Shot+2020-07-28+at+5.48.57+AM.png)

<h2>Frequently Asked Question</h2>

![Frequently Asked Question](https://alvincrespo-blog.s3.us-east-2.amazonaws.com/hookingup-datocms-gatsby/Screen+Shot+2020-07-28+at+5.49.00+AM.png)

<h2>Icon</h2>

![Icon](https://alvincrespo-blog.s3.us-east-2.amazonaws.com/hookingup-datocms-gatsby/Screen+Shot+2020-07-28+at+5.49.03+AM.png)

<h2>Skill</h2>

![Skill](https://alvincrespo-blog.s3.us-east-2.amazonaws.com/hookingup-datocms-gatsby/Screen+Shot+2020-07-28+at+5.49.06+AM.png)

<h1 id="datocms-textfield-presentations">DatoCMS - Text Field Presentations</h1>

When you select the "Multiple-paragraph text" option as a field type, you have the ability to customize how that field
looks like within DatoCMS's Content area. For example, if we go ahead and edit a "Multiple-paragraph text" field type
and hit the "Presentation" tab - we have tha bility to select an HTML Editor:

![](https://alvincrespo-blog.s3.us-east-2.amazonaws.com/hookingup-datocms-gatsby/Screen+Shot+2020-07-28+at+5.49.16+AM.png)

If we do that, we then see:

![](https://alvincrespo-blog.s3.us-east-2.amazonaws.com/hookingup-datocms-gatsby/Screen+Shot+2020-07-28+at+6.04.44+AM.png)

This will enable us to essentially add markup in DatoCMS - and then render it within our Gatsby app. So for this tutorial,
select "HTML Editor" so we can get some CMS driven content into our app later.

<h1 id="datocms-defining-relationships">DatoCMS - Defining Relationships</h1>

In DatoCMS - relationships are defined as "links".

![](https://alvincrespo-blog.s3.us-east-2.amazonaws.com/hookingup-datocms-gatsby/Screen+Shot+2020-07-28+at+5.49.28+AM.png)

![](https://alvincrespo-blog.s3.us-east-2.amazonaws.com/hookingup-datocms-gatsby/Screen+Shot+2020-07-28+at+5.49.43+AM.png)

![](https://alvincrespo-blog.s3.us-east-2.amazonaws.com/hookingup-datocms-gatsby/Screen+Shot+2020-07-28+at+5.49.49+AM.png)

By defining these relationships, when we go to create the content, we'll be able to select the instances that we create:

![](https://alvincrespo-blog.s3.us-east-2.amazonaws.com/hookingup-datocms-gatsby/Screen+Shot+2020-07-28+at+6.09.12+AM.png)

In the above example, I've created a "Ruby on Rails" skill - and have associated it with this new cover letter. Nifty, eh?!

Just keep in mind that you'll need to define each model first. Then you'll need to come back and add the links - since the model definition needs to exist for you to select it 😉.

<h1 id="gatsbyjs-installing-and-configuring-dependencies">Gatsby.js - Installing and Configuring Dependencies</h1>

If you followed the "Getting Started" section of this article - you should have a gatsby site ready.

The first step in connecting DatoCMS is installing `gatsby-source-datocms`, you can do this by running:

```
npm i --save gatsby-source-datocms
```

or

```
yarn add gatsby-source-datocms
```

Either way, you want to have the dependency listed in the `dependencies` section of your `package.json`:

```
    "gatsby-source-datocms": "^2.3.0",
```

Note: This was the version being installed at the time of this article.

Once the dependency is installed, let's use and configure it. To do that, let's hit up `gatsby-config.js` and add the following to the plugins list:

```
    // more plugins above
    {
      resolve: `gatsby-source-datocms`,
      options: {
        apiToken: process.env.CMS_TOKEN,
        preview: false,
        disableLiveReload: false,
      },
    },
```

Note: I've added this at the bottom of my plugins list.

Alright. So if you notice above - we have the following code: `apiToken: process.env.CMS_TOKEN`. You need an API token in order to query your data.

I'm using the read only version of the api token, since all I'm doing is presenting data - not modifying it. To get your API token, go to DatoCMS. Hit the "Settings" nav link at the top and then click on "API tokens" under the "Permissions" section of the sidebar. Click on "Read-only API token" and copy that sucker.

![](https://alvincrespo-blog.s3.us-east-2.amazonaws.com/hookingup-datocms-gatsby/Screen+Shot+2020-07-28+at+6.26.22+AM.png)

Now, you can use a package like [dotenv](https://github.com/motdotla/dotenv) or whatever to load in environment variables - but I'm NOT going to get into that for this article.

I'm simply going to have you run:

```
CMS_TOKEN=MY_API_TOKEN yarn develop
```

Note: Update `MY_API_TOKEN` with the token you copied earlier.

You won't notice any changes yet because we haven't really done anything user facing yet. Let's push forward!

<h1 id="gatsbyjs-exploring-the-playground">Gatsby.js - Exploring the Playground</h1>

Let's take a moment to understand how we can interact with DatoCMS's api using GraphQL. The best part about using Gatsby.js is that you get GraphQL for free and in order to start experimenting with it - you just need to use the built-in playground.

So, let's run the app:

```
CMS_TOKEN=MY_API_TOKEN yarn develop
```

Note: Update `MY_API_TOKEN` with the token you copied earlier.

Once that app is running, you can visit [http://localhost:8000/\_\_graphql](http://localhost:8000/__graphql)

You should see:

![](https://alvincrespo-blog.s3.us-east-2.amazonaws.com/hookingup-datocms-gatsby/Screen+Shot+2020-07-28+at+7.53.31+AM.png)

In the playground you can experiment with all the queries available to you, including this one:

![](https://alvincrespo-blog.s3.us-east-2.amazonaws.com/hookingup-datocms-gatsby/Screen+Shot+2020-07-28+at+7.58.10+AM.png)

The above query fetches all our cover letters.

You can also fetch per the slug field we defined earlier:

![](https://alvincrespo-blog.s3.us-east-2.amazonaws.com/hookingup-datocms-gatsby/Screen+Shot+2020-07-28+at+8.00.34+AM.png)

Cool right?! Yeah..very cool!

<div class="rounded-md bg-teal-200 p-4 my-8">
  <div class="flex">
    <div class="ml-3">
      <h3 class="text-sm leading-5 font-medium text-teal-800 uppercase">
        Break Time!
      </h3>
      <div class="mt-2 text-sm leading-5 text-teal-700">
        <p>
          This is a good time to take a break. If you haven't already, put in some content into DatoCMS!
        </p>
      </div>
    </div>
  </div>
</div>

<h1 id="gatsbyjs-hooking-up-the-plumbing">DatoCMS + Gatsby.js - The Perfect Match</h1>

Alright. So we installed and configured DatoCMS + Gatsby.js. We added some content to DatoCMS. Now we're ready to connect the dots.

<h2 id="gatsby-creating-dynamic-pages">Gatsby.js - Creating Dynamic Pages</h2>

Firs things first. We need to retrieve the content from DatoCMS and create landing pages. This requires us to tap into Gatsby.js' API. Specifically, we'll need to use the [`createPages`](https://www.gatsbyjs.org/docs/node-apis/#createPages) function.

So let's go to `gatsby-node.js` and drop in the following snippet:

```javascript
const path = require(`path`)

exports.createPages = ({ graphql, actions }) => {
  const { createPage } = actions

  return new Promise((resolve) => {
    graphql('
      {
        allDatoCmsCoverletter {
          edges {
            node {
              slug
            }
          }
        }
      }
    ').then((result) => {
      result.data.allDatoCmsCoverletter.edges.map(({ node: coverletter }) => {
        createPage({
          path: `applications/${coverletter.slug}`,
          component: path.resolve(`./src/templates/coverletter-page.js`),
          context: {
            slug: coverletter.slug,
          },
        })
      })
      resolve()
    })
  })
}
```

Credit: <a class="text-deeppink hover:underline" href="https://github.com/datocms/gatsby-portfolio/blob/master/src/templates/work.js" target="_blank" rel="noopener noreferrer">DatoCMS - Gatsby Portfolio Example</a>

So, what does this do?

- It uses the `allDatoCmsCoverletter` query (from `gatsby-source-datocms`) to retrieve all our data
- Once we get the results, we use `createPage` to set a path, define the component to use (which we have not defined yet) and provide the context/slug for that page

Essentially, this allows us to visit `http://localhost:8000/applications/COVERLETTER_SLUG` - where `COVERLETTER_SLUG` is the slug field value for a CoverLetter instance in DatoCMS.

TL;DR - It brings in the content from a model instance like this one:

![](https://alvincrespo-blog.s3.us-east-2.amazonaws.com/hookingup-datocms-gatsby/Screen+Shot+2020-07-28+at+8.26.11+AM.png)

<h2 id="gatsby-creating-dynamic-pages">Gatsby.js - Defining the template</h2>

So we're dynamically creating pages from content defined in DatoCMS - great! Now we need to define the template above so we can render that content.

First, create a directory called `templates` inside of `src`. Then, add the file `coverletter-page.js` inside of `templates`.

For confirmation, you should have the following file: `src/templates/coverletter-page.js`.

This is the file that will render the content from DatoCMS. So you can style it anyway you want. We're going to keep it simple:

```javascript
import React from "react"
import { graphql } from "gatsby"
import Layout from "../components/layout"

const CoverLetter = ({ data }) => {
  return (
    <Layout>
      <div className="my-6">
        <section className="mb-6">
          <h2 className="text-5xl tracking-tight leading-none uppercase text-center">
            {data.datoCmsCoverletter.companyName} //{" "}
            {data.datoCmsCoverletter.jobTitle}
          </h2>
        </section>

        {/* SECTION: Introduction  */}
        <div
          dangerouslySetInnerHTML={{
            __html: data.datoCmsCoverletter.introduction,
          }}
        />

        {/* SECTION: Skills */}
        <div className="my-10 px-4">
          <h3 className="text-base uppercase">My Skills</h3>
          <div className="mt-10">
            <ul className="grid grid-cols-2 col-gap-8 row-gap-10">
              {data.datoCmsCoverletter.skills.map((s) => (
                <li>
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <div
                        className="flex items-center justify-center h-12 w-12 rounded-md bg-indigo-500 text-white"
                        dangerouslySetInnerHTML={{
                          __html: s.icon.svg,
                        }}
                      ></div>
                    </div>
                    <div className="ml-4">
                      <h4 className="text-lg leading-6 font-medium text-gray-900">
                        {s.name}
                      </h4>
                      <p
                        className="mt-2 text-base leading-6 text-gray-500"
                        dangerouslySetInnerHTML={{
                          __html: s.description,
                        }}
                      />
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* SECTION: FAQs */}
        <div className="my-10 px-4">
          <h3 className="text-base uppercase">Frequently Asked Questions</h3>
          <div className="mt-10">
            <dl className="grid grid-cols-2 gap-8">
              {data.datoCmsCoverletter.frequentlyAskedQuestions.map((faq) => (
                <div>
                  <dt className="text-lg leading-6 font-medium text-gray-900">
                    {faq.question}
                  </dt>
                  <dd className="mt-2">
                    <p
                      className="text-base leading-6 text-gray-500"
                      dangerouslySetInnerHTML={{
                        __html: faq.answer,
                      }}
                    ></p>
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default CoverLetter

export const query = graphql'
  query GetCoverLetter($slug: String!) {
    datoCmsCoverletter(slug: { eq: $slug }) {
      id
      jobTitle
      companyName
      introduction
      skills {
        name
        description
        icon {
          svg
        }
      }
      frequentlyAskedQuestions {
        question
        answer
      }
    }
  }
'
```

Note: We're using `dangerouslySetInnerHTML` in order to render HTML content that we have filled in DatoCMS.

Ok. So if you're ready - I'm ready! Let's restart the app and load up [http://localhost:8000](http://localhost:8000).

You should see something like this:

![](https://alvincrespo-blog.s3.us-east-2.amazonaws.com/hookingup-datocms-gatsby/Screen+Shot+2020-07-28+at+8.39.46+AM.png)

Note: Your design will look totally different. I'm using [Tailwind](https://tailwindcss.com/) + [TailwindUI](https://tailwindui.com/) on my personal site - which is why it looks the way that it does above.

<h1>🚀 🚀 🚀 Congrats! You've made it! 🚀 🚀 🚀 </h1>

<h2>What we learned</h2>

- Data modeling
- DatoCMS' Capabilities
- Integrating DatoCMS with Gatsby.js
- Gatsby.js API using `createPages` and `createPage`
- GraphQL fetching and slug matching

and ultimately - enabling us to automate our processes for <strong>faster</strong> and more <strong>reliable</strong> delivery using a JAMStack.

<hr>
<h1 id="references">References</h1>

- <a href="https://javascript.info/" target="_blank" rel="noopener noreferrer">JavaScript</a>
- <a href="https://blog.hubspot.com/blog/tabid/6307/bid/7969/what-is-a-cms-and-why-should-you-care.aspx" target="_blank" rel="noopener noreferrer">CMS Concepts</a>
- <a href="https://www.gatsbyjs.org/docs/" target="_blank" rel="noopener noreferrer">Gatsby.js</a>
- <a href="https://reactjs.org/" target="_blank" rel="noopener noreferrer">React</a>
- <a href="https://graphql.org/" target="_blank" rel="noopener noreferrer">GraphQL</a>
- <a href="https://jamstack.wtf/" target="_blank" rel="noopener noreferrer">JAMStack</a>
- <a href="https://www.talend.com/resources/what-is-data-modeling/" target="_blank" rel="noopener noreferrer">Data Modeling: Ensuring Data You Can Trust</a>
- <a href="https://github.com/datocms/gatsby-portfolio" target="_blank" rel="noopener noreferrer">Github: datocms / gatsby-portfolio</a>
- <a href="https://www.datocms.com/docs/content-delivery-api/how-to-fetch-records" target="_blank" rel="noopener noreferrer">How to fetch records</a>
- <a href="https://www.gatsbyjs.org/docs/using-graphql-playground/" target="_blank" rel="noopener noreferrer">Gatsby: Using the GraphQL Playground</a>
- <a href="https://www.datocms.com/blog/rich-content-editing" target="_blank" rel="noopener noreferrer">Allowing rich-text editing within DatoCMS</a>
- <a href="https://www.datocms.com/docs/content-modelling/links" target="_blank" rel="noopener noreferrer">DatoCM - Link fields</a>
- <a href="https://github.com/datocms/gatsby-source-datocms" target="_blank" rel="noopener noreferrer">Github: datocms / gatsby-source-datocms</a>
- <a href="https://github.com/motdotla/dotenv" target="_blank" rel="noopener noreferrer">Github: motdotla / dotenv</a>
- <a href="https://www.gatsbyjs.org/docs/node-apis" target="_blank" rel="noopener noreferrer">Gatsby Node APIs</a>
- <a href="https://www.gatsbyjs.org/tutorial/part-seven/" target="_blank" rel="noopener noreferrer">Programmatically create pages from data</a>
