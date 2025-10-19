# Flux - Cross-Currency Transaction Platform Setup Guide

## 🚀 Complete Setup Instructions

This guide will walk you through setting up the complete Flux platform with Firebase backend and React frontend.

## 📋 Prerequisites

- Node.js (v16 or higher)
- Python (v3.8 or higher)
- Firebase account
- Git

## 🔥 Firebase Setup Instructions

### Step 1: Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Create a project"
3. Enter project name: `flux-cross-currency`
4. Enable Google Analytics (optional)
5. Click "Create project"

### Step 2: Enable Authentication

1. In Firebase Console, go to "Authentication"
2. Click "Get started"
3. Go to "Sign-in method" tab
4. Enable the following providers:
   - **Email/Password**: Click "Email/Password" → Enable → Save
   - **Google**: Click "Google" → Enable → Add your project support email → Save

### Step 3: Create Firestore Database

1. In Firebase Console, go to "Firestore Database"
2. Click "Create database"
3. Choose "Start in test mode" (for development)
4. Select a location (choose closest to your users)
5. Click "Done"

### Step 4: Get Firebase Configuration

1. In Firebase Console, go to "Project settings" (gear icon)
2. Scroll down to "Your apps" section
3. Click "Web app" icon (`</>`)
4. Enter app nickname: `flux-web`
5. Click "Register app"
6. Copy the Firebase configuration object

### Step 5: Download Service Account Key

1. In Firebase Console, go to "Project settings"
2. Go to "Service accounts" tab
3. Click "Generate new private key"
4. Download the JSON file
5. Rename it to `firebase-service-account.json`
6. Place it in the `backend/` directory

## 🛠️ Backend Setup

### Step 1: Install Dependencies

```bash
cd backend
pip install -r requirements.txt
```

### Step 2: Configure Firebase

1. Place your `firebase-service-account.json` file in the `backend/` directory
2. The backend will automatically use this file for Firebase Admin SDK

### Step 3: Start Backend Server

```bash
python main.py
```

The backend will start on `http://localhost:8000`

## 🎨 Frontend Setup

### Step 1: Install Dependencies

```bash
cd frontend
npm install
```

### Step 2: Configure Environment Variables

1. Copy the environment template:
```bash
cp env.example .env
```

2. Edit `.env` file with your Firebase configuration:
```env
REACT_APP_FIREBASE_API_KEY=your_api_key_here
REACT_APP_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=your_project_id
REACT_APP_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
REACT_APP_FIREBASE_APP_ID=your_app_id
REACT_APP_API_URL=http://localhost:8000
```

### Step 3: Start Frontend Development Server

```bash
npm start
```

The frontend will start on `http://localhost:3000`

## 🗄️ Firebase Data Model

The platform uses the following Firestore collections:

### Users Collection (`users/{userId}`)
```json
{
  "email": "user@example.com",
  "displayName": "John Doe",
  "balances": {
    "usd": 1000.0,
    "mxn": 0.0,
    "eur": 0.0,
    "gbp": 0.0,
    "jpy": 0.0,
    "cad": 0.0,
    "aud": 0.0
  },
  "createdAt": "2024-01-15T10:30:00Z"
}
```

### Transactions Collection (`transactions/{transactionId}`)
```json
{
  "sender_id": "user123",
  "receiver_email": "receiver@example.com",
  "sent_amount": 100.0,
  "sent_currency": "USD",
  "received_amount": 2000.0,
  "received_currency": "MXN",
  "rate": 20.0,
  "timestamp": "2024-01-15T10:30:00Z",
  "crypto_path": {
    "chain": "polygon",
    "path": "USD → USDC (Coinbase) → MXN (polygon via 1inch)"
  }
}
```

## 🔧 API Endpoints

### Public Endpoints
- `GET /` - Health check
- `POST /quote` - Get cross-currency quote
- `GET /health` - Service health status

### Authenticated Endpoints (require Firebase ID token)
- `POST /transfer/execute` - Execute a transfer
- `GET /user/me` - Get user profile
- `GET /transfer/history` - Get transaction history

## 🎯 Key Features

### Backend Features
- **Quoting Engine**: Real-time quotes from 15+ exchanges
- **Firebase Integration**: User authentication and data storage
- **Atomic Transactions**: Firestore transactions for data consistency
- **Multi-chain Support**: Polygon, zkSync, Arbitrum, Optimism, Ethereum
- **CEX Integration**: Coinbase and Binance APIs
- **DEX Aggregation**: 1inch and 0x protocol integration

### Frontend Features
- **Space-themed UI**: Dark blue and white theme with Open Sans font
- **GSAP Animations**: Smooth scroll animations and UI transitions
- **Firebase Authentication**: Email/password and Google sign-in
- **Responsive Design**: Mobile-first approach
- **Real-time Updates**: Live quote generation with loading states
- **Transaction Management**: Complete transaction history and dashboard

## 🚀 Usage Flow

1. **User Registration/Login**: Firebase authentication
2. **Quote Generation**: Real-time rate comparison
3. **Transfer Execution**: Atomic Firestore transactions
4. **Transaction History**: Complete audit trail

## 🔒 Security Features

- Firebase ID token verification
- Atomic Firestore transactions
- Input validation and sanitization
- CORS configuration
- Rate limiting (implement in production)

## 📱 Mobile Responsiveness

The platform is fully responsive and optimized for:
- Desktop (1200px+)
- Tablet (768px - 1199px)
- Mobile (320px - 767px)

## 🎨 Design System

- **Colors**: Space-themed dark blue (#0f0f23, #1a1a2e, #16213e)
- **Typography**: Open Sans font family
- **Components**: Styled-components with theme provider
- **Animations**: GSAP for smooth interactions
- **Icons**: Lucide React icon library

## 🧪 Testing

### Backend Testing
```bash
cd backend
python -m pytest tests/
```

### Frontend Testing
```bash
cd frontend
npm test
```

## 🚀 Production Deployment

### Backend Deployment
1. Deploy to your preferred cloud provider (AWS, GCP, Azure)
2. Set up environment variables
3. Configure Firebase service account
4. Set up SSL certificates

### Frontend Deployment
1. Build the production bundle:
```bash
npm run build
```
2. Deploy to your hosting provider (Netlify, Vercel, etc.)
3. Configure environment variables
4. Set up custom domain

## 📞 Support

For issues or questions:
1. Check the logs in browser console and backend terminal
2. Verify Firebase configuration
3. Ensure all environment variables are set correctly
4. Check network connectivity to APIs

## 🎉 You're Ready!

Once setup is complete, you'll have a fully functional cross-currency transaction platform with:

- ✅ Firebase authentication and data storage
- ✅ Real-time quote generation
- ✅ Atomic transaction execution
- ✅ Beautiful space-themed UI
- ✅ GSAP animations
- ✅ Mobile responsiveness
- ✅ Complete transaction history

Start converting currencies with the best rates from 15+ exchanges! 🚀
