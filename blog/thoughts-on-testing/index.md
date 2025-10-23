---
title: Automated Testing. Do it.
date: "2020-02-04T11:30:00.000Z"
description: Automated testing may not seem worth it - but its absolutely critical at any stage of your product lifecycle. Check out this post on why I think you should start automatically testing your app today.
tags: testing,automated testing,reasoning
---

I bring this up because it's very easy to get caught up in the hype that is TBD or "Twitter Based Development". Most recently, a few tweets were made that makes it seem like automated testing is a waste of time, especially at the beginning of a project:

<div align="center">
<blockquote class="twitter-tweet"><p lang="en" dir="ltr">I pay for all of my custom software out of my own pocket and tests have never been a priority outside of critical systems (accounting, etc) because they deliver marginal returns and can easily triple dev costs. <br><br>I’m an expert tester and understand how to effectively write them.</p>&mdash; Joel 🌧 (@jhooks) <a href="https://twitter.com/jhooks/status/1224058480878739456?ref_src=twsrc%5Etfw">February 2, 2020</a></blockquote>
<br>
<blockquote class="twitter-tweet"><p lang="en" dir="ltr">It&#39;s amazing what happens to programmers opinions on tests when suddenly their own bank account is paying for them. The value for the vast majority of them diminishes almost instantly in my experience.</p>&mdash; Ryan Florence (@ryanflorence) <a href="https://twitter.com/ryanflorence/status/1224069218926120961?ref_src=twsrc%5Etfw">February 2, 2020</a></blockquote>
</div>
<br>

Testing is absolutely necessary, especially at the beginning of a project. I've been involved
in too many projects where development was slow, deadlines were missed and trust was lacking
because of the lack of confidence in the codebase. Oh, but you can test manually you say? I think NOT.
Why? Well because of the following:

1. Humans aren't great at consistency
2. Small bugs eventually add up
3. Retrofitting testing is hard
4. Trust degrades as the app matures

Let's cover the first item, manual testing. We created automated testing because humans suck at testing consistently. We have Cypress, Selenium and others for this reason. You can believe in your skills, but having that much trust in your abilities is a false truth.

This will eventually lead to small bugs adding up. You're building out your app, you forget to test something - a bug goes out. Damn! This scenario will become more apparent as your codebase grows. The more bugs that get introduced - the harder it will be to manage.

At some point, you'll want to piecemeal a testing framework:

<div align="center">
<blockquote class="twitter-tweet"><p lang="en" dir="ltr">Correct.<br><br>You can&#39;t optimize for the long-term until you&#39;ve survived the short term. Tests are the least valuable code in the short term to even begin thinking about the long term.<br><br>(at which point, you should write some tests).</p>&mdash; Ryan Florence (@ryanflorence) <a href="https://twitter.com/ryanflorence/status/1224369817995448321?ref_src=twsrc%5Etfw">February 3, 2020</a></blockquote>
</div><br>

Well, yeah - you can't know what the future holds. Thats true. But if thats the case, why use any technology if it's just going to change? You can't predict the future, but you can create a foundation
that can be iterated upon.

But, if you decide not to write your tests - you're gonna be piecemealing that sucker. It is NOT fun! I've done this multiple times in my career. I don't find it fun, interesting or exciting - but I find it necessary to do my work. I want people to trust the code going out to production. This will cost you a pretty penny though - because retrofitting a testing framework is much harder than if you had originally just started writing tests.

All the above leads to trust issues. If #1 and/or #2 are happening, you better believe that there is a trust issue going on. Whether thats from the customer side or internally, with other folks or teams, the trust isn't optimal. It's not optimal because there is no way to be absolutely sure that core features work after each push.

<h2>Marginal Returns.</h2>

Whether you're working by yourself, on a large team or a small startup - testing has major implications. A positive one - trust.

Is it expensive to write tests? Yes.

Is trust expensive? Yes.

In any relationship, building trust takes time, effort and resources. When developing an application, you are building various types of relationships. That can include customers, stakeholders and team members. Testing increases customer confidence in a product, stakeholders can rely on the team to deliver and team members can effectively utilize their time; instead of having to manually test every feature.

So you might be asking, how can I have both? A return on investment and confidence in the code I'm or my team is writing. Well, there are various options and each option is surprisingly flexible and can be fit within any budget.

<h2>Start Now.</h2>

So you should write tests. No matter where you are in your product cycle - schedule it in. Trust shouldb e a core value in your organization and testing helps build that trust and confidence in the ability to ship
reliable code.

What tests should you focus on?

- End-to-End Tests (happy path)
- Integration Tests (component tests)
- Unit tests (functional tests)

I primarily encourage happy path tests through end-to-end testing - regardless of budget. These tests ensure that the critical parts of your system work as you expect them. Integration and unit tests are also extremely helpful - but should not be the priority. If you have a complicated experience you want to make sure doesn't degrade then write simple component integration tests. Have a function that does a simple calculation - write a simple unit tests.

Ultimately, write tests that are simple - and you'll be just fine. If you find that testing your code isn't simple, then your problem lies with complexity - either in the app code or user experience.

<h2>Get to it.</h2>

With all this in mind. Get to it. Start writing your first happy path, end-to-end test. Already have tests? Keep doing it.

You're doing it right!
