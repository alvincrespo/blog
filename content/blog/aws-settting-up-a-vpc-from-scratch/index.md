---
title: AWS - Setting up a VPC from scratch
date: "2020-02-09T06:54:00.000Z"
description: I'm currently studying for my AWS Solutions Architect exam and setting up a VPC is an extremely important aspect of the exam. In fact, if you can set up a VPC from scratch by memory - you're well over halfway there. This post is a simple how-to guide for anyone interested in setting up their own VPC on AWS.
tags: aws,solutions architect,vpc,how-to,guide
---

# Building a VPC from Scratch

# Create your VPC

Go to VPC

![./assets/Untitled.png](./assets/Untitled.png)

Click on "Your VPC's"

![./assets/Untitled%201.png](./assets/aws-your-vpcs.png)

Click on "Create VPC"

![./assets/Untitled%202.png](./assets/Untitled%202.png)

Fill in the form. Specifying the proper CIDR block and selecting "Amazon Provided IPv6 CIDR block"

![./assets/Screen_Shot_2020-02-05_at_7.11.39_AM.png](./assets/Screen_Shot_2020-02-05_at_7.11.39_AM.png)

Click "Create"

![./assets/Screen_Shot_2020-02-05_at_7.11.48_AM.png](./assets/Screen_Shot_2020-02-05_at_7.11.48_AM.png)

---

# Create Subnet

## Create Public Subnet

Navigate to "Subnets"

![./assets/Screen_Shot_2020-02-05_at_7.16.44_AM.png](./assets/Screen_Shot_2020-02-05_at_7.16.44_AM.png)

Click "Create subnet"

![./assets/Untitled%203.png](./assets/Untitled%203.png)

You should now see the "Create subnet" workflow:

![./assets/Screen_Shot_2020-02-05_at_7.17.13_AM.png](./assets/Screen_Shot_2020-02-05_at_7.17.13_AM.png)

Fill In fields, like so:

![./assets/Screen_Shot_2020-02-05_at_7.18.58_AM.png](./assets/Screen_Shot_2020-02-05_at_7.18.58_AM.png)

Click "Create"

![./assets/Screen_Shot_2020-02-05_at_7.19.16_AM.png](./assets/Screen_Shot_2020-02-05_at_7.19.16_AM.png)

![./assets/Screen_Shot_2020-02-05_at_7.19.18_AM.png](./assets/Screen_Shot_2020-02-05_at_7.19.18_AM.png)

## Create Private Subnet

Click "Create subnet"

![./assets/Screen_Shot_2020-02-05_at_7.20.46_AM.png](./assets/Screen_Shot_2020-02-05_at_7.20.46_AM.png)

Click "Create"

![./assets/Screen_Shot_2020-02-05_at_7.20.50_AM.png](./assets/Screen_Shot_2020-02-05_at_7.20.50_AM.png)

![./assets/Screen_Shot_2020-02-05_at_7.20.55_AM.png](./assets/Screen_Shot_2020-02-05_at_7.20.55_AM.png)

## Enable Public IP on Public Subnet

Select the public subnet

![./assets/Screen_Shot_2020-02-05_at_7.26.20_AM.png](./assets/Screen_Shot_2020-02-05_at_7.26.20_AM.png)

Click Actions and select "modify auto-assign IP settings"

![./assets/Screen_Shot_2020-02-05_at_7.26.24_AM.png](./assets/Screen_Shot_2020-02-05_at_7.26.24_AM.png)

![./assets/Screen_Shot_2020-02-05_at_7.26.27_AM.png](./assets/Screen_Shot_2020-02-05_at_7.26.27_AM.png)

Select "Enable auto-assign public IPv4 address" and Click "Save"

![./assets/Screen_Shot_2020-02-05_at_7.26.31_AM.png](./assets/Screen_Shot_2020-02-05_at_7.26.31_AM.png)

You can now verify that the public subnet has an auto-assigned public IP address

![./assets/Screen_Shot_2020-02-05_at_7.26.44_AM.png](./assets/Screen_Shot_2020-02-05_at_7.26.44_AM.png)

---

# Create Internet Gateway

Navigate to "Internet Gateways"

![./assets/Untitled%204.png](./assets/Untitled%204.png)

Click "Create Internet gateway"

![./assets/Untitled%205.png](./assets/Untitled%205.png)

Give your new internet gateway a name

![./assets/Screen_Shot_2020-02-05_at_7.27.19_AM.png](./assets/Screen_Shot_2020-02-05_at_7.27.19_AM.png)

![./assets/Screen_Shot_2020-02-05_at_7.27.23_AM.png](./assets/Screen_Shot_2020-02-05_at_7.27.23_AM.png)

Your new internet gateway will be "detached"

![./assets/Screen_Shot_2020-02-05_at_7.27.32_AM.png](./assets/Screen_Shot_2020-02-05_at_7.27.32_AM.png)

Select your new "detached" internet gateway

![./assets/Screen_Shot_2020-02-05_at_7.27.35_AM.png](./assets/Screen_Shot_2020-02-05_at_7.27.35_AM.png)

Click "Actions" and select "Attach to VPC"

![./assets/Screen_Shot_2020-02-05_at_7.27.38_AM.png](./assets/Screen_Shot_2020-02-05_at_7.27.38_AM.png)

Attach the internet gateway to your new VPC

![./assets/Screen_Shot_2020-02-05_at_7.27.47_AM.png](./assets/Screen_Shot_2020-02-05_at_7.27.47_AM.png)

Click "Attach" and you should then see your new internet gateway attached to your VPC

![./assets/Screen_Shot_2020-02-05_at_7.28.31_AM.png](./assets/Screen_Shot_2020-02-05_at_7.28.31_AM.png)

---

# Configuring your Route Table

We need to configure our main route to go out to the internet.

Currently it is configured to have any subnet communicate with each other:

![./assets/Untitled%206.png](./assets/Untitled%206.png)

Both existing subnets have also been, by default, associated to main routing table:

![./assets/Untitled%207.png](./assets/Untitled%207.png)

Note: We do **NOT** want to open the main routing table to the internet. This would cause every subnet by default to be open to the internet.

Click "Create route table"

![./assets/Untitled%208.png](./assets/Untitled%208.png)

Give your new route table a name, and associate it with your new VPC

![./assets/Screen_Shot_2020-02-05_at_7.30.58_AM.png](./assets/Screen_Shot_2020-02-05_at_7.30.58_AM.png)

Click "Create"

![./assets/Screen_Shot_2020-02-05_at_7.31.01_AM.png](./assets/Screen_Shot_2020-02-05_at_7.31.01_AM.png)

Click "Close" and you should be taken to your route tables table:

![./assets/Screen_Shot_2020-02-05_at_7.31.12_AM.png](./assets/Screen_Shot_2020-02-05_at_7.31.12_AM.png)

Select your new route table and navigate to the "routes" tab:

![./assets/Screen_Shot_2020-02-05_at_7.31.58_AM.png](./assets/Screen_Shot_2020-02-05_at_7.31.58_AM.png)

You'll notice the new route table is not automatically configured to connect with the internet.

Click on "Edit routes"

![./assets/Untitled%209.png](./assets/Untitled%209.png)

Add both IPv4 and IPv6 routes and select the internet gateway that was created in the last section:

![./assets/Screen_Shot_2020-02-05_at_7.33.01_AM.png](./assets/Screen_Shot_2020-02-05_at_7.33.01_AM.png)

Note: 0.0.0.0/0 - IPv4 and ::/0 - IPv6

Click "Save routes" when done.

![./assets/Screen_Shot_2020-02-05_at_7.33.04_AM.png](./assets/Screen_Shot_2020-02-05_at_7.33.04_AM.png)

Click "Close". You should now be taken to your routes table.

Click on your new route table, and select "Routes" tab. You should see your new routes added:

![./assets/Screen_Shot_2020-02-05_at_7.33.06_AM.png](./assets/Screen_Shot_2020-02-05_at_7.33.06_AM.png)

However, neither of our subnets are associated with this public facing route table.

Select, "Subnet Associations"

![./assets/Screen_Shot_2020-02-05_at_7.33.24_AM.png](./assets/Screen_Shot_2020-02-05_at_7.33.24_AM.png)

You'll notice, no subnets are associated with this table.

Click "Edit subnet associations"

![./assets/Untitled%2010.png](./assets/Untitled%2010.png)

Select the subnet(s) you want to be public, for this article, we're selecting any device under 10.0.1.0/24 to be public.

![./assets/Screen_Shot_2020-02-05_at_7.33.33_AM.png](./assets/Screen_Shot_2020-02-05_at_7.33.33_AM.png)

Click "Save"

Now, when you select a route table and inspect it's associated subnets - you should see something like:

![./assets/Screen_Shot_2020-02-05_at_7.33.37_AM.png](./assets/Screen_Shot_2020-02-05_at_7.33.37_AM.png)

![./assets/Screen_Shot_2020-02-05_at_7.33.40_AM.png](./assets/Screen_Shot_2020-02-05_at_7.33.40_AM.png)

Note that 10.0.1.0/24 has been associated with our new public route table, while 10.0.2.0/24 stays in our private main routing table.

---

# Configuring EC2 Instances

## Configuring a Public EC2 Instance

Our public EC2 instance will be our webserver, this is where your Rails, Django, Express application would exist. It needs to be publicly accessible so we're going to attach it to our public subnet within our VPC. Let's get started!

Navigate to EC2

![./assets/Untitled%2011.png](./assets/Untitled%2011.png)

Click "Launch Instance" and select "Launch instance" from dropdown:

![./assets/Untitled%2012.png](./assets/Untitled%2012.png)

Select an AMI, for this article - we're going with the first option:

![./assets/Untitled%2013.png](./assets/Untitled%2013.png)

Select the instance type you prefer, again for this article we're keeping it simple so we're going with the free tier t2.micro instance type. Then click "Configure Instance Details".

![./assets/Screen_Shot_2020-02-05_at_7.34.49_AM.png](./assets/Screen_Shot_2020-02-05_at_7.34.49_AM.png)

These are the default settings you'll see:

![./assets/Screen_Shot_2020-02-05_at_7.34.58_AM.png](./assets/Screen_Shot_2020-02-05_at_7.34.58_AM.png)

You'll want to change the "Network" and "Subnet". The "Network" will be your **VPC** and your subnet will be your **public subnet**.

![./assets/Untitled%2014.png](./assets/Untitled%2014.png)

Note: The auto-assign Public IP is set to "Use subnet setting (Enable)".

Click "Next: Add Storage"

![./assets/Screen_Shot_2020-02-05_at_7.35.33_AM.png](./assets/Screen_Shot_2020-02-05_at_7.35.33_AM.png)

We're not changing anything here, click "Next: Add Tags"

Here, we're going to add a "Name" and set it to "awesomesauceWebServer" - you can name it whatever you like - I'm prefixing it with "awesomesauce" because thats the name of my VPC.

When you're done, click "Next: Configure Security Group"

![./assets/Screen_Shot_2020-02-09_at_7.49.02_AM.png](./assets/Screen_Shot_2020-02-09_at_7.49.02_AM.png)

Here, we'll create a new security group - I'm naming this one "awesomesauceDMZ". I'm also adding a rule for HTTP. To do this, click "Add Rule" and select "HTTP" from the dropdown.

When you're done, click "Review and Launch"

![./assets/Screen_Shot_2020-02-09_at_7.51.34_AM.png](./assets/Screen_Shot_2020-02-09_at_7.51.34_AM.png)

On this page, you can review all the settings for your public EC2 instance:

When, you're done verifying the settings - click "Launch".

![./assets/Screen_Shot_2020-02-09_at_7.51.38_AM.png](./assets/Screen_Shot_2020-02-09_at_7.51.38_AM.png)

The next step is creating or selecting an existing key pair. For this article, I'm going to create a new key pair and name it "awesomesauceKP".

Make sure to download this Key Pair and move it to a secure location. I store mine on 1password as secure file.

Finally, click "Launch Instance".

![./assets/Screen_Shot_2020-02-09_at_7.52.33_AM.png](./assets/Screen_Shot_2020-02-09_at_7.52.33_AM.png)

Your new instance will now start launching, click "View Instances"

![./assets/Screen_Shot_2020-02-09_at_7.52.38_AM.png](./assets/Screen_Shot_2020-02-09_at_7.52.38_AM.png)

When your new instance is done "launching" it will be in the instance state "running":

![./assets/Instances__EC2_Management_Console_2020-02-09_08-02-14.jpg](./assets/Instances__EC2_Management_Console_2020-02-09_08-02-14.jpg)

Awesome! Now it's time to create a private EC2 instance.

---

## Configuring a Private EC2 Instance

Click "Launch instance"

![./assets/Untitled%2015.png](./assets/Untitled%2015.png)

Select the AMI at the top, Amazon Linux 2 AMI

![./assets/Screen_Shot_2020-02-09_at_8.06.41_AM.png](./assets/Screen_Shot_2020-02-09_at_8.06.41_AM.png)

For the instance type, select t2.micro (free tier) and click "Next: Configure Instance Details"

![./assets/Screen_Shot_2020-02-09_at_8.06.44_AM.png](./assets/Screen_Shot_2020-02-09_at_8.06.44_AM.png)

These are the default settings you will see for your instance:

![./assets/Screen_Shot_2020-02-09_at_8.06.50_AM.png](./assets/Screen_Shot_2020-02-09_at_8.06.50_AM.png)

Let's configure this instance to use our VPC and the private subnet:

![./assets/Untitled%2016.png](./assets/Untitled%2016.png)

Note: The "Auto-assign Public IP" option will be set to "Use subnet setting (Disable)". It is disabled because we're putting it behind our private subnet.

Click "Next: Add Storage"

We'll leave our storage as is. Click "Next: Add Tags"

![./assets/Screen_Shot_2020-02-09_at_8.15.20_AM.png](./assets/Screen_Shot_2020-02-09_at_8.15.20_AM.png)

I'm going to give this instance a "Name" of "awesomesauceDBServer".

Click "Next: Configure Security Groups"

![./assets/Screen_Shot_2020-02-09_at_8.51.26_AM.png](./assets/Screen_Shot_2020-02-09_at_8.51.26_AM.png)

This private instance will keep the default security group.

Click "Review and Launch"

![./assets/Screen_Shot_2020-02-09_at_8.23.21_AM.png](./assets/Screen_Shot_2020-02-09_at_8.23.21_AM.png)

Review your instances setup here.

When done, click "Launch"

![./assets/Screen_Shot_2020-02-09_at_8.23.37_AM.png](./assets/Screen_Shot_2020-02-09_at_8.23.37_AM.png)

Before launching, you'll be asked again to "Select an existing key pair or create new key pair". Select "Choose an existing key pair" and select the created key pair from the last section called "awesomesauceKP".

Check the checkbox for acknowledging you have access to that key pair.

Click "Launch Instances"

![./assets/Screen_Shot_2020-02-09_at_8.23.47_AM.png](./assets/Screen_Shot_2020-02-09_at_8.23.47_AM.png)

You'll be taken to your instances status page, click "View Instances"

![./assets/Screen_Shot_2020-02-09_at_8.23.53_AM.png](./assets/Screen_Shot_2020-02-09_at_8.23.53_AM.png)

Your instance may be pending, but once it's finished launching - you should see:

![./assets/Untitled%2017.png](./assets/Untitled%2017.png)

Note: Your public instance, WebServer, will have an IPv4 Public IP - while your DBServer will not.

---

# Testing Your VPC

First, we need to `chmod` our new key pair:

    chmod 400 awesomesauceKP.pem

Next, we'll SSH into our public facing EC2 instance:

    ➜  SSH ssh ec2-user@13.59.155.220 -i awesomesauceKP.pem
    The authenticity of host '13.59.155.220 (13.59.155.220)' can't be established.
    ECDSA key fingerprint is SHA256:D9SKlqUSlqtZNPcYEF6+VtqMu0InXbY/KnwdXm5Zrgo.
    Are you sure you want to continue connecting (yes/no)? yes
    Warning: Permanently added '13.59.155.220' (ECDSA) to the list of known hosts.

           __|  __|_  )
           _|  (     /   Amazon Linux 2 AMI
          ___|\___|___|

    https://aws.amazon.com/amazon-linux-2/
    7 package(s) needed for security, out of 39 available
    Run "sudo yum update" to apply all updates.
    [ec2-user@ip-10-0-1-203 ~]$

Yay! We can connect to our public EC2 instance!

However, we can't ping our private instance:

    [ec2-user@ip-10-0-1-203 ~]$ ping 10.0.2.201 -w 2
    PING 10.0.2.201 (10.0.2.201) 56(84) bytes of data.

    --- 10.0.2.201 ping statistics ---
    2 packets transmitted, 0 received, 100% packet loss, time 1031ms

This is because we used our default security group when creating the private instance. We need to create a security group specific to our DB server and allow it to be accessed specifically by our subnet. Let's do it!

---

# Enabling Subnet → Subnet Communication

From the instances page, click on "Security Groups" in the left sidebar.

![./assets/Untitled%2018.png](./assets/Untitled%2018.png)

Click on "Creates Security Group".

![./assets/Untitled%2019.png](./assets/Untitled%2019.png)

In the "Create Security Group" modal - you'll want out enable a few inbound rules:

- HTTP
- HTTPS
- MySQL/Aurora
- SSH

Each rule should then have a "Custom" source set to our public subnet 10.0.1.0/24. This security group is essentially going to tell our DB server that they allowed inbound communication from our public facing subnet.

![./assets/Untitled%2020.png](./assets/Untitled%2020.png)

Click "Create" and you should see your new security group in the table, like so:

![./assets/Untitled%2021.png](./assets/Untitled%2021.png)

Now, click on "Instances" in the left sidebar.

![./assets/Untitled%2022.png](./assets/Untitled%2022.png)

From here, select the DB server, ours is "awesomesauceDBServer" and click "Actions". In the dropdown, hover over "Networking" and in the sub dropdown - click on "Change Security Group".

![./assets/Untitled%2023.png](./assets/Untitled%2023.png)

In the "Change Security Groups" mdoal, select the new security group we created and uncheck the default security group.

![./assets/Screen_Shot_2020-02-09_at_11.03.16_AM.png](./assets/Screen_Shot_2020-02-09_at_11.03.16_AM.png)

---

# Testing our VPC for Cross Subnet Communication

Alright! So now that our DB server has the newly configured security group to allow inbound communication from our public subnet - let's see if we can ping our DB server from inside our Web server:

    [ec2-user@ip-10-0-1-203 ~]$ ping 10.0.2.201 -w 2
    PING 10.0.2.201 (10.0.2.201) 56(84) bytes of data.

    --- 10.0.2.201 ping statistics ---
    2 packets transmitted, 0 received, 100% packet loss, time 1031ms

    [ec2-user@ip-10-0-1-203 ~]$ ping 10.0.2.201 -w 2
    PING 10.0.2.201 (10.0.2.201) 56(84) bytes of data.
    64 bytes from 10.0.2.201: icmp_seq=1 ttl=255 time=0.985 ms
    64 bytes from 10.0.2.201: icmp_seq=2 ttl=255 time=0.988 ms

    --- 10.0.2.201 ping statistics ---
    2 packets transmitted, 2 received, 0% packet loss, time 1001ms
    rtt min/avg/max/mdev = 0.985/0.986/0.988/0.031 ms
    [ec2-user@ip-10-0-1-203 ~]$

🎉🎉🎉 We now have cross communication between public and private subnets within our VPC.

---

# Summary: What we built

![./assets/Caching_Cluster_Architecture.png](./assets/Caching_Cluster_Architecture.png)

The diagram above shows what we have built.

- A VPC
  - Containing Two Subnets
    - One Public Subnet
      - An instance that can be accessed from the internet
    - One Private Subnet
      - An instance that cannot be accessed from the internet
  - Interfacing with an Internet Gateway
  - A main route table that does not have internet access
    - That has 10.0.2.0/24 subnet automatically attached to it since this subnet is not associated to any route table
  - A custom route table that does have internet access
    - That also has the 10.0.1.0/24 subnet associated with it
