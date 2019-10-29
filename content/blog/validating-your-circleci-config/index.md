---
title: Validating your CircleCI config
date: "2019-10-27T06:00:00.000Z"
description: Did you know that you could validate your CircleCI config before pushing? Neither did I. Let me show you how.
tags: devops,ci,cicd,circleci
---

Did you know that you could validate your CircleCI config before pushing up your changes? Neither did I. I used to write my config, wait for CI to fail and then make the appropriate changes.

I got tired of doing that this morning, so decided to google "CircleCI config validator". Guess what? I found one! Built by CircleCI themselves!

You can read their docs on it [here](https://circleci.com/docs/2.0/local-cli/).

But, here's a quick TL;DR.

## Installation

```
brew install --ignore-dependencies circleci
```

In my case, I didn't need the package to install the "Docker for Mac" app since I already had it installed. For your specific needs, check out their [installation section](https://circleci.com/docs/2.0/local-cli/#installation).

## Usage

Once you have it installed, all you need to do is run:

```
circleci config validate
```

## Example

Let's say I did run the validator and had a syntax error, what would that look like?

```
➜  circleci config validate
Error: Unable to parse YAML
while scanning a simple key
 in 'string', line 36, column 7:
          run
          ^
could not find expected ':'
 in 'string', line 38, column 7:
          - run:
          ^
```

Whoa! This is awesome! No more useless commits.

## What else can we do?

There is a bunch of other things we can do with this command, such as:

- [Packing a config](https://circleci.com/docs/2.0/local-cli/#packing-a-config)
- [Processing a config](https://circleci.com/docs/2.0/local-cli/#processing-a-config) (e.g. viewing the final output)
- [Run a job locally](https://circleci.com/docs/2.0/local-cli/#run-a-job-in-a-container-on-your-machine)

## How can we automate this?

As a consultant, I work across multiple projects and always look to automate and improve the developer experience. Knowing the above, I plan to create a utility for CircleCI projects to auto check the ci config as part of pre-commit git hook using [lint-staged](https://github.com/okonet/lint-staged) and [husky](https://github.com/typicode/husky).

<hr>

So, what have we learned here?

- A config validator exists
- DevOps time can be cut by validating locally
- There are several other useful commands available to you
- This can be automated so we don't have to think about it

I hope this was helpful to you.

Let me know what you think in the comments below.

Cheers!
