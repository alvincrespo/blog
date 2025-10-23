---
title: Frontend Deployments made easy with Serverless Framework Website Component
date: "2019-11-16T14:00:00.000Z"
description: Deploying a website is easier than ever using Serverless Frameworks website component. In this article I'll show you how to get up and running deploying a frontend application in minutes.
tags: serverless,website component,deployment,cli
---

You're probably using Netlify or [Surge.sh](http://surge.sh), probably Heroku. All really amazing options! Heck, I'm using Netlify for my personal site and this blog. But, why do these exist?

Devops is hard and AWS is pretty complicated. Step in, [Serverless Framework](https://serverless.com/) and [Serverless Components](https://github.com/serverless/components)!

In this article, I'm going to help you get going with deploying your frontend application easily with Serverless Framework. At the end of the day, you won't have to depend on a third party service to deploy your apps. 😱😱😱

<strong>Breakdown</strong>

- Set up an IAM user in AWS
- Install serverless
- Deploy

<strong>Prerequisites</strong>

- AWS account
- Serverless account (Sign up [here](https://serverlessinc.auth0.com/login?state=g6Fo2SBuZDNwUzdLeGkzSmhiVWZlNVlMQ0M4X0l6V3dSSXAtYqN0aWTZIEpOZzF6QnFMZzhyek1EM3Vfdm1iS3ZkbGhUZ1oxYjlvo2NpZNkgRTRaeHFEOWpPSnNyRWV0VFE2ME8xenpZWE1EaE9lN3c&client=E4ZxqD9jOJsrEetTQ60O1zzYXMDhOe7w&protocol=oauth2&response_type=token%20id_token&scope=openid%20email_verified%20email%20profile%20name&audience=https%3A%2F%2Fserverlessinc.auth0.com%2Fuserinfo&redirect_uri=https%3A%2F%2Fdashboard.serverless.com%2Fcallback&nonce=fc3GCf0HGZLD5YixXZ4jq-MiaX2zHAK1&auth0Client=eyJuYW1lIjoiYXV0aDAuanMiLCJ2ZXJzaW9uIjoiOS4xMS4zIn0%3D))

Once you have your AWS and Serverless accounts set up - read ahead.

...

Alright, let's get started!

# Create an IAM User

Ok, so we're going to start by creating a user in AWS. Why? We'll, we definitely don't want third party resources to have access as our root user. So let's hit up the IAM service on AWS:

![](Screen_Shot_2019-11-16_at_2-32dd7286-7fc1-4619-a575-6c5d8675c3d4.12.09_PM.png)

Once we're on our "Users" page, we're going to click "Add user"

![](Screen_Shot_2019-11-16_at_2-282d2fbe-4520-4ca9-904b-0415933bcc0f.12.27_PM.png)

Ok, so first we're going to name the user "serverless-framework" - we've named it this in order to identify it easily.

Then, give this user "Programmatic access"

When you're done, click "Next: Permissions"

![](Screen_Shot_2019-11-16_at_2-870b6fd0-dbc2-4d3b-a2e2-5d20b4ed8547.12.57_PM.png)

Ok, now it's time to assign permissions. I'm going to allow "AdministratorAccess". Behind the scenes the serverless framework uses many AWS services - so narrowing it down could theoretically be difficult.

However, if you're interested in trying it out, the main services the website component utilizes are:

- S3
- Certificate Manager
- Cloudfront
- Route53

Once you're done here, click on "Next: Tags"

![](Screen_Shot_2019-11-16_at_2-2ec766cc-dbf5-4e2a-a47c-b3797957904b.13.16_PM.png)

This step is completely optional, for now - click on "Next: Review".

![](Screen_Shot_2019-11-16_at_2-57757353-0a1f-44bc-8726-4013b31d737e.13.24_PM.png)

At this step, you'll review your users details and click "Create user" when you've confirmed everything looks good.

![](Screen_Shot_2019-11-16_at_2-26fe0d80-fedb-4e78-a18a-5bf73a12a304.14.05_PM.png)

Your use has now been created! At this step, note down your access key id and secret access key.

![](Screen_Shot_2019-11-16_at_2-349191d7-42ef-4275-91f5-9987fd3b5486.13.39_PM.png)

When you click "Close", you'll be taken to your users page - where your newly created user will be selected.

![](Screen_Shot_2019-11-16_at_2-4bfcf437-ab6b-4a5e-8595-4780d154eae4.14.13_PM.png)

# Install and Setup Serverless

Verify you have serverless framework installed:

```shell
serverless -v
Framework Core: 1.57.0
Plugin: 3.2.3
SDK: 2.2.1
Components Core: 1.1.2
Components CLI: 1.4.0
```

Note: Make sure you're using serverless framework version 1.49.0 or later.

If you don't have it installed, install it:

    yarn global add serverless

or, alternatively:

```shell
npm i -g serverless
```

# Create website from template

```shell
serverless create --template-url https://github.com/serverless/components/tree/master/templates/website
```

This will output:

```shell
Serverless: Generating boilerplate...
Serverless: Downloading and installing "website"...
Serverless: Successfully installed "website"
```

Now, `cd` into the website template directory:

```shell
cd website
```

Now, install dependencies:

```shell
yarn
```

You'll see output like this:

```shell
yarn install v1.19.1
info No lockfile found.
[1/4] 🔍  Resolving packages...
warning parcel-bundler > @parcel/watcher > chokidar > fsevents@1.2.9: One of your dependencies needs to upgrade to fsevents v2: 1) Proper nodejs v10+ support 2) No more fetching binaries from AWS, smaller package size
[2/4] 🚚  Fetching packages...
[3/4] 🔗  Linking dependencies...
[4/4] 🔨  Building fresh packages...
success Saved lockfile.
✨  Done in 12.96s.
```

Now, let's create a .env file:

```shell
touch .env
```

Add the aws access key id and secret access key that was created for the serverless-framework user:

```shell
AWS_ACCESS_KEY_ID=abc123
AWS_SECRET_ACCESS_KEY=456xyz
```

Replace the values `abc123` and `456xyz` respectively.

You should now be able to run the application locally:

```shell
yarn start
```

When the build is done, you should be able to hit [http://localhost:1234/](http://localhost:1234/)

# Deploying your app

Let's open up `serverless.yml`

Now, let's update the deploy hook to run `yarn build`

```shell
name: website

website:
  component: '@serverless/website'
  inputs:
    code:
      src: dist
      hook: yarn build
```

Now, all you need to do is run:

```shell
serverless
```

The output will be:

```shell
➜   serverless

  website:
    url: http://8k2k8q-qbwj2nm.s3-website-us-east-1.amazonaws.com
    env:

  16s › website › done
```

Now you can visit the URL generated and check out your live site. 💥💥💥

<hr>

Sweet! We got a frontend application deployed using Serverless Framework's website component!

Hope you enjoyed this article and huge thanks to the team at Serverless for making our lives better. This is the kind of productivity gains I can live with.

Until next time! 👋

<hr>

## References

Oh! Want to know how I learned all this? Well - the serverless team has an amazing [YouTube channel](https://www.youtube.com/channel/UCFYG383lawh9Hrs_DEKTtdg) with tons of resources on learning how to go serverless.

Check out the below video for more information around getting up and going:

<iframe width="560" height="315" src="https://www.youtube.com/embed/ts26BVuX3j0" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
```
