---
title: Integrating Google OAuth in Rails - Part 1
date: "2020-09-07T13:00:00.000Z"
description: "Have you ever had to integrate OAuth? Integrate with Google? No?! Cool. This series is focused on helping you integrate with Google APIs fairly quickly. I'm going to show you how to 1) create events for your users google calendar and 2) manage incomi..."
tags:
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

![](./d95cb218-f47a-454f-aed4-339475e2d806.png)

Once the project is created, you'll see the following dashboard:

![](./04e28e15-8e5b-465b-ab36-b9b832e6ff2c.png)

We need to enable the API's we'll be using. In this series, I'm adding Calendar and Gmail. Let me show you how can do this fairly easily for Google Calendar.

Click on "ENAABLE APIS AND SERVICES" button in the middle of top bar next to "APIs & Services".

You'll be taken to the following page:

![](./357543f1-9d8a-4f53-881c-61429e8610d6.png)

In the search bar, type in "Calendar". This should give you the following results:

![](./7265922c-9d60-49fe-8980-d4a37694ab4c.png)

Click on the first result, "Google Calendar API". You should then be taken to:

![](./6ec5a4c6-8b7a-47ff-b58f-4fa2e48619c6.png)

Click on the blue "Enable" button. Once enabled, you'll be taken to:

![](./f696a2c4-0d93-40af-9763-99ca6a893247.png)

Here, you'll want to click on "Create Credentials" button at the top right of the content area.

This will take you to a wizard, where you'll fill in a few questions:

![](./e384e324-c882-4042-ac99-a32f16c3762e.png)

For the "Which API are you using?", select "Google Calendar API".

For the "Where will you be calling the API from?", select "Web server (e.g. nodejs, Tomcat)"

For "What data will you be accessing?", select "User data".

Your options should match:

![](./3b99ec21-40ae-4666-ad58-261db78ac484.png)

There should be a blue highlighted button, "What credetnials do I need?". Click that button.

You will receive a modal to "Set up OAuth consent screen":

![](./fac16329-b5c6-410c-9d65-d87a0db5ea66.png)

Click on "Set up consent screen". This will open up a new tab:

![](./efef94b1-b017-4af8-8812-43c10a449923.png)

Select "External" for User Type and click "Create".

![](./8feb31aa-8fd0-4df7-8a58-164f3c2ec3a0.png)

You will then be taken to the "OAuth consent screen", where you will fill in details about your app.

![](./39455569-9e7c-4b9f-afb8-efae19ac9ad4.png)

For "Application Type", select "Public".

For "Application name", fill in the name for your app - in the screenshot below I use "My Awesome App".

Scroll to the bottom of the page and click "Save".

![](./3bffd6cc-9a5d-4376-8df2-db3305fce5f2.png)

Once the settings have been saved, go back to the first tab to set up credentials.

Now, we're going to create the Client ID.

Fill in the name for the client ID, I'm using "myoauth".

Then, click on "refresh".

![](./3b719e37-dcb0-4efb-a0b9-19f8d7691bd0.png)

Once refresh is completed, you'll see the "Create OAuth client ID" button.

![](./ed24f3dc-f19e-4264-88d1-5f4a8ef21bd8.png)

This will create the credentials you'll use to authenticate.

![](./23c8cb5f-8ba7-43be-84c2-64e106950762.png)

Download these credentials and keep them safe. I tend to upload these to my personal 1Password account.

Finally, click on "Done".

You'll be taken to the Credentials dashboard.

![](./a2c77d27-d81e-4ebf-a87c-78aef4de3be1.png)

Here you'll see the credentials you created.

<hr>

Congratulations! 🎆🎆🎆

You have successfully set up credentials for your integration with Google API's. This specific intro set up Calendar. You'll want to go in and set up Gmail next. I'll let you tackle that one on your own. Don't worry though, I'll be creating a separate post for Gmail API's - but that'll come later.

Either way, the next part is setting up your Rails app to integrate with Google Calendar.

Thanks for reading and definitely check back for the next part in the series.
