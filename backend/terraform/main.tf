provider "google" {
  project = var.project_id
  region  = var.region
  credentials = "C:\\Users\\laugh\\Downloads\\scribe-449619-6cc4ce70cd06.json"
}

resource "google_storage_bucket" "function_source" {
  name          = var.bucket_name
  location      = var.region
  force_destroy = true
}

resource "google_storage_bucket_object" "function_zip" {
  name   = "function-source.zip"
  bucket = google_storage_bucket.function_source.name
  source = "function-source.zip"
}

resource "google_cloudfunctions_function" "function" {
  name        = "create_folder_and_update_document"
  runtime     = "python310"
  entry_point = "create_folder_and_update_document"
  region      = var.region

  source_archive_bucket = google_storage_bucket.function_source.name
  source_archive_object = google_storage_bucket_object.function_zip.name
  event_trigger {
    event_type = "providers/cloud.firestore/eventTypes/document.create"
    resource   = "projects/${var.project_id}/databases/(default)/documents/${var.collection_path}/{docId}"
  }

  environment_variables = {
    GCP_PROJECT = var.project_id
  }

  depends_on = [
    google_project_service.firestore,
    google_project_service.cloudfunctions
  ]
}

resource "google_project_service" "firestore" {
  service = "firestore.googleapis.com"
  disable_on_destroy = false
}

resource "google_project_service" "cloudfunctions" {
  service = "cloudfunctions.googleapis.com"
  disable_on_destroy = false
}

resource "google_project_service" "cloudbuild" {
  service = "cloudbuild.googleapis.com"
  disable_on_destroy = false
}

variable "project_id" {
  description = "The ID of the project in which to create the function"
  type        = string
}

variable "region" {
  description = "The region in which to create the function"
  type        = string
  default     = "us-central1"
}

variable "bucket_name" {
  description = "The name of the bucket to store the function source code"
  type        = string
  default     = "function-source-bucket"
}

variable "collection_path" {
  description = "The Firestore collection path to watch for document creation"
  type        = string
}
