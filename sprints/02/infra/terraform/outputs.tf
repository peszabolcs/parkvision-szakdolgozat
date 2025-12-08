output "project_name" {
  value       = vercel_project.parkvision_frontend.name
  description = "Name of the Vercel project"
}

output "project_url" {
  value       = "https://${vercel_project_domain.main.domain}"
  description = "Main project URL"
}
