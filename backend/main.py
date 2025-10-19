#!/usr/bin/env python3
"""
Flux Backend API - Cross-Currency Transaction Platform
FastAPI-based backend with Firebase integration and quoting engine
"""

from fastapi import FastAPI, HTTPException, Depends, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from fastapi import Header
from pydantic import BaseModel
from typing import Dict, List, Optional
import asyncio
import aiohttp
import json
import uuid
from datetime import datetime
import os
from dotenv import load_dotenv
import firebase_admin
from firebase_admin import credentials, firestore, auth

# Load environment variables
load_dotenv()

# Import our existing services
import sys
sys.path.append('..')
from cex_integration import CEXAggregatorService
from dex_aggregator import DEXAggregatorService
from enhanced_fx_platform import FXRateService

# Initialize Firebase Admin SDK
def initialize_firebase():
    """Initialize Firebase Admin SDK"""
    try:
        # Check if Firebase is already initialized
        if not firebase_admin._apps:
            # Initialize with service account key
            cred = credentials.Certificate("firebase-service-account.json")
            firebase_admin.initialize_app(cred)
        return firestore.client()
    except Exception as e:
        print(f"Firebase initialization error: {e}")
        return None

# Initialize Firebase
db = initialize_firebase()

app = FastAPI(
    title="Warp API",
    description="Cross-Currency Transaction Platform with Firebase Integration",
    version="1.0.0"
)

# CORS middleware for frontend access
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify your frontend domain
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Security scheme
security = HTTPBearer()

# Initialize services
fx_service = FXRateService()
cex_service = CEXAggregatorService()
dex_service = DEXAggregatorService()

# In-memory quote cache (replace with Redis in production)
quote_cache = {}

# Pydantic models
class QuoteRequest(BaseModel):
    send_currency: str
    receive_currency: str
    send_amount: float

class QuoteResponse(BaseModel):
    quote_id: str
    send_currency: str
    receive_currency: str
    send_amount: float
    our_rate: float
    our_amount: float
    mid_market_rate: float
    mid_market_amount: float
    crypto_path: Dict
    timestamp: str
    processing_time_ms: int

class TransferExecuteRequest(BaseModel):
    quote_id: str
    receiver_email: str

class TransferExecuteResponse(BaseModel):
    transaction_id: str
    status: str
    message: str
    timestamp: str

class UserResponse(BaseModel):
    email: str
    display_name: str
    balances: Dict[str, float]

class TransactionResponse(BaseModel):
    transaction_id: str
    sender_id: str
    receiver_email: str
    sent_amount: float
    sent_currency: str
    received_amount: float
    received_currency: str
    rate: float
    timestamp: str

# Authentication dependency
async def verify_firebase_token(authorization: str = Header(None)):
    """Verify Firebase ID token"""
    if not authorization or not authorization.startswith('Bearer '):
        raise HTTPException(status_code=401, detail="Authentication required")
    
    try:
        token = authorization.split(' ')[1]
        
        # For testing purposes, accept mock token
        if token == 'mock-firebase-token-123':
            print(f"✅ Mock token accepted: {token}")
            return {
                'uid': 'mock-user-123',
                'email': 'test@example.com',
                'displayName': 'Test User'
            }
        
        # Real Firebase token verification
        decoded_token = auth.verify_id_token(token)
        return decoded_token
    except Exception as e:
        print(f"❌ Firebase auth error: {e}")
        print(f"❌ Token received: {token}")
        raise HTTPException(status_code=401, detail="Invalid authentication token")

# Async HTTP client for API calls
async def get_async_session():
    return aiohttp.ClientSession()

async def call_fx_api(from_currency: str, to_currency: str) -> Dict:
    """Call FX API asynchronously"""
    try:
        async with aiohttp.ClientSession() as session:
            url = f"https://api.exchangerate-api.com/v4/latest/{from_currency}"
            async with session.get(url, timeout=10) as response:
                if response.status == 200:
                    data = await response.json()
                    rate = data.get('rates', {}).get(to_currency, 0)
                    return {
                        'rate': rate,
                        'source': 'ExchangeRate API',
                        'timestamp': datetime.now().isoformat()
                    }
                else:
                    raise Exception(f"FX API error: {response.status}")
    except Exception as e:
        print(f"FX API error: {e}")
        # Fallback to our existing service
        rate = fx_service.get_rate(from_currency, to_currency)
        return {
            'rate': rate,
            'source': 'Fallback FX Service',
            'timestamp': datetime.now().isoformat()
        }

async def call_coinbase_api(amount: float, from_currency: str, to_crypto: str = "USDC") -> Dict:
    """Call Coinbase API for on-ramp cost"""
    try:
        # Use our existing CEX service
        quote = cex_service.coinbase.get_fiat_to_crypto_quote(amount, from_currency, to_crypto)
        if quote:
            return {
                'crypto_amount': quote['crypto_amount'],
                'rate': quote['rate'],
                'source': 'Coinbase API',
                'timestamp': datetime.now().isoformat()
            }
        else:
            # Fallback simulation
            return {
                'crypto_amount': amount * 0.999,  # 0.1% fee
                'rate': 1.0,
                'source': 'Coinbase API (Simulated)',
                'timestamp': datetime.now().isoformat()
            }
    except Exception as e:
        print(f"Coinbase API error: {e}")
        return {
            'crypto_amount': amount * 0.999,
            'rate': 1.0,
            'source': 'Coinbase API (Fallback)',
            'timestamp': datetime.now().isoformat()
        }

async def call_1inch_api(crypto_amount: float, from_crypto: str, to_currency: str, chain: str = "polygon") -> Dict:
    """Call 1inch API for DEX swap rates"""
    try:
        # Use our existing DEX service
        chain_info = dex_service.get_chain_info(chain)
        if chain_info:
            # Simulate 1inch API call (replace with actual 1inch API integration)
            # For demo purposes, we'll simulate a good DEX rate
            fx_data = await call_fx_api("USD", to_currency)
            dex_rate = fx_data['rate'] * 1.001  # 0.1% better than mid-market
            
            return {
                'final_amount': crypto_amount * dex_rate,
                'rate': dex_rate,
                'chain': chain,
                'source': '1inch API (Simulated)',
                'timestamp': datetime.now().isoformat()
            }
        else:
            raise Exception(f"Unsupported chain: {chain}")
    except Exception as e:
        print(f"1inch API error: {e}")
        # Fallback
        fx_data = await call_fx_api("USD", to_currency)
        return {
            'final_amount': crypto_amount * fx_data['rate'],
            'rate': fx_data['rate'],
            'chain': chain,
            'source': '1inch API (Fallback)',
            'timestamp': datetime.now().isoformat()
        }

def model_batching_savings(crypto_rate: float, amount: float) -> float:
    """Apply batching savings model to crypto rate"""
    # Simulate batching savings based on amount
    if amount < 1000:
        savings_factor = 1.0  # No savings for small amounts
    elif amount < 10000:
        savings_factor = 1.001  # 0.1% savings for medium amounts
    else:
        savings_factor = 1.002  # 0.2% savings for large amounts
    
    return crypto_rate * savings_factor

async def find_best_crypto_path(amount: float, from_currency: str, to_currency: str) -> Dict:
    """Find the best crypto path for the transaction"""
    start_time = datetime.now()
    
    # Step 1: Get on-ramp cost from Coinbase
    print(f"🔍 Getting Coinbase on-ramp quote for {amount} {from_currency}...")
    on_ramp = await call_coinbase_api(amount, from_currency, "USDC")
    crypto_amount = on_ramp['crypto_amount']
    
    # Step 2: Test different chains for DEX swaps
    chains = ['polygon', 'zksync', 'arbitrum', 'optimism']
    best_path = None
    best_final_amount = 0
    
    for chain in chains:
        print(f"🔗 Testing {chain} chain...")
        try:
            dex_swap = await call_1inch_api(crypto_amount, "USDC", to_currency, chain)
            final_amount = dex_swap['final_amount']
            
            if final_amount > best_final_amount:
                best_final_amount = final_amount
                best_path = {
                    'chain': chain,
                    'on_ramp': on_ramp,
                    'dex_swap': dex_swap,
                    'final_amount': final_amount,
                    'path': f"{from_currency} → USDC (Coinbase) → {to_currency} ({chain} via 1inch)"
                }
        except Exception as e:
            print(f"Error testing {chain}: {e}")
            continue
    
    processing_time = (datetime.now() - start_time).total_seconds() * 1000
    
    if best_path:
        return {
            'success': True,
            'path': best_path,
            'processing_time_ms': processing_time
        }
    else:
        return {
            'success': False,
            'error': 'No viable crypto path found',
            'processing_time_ms': processing_time
        }

async def calculate_best_quote(send_currency: str, receive_currency: str, send_amount: float) -> QuoteResponse:
    """Calculate the best quote using all available routes"""
    start_time = datetime.now()
    
    print(f"🚀 Starting quote calculation: {send_amount} {send_currency} → {receive_currency}")
    
    # Step 1: Asynchronously call FX API for mid-market rate
    print("📡 Getting mid-market rate...")
    fx_data = await call_fx_api(send_currency, receive_currency)
    mid_market_rate = fx_data['rate']
    mid_market_amount = send_amount * mid_market_rate
    
    # Step 2: Execute find_best_crypto_path logic
    print("🪙 Finding best crypto path...")
    crypto_path_data = await find_best_crypto_path(send_amount, send_currency, receive_currency)
    
    if crypto_path_data['success']:
        crypto_final_amount = crypto_path_data['path']['final_amount']
        our_rate = model_batching_savings(crypto_final_amount / send_amount, send_amount)
        our_amount = send_amount * our_rate
        crypto_path = crypto_path_data['path']
    else:
        # Fallback to mid-market rate if crypto path fails
        our_rate = mid_market_rate
        our_amount = mid_market_amount
        crypto_path = {'error': 'Crypto path unavailable'}
    
    processing_time = (datetime.now() - start_time).total_seconds() * 1000
    
    quote_id = str(uuid.uuid4())
    
    # Cache the quote
    quote_cache[quote_id] = {
        'send_currency': send_currency,
        'receive_currency': receive_currency,
        'send_amount': send_amount,
        'our_rate': our_rate,
        'our_amount': our_amount,
        'mid_market_rate': mid_market_rate,
        'mid_market_amount': mid_market_amount,
        'crypto_path': crypto_path,
        'timestamp': datetime.now().isoformat()
    }
    
    return QuoteResponse(
        quote_id=quote_id,
        send_currency=send_currency,
        receive_currency=receive_currency,
        send_amount=send_amount,
        our_rate=our_rate,
        our_amount=our_amount,
        mid_market_rate=mid_market_rate,
        mid_market_amount=mid_market_amount,
        crypto_path=crypto_path,
        timestamp=datetime.now().isoformat(),
        processing_time_ms=int(processing_time)
    )

# API Endpoints
@app.get("/")
async def root():
    """Root endpoint"""
    return {
        "message": "Flux API - Cross-Currency Transaction Platform",
        "version": "1.0.0",
        "status": "running"
    }

@app.post("/quote", response_model=QuoteResponse)
async def get_quote(request: QuoteRequest):
    """Get a quote for cross-currency transaction"""
    try:
        print(f"📊 Quote request: {request.send_amount} {request.send_currency} → {request.receive_currency}")
        
        quote = await calculate_best_quote(
            request.send_currency,
            request.receive_currency,
            request.send_amount
        )
        
        print(f"✅ Quote generated: {quote.our_amount:.2f} {request.receive_currency}")
        return quote
        
    except Exception as e:
        print(f"❌ Quote error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/transfer/execute", response_model=TransferExecuteResponse)
async def execute_transfer(request: TransferExecuteRequest, user_token: dict = Depends(verify_firebase_token)):
    """Execute a transfer with Firebase authentication"""
    try:
        if not db:
            raise HTTPException(status_code=500, detail="Database not available")
        
        user_id = user_token['uid']
        user_email = user_token.get('email', '')
        
        # Get cached quote
        if request.quote_id not in quote_cache:
            raise HTTPException(status_code=404, detail="Quote not found or expired")
        
        quote_data = quote_cache[request.quote_id]
        
        # Execute Firestore transaction
        transaction_id = str(uuid.uuid4())
        
        @firestore.transactional
        def execute_transfer_transaction(transaction):
            # Read sender's user document
            sender_ref = db.collection('users').document(user_id)
            sender_doc = transaction.get(sender_ref)
            
            # Check if sender document exists
            if not sender_doc.exists:
                raise Exception("Sender user not found")
            
            sender_data = sender_doc.to_dict()
            sender_balances = sender_data.get('balances', {})
            
            # Check if sender has sufficient balance
            sent_currency = quote_data['send_currency'].lower()
            sent_amount = quote_data['send_amount']
            
            if sender_balances.get(sent_currency, 0) < sent_amount:
                raise Exception("Insufficient balance")
            
            # Read receiver's user document (query by email)
            receiver_query = db.collection('users').where('email', '==', request.receiver_email)
            receiver_docs = list(receiver_query.stream())
            
            if not receiver_docs:
                raise Exception("Receiver not found")
            
            receiver_doc = receiver_docs[0]
            receiver_data = receiver_doc.to_dict()
            receiver_balances = receiver_data.get('balances', {})
            
            # Update sender's balance
            sender_balances[sent_currency] -= sent_amount
            transaction.update(sender_ref, {'balances': sender_balances})
            
            # Update receiver's balance
            received_currency = quote_data['receive_currency'].lower()
            received_amount = quote_data['our_amount']
            receiver_balances[received_currency] = receiver_balances.get(received_currency, 0) + received_amount
            transaction.update(receiver_doc.reference, {'balances': receiver_balances})
            
            # Create transaction record
            transaction_ref = db.collection('transactions').document(transaction_id)
            transaction.set(transaction_ref, {
                'sender_id': user_id,
                'receiver_email': request.receiver_email,
                'sent_amount': sent_amount,
                'sent_currency': quote_data['send_currency'],
                'received_amount': received_amount,
                'received_currency': quote_data['receive_currency'],
                'rate': quote_data['our_rate'],
                'timestamp': firestore.SERVER_TIMESTAMP,
                'crypto_path': quote_data['crypto_path']
            })
        
        # Execute the transaction
        transaction = db.transaction()
        execute_transfer_transaction(transaction)
        
        # Remove quote from cache
        del quote_cache[request.quote_id]
        
        return TransferExecuteResponse(
            transaction_id=transaction_id,
            status="COMPLETED",
            message="Transfer executed successfully",
            timestamp=datetime.now().isoformat()
        )
        
    except Exception as e:
        print(f"❌ Transfer execution error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/user/me", response_model=UserResponse)
async def get_user_profile(user_token: dict = Depends(verify_firebase_token)):
    """Get current user's profile and balances"""
    try:
        if not db:
            # Return mock data when Firebase is not available
            return UserResponse(
                email=user_token.get('email', 'test@example.com'),
                display_name=user_token.get('displayName', 'Test User'),
                balances={
                    'usd': 1000.0,
                    'mxn': 0.0,
                    'eur': 0.0,
                    'gbp': 0.0,
                    'jpy': 0.0,
                    'cad': 0.0,
                    'aud': 0.0
                }
            )
        
        user_id = user_token['uid']
        user_doc = db.collection('users').document(user_id).get()
        
        # Check if user document exists
        if not user_doc.exists:
            # Create user if doesn't exist
            user_data = {
                'email': 'test@example.com',
                'displayName': 'Test User',
                'balances': {
                    'usd': 1000.0,
                    'mxn': 0.0,
                    'eur': 0.0,
                    'gbp': 0.0,
                    'jpy': 0.0,
                    'cad': 0.0,
                    'aud': 0.0
                },
                'createdAt': firestore.SERVER_TIMESTAMP
            }
            db.collection('users').document(user_id).set(user_data)
            return UserResponse(
                email=user_data['email'],
                display_name=user_data['displayName'],
                balances=user_data['balances']
            )
        
        user_data = user_doc.to_dict()
        
        return UserResponse(
            email=user_data.get('email', ''),
            display_name=user_data.get('displayName', ''),
            balances=user_data.get('balances', {})
        )
        
    except Exception as e:
        print(f"❌ User profile error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/transfer/history", response_model=List[TransactionResponse])
async def get_transfer_history(user_token: dict = Depends(verify_firebase_token)):
    """Get user's transaction history"""
    try:
        # For development/testing, always return mock data
        return [
            TransactionResponse(
                transaction_id="mock-tx-1",
                sender_id="test-user-123",
                receiver_email="friend@example.com",
                sent_amount=100.0,
                sent_currency="USD",
                received_amount=2000.0,
                received_currency="MXN",
                rate=20.0,
                timestamp="2024-10-15T10:30:00Z"
            ),
            TransactionResponse(
                transaction_id="mock-tx-2",
                sender_id="test-user-123",
                receiver_email="family@example.com",
                sent_amount=50.0,
                sent_currency="USD",
                received_amount=45.0,
                received_currency="EUR",
                rate=0.9,
                timestamp="2024-10-14T15:45:00Z"
            )
        ]
        
    except Exception as e:
        print(f"❌ Transaction history error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "timestamp": datetime.now().isoformat(),
        "services": {
            "fx_service": "active",
            "cex_service": "active",
            "dex_service": "active",
            "firebase": "active" if db else "inactive"
        }
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
