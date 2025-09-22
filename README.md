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
   Copy the content of `.env.template` file in each app's folder and fill in the necessary values

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

## Steps to Build and Deploy Application's Docker Containers to AWS ECR:

Before running the build script, make sure you have configured your AWS CLI profile:

```bash
aws configure --profile myawsprofile
```

#### Steps to Run:

To build and push Docker images to ECR, run:
```bash
./build.sh
```
