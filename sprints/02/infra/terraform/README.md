# Terraform Infrastructure - ParkVision Frontend MVP

## Overview

This directory contains Terraform configuration for deploying the ParkVision Frontend MVP to Vercel.

## Prerequisites

- Terraform >= 1.5.0
- Vercel account
- Vercel API token

## Setup

### 1. Install Terraform

**macOS:**
```bash
brew install terraform
```

**Linux:**
```bash
wget https://releases.hashicorp.com/terraform/1.5.0/terraform_1.5.0_linux_amd64.zip
unzip terraform_1.5.0_linux_amd64.zip
sudo mv terraform /usr/local/bin/
```

### 2. Get Vercel API Token

1. Go to Vercel Dashboard → Settings → Tokens
2. Create a new token with Full Access
3. Copy the token

### 3. Create terraform.tfvars

Create a `terraform.tfvars` file (gitignored):

```hcl
vercel_api_token = "your-vercel-token-here"
github_repo      = "your-username/parkvision-frontend"
```

## Usage

### Initialize

```bash
terraform init
```

### Validate

```bash
terraform validate
```

### Plan

```bash
terraform plan -out=plan.out
```

### Apply (when ready)

```bash
terraform apply plan.out
```

## CI Integration

The `.github/workflows/terraform.yml` workflow automatically runs:
- `terraform validate` on every PR
- `terraform plan` on every PR and push to main
- Uploads `plan.out` as artifact

## Outputs

After apply:
- `project_id`: Vercel project ID
- `deployment_url`: Production URL (e.g., https://parkvision-frontend-mvp.vercel.app)

## Notes

- **MVP Phase:** We only run `validate` and `plan` in CI
- **Apply:** Manual for now (Sprint 3 will automate)
- **State:** Local state (consider Terraform Cloud for production)
