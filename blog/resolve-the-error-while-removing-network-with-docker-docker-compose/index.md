---
title: Resolve the "error while removing network" with Docker + Docker Compose
date: "2025-01-07T01:54:06.087Z"
description: "Prerequisites  Docker version 4.37.1 or later  Basic familiarity with Docker Compose  Multiple Docker Compose files in your environment    The Problem This week I ran into a fun issue at work having to do with setting up our local development environ..."
tags:
---

## Prerequisites

* Docker version 4.37.1 or later
    
* Basic familiarity with Docker Compose
    
* Multiple Docker Compose files in your environment
    

---

## The Problem

This week I ran into a fun issue at work having to do with setting up our local development environment. We have multiple microservices that need to be run and this is all managed via Ansible + Docker Compose files. The error that I ran into this week is below:

```plaintext
Error response from daemon: error while removing network: network docker_default id ABC has active endpoints
```

---

Now, I’ve never run into this error before so this was completely new to me. My guess is something with Docker 4.37.1 made recreating the default network and explicit action. I’m not entirely 100% sure. I did some digging around and found the following that was super helpful:

> Compose now recreates containers when the volume or network configuration changes
> 
> [https://docs.docker.com/compose/releases/release-notes/#2320](https://docs.docker.com/compose/releases/release-notes/#2320)

## Understanding Docker Networks

This got me thinking…what are networks?! Yes, I never thought about it before - so I decided to educate myself and here was the key to my issue:

> By default Compose sets up a single [network](https://docs.docker.com/reference/cli/docker/network/create/) for your app. Each container for a service joins the default network and is both reachable by other containers on that network, and discoverable by the service's name.
> 
> [https://docs.docker.com/compose/how-tos/networking/](https://docs.docker.com/compose/how-tos/networking/)

So, if this is the case then, wouldn’t running multiple compose files mean that the default network would be destroyed and created with the next compose call? It turns out, the answer is *yes*.

For example, lets consider the following process:

* Initialize Applications (init.yml)
    
* Start Applications (apps.yml)
    

Once we run `docker compose -f init.yml up` then the subsequent call to `docker compose -f apps.yml` could lead us to the active endpoints error. This was further confirmed by this comment in the following thread:

> Compose by default build your containers as if they are one network connected to each other
> 
> …
> 
> keep in mind that you could use external networks so compose don’t create new network but use a pre-built docker network
> 
> [https://forums.docker.com/t/is-it-possible-to-stop-docker-compose-from-creating-a-default-network/129805/4](https://forums.docker.com/t/is-it-possible-to-stop-docker-compose-from-creating-a-default-network/129805/4)

At this point, I had two options:

1. Create a custom shared network across compose files, as per the recommendation in the above comment, or
    
2. Use one docker compose file, eliminating the need to run `docker compose` multiple times
    

---

## Solutions

### Option 1: Combining `docker compose` configurations

It turns out, you can do this simply and is documented:

> #### *Specifying multiple Compose files*
> 
> You can supply multiple `-f` configuration files. When you supply multiple files, Compose combines them into a single configuration. Compose builds the configuration in the order you supply the files. Subsequent files override and add to their predecessors.
> 
> For example, consider this comman[d line:](https://docs.docker.com/reference/cli/docker/compose/#specifying-multiple-compose-files)
> 
> ```console
> $ docker compose -f docker-compose.yml -f docker-compose.admin.yml run backup_db
> ```
> 
> [https://docs.docker.com/reference/cli/docker/compose/#specifying-multiple-compose-files](https://docs.docker.com/reference/cli/docker/compose/#specifying-multiple-compose-files)

Simplifying the ansible script to do this is possibly the easier option here as it would simplify things and solve the issue. However, because I was curious about docker networks, I decided to go with option #1.

### Option 2: Custom `docker compose` networks

This option solved my issue completely. Although I had to modify multiple docker compose configurations, it made which networks services were communicating under and explicit defined thing. Although having a default network is awesome, surfacing this to the team really did help in communicating how this stuff works.

The first thing you need to do is create the shared network:

```plaintext
docker network create shared_network
```

Creating this shared network is part of the ansible task for setting up the microservices, so it’s an automated step. I would recommend doing the same in your onboarding process, since you probably won’t remember this and it’ll make your team happier.

<div data-node-type="callout">
<div data-node-type="callout-emoji">❗</div>
<div data-node-type="callout-text">Please note the above are just examples, not the real docker compose configurations.</div>
</div>

**init.yml**

```plaintext
services:
  app_init:
    image: myapp
    environment:
      STATE: init
    networks:
     - shared_network

networks:
  shared_network:
    external: true
```

**apps.yml**

```plaintext
services:
  app:
    image: myapp
    environment:
      STATE: application
    networks:
     - shared_network

networks:
  shared_network:
    external: true
```

If you want more information on how this works, please read Docker’s [Specify Custom Networks](https://docs.docker.com/compose/how-tos/networking/#specify-custom-networks) documentation.

---

## Troubleshooting tips

When dealing with Docker network issues, these commands can be helpful:

1. List all networks:
    

```plaintext
docker network ls
```

2. Inspect a specific network:
    

```plaintext
docker network inspect shared_network
```

3. Check which containers are connected to a network:
    

```plaintext
docker network inspect shared_network -f '{{range .Containers}}{{.Name}} {{end}}'
```

Common issues to watch for:

* Ensure the shared network exists before running compose files that reference it
    
* Check for containers still connected to networks you're trying to remove
    
* Verify network names match exactly across all compose files
    

---

## Conclusion

Docker Compose creates a default network for each configuration by default. When running multiple compose files sequentially, this can lead to the "has active endpoints" error as compose tries to remove and recreate networks. You can resolve this either by:

1. Creating a custom shared network and explicitly configuring all services to use it
    
2. Combining your compose files using the `-f` flag to create one shared default network
    

While I opted for the custom network solution to make service communication more explicit, both approaches are valid depending on your specific needs.

Remember that the examples provided are simplified for illustration - adapt them to match your actual service configurations and requirements.

If you have any questions or need clarification, feel free to [reach out](https://docs.google.com/forms/d/e/1FAIpQLSd3FJbsjj8kqY3HF2HixnwsNQ2VyQYQNomasGQBIq0r6FAMJQ/viewform)!