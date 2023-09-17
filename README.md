# Vue Comments App

## Overview

This is a Vue.js application designed to interact with the [NestJS Comments API](https://github.com/vladislv31/spa-comments). The app allows users to register, log in, post comments, reply to existing comments, and attach text files or images to their comments.

## Features

- User registration and authentication via JWT
- Post, view, and reply to comments
- Attach text files and images to comments
- Mobile-responsive design
- When another user replies on your comment, you will receive alert by websockets

## Prerequisites

- Node.js v18.x or above
- Docker and Docker Compose
- Access to the NestJS Comments API

## Quick Start

Clone the repository:

```
git clone https://github.com/vladislv31/spa-comments-vue
cd spa-comments-vue
```

Rename .env.example to .env and update the environment variables, especially the API endpoint to point to your running NestJS Comments API.

Run the application using Docker Compose:

```
docker-compose up --build
```

The app should now be accessible at http://localhost.