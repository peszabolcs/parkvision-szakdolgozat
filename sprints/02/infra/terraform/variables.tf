variable "vercel_api_token" {
  description = "Vercel API token for authentication"
  type        = string
  sensitive   = true
}

variable "github_repo" {
  description = "GitHub repository in format 'owner/repo'"
  type        = string
  default     = "username/parkvision-frontend"
}

variable "environment" {
  description = "Deployment environment"
  type        = string
  default     = "production"
}
