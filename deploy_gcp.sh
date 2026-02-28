#!/bin/bash

# TravelBuddy GCP Deployment Script
# Usage: ./deploy_gcp.sh [PROJECT_ID] [BUCKET_NAME]

PROJECT_ID=$1
BUCKET_NAME=$2

if [ -z "$PROJECT_ID" ] || [ -z "$BUCKET_NAME" ]; then
    echo "Usage: ./deploy_gcp.sh [PROJECT_ID] [BUCKET_NAME]"
    exit 1
fi

echo "🚀 Starting deployment for project: $PROJECT_ID..."

# Set project
gcloud config set project $PROJECT_ID

# Create bucket if it doesn't exist
echo "📦 Creating bucket gs://$BUCKET_NAME..."
gcloud storage buckets create gs://$BUCKET_NAME --location=US --uniform-bucket-level-access

# Upload files
echo "📤 Uploading files..."
gcloud storage cp index.html style.css script.js gs://$BUCKET_NAME

# Set public access
echo "🔓 Setting public permissions..."
gcloud storage buckets add-iam-policy-binding gs://$BUCKET_NAME \
    --member=allUsers \
    --role=roles/storage.objectViewer

# Configure as website
echo "🌐 Configuring as static website..."
gcloud storage buckets update gs://$BUCKET_NAME --web-main-page-suffix=index.html

echo "✅ Success! Your app is live at:"
echo "https://storage.googleapis.com/$BUCKET_NAME/index.html"
