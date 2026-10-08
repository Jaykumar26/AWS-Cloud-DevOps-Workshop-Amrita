# Module 3 — Dockerise the App

> This module will be explained live during the workshop. Details will be unlocked after the session.

---

## What You Will Learn

- What Docker is and why containers exist
- How to write a Dockerfile
- How to build a Docker image and run it as a container
- How to push your image to Docker Hub
- How anyone can pull and run your app with a single command

---

## Prerequisites

- Module 1 and Module 2 completed
- A [Docker Hub](https://hub.docker.com) account (free) — create one before the session

---

## 🔒 Step-by-step Instructions:

### The Dockerfile (already in the repo)
```dockerfile
# Use the official lightweight Nginx image based on Alpine Linux
FROM nginx:alpine

# Set the working directory inside the container
WORKDIR /usr/share/nginx/html

# Remove the default Nginx welcome page
RUN rm -rf ./*

# Copy our website files into the container
COPY index.html .
COPY style.css .

# Tell Docker this container listens on port 80
EXPOSE 80

# Nginx starts automatically — no CMD needed for nginx:alpine
```

### Step 1: Install Docker on EC2
```bash
# Update packages
sudo apt update -y

# Install Docker
sudo apt install docker.io -y

# Start Docker and enable it on boot
sudo systemctl start docker
sudo systemctl enable docker

# Add your user to the docker group (so you don't need sudo every time)
sudo usermod -aG docker ubuntu

# Apply the group change without logging out
newgrp docker

# Verify Docker is installed
docker --version
```

### Step 2: Build the Docker Image
```bash
# Clone the repo if not already done
git clone https://github.com/yeshwanthlm/AWS-Cloud-DevOps-Workshop-VVCE.git
cd AWS-Cloud-DevOps-Workshop-VVCE/

# Build the image
# -t = tag (give it a name)
# . = use the Dockerfile in the current directory
docker build -t vvce-resume-app .

# Verify the image was created
docker images
```

### Step 3: Run the Container
```bash
# Run the container
# -d = detached mode (runs in background)
# -p 8080:80 = map EC2 port 8080 to container port 80
# --name = give the container a friendly name
docker run -d -p 8080:80 --name resume-container vvce-resume-app

# Verify the container is running
docker ps
```

> Open `http://<PUBLIC_IP>:8080` in your browser — you'll see the website served from inside a container.

> ⚠️ Make sure port `8080` is open in your EC2 Security Group (add an inbound rule: Custom TCP, port 8080, source 0.0.0.0/0).

### Useful Docker Commands (show these live)
```bash
# See running containers
docker ps

# See all containers (including stopped)
docker ps -a

# See all images
docker images

# Stop a container
docker stop resume-container

# Remove a container
docker rm resume-container

# Remove an image
docker rmi vvce-resume-app

# View container logs
docker logs resume-container
```

### Step 4: Push Image to Docker Hub

**Pre-requisite:** Create a free account at [hub.docker.com](https://hub.docker.com)

```bash
# Log in to Docker Hub from the terminal
docker login
# Enter your Docker Hub username and password when prompted

# Tag the image with your Docker Hub username
# Format: docker tag <local-image> <dockerhub-username>/<repo-name>:<tag>
docker tag vvce-resume-app <your-dockerhub-username>/vvce-resume-app:latest

# Push the image to Docker Hub
docker push <your-dockerhub-username>/vvce-resume-app:latest
```

Now go to [hub.docker.com](https://hub.docker.com) and show the students their image is publicly available.

### Step 5: Pull and Run from Docker Hub (The Magic Moment 🎉)
Show students that anyone in the world can now run this website with a single command:

```bash
# Pull and run directly from Docker Hub (no code needed)
docker run -d -p 9090:80 <your-dockerhub-username>/vvce-resume-app:latest
```

Open `http://<PUBLIC_IP>:9090` — same website, running from a public image.

> 💡 **Key point:** This is how companies ship software today. One image, runs anywhere — laptops, servers, cloud.

---

[← Previous Module: CI/CD](../module-2-cicd/README.md) | [Back to Main →](../README.md)
