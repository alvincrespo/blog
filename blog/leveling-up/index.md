---
title: Leveling Up
date: "2020-05-19T16:00:00.000Z"
description: "This article was originally published for Echobind. https://medium.com/theechobind/leveling-up-64ffc4dbb8dc  There are a lot of good articles out there on how to level up your software engineering career. I’m going to focus on one: digging deeper. Di..."
tags:
---

---

This article was originally published for Echobind. [https://medium.com/theechobind/leveling-up-64ffc4dbb8dc](https://medium.com/theechobind/leveling-up-64ffc4dbb8dc)

---

There are a lot of good articles out there on how to level up your software engineering career. I’m going to focus on one: digging deeper. Digging deeper is the concept of being comfortable understanding what you use and how you use it. Let’s get to it.

# **1 Player Game**

When I first started, I had no clue what I was doing. My method of doing anything, especially in the early days of web development, was to just piece things together. Some HTML here, add a little bit of CSS ([Blueprint](http://blueprintcss.org/) anyone?) to make it look good and a sprinkle of [jQuery](https://jquery.com/). I’d download assets, add it to the project and then FTP it — done!

I didn’t dig into any of those libraries. This was my method:

* Read some blog post
    
* Integrate recommendations
    
* Ship the project
    
* Make cash 💰💰💰
    

This wasn’t sustainable.

# **2 Player Game**

I feel sorry for the people who had to maintain code from my early days. Who knows, perhaps they still are. It’s a spaghetti mess. I eventually learned to clean up my act and my code! Once I got out of freelancing and had opportunities to join formal engineering teams — I understood that it was necessary to think through solutions.

I thought about maintenance, scaling, and code styling. This was my method:

* Read some blog post
    
* Discuss solutions with the team
    
* Integrate recommendations
    
* Ship the project
    
* Make 💰💰💰
    

That’s where I plateaued.

# **Grand Prix**

When I was working in [Ember](https://emberjs.com/) and working closely with folks on the core team, I was introduced to a novel concept: debugging internals. We would put a debugger and just step through the whole stack. I had never done this before! I thought it was crazy! I also thought it was the coolest thing in the world!

During that time — I found that the tools I was using were developed by other humans! Humans who had an idea and just wrote the code for it. Some of it was great, some of it was terrible.

Over the course of a year or so — I had developed some core knowledge about Ember that helped me:

1. Develop features faster
    
2. Communicate more effectively with teammates
    
3. Contribute to OSS (to overcome roadblocks)
    

This was my method:

* Read some blog post
    
* Discuss solutions with the team
    
* Integrate recommendations
    
* Learn about my tools
    
* Knowledge share
    
* Ship the project
    
* Make 💰💰💰 (this increased significantly)
    

How do **you** get here?

# **Let’s-a Go!**

Don’t wait to get to this step! Start today!

I’m going to showcase an example. For this example, I’m going to dive into Apollo’s `useQuery` hook. I haven't used Apollo for almost six to seven months now, and I haven't dug into `apollo-client` before, so this is my first time.

Alright, let’s start here:

```plaintext
const { loading, error, data } = useQuery(GET_DOGS);
```

Let’s say that for whatever reason my loading state isn’t working. I don’t know why my query works and the graphql playground is working as expected. I’ve looked at the docs several times and I’m stumped. What can I do? I can add a debugger at this line and step into what’s happening — that’s a great option.

I could also dive into the source code. This is what I’m going to do because I need to know whats going on to figure out what’s up. Keep in mind, I’ve never done this before this article.

Here’s what I do:

Let’s start by going to the repo:

![](https://miro.medium.com/v2/resize:fit:875/1*qsE-d_CqTObODajysPrdgQ.png align="left")

I’m going to search for `useQuery`, and luckily my second result is the test for this hook. I can look at the test, but I'm going to dive deeper.

![](https://miro.medium.com/v2/resize:fit:875/1*EwJyU4WW0Z2XPeafCs2-8g.png align="left")

The test tells me where `useQuery` exists, so I'm going to go up one directory and check it out.

![](https://miro.medium.com/v2/resize:fit:875/1*Wyh6XpfrC-uq7B3V0aWfjg.png align="left")

Ok cool, there it is — let’s click into `useQuery.ts`

![](https://miro.medium.com/v2/resize:fit:875/1*w1KRNRcJVXCaWZGjCGRv4g.png align="left")

Alright! We’re looking at source code…but… there’s nothing here — what do I do?

![](https://miro.medium.com/v2/resize:fit:875/1*IQLEmHNNe1z_odVKT_4uwQ.png align="left")

It looks like it’s using something called `useBaseQuery`, the import above shows it's in a utils directory - let's go to it.

![](https://miro.medium.com/v2/resize:fit:875/1*JH6SeEYR9NPzVhObMduODA.png align="left")

Ok, we’ve found the file — let’s open it.

![](https://miro.medium.com/v2/resize:fit:875/1*8-k1UI0t_OfRKL6bLeg4dg.png align="left")

Ok. I’m digging through the file and I see something called `queryResult.loading`. I don't know what `queryResult` is so, let's see what it is...

![](https://miro.medium.com/v2/resize:fit:875/1*GC7fgjZ86Pz_nVp-IwfzQQ.png align="left")

Ok, looks like it depends on if `lazy` is true or false. Since we didn't specify anything `lazy` about our hook as an option, I'm assuming it is the second one where we typecast it as `QueryResult`.

![](https://miro.medium.com/v2/resize:fit:875/1*HlEvq8U4zjUAxswhp9Rzow.png align="left")

This is the line, I’m assuming we hit:

![](https://miro.medium.com/v2/resize:fit:875/1*7YztZm1mHKoM6fqwxR_5KQ.png align="left")

Regardless, whats `result`? Ah, ok it's above.

![](https://miro.medium.com/v2/resize:fit:875/1*6LToGPeGGkr63dWa2WGNFw.png align="left")

Ok so within this other hook is a call to `executeLazy` or just `execute`.

![](https://miro.medium.com/v2/resize:fit:875/1*MNCt4rpq5qslArxk1dMjIA.png align="left")

I’m going to assume where calling `queryData.execute` because I didn't specify `lazy`. But, what's `queryData`?

![](https://miro.medium.com/v2/resize:fit:875/1*03wXCoHH3hnaQnhDrIWB5g.png align="left")

Looking further above, it looks like it gets set to some current thing or a new thing. The new thing is an instance of `QueryData`. So, knowing what we know so far `execute` is a method on an instance of `QueryData`.

Nothing significant about `loading` here - it looks to be contained within this `QueryData` type. So let's dig deeper.

![](https://miro.medium.com/v2/resize:fit:875/1*htBRKuUJ5fV4eOCVa5aP6g.png align="left")

Looks like `QueryData` is being imported by two levels above. Let's go to it.

![](https://miro.medium.com/v2/resize:fit:875/1*GtMQESW0mmOwD8EhTMuIBg.png align="left")

Found it! Let’s go into the data directory:

![](https://miro.medium.com/v2/resize:fit:875/1*msvQHzeLxTHqqHOl2GWSHg.png align="left")

Once here, we’ve found `QueryData.ts` - let's click it.

![](https://miro.medium.com/v2/resize:fit:875/1*3N6jb66xHY6TVK8WyKuTrg.png align="left")

Alright, we’ve found the `QueryData` class! Let's investigate for `execute`

![](https://miro.medium.com/v2/resize:fit:875/1*bjpueQCJlyGmMKFw7tiyHg.png align="left")

Found it! Let’s see what it does:

![](https://miro.medium.com/v2/resize:fit:875/1*GG_iak5Jbv6a7Hv-nNzYeg.png align="left")

Ok, it seems to make a call to `getExecuteSsrResult` or `getExecuteResult`. Since we're not doing anything SSR related, I'm going to expect `getExecuteResult` is what gets called. Let's see what that does.

![](https://miro.medium.com/v2/resize:fit:875/1*woVVMPhht2HSssY3QIYvGQ.png align="left")

There it is!

![](https://miro.medium.com/v2/resize:fit:875/1*1qYk-5woUgiUc20_-8Nxjg.png align="left")

This function seems to call `getQueryResult` - ok, that definitely seems relevant! Let's see what it does.

![](https://miro.medium.com/v2/resize:fit:875/1*ZOwX_ajppK7_X9lJnuJBxw.png align="left")

And boom! We’ve found where all the magic happens. This is the function that returns the result we’ve been looking for. Here, we’ll find `loading`, `error`, and `data`.

![](https://miro.medium.com/v2/resize:fit:875/1*JUO8psTQn2EbPclcXFmvQg.png align="left")

# **Fín**

A very important step in your career is the ability to dive into the tools you use. Doing this is a crucial step in giving you the freedom you need to build software the way you want. With this in mind, go on and triumph!