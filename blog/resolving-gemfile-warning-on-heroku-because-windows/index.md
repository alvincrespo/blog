---
title: Resolving Gemfile warning on Heroku because Windows
date: "2020-08-01T06:54:00.000Z"
description: "You ever run into this warning on Heroku?` ###### WARNING:        Removing `Gemfile.lock` because it was generated on Windows.        Bundler will do a full resolve so native gems are handled properly.        This may result in unexpected gem version..."
tags:
---

You ever run into this warning on Heroku?\`

```bash
###### WARNING:
       Removing `Gemfile.lock` because it was generated on Windows.
       Bundler will do a full resolve so native gems are handled properly.
       This may result in unexpected gem versions being used in your app.
       In rare occasions Bundler may not be able to resolve your dependencies at all.
       https://devcenter.heroku.com/articles/bundler-windows-gemfile
```

Well - I did and had no idea why it was happening. Did some quick research and I'm here to share my findings.

## What is this error mean?

It's telling us that there are gems bundled with the app that won't work on Heroku.

## Why is this happening?

In my case, I was pushing out a new build of Rails and it had the following in Gemfile:

```bash
# Windows does not include zoneinfo files, so bundle the tzinfo-data gem
gem 'tzinfo-data', platforms: [:mingw, :mswin, :x64_mingw, :jruby]
```

As the comment suggests, it's including platform specific files in order to support Windows.

I'm not working on Windows - so I'm just going to remove it.

## Do I need to fix this?

Heroku is going to rebuild your lockfile. That's bad because it could theoretically install a dependency that doesn't align with your local or staging environments. ie. A bug could sneak in.

So we can't leave it as it is.

## How do I fix it?

Easy. Change the above gem definition to:

```bash
gem 'tzinfo-data'
```

Another way to resolve this is by running:

```bash
bundle lock --remove-platform x86-mingw32 x86-mswin32 x64-mingw32 java
```

Regardless - you should see something like this:

![](./ce040840-2765-4822-a801-3a88c9af0bf0.png)

Notice how we're removing platform specific builds? That's what we want! 🎆🎆🎆

## Congrats!

There you go! You've fixed the warning. Keep going 💪 💪 💪

## References

* [Deploying a Ruby Project Generated on Windows](https://devcenter.heroku.com/articles/bundler-windows-gemfile)
    
* [Platforms added to Gemfile.lock](https://stackoverflow.com/a/48772358)
    
* [bundle lock](https://bundler.io/v2.0/bundle_lock.html)