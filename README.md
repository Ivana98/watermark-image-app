# Watermark Image Application

This repository contains a cloud-native application for watermarking images using AWS infrastructure. The system is composed of a frontend interface, a backend API, and a worker process for asynchronous image processing. Diagrams are also provided to illustrate the overall cloud infrastructure and application flows.

## Repository Folder Structure

- diagrams/      - Diagrams illustrating AWS infrastructure, frontend app states, and sequence diagram of watermarking image flow
- frontend/      - React + TypeScript + Vite application that provides UI for uploading images and viewing results.
- backend/       - FastAPI (Python) backend API that exposes HTTPS endpoints used by the frontend. Handles requests, validation, and listens to SNS messages.
- worker/        - Python script for polling SQS messages and adding watermark to images stored in S3 bucket.

## Running applications locally
### Before running any of the applications locally, the following **must be completed**:
1. **AWS Infrastructure Setup**  
   Ensure all required AWS services are created and configured 

2. **Environment Variables**  
   Each app requires its own `.env` file with appropriate variables.  
   Copy the content of `.env.template` file in each app's folder and fill in the necessary values.

---

### Frontend

* **Technology:** React + TypeScript + Vite
* **Location:** `frontend/`

#### Steps to Run:

```bash
cd frontend
npm install              # Install dependencies
npm run start            # Start development server
```

> Access the app in your browser at `http://localhost:5173` (or the port Vite shows in the terminal, if 5173 is used).

---

### Backend

* **Technology:** Python 3.13.0 + FastAPI
* **Location:** `backend/`

#### Steps to Run:

```bash
cd backend
python -m venv venv                       # Create a virtual environment
.\venv\Scripts\activate                   # Activate virtual environment (On Windows)
# or source venv/bin/activate             # Activate virtual environment (Linux/macOS)
pip install -r requirements.txt           # Install dependencies
uvicorn app.main:app --reload --port 8000 # Run the FastAPI app
```

> The API will be available at `http://localhost:8000`

---

### Worker

* **Technology:** Python 3.13.0
* **Location:** `worker/`

#### Steps to Run:

```bash
cd worker
python -m venv venv                # Create a virtual environment
.\venv\Scripts\activate            # Activate virtual environment (On Windows)
# or source venv/bin/activate      # Activate virtual environment (Linux/macOS)
pip install -r requirements.txt    # Install dependencies  
python worker.py                   # Start the worker script
```

> The worker listens to AWS SQS queue and processes messages in real-time.

---

## Steps to run application on AWS sandbox

### 1. Start AWS Sandbox

1. Log in to [Pluralsight](https://app.pluralsight.com/).
2. Start an **AWS Sandbox** environment.

### 2. Configure AWS CLI Profile

Open your terminal (Bash, WSL, or Git Bash) and configure a named AWS CLI profile:

```bash
aws configure --profile acg
```

Enter the following values when prompted:

- **AWS Access Key ID:** Access Key ID provided in sandbox.
- **AWS Secret Access Key:** Secret Access Key provided in sandbox.
- **Default region name:** `us-east-1`
- **Default output format:** `json`

> **Note:** If working on Windows OS, export the AWS profile to ensure all subsequent AWS CLI and Terraform commands use the correct credentials.
> This environment variable applies only to the current terminal session. Run the command again when opening a new terminal.

```bash
export AWS_PROFILE=acg
```

### 3. Clean Up Previous Terraform Files

Navigate to the `infrastructure` project directory.

If the project was previously initialized against another AWS Sandbox, remove the old Terraform initialization files.

#### Files that can be safely removed:

- `.terraform/` — Directory containing downloaded providers, modules, and cached backend configuration. Terraform recreates it during initialization.

Remove the directory using:

```bash
rm -rf .terraform/
```

#### Files that can be removed conditionally (files that contain Terraform state and should be removed when starting with a new sandbox):

- `terraform.tfstate` — Local Terraform state file.
- `terraform.tfstate.backup` — Backup of the previous Terraform state.
- `terraform.tfstate.d/` — Local state files for additional Terraform workspaces, if used.

> **Important:**
> - Do not delete Terraform configuration files (`*.tf`, `*.tfvars`).
> - Keep `.terraform.lock.hcl` because it maintains consistent Terraform provider versions.

### 4. Initialize Terraform

From the `infrastructure` project directory, initialize Terraform:

```bash
terraform init
```

> Alternatively, if the Terraform backend configuration has changed or you want to discard the previously cached backend configuration, you can run the "-reconfigure" option that tells Terraform to reinitialize the backend without attempting to migrate existing state: `terraform init -reconfigure`

### 5. Deploy Infrastructure
Apply the Terraform configuration to provision the required AWS resources:

```bash
terraform apply
```

> If you first want to review the changes Terraform is going to make: `terraform plan`  
> If you want to skip the interactive approval of prompt: `terraform apply -auto-approve`

### 6. Build and Push Docker Images to Amazon ECR

After the infrastructure is deployed, navigate back to the project root directory containing `build.sh`.

The script builds the Docker images and pushes them to **Amazon Elastic Container Registry (ECR)**.

> **Note:** Ensure **Docker is installed and running** before executing the script.

#### Using WSL (Windows Subsystem for Linux)

```bash
bash build.sh <domain>
```

#### Using Bash (Windows)

```bash
./build.sh <domain>
```

> **Note:** Replace `<domain>` with the domain name configured in **Amazon Route 53**, e.g. `https://134851837170.realhandsonlabs.net`.
