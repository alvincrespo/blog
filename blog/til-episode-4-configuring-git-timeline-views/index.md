---
title: TIL - Episode 4. Configuring GIT timeline views.
date: "2019-11-08T07:00:00.000Z"
description: "Ever wonder how you can easily check out your git timeline locally, without having to use a GUI or have to go to Github? Yeah, there is an easy way. You can configure your global config to this: [format]     pretty = %ad %Cred%h%Creset %C(yellow)%d%C..."
tags:
---

Ever wonder how you can easily check out your git timeline locally, without having to use a GUI or have to go to Github? Yeah, there is an easy way.

You can configure your [global config](https://git-scm.com/book/en/v2/Customizing-Git-Git-Configuration) to this:

```bash
[format]
	pretty = %ad %Cred%h%Creset %C(yellow)%d%Creset %s <%Cgreen%an%Creset>
[log]
	decorate = short
```

I've been using this since my time at [Customer.io](https://customer.io/). Thanks to Stephen for showing me this!.

This will produce a timeline like:

![](./80b4477d-3026-4e2f-96fc-45a68122dd9d.png)

For information around formatting, check out the `--format` flag [documentation](https://git-scm.com/docs/git-log#_pretty_formats).

---

If you'd prefer to avoid creating a global configuration for viewing your timeline, you can easily use `--oneline` and `--graph` flags in your terminal, thanks to [Chris Achard](https://twitter.com/chrisachard) for this one!

%[https://twitter.com/chrisachard/status/1192825445265399811?ref_src=twsrc%5Etfw] 

So what does this command do?

```bash
git log --oneline --graph
```

Let's break it down:

The [git documentation](https://git-scm.com/docs/git-log#Documentation/git-log.txt---oneline) specifies that `--oneline` is just a shortcut for:

```bash
--pretty=oneline --abbrev-commit
```

In practice, it looks like this:

```bash
git log --pretty=oneline --abbrev-commit --graph
```

![](./688d528a-5389-44b7-a7f9-353f7a73349b.png)

Finally, what does `--graph` do? Again, going back to [git's documentation](https://git-scm.com/docs/git-log#Documentation/git-log.txt---graph):

> Draw a text-based graphical representation of the commit history on the left hand side of the output.

Basically, `*` is used to represent a single line in your timeline.

---

Alright! Thank you for reading my learnings from today. Did you learn something new? Anything here that I got wrong or can improve on? Let me know at [@alvincrespo](https://twitter.com/alvincrespo).

Cheers!