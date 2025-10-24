---
title: AWS - Building a VPC from Scratch
date: "2020-02-09T06:54:00.000Z"
description: "The best way to learn anything is by digging in. AWS has a wizard for building out a Virtual Private Cloud (VPC), but in this article - I'm going to share my notes on how to build one out yourself from scratch. You'll get to know the basic vocabulary..."
tags:
---

The best way to learn anything is by digging in.

AWS has a wizard for building out a Virtual Private Cloud (VPC), but in this article - I'm going to share my notes on how to build one out yourself from scratch. You'll get to know the basic vocabulary used to build out a VPC. Below are notes I've put together on setting up a VPC based on my research and study for the [AWS Solutions Architect](https://aws.amazon.com/certification/certified-solutions-architect-associate/) exam. Hope you find this useful!

Below is a Table of Contents (TOC) for you to easily dive through each section as needed. If you're new to this, like I was, starting at [Create your VPC](#create-your-vpc) is the way to go. If you're studying and need a quick refresher for each step of the process, feel free to skip any section an move on.

* [Create your VPC](#create-your-vpc)
    
* [Create your Subnets](#create-your-subnets)
    
    * [Create Public Subnet](#create-public-subnet)
        
    * [Create Private Subnet](#create-private-subnet)
        
    * [Enable Public IP on Public Subnet](#enable-public-ip-on-public-subnet)
        
* [Create Internet Gateway](#create-internet-gateway)
    
* [Configuring your Route Table](#configuring-your-route-table)
    
* [Configuring EC2 Instances](#configuring-ec2-instances)
    
    * [Configuring a Public EC2 Instance](#configuring-a-public-ec2-instance)
        
    * [Configuring a Private EC2 Instance](#configuring-a-private-ec2-instance)
        
* [Testing Your VPC](#testing-your-vpc)
    
* [Enabling Subnet → Subnet Communication](#enabling-subnet---subnet-communication)
    
* [Testing our VPC for Cross Subnet Communication](#testing-our-vpc-for-cross-subnet-communication)
    
* [Summary: What we built](#summary--what-we-built)
    
* [References](#references)
    

# Create your VPC

Go to VPC

![AWS Console Menu / Networking & Content Delivery / VPC](./c672dc5d-9124-4da0-a6f9-4bed6ecc1862.png)

Click on "Your VPC's"

![AWS Console / Virtual Private Cloud / Your VPC's](./e9c0e7af-5d32-49c3-9736-66eb8b980e15.png)

Click on "Create VPC"

![AWS Console / Virtual Private Cloud / Your VPC's / Create VPC](./d2261bd7-4c32-4e79-a142-790c09d060d2.png)

Fill in the form. Specifying the proper CIDR block and selecting "Amazon Provided IPv6 CIDR block"

![AWS Console / Virtual Private Cloud / Create VPC](./fa1e80d4-1ec8-4f98-9b54-69219ed90c7c.png)

Click "Create"

![AWS Console / Virtual Private Cloud / Create VPC / Success](./52a754ef-f69a-4406-b487-768e2b44aeb6.png)

---

# Create your Subnets

## Create Public Subnet

Navigate to "Subnets"

![AWS Console / Virtual Private Cloud / Subnets](./8da90e72-2434-4f55-a960-0fda17353c1b.png)

Click "Create subnet"

![AWS Console / Virtual Private Cloud / Subnets / Create Subnet Button](./f15072e2-25a5-4ea1-bd71-fdf8a4375c09.png)

You should now see the "Create subnet" workflow:

![AWS Console / Virtual Private Cloud / Subnets / Create Subnet Screen](./09f2abe4-ddfc-4388-a597-2cf59b927325.png)

Fill In fields, like so:

![AWS Console / Virtual Private Cloud / Subnets / Create Subnet Screen / Filled In](./2dbd3081-9fbb-48e9-a44c-f6d85f8c773c.png)

Click "Create"

![AWS Console / Virtual Private Cloud / Subnets / Create Subnet / Success](./e2662673-7408-4be1-a9b4-36d688ec7ade.png)

![AWS Console / Virtual Private Cloud / Subnets / Subnets / With New Subnet](./b893b6be-2647-4ae3-bd58-0e09be715a42.png)

## Create Private Subnet

Click "Create subnet"

![https://cdn.hashnode.com/res/hashnode/image/upload/v1722348923809/21c1b15a-9987-4ac5-b2a2-9c5708f18d75.png](https://alvincrespo-blog.s3.us-east-2.amazonaws.com/aws-setting-up-a-vpc-from-scratch/Screen_Shot_2020-02-05_at_7.20.46_AM.png)

Click "Create"

![https://cdn.hashnode.com/res/hashnode/image/upload/v1722348925403/5f257ecc-b819-4aca-bb36-e61f7d28295c.png](https://alvincrespo-blog.s3.us-east-2.amazonaws.com/aws-setting-up-a-vpc-from-scratch/Screen_Shot_2020-02-05_at_7.20.50_AM.png)

![https://cdn.hashnode.com/res/hashnode/image/upload/v1722348926751/50a1e361-bf64-4078-a6e9-62cb5c060c0a.png](https://alvincrespo-blog.s3.us-east-2.amazonaws.com/aws-setting-up-a-vpc-from-scratch/Screen_Shot_2020-02-05_at_7.20.55_AM.png)

## Enable Public IP on Public Subnet

Select the public subnet

![https://cdn.hashnode.com/res/hashnode/image/upload/v1722348928392/5b25578b-abc5-4faa-8cc0-a5951d278022.png](https://alvincrespo-blog.s3.us-east-2.amazonaws.com/aws-setting-up-a-vpc-from-scratch/Screen_Shot_2020-02-05_at_7.26.20_AM.png)

Click Actions and select "modify auto-assign IP settings"

![https://cdn.hashnode.com/res/hashnode/image/upload/v1722348930357/a4ba48db-d412-4369-bf9a-8e50d1664ba1.png](https://alvincrespo-blog.s3.us-east-2.amazonaws.com/aws-setting-up-a-vpc-from-scratch/Screen_Shot_2020-02-05_at_7.26.24_AM.png)

![https://cdn.hashnode.com/res/hashnode/image/upload/v1722348932246/0621c6cb-b243-4397-9b99-d45748dfb82a.png](https://alvincrespo-blog.s3.us-east-2.amazonaws.com/aws-setting-up-a-vpc-from-scratch/Screen_Shot_2020-02-05_at_7.26.27_AM.png)

Select "Enable auto-assign public IPv4 address" and Click "Save"

![https://cdn.hashnode.com/res/hashnode/image/upload/v1722348933932/dd341c3e-ad88-4753-8ea8-e4fe43d364eb.png](https://alvincrespo-blog.s3.us-east-2.amazonaws.com/aws-setting-up-a-vpc-from-scratch/Screen_Shot_2020-02-05_at_7.26.31_AM.png)

You can now verify that the public subnet has an auto-assigned public IP address

![https://cdn.hashnode.com/res/hashnode/image/upload/v1722348935359/e1c0ab7f-6103-4c11-a7e6-cfdc4bc2b05f.png](https://alvincrespo-blog.s3.us-east-2.amazonaws.com/aws-setting-up-a-vpc-from-scratch/Screen_Shot_2020-02-05_at_7.26.44_AM.png)

---

# Create Internet Gateway

Navigate to "Internet Gateways"

![AWS Console / Virtual Private Cloud / Internet Gateways / Sidebar](./c33175db-aef7-4e2a-abaa-9a19a90ede70.png)

Click "Create Internet gateway"

![AWS Console / Virtual Private Cloud / Internet Gateways / Create Internet Gateway Button](./3ca869dd-74e5-4dd7-858d-883c6d213b55.png)

Give your new internet gateway a name

![https://cdn.hashnode.com/res/hashnode/image/upload/v1722348940844/6ef87550-a332-4a78-a86c-cea31aab7d25.png](https://alvincrespo-blog.s3.us-east-2.amazonaws.com/aws-setting-up-a-vpc-from-scratch/Screen_Shot_2020-02-05_at_7.27.19_AM.png)

![https://cdn.hashnode.com/res/hashnode/image/upload/v1722348942337/b36ae25a-f339-4fde-9b48-200d06d894a0.png](https://alvincrespo-blog.s3.us-east-2.amazonaws.com/aws-setting-up-a-vpc-from-scratch/Screen_Shot_2020-02-05_at_7.27.23_AM.png)

Your new internet gateway will be "detached"

![https://cdn.hashnode.com/res/hashnode/image/upload/v1722348943994/1e55c4e7-18eb-4215-821f-62c5f87a552f.png](https://alvincrespo-blog.s3.us-east-2.amazonaws.com/aws-setting-up-a-vpc-from-scratch/Screen_Shot_2020-02-05_at_7.27.32_AM.png)

Select your new "detached" internet gateway

![https://cdn.hashnode.com/res/hashnode/image/upload/v1722348945618/b28b02c1-248c-4be8-b772-d7da78729e58.png](https://alvincrespo-blog.s3.us-east-2.amazonaws.com/aws-setting-up-a-vpc-from-scratch/Screen_Shot_2020-02-05_at_7.27.35_AM.png)

Click "Actions" and select "Attach to VPC"

![https://cdn.hashnode.com/res/hashnode/image/upload/v1722348947302/b4b0f57a-8171-4f71-9c07-d9744f83b50d.png](https://alvincrespo-blog.s3.us-east-2.amazonaws.com/aws-setting-up-a-vpc-from-scratch/Screen_Shot_2020-02-05_at_7.27.38_AM.png)

Attach the internet gateway to your new VPC

![https://cdn.hashnode.com/res/hashnode/image/upload/v1722348948842/205ea862-7215-43a2-b2b9-43c678a3e883.png](https://alvincrespo-blog.s3.us-east-2.amazonaws.com/aws-setting-up-a-vpc-from-scratch/Screen_Shot_2020-02-05_at_7.27.47_AM.png)

Click "Attach" and you should then see your new internet gateway attached to your VPC

![https://cdn.hashnode.com/res/hashnode/image/upload/v1722348950255/ee9ca868-f6d6-44b2-9878-c18d23514780.png](https://alvincrespo-blog.s3.us-east-2.amazonaws.com/aws-setting-up-a-vpc-from-scratch/Screen_Shot_2020-02-05_at_7.28.31_AM.png)

---

# Configuring your Route Table

We need to configure our main route to go out to the internet.

Currently it is configured to have any subnet communicate with each other:

![AWS Console / Virtual Private Cloud / Route Tables / Main Route Table Routes](./b93622c0-6861-455a-883b-cdd538901fc8.png)

Both existing subnets have also been, by default, associated to main routing table:

![AWS Console / Virtual Private Cloud / Route Tables / Main Route Table Subnet Associations](./0c180728-11db-4d73-a2a6-559b3b87a0dc.png)

Note: We do **NOT** want to open the main routing table to the internet. This would cause every subnet by default to be open to the internet.

Click "Create route table"

![AWS Console / Virtual Private Cloud / Route Tables / Create Route Table](./b9bd0bfd-feb7-45f2-a0ed-a0dac9c8bcdf.png)

Give your new route table a name, and associate it with your new VPC

![https://cdn.hashnode.com/res/hashnode/image/upload/v1722348957420/0e460d2f-0d50-4bb9-b6ca-f451432245f3.png](https://alvincrespo-blog.s3.us-east-2.amazonaws.com/aws-setting-up-a-vpc-from-scratch/Screen_Shot_2020-02-05_at_7.30.58_AM.png)

Click "Create"

![https://cdn.hashnode.com/res/hashnode/image/upload/v1722348958704/f834f859-1d37-43cf-b07d-35f9652a1217.png](https://alvincrespo-blog.s3.us-east-2.amazonaws.com/aws-setting-up-a-vpc-from-scratch/Screen_Shot_2020-02-05_at_7.31.01_AM.png)

Click "Close" and you should be taken to your route tables table:

![https://cdn.hashnode.com/res/hashnode/image/upload/v1722348960173/ba103014-eba9-4d08-9bc6-eb807ce7a79c.png](https://alvincrespo-blog.s3.us-east-2.amazonaws.com/aws-setting-up-a-vpc-from-scratch/Screen_Shot_2020-02-05_at_7.31.12_AM.png)

Select your new route table and navigate to the "routes" tab:

![https://cdn.hashnode.com/res/hashnode/image/upload/v1722348961923/9b6cefbf-34ca-42dd-9527-d043a4b4f2d1.png](https://alvincrespo-blog.s3.us-east-2.amazonaws.com/aws-setting-up-a-vpc-from-scratch/Screen_Shot_2020-02-05_at_7.31.58_AM.png)

You'll notice the new route table is not automatically configured to connect with the internet.

Click on "Edit routes"

![AWS Console / Virtual Private Cloud / Route Tables / New Route Table / Edit Routes Button](./c81461d3-de3e-41b4-9e0e-0795911a13b5.png)

Add both IPv4 and IPv6 routes and select the internet gateway that was created in the last section:

![https://cdn.hashnode.com/res/hashnode/image/upload/v1722348965590/c3768651-0b86-41d6-bf00-0cec1ba8262d.png](https://alvincrespo-blog.s3.us-east-2.amazonaws.com/aws-setting-up-a-vpc-from-scratch/Screen_Shot_2020-02-05_at_7.33.01_AM.png)

Note: 0.0.0.0/0 - IPv4 and ::/0 - IPv6

Click "Save routes" when done.

![https://cdn.hashnode.com/res/hashnode/image/upload/v1722348967438/64fb6f1c-cf4e-437d-880b-5dc5ee891b5a.png](https://alvincrespo-blog.s3.us-east-2.amazonaws.com/aws-setting-up-a-vpc-from-scratch/Screen_Shot_2020-02-05_at_7.33.04_AM.png)

Click "Close". You should now be taken to your routes table.

Click on your new route table, and select "Routes" tab. You should see your new routes added:

![https://cdn.hashnode.com/res/hashnode/image/upload/v1722348968926/4e8e1549-e05c-4cd6-ba69-cd403a3a8328.png](https://alvincrespo-blog.s3.us-east-2.amazonaws.com/aws-setting-up-a-vpc-from-scratch/Screen_Shot_2020-02-05_at_7.33.06_AM.png)

However, neither of our subnets are associated with this public facing route table.

Select, "Subnet Associations"

![https://cdn.hashnode.com/res/hashnode/image/upload/v1722348970771/279749c8-5847-4a4e-8cc3-0eaf5e7d8251.png](https://alvincrespo-blog.s3.us-east-2.amazonaws.com/aws-setting-up-a-vpc-from-scratch/Screen_Shot_2020-02-05_at_7.33.24_AM.png)

You'll notice, no subnets are associated with this table.

Click "Edit subnet associations"

![AWS Console / VPCs / Route Tables / New Route Table / Edit Subnet Associations](./c44b684d-14e8-4f5c-b200-27e58fe2e828.png)

Select the subnet(s) you want to be public, for this article, we're selecting any device under 10.0.1.0/24 to be public.

![https://cdn.hashnode.com/res/hashnode/image/upload/v1722348974239/7259cfba-6844-4263-993f-b102e6e02d3c.png](https://alvincrespo-blog.s3.us-east-2.amazonaws.com/aws-setting-up-a-vpc-from-scratch/Screen_Shot_2020-02-05_at_7.33.33_AM.png)

Click "Save"

Now, when you select a route table and inspect it's associated subnets - you should see something like:

![https://cdn.hashnode.com/res/hashnode/image/upload/v1722348976112/2add0bf3-0d5e-4e56-be64-112d61ae3264.png](https://alvincrespo-blog.s3.us-east-2.amazonaws.com/aws-setting-up-a-vpc-from-scratch/Screen_Shot_2020-02-05_at_7.33.37_AM.png)

![https://cdn.hashnode.com/res/hashnode/image/upload/v1722348977794/bb94dc25-3abb-47cb-ae7b-2f9e388fbc94.png](https://alvincrespo-blog.s3.us-east-2.amazonaws.com/aws-setting-up-a-vpc-from-scratch/Screen_Shot_2020-02-05_at_7.33.40_AM.png)

Note that 10.0.1.0/24 has been associated with our new public route table, while 10.0.2.0/24 stays in our private main routing table.

---

# Configuring EC2 Instances

## Configuring a Public EC2 Instance

Our public EC2 instance will be our webserver, this is where your Rails, Django, Express application would exist. It needs to be publicly accessible so we're going to attach it to our public subnet within our VPC. Let's get started!

Navigate to EC2

![AWS Console / Menu / EC2](./36d0e512-123d-4af5-b8b0-f0fd55f69285.png)

Click "Launch Instance" and select "Launch instance" from dropdown:

![AWS Console / EC2 / Launch Instance button](./4616dda2-c2d3-4ddc-8554-fb8fbc95fb04.png)

Select an AMI, for this article - we're going with the first option:

![AWS Console / EC2 / Launch Instance / Choose AMI](./5a776540-5c85-49f2-8ed6-7d56e533f925.png)

Select the instance type you prefer, again for this article we're keeping it simple so we're going with the free tier t2.micro instance type. Then click "Configure Instance Details".

![https://cdn.hashnode.com/res/hashnode/image/upload/v1722348984895/3104b753-858b-434a-a292-e933fd26679f.png](https://alvincrespo-blog.s3.us-east-2.amazonaws.com/aws-setting-up-a-vpc-from-scratch/Screen_Shot_2020-02-05_at_7.34.49_AM.png)

These are the default settings you'll see:

![https://cdn.hashnode.com/res/hashnode/image/upload/v1722348986945/036c90d5-552a-4448-a2e6-663ae3c6a915.png](https://alvincrespo-blog.s3.us-east-2.amazonaws.com/aws-setting-up-a-vpc-from-scratch/Screen_Shot_2020-02-05_at_7.34.58_AM.png)

You'll want to change the "Network" and "Subnet". The "Network" will be your **VPC** and your subnet will be your **public subnet**.

![AWS Console / EC2 / Launch Instance / Configure Instance](./c70e0a73-a1af-4d55-8c98-82e2f47aded7.png)

Note: The auto-assign Public IP is set to "Use subnet setting (Enable)".

Click "Next: Add Storage"

![https://cdn.hashnode.com/res/hashnode/image/upload/v1722348990062/1aa03331-57d7-4c7c-8f61-b821178b12b9.png](https://alvincrespo-blog.s3.us-east-2.amazonaws.com/aws-setting-up-a-vpc-from-scratch/Screen_Shot_2020-02-05_at_7.35.33_AM.png)

We're not changing anything here, click "Next: Add Tags"

Here, we're going to add a "Name" and set it to "awesomesauceWebServer" - you can name it whatever you like - I'm prefixing it with "awesomesauce" because thats the name of my VPC.

When you're done, click "Next: Configure Security Group"

![https://cdn.hashnode.com/res/hashnode/image/upload/v1722348991931/1067e53d-5996-4dc1-bb23-647c8847c68c.png](https://alvincrespo-blog.s3.us-east-2.amazonaws.com/aws-setting-up-a-vpc-from-scratch/Screen_Shot_2020-02-09_at_7.49.02_AM.png)

Here, we'll create a new security group - I'm naming this one "awesomesauceDMZ". I'm also adding a rule for HTTP. To do this, click "Add Rule" and select "HTTP" from the dropdown.

When you're done, click "Review and Launch"

![https://cdn.hashnode.com/res/hashnode/image/upload/v1722348993359/a9ca01e5-7673-478f-a9b8-49f3d65f2a9f.png](https://alvincrespo-blog.s3.us-east-2.amazonaws.com/aws-setting-up-a-vpc-from-scratch/Screen_Shot_2020-02-09_at_7.51.34_AM.png)

On this page, you can review all the settings for your public EC2 instance:

When, you're done verifying the settings - click "Launch".

![https://cdn.hashnode.com/res/hashnode/image/upload/v1722348994996/fb7fca66-4dfd-4ad0-af5e-8c5c3e774020.png](https://alvincrespo-blog.s3.us-east-2.amazonaws.com/aws-setting-up-a-vpc-from-scratch/Screen_Shot_2020-02-09_at_7.51.38_AM.png)

The next step is creating or selecting an existing key pair. For this article, I'm going to create a new key pair and name it "awesomesauceKP".

Make sure to download this Key Pair and move it to a secure location. I store mine on 1password as secure file.

Finally, click "Launch Instance".

![https://cdn.hashnode.com/res/hashnode/image/upload/v1722348996637/970c5cb5-dce8-4b18-b6ce-1bfebf12280d.png](https://alvincrespo-blog.s3.us-east-2.amazonaws.com/aws-setting-up-a-vpc-from-scratch/Screen_Shot_2020-02-09_at_7.52.33_AM.png)

Your new instance will now start launching, click "View Instances"

![https://cdn.hashnode.com/res/hashnode/image/upload/v1722348998322/8d204630-05bb-488e-a5b1-f39838ec0450.png](https://alvincrespo-blog.s3.us-east-2.amazonaws.com/aws-setting-up-a-vpc-from-scratch/Screen_Shot_2020-02-09_at_7.52.38_AM.png)

When your new instance is done "launching" it will be in the instance state "running":

![https://cdn.hashnode.com/res/hashnode/image/upload/v1722348999947/fd4611e6-2c0d-4b70-b0d1-f3b0a42a2766.jpeg](https://alvincrespo-blog.s3.us-east-2.amazonaws.com/aws-setting-up-a-vpc-from-scratch/Instances__EC2_Management_Console_2020-02-09_08-02-14.jpg)

Awesome! Now it's time to create a private EC2 instance.

---

## Configuring a Private EC2 Instance

Click "Launch instance"

![AWS Console / EC2 / Launch Instance Button w/ Public Instance Created](./ce3fc1d2-ef4d-4b29-9e5b-b8c7aeea543e.png)

Select the AMI at the top, Amazon Linux 2 AMI

![https://cdn.hashnode.com/res/hashnode/image/upload/v1722349003373/c4ff622b-e440-48ce-b988-d14429ec7bdb.png](https://alvincrespo-blog.s3.us-east-2.amazonaws.com/aws-setting-up-a-vpc-from-scratch/Screen_Shot_2020-02-09_at_8.06.41_AM.png)

For the instance type, select t2.micro (free tier) and click "Next: Configure Instance Details"

![https://cdn.hashnode.com/res/hashnode/image/upload/v1722349004759/d00dac4b-a619-4c72-ad0c-5296ae46413c.png](https://alvincrespo-blog.s3.us-east-2.amazonaws.com/aws-setting-up-a-vpc-from-scratch/Screen_Shot_2020-02-09_at_8.06.44_AM.png)

These are the default settings you will see for your instance:

![https://cdn.hashnode.com/res/hashnode/image/upload/v1722349006351/058f176c-75c8-42ad-b3e2-3646a2a2bda2.png](https://alvincrespo-blog.s3.us-east-2.amazonaws.com/aws-setting-up-a-vpc-from-scratch/Screen_Shot_2020-02-09_at_8.06.50_AM.png)

Let's configure this instance to use our VPC and the private subnet:

![AWS Console / EC2 / Launch Instance / Configure Instance / Private Subnet](./df11ed12-eede-4900-bfea-c1fffe5bb800.png)

Note: The "Auto-assign Public IP" option will be set to "Use subnet setting (Disable)". It is disabled because we're putting it behind our private subnet.

Click "Next: Add Storage"

We'll leave our storage as is. Click "Next: Add Tags"

![https://cdn.hashnode.com/res/hashnode/image/upload/v1722349009595/e9a0d512-b46f-4e4d-a0e3-b95a2fc8ba31.png](https://alvincrespo-blog.s3.us-east-2.amazonaws.com/aws-setting-up-a-vpc-from-scratch/Screen_Shot_2020-02-09_at_8.15.20_AM.png)

I'm going to give this instance a "Name" of "awesomesauceDBServer".

Click "Next: Configure Security Groups"

![https://cdn.hashnode.com/res/hashnode/image/upload/v1722349011251/57c28782-f9ab-4f9c-b987-fc129d0e63c0.png](https://alvincrespo-blog.s3.us-east-2.amazonaws.com/aws-setting-up-a-vpc-from-scratch/Screen_Shot_2020-02-09_at_8.51.26_AM.png)

This private instance will keep the default security group.

Click "Review and Launch"

![https://cdn.hashnode.com/res/hashnode/image/upload/v1722349013200/af27eba0-1b18-4a2d-95c2-a6462b4e83ee.png](https://alvincrespo-blog.s3.us-east-2.amazonaws.com/aws-setting-up-a-vpc-from-scratch/Screen_Shot_2020-02-09_at_8.23.21_AM.png)

Review your instances setup here.

When done, click "Launch"

![https://cdn.hashnode.com/res/hashnode/image/upload/v1722349014493/4ccc61be-56c5-4ecb-aecf-41d6113afba5.png](https://alvincrespo-blog.s3.us-east-2.amazonaws.com/aws-setting-up-a-vpc-from-scratch/Screen_Shot_2020-02-09_at_8.23.37_AM.png)

Before launching, you'll be asked again to "Select an existing key pair or create new key pair". Select "Choose an existing key pair" and select the created key pair from the last section called "awesomesauceKP".

Check the checkbox for acknowledging you have access to that key pair.

Click "Launch Instances"

![https://cdn.hashnode.com/res/hashnode/image/upload/v1722349016108/3eef414e-dbed-4cec-a967-35c5394135e4.png](https://alvincrespo-blog.s3.us-east-2.amazonaws.com/aws-setting-up-a-vpc-from-scratch/Screen_Shot_2020-02-09_at_8.23.47_AM.png)

You'll be taken to your instances status page, click "View Instances"

![https://cdn.hashnode.com/res/hashnode/image/upload/v1722349017595/2870b66c-f8a3-4fb2-8675-be0a106ace2a.png](https://alvincrespo-blog.s3.us-east-2.amazonaws.com/aws-setting-up-a-vpc-from-scratch/Screen_Shot_2020-02-09_at_8.23.53_AM.png)

Your instance may be pending, but once it's finished launching - you should see:

![AWS Console / EC2 / Launched Instances](./da6db76c-a2e3-4dcc-9f98-3ed6fdc6558f.png)

Note: Your public instance, WebServer, will have an IPv4 Public IP - while your DBServer will not.

---

# Testing Your VPC

First, we need to `chmod` our new key pair:

chmod 400 awesomesauceKP.pem

Next, we'll SSH into our public facing EC2 instance:

```bash
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
```

Yay! We can connect to our public EC2 instance!

However, we can't ping our private instance:

```bash
[ec2-user@ip-10-0-1-203 ~]$ ping 10.0.2.201 -w 2
PING 10.0.2.201 (10.0.2.201) 56(84) bytes of data.

--- 10.0.2.201 ping statistics ---
2 packets transmitted, 0 received, 100% packet loss, time 1031ms
```

This is because we used our default security group when creating the private instance. We need to create a security group specific to our DB server and allow it to be accessed specifically by our subnet. Let's do it!

---

# Enabling Subnet → Subnet Communication

From the instances page, click on "Security Groups" in the left sidebar.

![AWS Console / EC2 / Security Groups Sidebar Link](./b56422ff-229e-425a-a8b9-17962e39d1cd.png)

Click on "Create Security Group".

![AWS Console / EC2 / Security Groups / Create Security Group Button](./e41e6438-21ca-4beb-a5e9-2ed5fa74e37c.png)

In the "Create Security Group" modal - you'll want out enable a few inbound rules:

* HTTP
    
* HTTPS
    
* MySQL/Aurora
    
* SSH
    

Each rule should then have a "Custom" source set to our public subnet 10.0.1.0/24. This security group is essentially going to tell our DB server that they allowed inbound communication from our public facing subnet.

![AWS Console / EC2 / Security Groups / Create Security Group Modal Values](./baa66da5-5307-45b2-9167-cb4f41938b39.png)

Click "Create" and you should see your new security group in the table, like so:

![AWS Console / EC2 / Security Groups / Table with New Security Group](./9d4d78a1-d392-4c89-b424-a93b2c3ef2b3.png)

Now, click on "Instances" in the left sidebar.

![AWS Console / EC2 / Instances in Sidebar link](./4d659fa6-db83-4c2b-8a7e-b35c10ede774.png)

From here, select the DB server, ours is "awesomesauceDBServer" and click "Actions". In the dropdown, hover over "Networking" and in the sub dropdown - click on "Change Security Group".

![AWS Console / EC2 / Instances / Change Security Group Action in Dropdown.png](./8f7b0cf9-9bf4-4645-b912-cb56829522ec.png)

In the "Change Security Groups" mdoal, select the new security group we created and uncheck the default security group.

![https://cdn.hashnode.com/res/hashnode/image/upload/v1722349030175/7999964a-94cf-4e7b-8364-cb281a90f2cb.png](https://alvincrespo-blog.s3.us-east-2.amazonaws.com/aws-setting-up-a-vpc-from-scratch/Screen_Shot_2020-02-09_at_11.03.16_AM.png)

When you're done, click on "Assign Security Group".

Next, we'll test that our private subnet can accept inbound communication from our public subnet within our VPC.

---

# Testing our VPC for Cross Subnet Communication

Alright! So now that our DB server has the newly configured security group to allow inbound communication from our public subnet - let's see if we can ping our DB server from inside our Web server:

```bash
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
```

🎉🎉🎉 We now have cross communication between public and private subnets within our VPC.

---

# Summary: What we built

![Basic VPC Architecture](./d308519c-07a7-421c-83ef-f5e813d859db.png)

The diagram above shows what we have built.

* A VPC
    
    * Containing Two Subnets
        
        * One Public Subnet
            
            * An instance that can be accessed from the internet
                
        * One Private Subnet
            
            * An instance that cannot be accessed from the internet
                
    * Interfacing with an Internet Gateway
        
    * A main route table that does not have internet access
        
        * That has 10.0.2.0/24 subnet automatically attached to it since this subnet is not associated to any route table
            
    * A custom route table that does have internet access
        
        * That also has the 10.0.1.0/24 subnet associated with it
            

---

# References

* [A Cloud Guru - AWS Certified Solutions Architect Associate 2020](https://acloud.guru/learn/aws-certified-solutions-architect-associate)
    
* [VPC FAQ's](https://aws.amazon.com/vpc/faqs/)
    
* [Amazon Virtual Private Cloud - User Guide](https://docs.aws.amazon.com/vpc/latest/userguide/what-is-amazon-vpc.html)