---
title: Hooking up DatoCMS and Gatsby.js [WIP]
date: "2020-07-27T06:54:00.000Z"
description:
tags: gatsbyjs,datocms,jamstack,javascript
---

<div class="rounded-md bg-pink-200 p-4 my-8">
  <div class="flex">
    <div class="ml-3">
      <h3 class="text-sm leading-5 font-medium text-pink-800 uppercase">
        Work in progress
      </h3>
      <div class="mt-2 text-sm leading-5 text-pink-700">
        <p>
          I'm currently writing this up. It is incomplete - but feel free to read.
        </p>
      </div>
    </div>
  </div>
</div>

Want to ship landing pages easily? Cool. Let's do it.

Today, I'm going to show you how to use [DatoCMS](https://www.datocms.com/) to manage your content and [Gatsby.js](https://www.gatsbyjs.org/) to run it.

<h1 id="prerequisites">Prerequisites</h1>

Here's what you need to be familiar with:

- <a href="https://javascript.info/" target="_blank" rel="noopener noreferrer">JavaScript</a>
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

Cool. So, we have a bunch of options out there. We can use Wix, Wordpress, etc... But - nah. We're going to use Gatsby, DatoCMS and Netlify. Why?

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

You won't notice any changes yet because we haven't really done anything user facing yet. Let's push forward!

<h1 id="gatsbyjs-exploring-the-playground">Gatsby.js - Exploring the Playground</h1>

<div class="rounded-md bg-pink-200 p-4 my-8">
  <div class="flex">
    <div class="ml-3">
      <h3 class="text-sm leading-5 font-medium text-pink-800 uppercase">
        Work in progress
      </h3>
      <div class="mt-2 text-sm leading-5 text-pink-700">
        <p>
          That's all for now. I'll be adding more content to this article soon. [Updated On July 27, 2020]
        </p>
      </div>
    </div>
  </div>
</div>

<h1 id="references">References</h1>

- <a href="https://javascript.info/" target="_blank" rel="noopener noreferrer">JavaScript</a>
- <a href="https://blog.hubspot.com/blog/tabid/6307/bid/7969/what-is-a-cms-and-why-should-you-care.aspx" target="_blank" rel="noopener noreferrer">CMS Concepts</a>
- <a href="https://www.gatsbyjs.org/docs/" target="_blank" rel="noopener noreferrer">Gatsby.js</a>
- <a href="https://reactjs.org/" target="_blank" rel="noopener noreferrer">React</a>
- <a href="https://graphql.org/" target="_blank" rel="noopener noreferrer">GraphQL</a>
- <a href="https://jamstack.wtf/" target="_blank" rel="noopener noreferrer">JAMStack</a>
- <a href="https://www.talend.com/resources/what-is-data-modeling/" target="_blank" rel="noopener noreferrer">Data Modeling: Ensuring Data You Can Trust</a>
- <a href="https://github.com/datocms/gatsby-portfolio/blob/master/src/templates/work.js" target="_blank" rel="noopener noreferrer">Github: datocms / gatsby-portfolio</a>
- <a href="https://www.datocms.com/docs/content-delivery-api/how-to-fetch-records" target="_blank" rel="noopener noreferrer">How to fetch records</a>
- <a href="https://www.gatsbyjs.org/docs/using-graphql-playground/" target="_blank" rel="noopener noreferrer">Gatsby: Using the GraphQL Playground</a>
- <a href="https://www.datocms.com/blog/rich-content-editing" target="_blank" rel="noopener noreferrer">Allowing rich-text editing within DatoCMS</a>
- <a href="https://www.datocms.com/docs/content-modelling/links" target="_blank" rel="noopener noreferrer">DatoCM - Link fields</a>
- <a href="https://github.com/datocms/gatsby-source-datocms" target="_blank" rel="noopener noreferrer">Github: datocms / gatsby-source-datocms</a>
- <a href="https://github.com/motdotla/dotenv" target="_blank" rel="noopener norerrer">Github: motdotla / dotenv</a>
