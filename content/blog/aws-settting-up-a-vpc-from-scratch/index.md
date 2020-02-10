---
title: AWS - Building a VPC from Scratch
date: "2020-02-09T06:54:00.000Z"
description: I'm currently studying for my AWS Solutions Architect exam and setting up a VPC is an extremely important aspect of the exam. In fact, if you can set up a VPC from scratch by memory - you're well over halfway there. This post is a simple how-to guide for anyone interested in setting up their own VPC on AWS.
tags: aws,solutions architect,vpc,how-to,guide
---

The best way to learn anything is by digging in.

AWS has a wizard for building out a Virtual Private Cloud (VPC), but in this article - I'm going to share my notes on how to build one out yourself from scratch. You'll get to know the basic vocabulary used to build out a VPC. Below are notes I've put together on setting up a VPC based on my research and study for the [AWS Solutions Architect](https://aws.amazon.com/certification/certified-solutions-architect-associate/) exam. Hope you find this useful!

Below is a Table of Contents (TOC) for you to easily dive through each section as needed. If you're new to this, like I was, starting at [Create your VPC](#create-your-vpc) is the way to go. If you're studying and need a quick refresher for each step of the process, feel free to skip any section an move on.

- [Create your VPC](#create-your-vpc)
- [Create your Subnets](#create-your-subnets)
  - [Create Public Subnet](#create-public-subnet)
  - [Create Private Subnet](#create-private-subnet)
  - [Enable Public IP on Public Subnet](#enable-public-ip-on-public-subnet)
- [Create Internet Gateway](#create-internet-gateway)
- [Configuring your Route Table](#configuring-your-route-table)
- [Configuring EC2 Instances](#configuring-ec2-instances)
  - [Configuring a Public EC2 Instance](#configuring-a-public-ec2-instance)
  - [Configuring a Private EC2 Instance](#configuring-a-private-ec2-instance)
- [Testing Your VPC](#testing-your-vpc)
- [Enabling Subnet → Subnet Communication](#enabling-subnet---subnet-communication)
- [Testing our VPC for Cross Subnet Communication](#testing-our-vpc-for-cross-subnet-communication)
- [Summary: What we built](#summary--what-we-built)
- [References](#references)

<h1 id="create-your-vpc">Create your VPC</h1>

Go to VPC

![AWS Console Menu / Networking & Content Delivery / VPC](./assets/aws-console-menu.png)

Click on "Your VPC's"

![AWS Console / Virtual Private Cloud / Your VPC's](./assets/aws-your-vpcs.png)

Click on "Create VPC"

![AWS Console / Virtual Private Cloud / Your VPC's / Create VPC](./assets/aws-create-vpc.png)

Fill in the form. Specifying the proper CIDR block and selecting "Amazon Provided IPv6 CIDR block"

![AWS Console / Virtual Private Cloud / Create VPC](./assets/aws-console-vpcs-create-vpc.png)

Click "Create"

![AWS Console / Virtual Private Cloud / Create VPC / Success](./assets/aws-console-vpcs-create-vpc-success.png)

---

<h1 id="create-your-subnets">Create your Subnets</h1>

<h2 id="create-public-subnet">Create Public Subnet</h2>

Navigate to "Subnets"

![AWS Console / Virtual Private Cloud / Subnets](./assets/aws-console-vpcs-subnets.png)

Click "Create subnet"

![AWS Console / Virtual Private Cloud / Subnets / Create Subnet Button](./assets/aws-console-vpcs-subnets-create-subnet.png)

You should now see the "Create subnet" workflow:

![AWS Console / Virtual Private Cloud / Subnets / Create Subnet Screen](./assets/aws-console-vpcs-subnets-create-subnet-screen.png)

Fill In fields, like so:

![AWS Console / Virtual Private Cloud / Subnets / Create Subnet Screen / Filled In](./assets/aws-console-vpcs-subnets-create-subnet-screen-filledin.png)

Click "Create"

![AWS Console / Virtual Private Cloud / Subnets / Create Subnet / Success](./assets/aws-console-vpcs-subnets-create-subnet-success.png)

![AWS Console / Virtual Private Cloud / Subnets / Subnets / With New Subnet](./assets/aws-console-vpcs-subnets-new-subnet.png)

<h2 id="create-private-subnet">Create Private Subnet</h2>

Click "Create subnet"

![./assets/Screen_Shot_2020-02-05_at_7.20.46_AM.png](./assets/Screen_Shot_2020-02-05_at_7.20.46_AM.png)

Click "Create"

![./assets/Screen_Shot_2020-02-05_at_7.20.50_AM.png](./assets/Screen_Shot_2020-02-05_at_7.20.50_AM.png)

![./assets/Screen_Shot_2020-02-05_at_7.20.55_AM.png](./assets/Screen_Shot_2020-02-05_at_7.20.55_AM.png)

<h2 id="enable-public-ip-on-public-subnet">Enable Public IP on Public Subnet</h2>

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

<h1 id="create-internet-gateway">Create Internet Gateway</h1>

Navigate to "Internet Gateways"

![AWS Console / Virtual Private Cloud / Internet Gateways / Sidebar](./assets/aws-console-vpcs-internet-gateways-sidebar.png)

Click "Create Internet gateway"

![AWS Console / Virtual Private Cloud / Internet Gateways / Create Internet Gateway Button](./assets/aws-console-vpcs-internet-gateways-create-internet-gateway-button.png)

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

<h1 id="configuring-your-route-table">Configuring your Route Table</h1>

We need to configure our main route to go out to the internet.

Currently it is configured to have any subnet communicate with each other:

![AWS Console / Virtual Private Cloud / Route Tables / Main Route Table Routes](./assets/aws-console-vpcs-route-tables-main-route-routes.png)

Both existing subnets have also been, by default, associated to main routing table:

![AWS Console / Virtual Private Cloud / Route Tables / Main Route Table Subnet Associations](./assets/aws-console-vpcs-route-tables-main-route-table-subnet-associations.png)

Note: We do **NOT** want to open the main routing table to the internet. This would cause every subnet by default to be open to the internet.

Click "Create route table"

![AWS Console / Virtual Private Cloud / Route Tables / Create Route Table](./assets/aws-consle-vpcs-route-tables-create-route-table-button.png)

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

![AWS Console / Virtual Private Cloud / Route Tables / New Route Table / Edit Routes Button](./assets/aws-console-vpcs-route-tables-new-route-table-edit-routes-button.png)

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

![AWS Console / VPCs / Route Tables / New Route Table / Edit Subnet Associations](./assets/aws-console-vpcs-new-route-table-edit-subnet-associations.png)

Select the subnet(s) you want to be public, for this article, we're selecting any device under 10.0.1.0/24 to be public.

![./assets/Screen_Shot_2020-02-05_at_7.33.33_AM.png](./assets/Screen_Shot_2020-02-05_at_7.33.33_AM.png)

Click "Save"

Now, when you select a route table and inspect it's associated subnets - you should see something like:

![./assets/Screen_Shot_2020-02-05_at_7.33.37_AM.png](./assets/Screen_Shot_2020-02-05_at_7.33.37_AM.png)

![./assets/Screen_Shot_2020-02-05_at_7.33.40_AM.png](./assets/Screen_Shot_2020-02-05_at_7.33.40_AM.png)

Note that 10.0.1.0/24 has been associated with our new public route table, while 10.0.2.0/24 stays in our private main routing table.

---

<h1 id="configuring-ec2-instances">Configuring EC2 Instances</h1>

<h2 id="configuring-a-public-ec2-instance">Configuring a Public EC2 Instance</h2>

Our public EC2 instance will be our webserver, this is where your Rails, Django, Express application would exist. It needs to be publicly accessible so we're going to attach it to our public subnet within our VPC. Let's get started!

Navigate to EC2

![AWS Console / Menu / EC2](./assets/aws-console-menu-ec2.png)

Click "Launch Instance" and select "Launch instance" from dropdown:

![AWS Console / EC2 / Launch Instance button](./assets/aws-console-ec2-launch-instance-button.png)

Select an AMI, for this article - we're going with the first option:

![AWS Console / EC2 / Launch Instance / Choose AMI](./assets/aws-console-ec2-launch-instance-choose-ami.png)

Select the instance type you prefer, again for this article we're keeping it simple so we're going with the free tier t2.micro instance type. Then click "Configure Instance Details".

![./assets/Screen_Shot_2020-02-05_at_7.34.49_AM.png](./assets/Screen_Shot_2020-02-05_at_7.34.49_AM.png)

These are the default settings you'll see:

![./assets/Screen_Shot_2020-02-05_at_7.34.58_AM.png](./assets/Screen_Shot_2020-02-05_at_7.34.58_AM.png)

You'll want to change the "Network" and "Subnet". The "Network" will be your **VPC** and your subnet will be your **public subnet**.

![AWS Console / EC2 / Launch Instance / Configure Instance](./assets/aws-console-ec2-launch-instance-configure-instance.png)

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

<h2 id="configuring-a-private-ec2-instance">Configuring a Private EC2 Instance</h2>

Click "Launch instance"

![AWS Console / EC2 / Launch Instance Button w/ Public Instance Created](./assets/aws-console-ec2-launch-instance-button-2.png)

Select the AMI at the top, Amazon Linux 2 AMI

![./assets/Screen_Shot_2020-02-09_at_8.06.41_AM.png](./assets/Screen_Shot_2020-02-09_at_8.06.41_AM.png)

For the instance type, select t2.micro (free tier) and click "Next: Configure Instance Details"

![./assets/Screen_Shot_2020-02-09_at_8.06.44_AM.png](./assets/Screen_Shot_2020-02-09_at_8.06.44_AM.png)

These are the default settings you will see for your instance:

![./assets/Screen_Shot_2020-02-09_at_8.06.50_AM.png](./assets/Screen_Shot_2020-02-09_at_8.06.50_AM.png)

Let's configure this instance to use our VPC and the private subnet:

![AWS Console / EC2 / Launch Instance / Configure Instance / Private Subnet](./assets/aws-console-vpcs-new-route-table-edit-subnet-associations.png)

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

![AWS Console / EC2 / Launched Instances](./assets/aws-console-ec2-launched-instances.png)

Note: Your public instance, WebServer, will have an IPv4 Public IP - while your DBServer will not.

---

<h1 id="testing-your-vpc">Testing Your VPC</h1>

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

<h1 id="enabling-subnet---subnet-communication">Enabling Subnet → Subnet Communication</h1>

From the instances page, click on "Security Groups" in the left sidebar.

![AWS Console / EC2 / Security Groups Sidebar Link](./assets/aws-console-ec2-security-groups-sidebar.png)

Click on "Create Security Group".

![AWS Console / EC2 / Security Groups / Create Security Group Button](./assets/aws-console-ec2-securiyt-groups-create-security-group-button.png)

In the "Create Security Group" modal - you'll want out enable a few inbound rules:

- HTTP
- HTTPS
- MySQL/Aurora
- SSH

Each rule should then have a "Custom" source set to our public subnet 10.0.1.0/24. This security group is essentially going to tell our DB server that they allowed inbound communication from our public facing subnet.

![AWS Console / EC2 / Security Groups / Create Security Group Modal Values](./assets/aws-console-ec2-security-groups-create-security-group-modal-values.png)

Click "Create" and you should see your new security group in the table, like so:

![AWS Console / EC2 / Security Groups / Table with New Security Group](./assets/aws-console-ec2-security-groups-new-security-group-table.png)

Now, click on "Instances" in the left sidebar.

![AWS Console / EC2 / Instances in Sidebar link](./assets/aws-console-ec2-instances-sidebar.png)

From here, select the DB server, ours is "awesomesauceDBServer" and click "Actions". In the dropdown, hover over "Networking" and in the sub dropdown - click on "Change Security Group".

![AWS Console / EC2 / Instances / Change Security Group Action in Dropdown.png](./assets/aws-console-ec2-instances-change-security-group-action.png)

In the "Change Security Groups" mdoal, select the new security group we created and uncheck the default security group.

![./assets/Screen_Shot_2020-02-09_at_11.03.16_AM.png](./assets/Screen_Shot_2020-02-09_at_11.03.16_AM.png)

When you're done, click on "Assign Security Group".

Next, we'll test that our private subnet can accept inbound communication from our public subnet within our VPC.

---

<h1 id="testing-our-vpc-for-cross-subnet-communication">Testing our VPC for Cross Subnet Communication</h1>

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

<h1 id="summary--what-we-built">Summary: What we built</h1>

![Basic VPC Architecture](./assets/basic-vpc-architecture.png)

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

---

<h1 id="references">References</h1>

- [A Cloud Guru - AWS Certified Solutions Architect Associate 2020](https://acloud.guru/learn/aws-certified-solutions-architect-associate)
- [VPC FAQ's](https://aws.amazon.com/vpc/faqs/)
- [Amazon Virtual Private Cloud - User Guide](https://docs.aws.amazon.com/vpc/latest/userguide/what-is-amazon-vpc.html)
