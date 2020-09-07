---
title: Integrating Google OAuth in Rails - Part 1
date: "2020-09-07T13:00:00.000Z"
description: I've recently had to integrate Google Authentication for a side project. Join me in this first part - setting up our Google API.
tags: googleapi,oauth,rails
---

Have you ever had to integrate OAuth? Integrate with Google? No?! Cool.

This series is focused on helping you integrate with Google APIs fairly quickly. I'm going to show you how to 1) create events for your users google calendar and 2) manage incoming/outgoing communication via Gmail right within your app.

For this first part, we'll be setting up our app in Google's developer console. So let's get started!

<hr>

You'll need to follow along at [console.developers.google.com](https://console.developers.google.com).

First, let's create a new project. You can name it anything, for my personal set up - I have 3 projects:

- Development (local)
- Staging
- Production

I do this to separate out each environment. For the sake of this article, I'm just using the default name filled in by Google.

![](https://alvincrespo-blog.s3.us-east-2.amazonaws.com/integrating-google-oauth-in-rails/Screen+Shot+2020-09-07+at+12.10.08+PM.png)

Once the project is created, you'll see the following dashboard:

![](https://alvincrespo-blog.s3.us-east-2.amazonaws.com/integrating-google-oauth-in-rails/Screen+Shot+2020-09-07+at+12.22.51+PM.png)

We need to enable the API's we'll be using. In this series, I'm adding Calendar and Gmail. Let me show you how can do this fairly easily for Google Calendar.

Click on "ENAABLE APIS AND SERVICES" button in the middle of top bar next to "APIs & Services".

You'll be taken to the following page:

![](https://alvincrespo-blog.s3.us-east-2.amazonaws.com/integrating-google-oauth-in-rails/Screen+Shot+2020-09-07+at+12.23.43+PM.png)

In the search bar, type in "Calendar". This should give you the following results:

![](https://alvincrespo-blog.s3.us-east-2.amazonaws.com/integrating-google-oauth-in-rails/Screen+Shot+2020-09-07+at+12.24.31+PM.png)

Click on the first result, "Google Calendar API". You should then be taken to:

![](https://alvincrespo-blog.s3.us-east-2.amazonaws.com/integrating-google-oauth-in-rails/Screen+Shot+2020-09-07+at+12.25.04+PM.png)

Click on the blue "Enable" button. Once enabled, you'll be taken to:

![](https://alvincrespo-blog.s3.us-east-2.amazonaws.com/integrating-google-oauth-in-rails/Screen+Shot+2020-09-07+at+12.11.35+PM.png)

Here, you'll want to click on "Create Credentials" button at the top right of the content area.

This will take you to a wizard, where you'll fill in a few questions:

![](https://alvincrespo-blog.s3.us-east-2.amazonaws.com/integrating-google-oauth-in-rails/Screen+Shot+2020-09-07+at+12.11.46+PM.png)

For the "Which API are you using?", select "Google Calendar API".

For the "Where will you be calling the API from?", select "Web server (e.g. nodejs, Tomcat)"

For "What data will you be accessing?", select "User data".

Your options should match:

![](https://alvincrespo-blog.s3.us-east-2.amazonaws.com/integrating-google-oauth-in-rails/Screen+Shot+2020-09-07+at+12.12.04+PM.png)

There should be a blue highlighted button, "What credetnials do I need?". Click that button.

You will receive a modal to "Set up OAuth consent screen":

![](https://alvincrespo-blog.s3.us-east-2.amazonaws.com/integrating-google-oauth-in-rails/Screen+Shot+2020-09-07+at+12.12.08+PM.png)

Click on "Set up consent screen". This will open up a new tab:

![](https://alvincrespo-blog.s3.us-east-2.amazonaws.com/integrating-google-oauth-in-rails/Screen+Shot+2020-09-07+at+12.12.15+PM.png)

Select "External" for User Type and click "Create".

![](https://alvincrespo-blog.s3.us-east-2.amazonaws.com/integrating-google-oauth-in-rails/Screen+Shot+2020-09-07+at+12.12.20+PM.png)

You will then be taken to the "OAuth consent screen", where you will fill in details about your app.

![](https://alvincrespo-blog.s3.us-east-2.amazonaws.com/integrating-google-oauth-in-rails/Screen+Shot+2020-09-07+at+12.12.35+PM.png)

For "Application Type", select "Public".

For "Application name", fill in the name for your app - in the screenshot below I use "My Awesome App".

Scroll to the bottom of the page and click "Save".

![](https://alvincrespo-blog.s3.us-east-2.amazonaws.com/integrating-google-oauth-in-rails/Screen+Shot+2020-09-07+at+12.48.13+PM.png)

Once the settings have been saved, go back to the first tab to set up credentials.

Now, we're going to create the Client ID.

Fill in the name for the client ID, I'm using "myoauth".

Then, click on "refresh".

![](https://alvincrespo-blog.s3.us-east-2.amazonaws.com/integrating-google-oauth-in-rails/Screen+Shot+2020-09-07+at+12.12.48+PM.png)

Once refresh is completed, you'll see the "Create OAuth client ID" button.

![](https://alvincrespo-blog.s3.us-east-2.amazonaws.com/integrating-google-oauth-in-rails/Screen+Shot+2020-09-07+at+12.14.11+PM.png)

This will create the credentials you'll use to authenticate.

![](https://alvincrespo-blog.s3.us-east-2.amazonaws.com/integrating-google-oauth-in-rails/Screen+Shot+2020-09-07+at+12.14.19+PM.png)

Download these credentials and keep them safe. I tend to upload these to my personal 1Password account.

Finally, click on "Done".

You'll be taken to the Credentials dashboard.

![](https://alvincrespo-blog.s3.us-east-2.amazonaws.com/integrating-google-oauth-in-rails/Screen+Shot+2020-09-07+at+12.14.25+PM.png)

Here you'll see the credentials you created.

<hr>

Congratulations! 🎆🎆🎆

You have successfully set up credentials for your integration with Google API's. This specific intro set up Calendar. You'll want to go in and set up Gmail next. I'll let you tackle that one on your own. Don't worry though, I'll be creating a separate post for Gmail API's - but that'll come later.

Either way, the next part is setting up your Rails app to integrate with Google Calendar.

Thanks for reading and definitely check back for the next part in the series.
