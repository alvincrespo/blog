---
title: React, Vite & Production-Ready Docker
date: "2025-01-31T20:19:35.150Z"
description: "In my previous article, we set up a development environment for a Vite + React application using Docker. While that setup was perfect for development, production environments have different requirements around security, performance, and reliability. ..."
tags:
---

In my [previous article](https://alvincrespo.hashnode.dev/getting-started-with-react-vite-docker), we set up a development environment for a [Vite](https://vite.dev/) + [React](https://react.dev/) application using [Docker](https://www.docker.com/). While that setup was perfect for development, production environments have different requirements around security, performance, and reliability. Today, we'll explore how to create a production-ready Docker container for your frontend application application.

## Key Differences Between Development and Production

Before diving into the implementation, let's understand why we need a different setup for production:

1. Development containers prioritize fast feedback loops and hot reloading
    
2. Production containers need to be optimized for performance and security
    
3. Development exposes development servers, while production uses proper web servers
    
4. Production builds should be minimized and optimized
    

## Understanding Our Production Dockerfile

Let’s start by looking at the complete production Dockerfile:

```dockerfile
# Build stage
FROM node:23-alpine as build

# Set working directory
WORKDIR /app

# Copy package files
COPY package.json package-lock.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Build the app
RUN npm run build

# Serve stage
FROM nginx:alpine

# Create a non-root user to run nginx
RUN adduser -D -H -u 1001 -s /sbin/nologin webuser

# Create app directory
RUN mkdir -p /app/www

# Copy built assets from build stage
COPY --from=build /app/dist /app/www

# Copy nginx config template
COPY nginx.conf /etc/nginx/templates/default.conf.template

# Set correct ownership and permissions
RUN chown -R webuser:webuser /app/www && \
    chmod -R 755 /app/www && \
    # Nginx needs to read and write to these directories
    chown -R webuser:webuser /var/cache/nginx && \
    chown -R webuser:webuser /var/log/nginx && \
    chown -R webuser:webuser /etc/nginx/conf.d && \
    touch /var/run/nginx.pid && \
    chown -R webuser:webuser /var/run/nginx.pid && \
    chmod -R 777 /etc/nginx/conf.d

# Expose port (will be overridden by Render)
EXPOSE 80

# Tell nginx's template processing which variables to replace
ENV NGINX_ENVSUBST_TEMPLATE_DIR=/etc/nginx/templates
ENV NGINX_ENVSUBST_TEMPLATE_SUFFIX=.template
ENV NGINX_ENVSUBST_OUTPUT_DIR=/etc/nginx/conf.d
ENV PORT=80

# Switch to non-root user
USER webuser

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
```

Okay, so there’s a lot going on here. Let's break down our production Dockerfile step by step:

```dockerfile
# Build stage
FROM node:23-alpine as build

WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
RUN npm run build
```

This first stage is our build environment. We're using a [multi-stage build](https://docs.docker.com/build/building/multi-stage/) pattern, which helps keep our final image size small. The `node:23-alpine` base image provides the Node.js runtime we need for our build step, while keeping the image size minimal thanks to [Alpine Linux](https://alpinelinux.org/).

```dockerfile
# Serve stage
FROM nginx:alpine

# Create a non-root user to run nginx
RUN adduser -D -H -u 1001 -s /sbin/nologin webuser

# Create app directory and set up nginx
RUN mkdir -p /app/www
COPY --from=build /app/dist /app/www
COPY nginx.conf /etc/nginx/templates/default.conf.template
```

The second stage configures Nginx to serve our static files. We're creating a dedicated non-root user for security best practices. The article [**Understanding the Docker USER Instruction**](https://www.docker.com/blog/understanding-the-docker-user-instruction/) by Jay Schmidt does an excellent job of explaining why this is a good idea to secure your container. It boils down to this:

> By using a non-root user, even if the attacker manages to break out of the application running in the container, they will have limited permissions if the container is running as a non-root user.

The next step is to copy our built assets from the previous stage using `--from=build`. By basing this stage on nginx and only copying the built assets, we discard the Node.js environment and it’s build tools. Following this process ensures you have a lighter image at the end.

## Security Considerations

Our production Dockerfile implements several security best practices. We started securing our app by starting with Alpine, because it reduces the attack surface. When we created a non-root user we limit the permissions when run as a non-root user. The multi-stage approach allows us to limit the attack surface even further by discarding tooling and dependencies we don’t need in our final image. The next step is to set the correct ownership and permissions on files:

```dockerfile
# Set correct ownership and permissions
RUN chown -R webuser:webuser /app/www && \
    chmod -R 755 /app/www && \
    chown -R webuser:webuser /var/cache/nginx && \
    chown -R webuser:webuser /var/log/nginx && \
    chown -R webuser:webuser /etc/nginx/conf.d && \
    touch /var/run/nginx.pid && \
    chown -R webuser:webuser /var/run/nginx.pid && \
    chmod -R 777 /etc/nginx/conf.d
```

## Environment Configuration

Our Dockerfile uses environment variables to configure Nginx:

```dockerfile
ENV NGINX_ENVSUBST_TEMPLATE_DIR=/etc/nginx/templates
ENV NGINX_ENVSUBST_TEMPLATE_SUFFIX=.template
ENV NGINX_ENVSUBST_OUTPUT_DIR=/etc/nginx/conf.d
ENV PORT=80
```

This setup allows for runtime configuration of Nginx through environment variables, making the container more flexible across different deployment environments. For example, you might have different configurations for a test and staging environments and having this flexibility allows us to configure these environments easily.

## Essential Nginx Configuration

To properly serve a single-page application (SPA), we need an Nginx configuration that handles client-side routing. Let’s take a look at the final Nginx configuration:

```nginx
server {
    listen ${PORT};
    server_name localhost;
    root /app/www;
    
    # Security headers
    add_header X-Frame-Options "SAMEORIGIN";
    add_header X-XSS-Protection "1; mode=block";
    add_header X-Content-Type-Options "nosniff";
    
    # Compression
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;
    
    location / {
        try_files $uri $uri/ /index.html;
        expires -1;
    }
    
    # Cache static assets
    location /assets {
        expires 1y;
        add_header Cache-Control "public, no-transform";
    }
}
```

Let's break down our Nginx configuration piece by piece

```nginx
server {
    listen ${PORT};
    server_name localhost;
    root /app/www;
```

This opening block configures:

* `listen ${PORT}`: Uses an environment variable for the port, making it configurable at runtime
    
* `server_name` [`localhost`](http://localhost): Defines the server name (this can be changed for production domains)
    
* `root /app/www`: Points to our built React application files
    

```nginx
    add_header X-Frame-Options "SAMEORIGIN";
    add_header X-XSS-Protection "1; mode=block";
    add_header X-Content-Type-Options "nosniff";
```

These security headers protect against common web vulnerabilities:

* [`X-Frame-Options`](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/X-Frame-Options): Prevents clickjacking attacks by controlling how the site can be embedded in iframes
    
* [`X-XSS-Protection`](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/X-XSS-Protection): Enables browser-level XSS filtering
    
* [`X-Content-Type-Options`](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/X-Content-Type-Options): Prevents MIME-type sniffing attacks
    

```nginx
    gzip on;
    gzip_types text/plain text/css application/json application/javascript 
               text/xml application/xml application/xml+rss text/javascript;
```

The [compression configuration](https://docs.nginx.com/nginx/admin-guide/web-server/compression/):

* Enables gzip compression to reduce bandwidth usage
    
* Specifies which file types to compress
    
* Improves load times for end users
    

```nginx
    location / {
        try_files $uri $uri/ /index.html;
        expires -1;
    }
```

This block handles the React application's client-side routing:

* [`try_files`](https://nginx.org/en/docs/http/ngx_http_core_module.html#try_files): Attempts to serve the requested file, then directory, falling back to index.html
    
* [`expires`](https://nginx.org/en/docs/http/ngx_http_headers_module.html#expires) `-1`: Prevents caching of the main index.html file to ensure users get the latest version
    

```nginx
    location /assets {
        expires 1y;
        add_header Cache-Control "public, no-transform";
    }
```

The static asset configuration:

* Aggressively caches assets for one year (Vite's build process includes content hashes in filenames)
    
* [`add_header`](https://nginx.org/en/docs/http/ngx_http_headers_module.html#add_header): Adds [cache control headers](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Cache-Control) to optimize browser and CDN caching
    

## Building and Running in Production

1. Build the image:
    

```bash
docker build -t my-react-app:prod .
```

2. Run the container:
    

```bash
docker run -p 80:80 my-react-app:prod
```

<div data-node-type="callout">
<div data-node-type="callout-emoji">🎆</div>
<div data-node-type="callout-text">Congrats! You now have a production ready image you can use for deployments! Source code for this guide is located here: <a target="_self" rel="noopener noreferrer nofollow" href="https://github.com/alvincrespo/pulsar-point" style="pointer-events: none"><strong>https://github.com/alvincrespo/pulsar-point</strong></a></div>
</div>

## [Conclusion](https://github.com/alvincrespo/pulsar-point)

[Creating a production-ready](https://github.com/alvincrespo/pulsar-point) Docker container involves more than just building and serving your application. Security, performance, and reliability considerations should guide your configuration decisions. This setup provides a solid foundation that you can further customize based on your specific requirements.

Remember to:

* Regularly update base images and dependencies
    
* Monitor container resource usage
    
* Implement proper logging
    
* Set up automated security scanning
    
* Test your container in a staging environment before production deployment
    

With these practices in place, your Vite based React application will be well-positioned for production use.

## Next time…

In my follow up article(s), we’ll cover a few additional details we haven’t covered yet:

* SSL/TLS Configuration
    
* CORS Headers (if needed)
    
* Browser Caching Strategy
    
* Error Pages
    
* Health Checks and Monitoring
    
* Production Optimization Tips
    
* CI/CD Integration
    
* Configuring CDN for Static Assets
    

In the meantime, if you have any questions or need clarification, feel free to [**reach out**](https://docs.google.com/forms/d/e/1FAIpQLSd3FJbsjj8kqY3HF2HixnwsNQ2VyQYQNomasGQBIq0r6FAMJQ/viewform)!