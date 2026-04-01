# 🚀 AI-Powered Predictive Maintenance & Bearing Life Prediction Platform

An AI-powered predictive maintenance platform designed to monitor industrial bearing health and estimate **Remaining Useful Life (RUL)** using machine learning and intelligent analytics.

The platform integrates machine learning models, backend APIs, and an interactive dashboard to analyze bearing sensor data and predict potential failures.

---

# 📌 Overview

Predictive maintenance enables industries to **anticipate equipment failures before they occur**.  
By analyzing bearing sensor data such as vibration and temperature, the platform predicts the **remaining operational life of bearings** and provides recommendations for maintenance planning.

The system includes:

- Machine learning models for RUL prediction
- Backend API for serving predictions
- Interactive monitoring dashboard
- Synthetic dataset generation
- Role-based analytics and monitoring

**Goal**

- Reduce unexpected downtime  
- Optimize maintenance schedules  
- Improve operational efficiency  
- Enable data-driven maintenance decisions  

---

# ✨ Key Features

## Predictive Maintenance Intelligence
- AI-powered Remaining Useful Life prediction
- Bearing degradation analysis using sensor data
- Failure risk categorization with confidence scores
- Intelligent maintenance recommendations

## Real-Time Bearing Health Monitoring
- Monitor vibration and temperature
- Machine-level bearing health tracking
- Historical degradation trends
- Fleet-wide monitoring dashboard

## Interactive Dashboard
- Fleet health overview
- Sensor data visualization
- Predictive alerts
- Maintenance planning insights

---

# 🔐 Role-Based Access Control

| Role | Capabilities |
|-----|-------------|
| Engineer | Monitor machines, view sensor data, predictions |
| Manager | View analytics dashboards and reports |
| Sales | Identify service opportunities |
| Admin | Manage system configuration and users |

---

# 🏗 System Architecture

The platform follows a **three-layer architecture**.

## Machine Learning Layer
- Feature extraction from sensor signals
- Model training for bearing life prediction
- Remaining Useful Life estimation
- Failure risk classification

## Backend Layer
- REST API endpoints
- Model inference services
- Data processing

## Frontend Layer
- Web-based dashboard
- Interactive analytics
- Maintenance planning tools

---

# ⚙️ System Workflow

Sensor Data  
↓  
Feature Extraction  
↓  
Machine Learning Model  
↓  
Prediction API  
↓  
Frontend Dashboard  
↓  
Maintenance Decision Support  

---

# 📊 Dashboard Modules

### Dashboard
- Fleet health overview
- Critical alerts
- Performance indicators

### Machines
- Machine-by-machine monitoring
- Sensor data visualization
- Maintenance history

### RUL Predictions
- Bearing failure predictions
- Risk classification
- Maintenance recommendations

### Recommendations
- Maintenance action planning
- Downtime estimates

### Analytics
- Health score distribution
- RUL trend analysis
- Forecasting insights

### Reports
- Fleet health reports
- Maintenance analytics
- Export options

### Admin Panel
- System monitoring
- User management
- API configuration

---

# 🧰 Technical Stack

| Layer | Technology |
|------|-------------|
| Frontend | Next.js, React, TypeScript |
| UI Framework | Tailwind CSS |
| Data Visualization | Recharts |
| AI Integration | Claude AI via Vercel AI Gateway |
| Backend | Python REST API |
| Machine Learning | RUL Prediction Models |

---

# 📂 Repository Structure

    BEARING_RUL_PROJECT
    │
    ├── backend
    │   ├── api.py
    │   └── predict.py
    │
    ├── data
    │   └── generate_dataset.py
    │
    ├── model
    │   └── train_model.py
    │
    ├── frontend
    │   └── dashboard application
    │
    ├── app
    │   └── dashboard
    │       ├── machines
    │       ├── predictions
    │       ├── analytics
    │       ├── reports
    │       └── admin
    │
    ├── lib
    │   ├── types.ts
    │   ├── mock-data.ts
    │   └── auth-context.tsx
    │
    ├── components
    │   └── dashboard components
    │
    └── README.md

---

# 📊 Synthetic Dataset

The project uses **synthetically generated sensor data** to simulate bearing degradation patterns.

Generate dataset:

    python data/generate_dataset.py

The dataset will be saved in the `data/` directory.

---

# 🚀 Getting Started

## Clone the Repository

    git clone https://github.com/nityasanthosh/AI-Powered-Predictive-Maintenance-Bearing-Life-Prediction-Platform.git

Navigate to project directory:

    cd AI-Powered-Predictive-Maintenance-Bearing-Life-Prediction-Platform

---

# ⚙ Backend Setup

Install dependencies:

    pip install -r requirements.txt

Run backend API:

    python backend/api.py

---

# 🌐 Frontend Setup

Navigate to frontend folder:

    cd frontend

Install dependencies:

    npm install

Run development server:

    npm start

Open:

    http://localhost:3000

---

# 🤖 AI Prediction Integration

The platform integrates **Claude AI via the Vercel AI Gateway**.

The AI analyzes:

- Bearing specifications
- Health score
- Sensor data
- Machine operating conditions

Outputs include:

- Failure risk analysis
- Maintenance recommendations
- Reliability insights
- Prediction confidence scores

---

# 🏭 Applications

This predictive maintenance framework can be applied in:

- Industrial equipment monitoring
- Smart manufacturing systems
- Condition-based maintenance
- IoT predictive maintenance platforms
- Rotating machinery monitoring

---

# 🔮 Future Enhancements

- Real-time IoT sensor streaming
- Deep learning models for better prediction accuracy
- Cloud deployment
- Mobile application for engineers
- Automated alert system

---

# 📜 License

This project is intended for **academic and demonstration purposes**.

