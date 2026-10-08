# Module 2 — CI/CD with GitHub Actions

> This module will be explained live during the workshop. Details will be unlocked after the session.

---

## What You Will Learn

- What CI/CD means and why it matters
- How GitHub Actions works
- How to set up repository secrets securely
- How to write a workflow that auto-deploys to EC2 on every push

---

## Prerequisites

- Module 1 completed — your EC2 instance must be running with Apache installed
- A GitHub account with this repo forked to your profile

---

## 🔒 Step-by-step instructions:

### Step 1: Add GitHub Secrets
In your GitHub repo → **Settings → Secrets and variables → Actions → New repository secret**

Add the following 4 secrets:

| Secret Name     | Value                                                        |
|-----------------|--------------------------------------------------------------|
| `EC2_SSH_KEY`   | The full contents of your `vvce-key.pem` file               |
| `HOST_DNS`      | Your EC2 instance's Public IPv4 address (e.g. `3.x.x.x`)   |
| `USERNAME`      | `ubuntu` (default user for Ubuntu AMI)                       |
| `TARGET_DIR`    | `/home/ubuntu` (files will be copied here first)            |

> **How to get the `.pem` content:** `cat vvce-key.pem` — copy everything including the `-----BEGIN...` and `-----END...` lines.

### Step 2: Create the GitHub Actions Workflow
Create the file `.github/workflows/deploy.yml` in your repo with this content:

```yaml
name: Deploy to EC2

# Trigger only on pushes to the main branch
on:
  push:
    branches:
      - main

jobs:
  deploy:
    name: Deploy to EC2
    runs-on: ubuntu-latest

    steps:
      - name: Checkout code
        uses: actions/checkout@v3

      - name: Copy files to EC2 via SSH
        uses: easingthemes/ssh-deploy@main
        env:
          SSH_PRIVATE_KEY: ${{ secrets.EC2_SSH_KEY }}
          REMOTE_HOST: ${{ secrets.HOST_DNS }}
          REMOTE_USER: ${{ secrets.USERNAME }}
          TARGET: ${{ secrets.TARGET_DIR }}
          SOURCE: "module-2-cicd/"

      - name: Install Apache and move files
        uses: appleboy/ssh-action@master
        with:
          host: ${{ secrets.HOST_DNS }}
          username: ${{ secrets.USERNAME }}
          key: ${{ secrets.EC2_SSH_KEY }}
          script: |
            sudo apt-get update -y
            sudo apt-get install -y apache2
            sudo systemctl start apache2
            sudo systemctl enable apache2
            sudo cp ${{ secrets.TARGET_DIR }}/index.html /var/www/html/index.html
            sudo cp ${{ secrets.TARGET_DIR }}/style.css /var/www/html/style.css

```

### Step 3: Test the Pipeline
1. Make a small change to `index.html` (e.g. change the name or add a skill)
2. Commit and push to `main`
3. Go to your repo → **Actions tab** → watch the workflow run live
4. Once it turns green, refresh `http://<PUBLIC_IP>` — your change is live

> 💡 **Key point for students:** You didn't SSH into anything. The code change went live automatically. That's the power of CI/CD.

---

[← Previous Module: EC2](../module-1-ec2/README.md) | [Next Module: Docker →](../module-3-docker/README.md)
