#!/usr/bin/env bash
set -eo pipefail # Exit immediately if any command fails

export AWS_PROFILE=acg
# Set region once (both AWS_REGION and AWS_DEFAULT_REGION)
export AWS_REGION=us-east-1
export AWS_DEFAULT_REGION=$AWS_REGION

# Get AWS account number
AWS_ACCOUNT=$(aws sts get-caller-identity --query Account --output text)
if [ -z "$AWS_ACCOUNT" ]; then
    echo "Unable to retrieve AWS account number."
    exit 1
fi
echo "AWS Account: $AWS_ACCOUNT"

# Log in to ECR in the specified region
echo "Logging in to AWS ECR in ${AWS_REGION}..."
aws ecr get-login-password | docker login --username AWS --password-stdin "${AWS_ACCOUNT}.dkr.ecr.${AWS_REGION}.amazonaws.com"

echo "Retrieving domain name..."
# Use this to retrieve the domain name from Terraform output in the infrastructure directory
# DOMAIN_NAME=$(terraform -chdir=infra output -raw domain_name)
DOMAIN_NAME="$1"
if [ -z "$DOMAIN_NAME" ]; then
    # echo "Failed to retrieve the domain name from Terraform output."
    echo "Domain name is not passed as argument."
    exit 1
fi
echo "Domain Name: $DOMAIN_NAME"

# Build the backend image (no build argument required)
echo "Building backend image..."
docker build \
    -t "${AWS_ACCOUNT}.dkr.ecr.${AWS_REGION}.amazonaws.com/watermarky-dev-be" \
    backend

# Build the frontend image with the required build argument
echo "Building frontend image..."
docker build \
    --build-arg VITE_BACKEND_APP_URL="https://${DOMAIN_NAME}/api" \
    -t "${AWS_ACCOUNT}.dkr.ecr.${AWS_REGION}.amazonaws.com/watermarky-dev-fe" \
    frontend

# Build the worker image (no build argument required)
echo "Building worker image..."
docker build \
    -t "${AWS_ACCOUNT}.dkr.ecr.${AWS_REGION}.amazonaws.com/watermarky-dev-worker" \
    worker

echo "Docker images built successfully."

# (Optional) Push the images to ECR
# Uncomment the following lines to push your images automatically

echo "Pushing backend image to ECR..."
docker push "${AWS_ACCOUNT}.dkr.ecr.${AWS_REGION}.amazonaws.com/watermarky-dev-be"
echo "Pushing frontend image to ECR..."
docker push "${AWS_ACCOUNT}.dkr.ecr.${AWS_REGION}.amazonaws.com/watermarky-dev-fe"
echo "Pushing worker image to ECR..."
docker push "${AWS_ACCOUNT}.dkr.ecr.${AWS_REGION}.amazonaws.com/watermarky-dev-worker"

echo "All done!"
