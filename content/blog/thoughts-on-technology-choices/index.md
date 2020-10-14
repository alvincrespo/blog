---
title: Thoughts on Technology Choices
date: "2020-10-14T10:00:00.000Z"
description: Automated testing may not seem worth it - but its absolutely critical at any stage of your product lifecycle. Check out this post on why I think you should start automatically testing your app today.
tags: testing,automated testing,reasoning
---

## Guiding Principle

<blockquote class="custom" cite="Yevgeniy Brikman, Hello, Startup - Chapter 5. Choosing a Tech Stack">
  <p>A good tech stack is one that scales faster than the people required to maintain it.<p>
</blockquote>

When considering a technology choice, I think about a few things:

- The product being built (market, scale, etc.)
  - SAAS, B2B, etc.
  - Are we talking hundreds, thousands or millions of users?
  - Rural and/or Urban?
- Composition of the team
  - What type of engineers are on the project?
    - Full-Stack
    - Backend / Frontend
    - Seniority
  - Does the team prefer a language? Framework?
- Company culture
  - Get it done ASAP?
  - Get it done Right?
- Budget
  - 60k - 100k
  - 100k +
  - 1M +

At this point - I haven't thought about the technology itself. That's because - there is no such thing as the "right" technology. Context drives the decision. Anyone promising technology without the context needed to make these decisions is lying to you. Learning a new technology can be fun - but your focus should be on delivering value.

## Use what you know

<blockquote class="custom" cite="Nicholas C. Zakas, Thoughts on JS Fatigue, Top of the Month Newsletter (August 4, 2020)">
  <p>
  Quite simply, I don't try to learn about every new thing that comes out. There's a limited number of hours in the day and a limited amount of energy you can devote to any topic, so I choose not to learn about anything that I don't think will be immediately useful to me
  </p>
</blockquote>

Every successful company that we know of built the foundations of its technology based on the founding team's knowledge of what they knew at the time. They used what they knew:

- LinkedIn was built in Java because it's founders knew Java
- Github founders were Ruby developers, so it was built in Ruby
- Twitter was built on Rails because early employees knew Rails
- Pinterest was built on Python because the founders knew Python

This doesn't mean that you don't learn new technologies and methodologies - but that you focus on utilizing your strengths to deliver value while developing a mental model around how these technologies can be integrated. Nicholas C. Zakas writes his thoughts on this perfectly:

<blockquote class="custom" cite="Nicholas C. Zakas, Thoughts on JS Fatigue, Top of the Month Newsletter (August 4, 2020)">
  <p>
    The most important skill for a long career in software engineering is the ability to **learn new things quickly.** If you trust that you can learn new things quickly, then you don't need to stop and learn every new thing as it is released. You know that when you can learn about something right when you need it.
  </p>
</blockquote>

## Evolving a technology stack

<blockquote class="custom" cite="[ Scott 2014 ], Kevin Scott, SVP at LinkedIn, VP at AdMob, Director at Google. Hello, Startup - Chapter 5. Choosing a Tech Stack">
  <p>
    The trick is not the initial choice of technology. The initial decision is guaran-fucking-teed to be wrong… eventually. The only question is how long it’s going to take to be wrong. The trick is recognizing when you hit that inflection point where you need to have the courage to just kill the thing rather than apply Band-Aid after Band-Aid after Band-Aid to it to keep it alive.
  </p>
  <p>
    Having that discipline is super important. I think, by far and away, that’s more important than trying to read the zeitgeist and get into an infinite design analysis loop to figure out the best initial technology decision. Instead, make sure that you’re building yourself and your environment to adapt to change and you know when the time is right to rebuild.  
  </p>
</blockquote>

You will need to evolve your technology stack. It is inevitable. As you learn about the needs of your product's users - the more you'll need to evolve what was built. Needs change, so your technology will need to change with it. Many of the products we use have done this:

- Twitter migrated from Rails to Scala
- Coursera went from PHP to Scala
- HubSpot from .NET to Java

When do we know our technology needs to evolve?

Symptoms that technology needs to evolve:

- Scaling people faster than technology
- Features are taking longer to deliver
- Releases seem to break existing functionality

Ultimately, your technology choices should be driven by the leverage it affords you. Yevgeniy puts it this way:

<blockquote class="custom" cite="Yevgeniy Brikman, Hello, Startup - Chapter 5. Choosing a Tech Stack">
  <p>
    Your goal is to be able to scale your tech stack to more users, traffic, data, and code by throwing money or hardware, rather than manpower, at the problem. If every time your user base doubles, you can just pay for a few more servers and everything keeps working, you’re in good shape. On the other hand, if you have to double the size of your team, you might need a change.
  </p>
</blockquote>

## Deciding on a framework

The framework you choose should depend on the size of the community around it. Why?

- Hiring ability
- Learning resources
- Open source libraries

This is not to be confused by popularity. A framework may be popular and have a small community of active users, while an unpopular framework might have a large community of active users. Again, your aim is to ensure that you can hire, ramp up engineers quickly and tap into open sources resources easily.

## Wrap up

Technology choices are driven by context. The context is gained by understanding the product, team, culture and budget. Ultimately, your decision will be wrong. Learning how to leverage the technology to scale correctly will give you the ability you need to evolve. Deciding on a technology should be based around the community surrounding it - giving you the ability to hire, learn quickly and utilize open source libraries.

Use what you know and understand it's leverage to give you the best results. Continue to learn new technologies, but understand when and why to use them.

## References

- <a href="https://www.hello-startup.net/" target="_blank" rel="noopener noreferrer">Hello, Startup by Yevgeniy Brikman</a>
- <a href="https://humanwhocodes.com/" target="_blank" rel="noopener noreferrer">Human Who Codes</a>
