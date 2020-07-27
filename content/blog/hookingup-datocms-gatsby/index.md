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

Alright, so let's start with the story for what we're building:

```
I'm looking for a job. I want to stand out. Instead of sending out a cover letter, I'm going to create a landing page and send that instead.
```

Cool. So, we have a bunch of options out there. We can use Wix, Wordpress, etc... But - nah. We're going to use Gatsby, DatoCMS and Netlify. Why?

- Cost effective (free packages on all services)
- Easy customization (more control over the code)
- Fast delivery (low learning barrier)

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
