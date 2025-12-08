resource "vercel_project" "parkvision_frontend" {
  name      = "parkvision-frontend-mvp"
  framework = "vite"

  git_repository = {
    type = "github"
    repo = var.github_repo
  }

  build_command    = "npm run build"
  output_directory = "dist"
  install_command  = "npm install"

  environment = [
    {
      key    = "VITE_MOCK_SCENARIO"
      value  = "normal"
      target = ["production", "preview"]
    }
  ]
}

resource "vercel_project_domain" "main" {
  project_id = vercel_project.parkvision_frontend.id
  domain     = "${vercel_project.parkvision_frontend.name}.vercel.app"
}

output "project_id" {
  value       = vercel_project.parkvision_frontend.id
  description = "Vercel project ID"
}

output "deployment_url" {
  value       = "https://${vercel_project_domain.main.domain}"
  description = "Production deployment URL"
}
