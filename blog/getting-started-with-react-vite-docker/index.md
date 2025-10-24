---
title: Getting Started with React + Vite + Docker
date: "2025-01-16T02:35:09.078Z"
description: "I’ve recently jumped back into React / Frontend development and was curious what tools the cool kids are using these days. At work, we use create react app, which seems to have been deprecated and isn’t even mentioned in the React docs anymore. So I ..."
tags:
---

I’ve recently jumped back into React / Frontend development and was curious what tools the cool kids are using these days. At work, we use create react app, which seems to have been deprecated and isn’t even mentioned in the React docs anymore. So I did some research and found out about [Vite](https://vite.dev/), which is amazing because I really did not like [webpack](https://webpack.js.org/) when I last worked with React. I decided to put together a getting started guide for you that sets up a containerized React application with Docker.

## Prerequisites

* [Node.js](https://nodejs.org/en) (v23 or later)
    
* [Docker](https://www.docker.com/products/docker-desktop/) and [Docker Compose](https://docs.docker.com/compose/)
    
* Basic familiarity with [React](https://react.dev/) and terminal commands
    

---

## Create a New Vite Project

Ok, lets get started by creating a new Vite project. This is done by using [npm create](https://docs.npmjs.com/cli/v10/commands/npm-init).

```bash
# Create a new Vite project
npm create vite@latest my-react-app
cd my-react-app

# Install dependencies
npm install
```

## Set Up the Project Structure

To get Docker and Nginx configured to serve up the app within a container, we need to create the following files at the root of the project. In addition to this, we’re going to set up a local custom domain to access the app at `http://myreactapp`.

`docker-compose.yml`

```yaml
services:
  app:
    build:
      context: .
      dockerfile: Dockerfile.dev
    ports:
      - "80:5173"  # Map container's 5173 to host's 80
    volumes:
      - .:/app
      - /app/node_modules  # Prevents local node_modules from mounting
    environment:
      - NODE_ENV=development
    networks:
      app_net:
        aliases:
          - myreactapp

networks:
  app_net:
    name: app_network
```

`Dockerfile.dev`

```dockerfile
# Use Node image for development
FROM node:23-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package.json package-lock.json ./

# Install dependencies
RUN npm ci

# Set host to allow external connections
ENV VITE_HOST=0.0.0.0

# Expose Vite's port
EXPOSE 5173

# Start development server
CMD ["npm", "run", "dev", "--", "--host"]
```

[`setup.sh`](http://setup.sh) (for local domain configuration)

```bash
#!/bin/bash

# Check if script is run with sudo
if [ "$EUID" -ne 0 ]; then
  echo "Please run with sudo"
  exit 1
fi

# Add domain to /etc/hosts if not already present
if ! grep -q "myreactapp" /etc/hosts; then
  echo "127.0.0.1 myreactapp" >> /etc/hosts
  echo "Added myreactapp to /etc/hosts"
else
  echo "myreactapp already in /etc/hosts"
fi

# Flush DNS cache
dscacheutil -flushcache
killall -HUP mDNSResponder
echo "Flushed DNS cache"

echo "Setup complete! You can now access your app at http://myreactapp"
```

`package.json`

To make things easy, let’s add the following scripts:

```json
    "docker:dev": "docker compose -f docker-compose.dev.yml up --build",
    "docker:dev:down": "docker compose -f docker-compose.dev.yml down",
    "docker:clean": "docker compose -f docker-compose.dev.yml down -v"
```

## Configure the Development Environment

Make the setup script executable:

```bash
chmod +x setup.sh
```

Run the setup script to configure local domain (requires sudo):

```bash
sudo ./setup.sh
```

## Build and Run the Application

Build and start the Docker container:

```bash
npm run docker:dev
```

🎆🎆🎆 Congrats! You can access the application at [`http://myreactapp`](http://myreactapp).

Source code for this guide is located here: [https://github.com/alvincrespo/pulsar-point](https://github.com/alvincrespo/pulsar-point)

---

## Development Workflow

For local development without Docker:

```bash
npm run dev
```

## Troubleshooting

If the site doesn't load:

* Check if Docker containers are running: `docker compose ps`
    
* Verify local DNS: `ping myreactapp`
    
* Check Docker logs: `docker compose logs`
    

If changes aren't reflecting:

* Rebuild the Docker image: `docker compose up --build`
    
* Clear browser cache
    
* Check if the correct files are being served: `docker exec -it container_name ls /app`
    

## Next Steps

* Create the production level `Dockerfile` + `docker-compose.yml`
    
* Configure CI/CD pipelines
    
* Add environment-specific configurations
    
* Set up monitoring and logging
    
* Implement container health checks
    
* Security considerations for the production level `Dockerfile`
    

---

Vite is an excellent frontend tooling solution when working with React. Combined with Docker's containerization you have a development environment that's both efficient and scalable. While this setup serves as an excellent starting point, it can be further customized to meet specific project requirements, whether that's implementing CI/CD pipelines, or integrating additional services. In a follow up article, I will sharing a preliminary guide putting together a production level image that addresses the above next steps.

If you have any questions or need clarification, feel free to [**reach out**](https://docs.google.com/forms/d/e/1FAIpQLSd3FJbsjj8kqY3HF2HixnwsNQ2VyQYQNomasGQBIq0r6FAMJQ/viewform)!