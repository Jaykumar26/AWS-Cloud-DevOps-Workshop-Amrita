# Prerequisites

Please complete all of the following **before** the workshop starts. This ensures we don't lose time on setup during the session.

---

## 1. Accounts to Create (all free)

| Account | Link | Why You Need It |
|---|---|---|
| AWS Account | [aws.amazon.com/free](https://aws.amazon.com/free) | To launch EC2 instances |
| GitHub Account | [github.com](https://github.com) | To store code and run CI/CD pipelines |
| Docker Hub Account | [hub.docker.com](https://hub.docker.com) | To push and pull Docker images |

> ⚠️ For the AWS Free Tier — you'll need a valid email address and a debit/credit card for verification. You will **not** be charged if you use `t2.micro` instances and terminate them after the workshop.

### How to Create Your AWS Account

Never created an AWS account before? Follow this step-by-step video:
📺 [Watch: How to Create an AWS Account](https://youtu.be/PBU2XY2oCTU?si=oYIO4htLL_OEx6Ve)

Or follow the official guide: [aws.amazon.com/free](https://aws.amazon.com/free)

---

## 2. Create an IAM User (Important — Do This After Creating Your AWS Account)

> ⚠️ **Do not use your root account** for the workshop. AWS best practice is to create an IAM user and work with that instead. Your root account is like the master key — keep it safe.

### What is an IAM User?
IAM (Identity and Access Management) lets you create separate users within your AWS account with specific permissions. We'll create one with **AdministratorAccess** for this workshop.

### Steps to Create an IAM User

1. Log in to [console.aws.amazon.com](https://console.aws.amazon.com) with your **root account**
2. In the search bar, type **IAM** and click on it
3. In the left sidebar, click **Users** → then click **Create user**
4. Enter a username (e.g. `vvce-workshop-user`) → click **Next**
5. On the **Set permissions** page:
   - Select **Attach policies directly**
   - Search for `AdministratorAccess`
   - Check the box next to **AdministratorAccess**
   - Click **Next**
6. Review the details and click **Create user**
7. Click on the user you just created → go to the **Security credentials** tab
8. Under **Console sign-in**, click **Enable console access**
   - Set a custom password → save it somewhere safe
   - Click **Apply**
9. Note down your **Account ID** (12-digit number shown at the top right of the AWS Console)

### How to Log In as Your IAM User

Use this URL format to sign in:
```
https://<your-account-id>.signin.aws.amazon.com/console
```
Or go to [console.aws.amazon.com](https://console.aws.amazon.com), choose **IAM user**, enter your Account ID, username, and password.

> From this point on, **always log in as the IAM user** — not the root account.

---

## 3. Software to Install on Your Laptop

| Software | Download Link | Why You Need It |
|---|---|---|
| Git | [git-scm.com](https://git-scm.com/downloads) | To clone repos and push code |
| Kiro (recommended) | [kiro.dev/downloads](https://kiro.dev/downloads/) | AI-powered IDE to edit code |
| A terminal | Built-in on Mac/Linux. Windows: use [Git Bash](https://git-scm.com/downloads) or PowerShell | To run commands |

> Docker Desktop is **not required** — we will install Docker directly on EC2 during the workshop.

---

## 4. Fork This Repository

1. Go to [github.com/yeshwanthlm/AWS-Cloud-DevOps-Workshop-VVCE](https://github.com/yeshwanthlm/AWS-Cloud-DevOps-Workshop-VVCE)
2. Click the **Fork** button (top right)
3. This creates your own copy under your GitHub account — you'll use this for Module 2

---

## 5. Basic Knowledge Expected

You don't need to be an expert, but it helps to know:
- What a terminal/command line is and how to run basic commands (`cd`, `ls`, `mkdir`)
- Basic HTML/CSS (we already have the website ready — just helps to understand what it is)
- What GitHub is (storing and sharing code online)

---

## 6. Day-of Checklist

Before walking into the workshop, make sure:
- [ ] You can log in to your AWS Console **as your IAM user** (not root)
- [ ] Your IAM user has AdministratorAccess attached
- [ ] You can log in to your GitHub account
- [ ] You can log in to your Docker Hub account
- [ ] Git is installed — run `git --version` in your terminal to verify
- [ ] You have forked this repository to your GitHub account
- [ ] Your laptop is charged and you have your charger

---

[← Back to Main](../README.md) | [Start Module 1 →](../module-1-ec2/README.md)
