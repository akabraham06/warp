#!/usr/bin/env python3
"""
CEX Integration for Cross-Currency Platform
Integrates with Coinbase Advanced Trade API and Binance API for fiat-to-crypto on-ramp
"""

import requests
import json
import hmac
import hashlib
import time
import base64
from typing import Dict, List, Optional, Tuple
from datetime import datetime
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

class CoinbaseAdvancedTradeAPI:
    """Coinbase Advanced Trade API integration"""
    
    def __init__(self, api_key: Optional[str] = None, api_secret: Optional[str] = None):
        self.api_key = api_key or os.getenv('COINBASE_API_KEY')
        self.api_secret = api_secret or os.getenv('COINBASE_API_SECRET')
        self.base_url = "https://api.coinbase.com/api/v3/brokerage"
        
        # Supported fiat currencies
        self.supported_fiats = ['USD', 'EUR', 'GBP', 'CAD', 'AUD', 'JPY', 'CHF', 'SEK', 'NOK', 'DKK']
        
        # Major crypto pairs
        self.crypto_pairs = {
            'BTC': ['BTC-USD', 'BTC-EUR', 'BTC-GBP'],
            'ETH': ['ETH-USD', 'ETH-EUR', 'ETH-GBP'],
            'USDC': ['USDC-USD', 'USDC-EUR', 'USDC-GBP'],
            'USDT': ['USDT-USD', 'USDT-EUR', 'USDT-GBP'],
            'DAI': ['DAI-USD', 'DAI-EUR', 'DAI-GBP']
        }
    
    def _generate_jwt_token(self, method: str, path: str, body: str = "") -> str:
        """Generate JWT token for Coinbase API authentication"""
        if not self.api_key or not self.api_secret:
            return ""
        
        # Simplified JWT generation (in production, use proper JWT library)
        timestamp = str(int(time.time()))
        message = timestamp + method + path + body
        
        signature = hmac.new(
            self.api_secret.encode('utf-8'),
            message.encode('utf-8'),
            hashlib.sha256
        ).hexdigest()
        
        return f"{self.api_key}:{timestamp}:{signature}"
    
    def get_product_quote(self, product_id: str, side: str = "buy", amount: str = "100") -> Optional[Dict]:
        """Get quote for a product (fiat-to-crypto or crypto-to-fiat)"""
        try:
            url = f"{self.base_url}/orders/quote"
            headers = {
                'Authorization': f'Bearer {self._generate_jwt_token("POST", "/api/v3/brokerage/orders/quote")}',
                'Content-Type': 'application/json'
            }
            
            data = {
                'product_id': product_id,
                'side': side,
                'amount': amount
            }
            
            response = requests.post(url, headers=headers, json=data, timeout=10)
            
            if response.status_code == 200:
                return response.json()
            else:
                print(f"Coinbase API error: {response.status_code} - {response.text}")
                return None
                
        except requests.exceptions.RequestException as e:
            print(f"Coinbase API request error: {e}")
            return None
    
    def get_market_data(self, product_id: str) -> Optional[Dict]:
        """Get market data for a product"""
        try:
            url = f"{self.base_url}/products/{product_id}/ticker"
            headers = {
                'Authorization': f'Bearer {self._generate_jwt_token("GET", f"/api/v3/brokerage/products/{product_id}/ticker")}',
                'Content-Type': 'application/json'
            }
            
            response = requests.get(url, headers=headers, timeout=10)
            
            if response.status_code == 200:
                return response.json()
            else:
                # Fallback to public API
                return self._get_public_market_data(product_id)
                
        except requests.exceptions.RequestException as e:
            print(f"Coinbase market data error: {e}")
            return self._get_public_market_data(product_id)
    
    def _get_public_market_data(self, product_id: str) -> Optional[Dict]:
        """Get public market data (no auth required)"""
        try:
            url = f"https://api.exchange.coinbase.com/products/{product_id}/ticker"
            response = requests.get(url, timeout=10)
            
            if response.status_code == 200:
                data = response.json()
                return {
                    'price': data.get('price'),
                    'bid': data.get('bid'),
                    'ask': data.get('ask'),
                    'volume': data.get('volume')
                }
            return None
            
        except requests.exceptions.RequestException as e:
            print(f"Coinbase public API error: {e}")
            return None
    
    def get_fiat_to_crypto_quote(self, fiat_amount: float, fiat_currency: str, crypto_currency: str) -> Optional[Dict]:
        """Get quote for fiat to crypto conversion"""
        product_id = f"{crypto_currency}-{fiat_currency}"
        
        # Get market data
        market_data = self.get_market_data(product_id)
        if not market_data:
            return None
        
        # Calculate crypto amount
        price = float(market_data.get('price', 0))
        if price == 0:
            return None
        
        crypto_amount = fiat_amount / price
        
        return {
            'exchange': 'coinbase',
            'fiat_amount': fiat_amount,
            'fiat_currency': fiat_currency,
            'crypto_currency': crypto_currency,
            'crypto_amount': crypto_amount,
            'rate': price,
            'product_id': product_id,
            'timestamp': datetime.now().isoformat()
        }

class BinanceAPI:
    """Binance API integration"""
    
    def __init__(self, api_key: Optional[str] = None, api_secret: Optional[str] = None):
        self.api_key = api_key or os.getenv('BINANCE_API_KEY')
        self.api_secret = api_secret or os.getenv('BINANCE_API_SECRET')
        self.base_url = "https://api.binance.com"
        
        # Supported fiat currencies
        self.supported_fiats = ['USD', 'EUR', 'GBP', 'CAD', 'AUD', 'JPY', 'CHF', 'SEK', 'NOK', 'DKK']
        
        # Major crypto pairs
        self.crypto_pairs = {
            'BTC': ['BTCUSDT', 'BTCEUR', 'BTCGBP'],
            'ETH': ['ETHUSDT', 'ETHEUR', 'ETHGBP'],
            'USDC': ['USDCUSDT', 'USDCEUR', 'USDCGBP'],
            'USDT': ['USDTUSD', 'USDTEUR', 'USDTGBP'],
            'DAI': ['DAIUSDT', 'DAIEUR', 'DAIGBP']
        }
    
    def _generate_signature(self, query_string: str) -> str:
        """Generate signature for Binance API"""
        if not self.api_secret:
            return ""
        return hmac.new(
            self.api_secret.encode('utf-8'),
            query_string.encode('utf-8'),
            hashlib.sha256
        ).hexdigest()
    
    def get_ticker_price(self, symbol: str) -> Optional[Dict]:
        """Get ticker price for a symbol"""
        try:
            url = f"{self.base_url}/api/v3/ticker/price"
            params = {'symbol': symbol}
            
            response = requests.get(url, params=params, timeout=10)
            
            if response.status_code == 200:
                return response.json()
            return None
            
        except requests.exceptions.RequestException as e:
            print(f"Binance API error: {e}")
            return None
    
    def get_order_book(self, symbol: str, limit: int = 5) -> Optional[Dict]:
        """Get order book for a symbol"""
        try:
            url = f"{self.base_url}/api/v3/depth"
            params = {'symbol': symbol, 'limit': limit}
            
            response = requests.get(url, params=params, timeout=10)
            
            if response.status_code == 200:
                return response.json()
            return None
            
        except requests.exceptions.RequestException as e:
            print(f"Binance order book error: {e}")
            return None
    
    def get_fiat_to_crypto_quote(self, fiat_amount: float, fiat_currency: str, crypto_currency: str) -> Optional[Dict]:
        """Get quote for fiat to crypto conversion"""
        # Binance uses different symbol format
        if fiat_currency == 'USD':
            symbol = f"{crypto_currency}USDT"  # Use USDT as USD proxy
        else:
            symbol = f"{crypto_currency}{fiat_currency}"
        
        # Get ticker price
        ticker = self.get_ticker_price(symbol)
        if not ticker:
            return None
        
        # Get order book for better pricing
        order_book = self.get_order_book(symbol)
        
        price = float(ticker.get('price', 0))
        if price == 0:
            return None
        
        # Use ask price for buying (fiat to crypto)
        if order_book and 'asks' in order_book and order_book['asks']:
            ask_price = float(order_book['asks'][0][0])
            price = ask_price
        
        crypto_amount = fiat_amount / price
        
        return {
            'exchange': 'binance',
            'fiat_amount': fiat_amount,
            'fiat_currency': fiat_currency,
            'crypto_currency': crypto_currency,
            'crypto_amount': crypto_amount,
            'rate': price,
            'symbol': symbol,
            'timestamp': datetime.now().isoformat()
        }

class CEXAggregatorService:
    """Service to aggregate quotes from multiple CEX APIs"""
    
    def __init__(self):
        self.coinbase = CoinbaseAdvancedTradeAPI()
        self.binance = BinanceAPI()
        
        # Supported crypto currencies for on-ramp
        self.supported_cryptos = ['BTC', 'ETH', 'USDC', 'USDT', 'DAI']
        
        # Recommended crypto for different transaction sizes
        self.crypto_recommendations = {
            'small': ['USDC', 'USDT', 'DAI'],      # < $1000
            'medium': ['USDC', 'USDT', 'ETH'],     # $1000 - $10000
            'large': ['BTC', 'ETH', 'USDC']        # > $10000
        }
    
    def get_fiat_to_crypto_quotes(self, fiat_amount: float, fiat_currency: str, 
                                 crypto_currency: str) -> Dict:
        """Get quotes from multiple CEX APIs for fiat to crypto conversion"""
        quotes = {}
        
        # Get Coinbase quote
        print(f"🔍 Getting Coinbase quote for {fiat_amount} {fiat_currency} → {crypto_currency}...")
        coinbase_quote = self.coinbase.get_fiat_to_crypto_quote(fiat_amount, fiat_currency, crypto_currency)
        if coinbase_quote:
            quotes['coinbase'] = coinbase_quote
        
        # Get Binance quote
        print(f"🔍 Getting Binance quote for {fiat_amount} {fiat_currency} → {crypto_currency}...")
        binance_quote = self.binance.get_fiat_to_crypto_quote(fiat_amount, fiat_currency, crypto_currency)
        if binance_quote:
            quotes['binance'] = binance_quote
        
        # Find best quote
        best_quote = None
        best_crypto_amount = 0
        
        for exchange, quote in quotes.items():
            if quote['crypto_amount'] > best_crypto_amount:
                best_crypto_amount = quote['crypto_amount']
                best_quote = quote
        
        return {
            'fiat_amount': fiat_amount,
            'fiat_currency': fiat_currency,
            'crypto_currency': crypto_currency,
            'quotes': quotes,
            'best_quote': best_quote,
            'timestamp': datetime.now().isoformat()
        }
    
    def get_optimal_crypto_route(self, fiat_amount: float, fiat_currency: str, 
                               target_fiat_currency: str) -> Dict:
        """Find optimal crypto route for fiat-to-fiat conversion"""
        
        # Determine transaction size category
        if fiat_amount < 1000:
            size_category = 'small'
        elif fiat_amount < 10000:
            size_category = 'medium'
        else:
            size_category = 'large'
        
        recommended_cryptos = self.crypto_recommendations[size_category]
        
        print(f"🔄 Finding optimal crypto route for {fiat_amount} {fiat_currency} → {target_fiat_currency}")
        print(f"   Transaction size: {size_category} (recommended cryptos: {', '.join(recommended_cryptos)})")
        
        all_routes = {}
        
        for crypto in recommended_cryptos:
            print(f"\n🪙 Testing {crypto} route...")
            
            # Get fiat to crypto quotes
            fiat_to_crypto = self.get_fiat_to_crypto_quotes(fiat_amount, fiat_currency, crypto)
            
            if fiat_to_crypto['best_quote']:
                best_quote = fiat_to_crypto['best_quote']
                crypto_amount = best_quote['crypto_amount']
                
                # Simulate crypto to target fiat conversion
                # In production, you'd get actual quotes for crypto to target fiat
                target_fiat_amount = self._simulate_crypto_to_fiat_conversion(
                    crypto_amount, crypto, target_fiat_currency
                )
                
                all_routes[crypto] = {
                    'crypto_currency': crypto,
                    'fiat_to_crypto': best_quote,
                    'crypto_amount': crypto_amount,
                    'target_fiat_amount': target_fiat_amount,
                    'total_efficiency': target_fiat_amount / fiat_amount,
                    'route': f"{fiat_currency} → {crypto} → {target_fiat_currency}"
                }
        
        # Find best route
        best_route = None
        best_efficiency = 0
        
        for crypto, route_data in all_routes.items():
            if route_data['total_efficiency'] > best_efficiency:
                best_efficiency = route_data['total_efficiency']
                best_route = route_data
        
        return {
            'fiat_amount': fiat_amount,
            'from_fiat': fiat_currency,
            'to_fiat': target_fiat_currency,
            'routes': all_routes,
            'best_route': best_route,
            'timestamp': datetime.now().isoformat()
        }
    
    def _simulate_crypto_to_fiat_conversion(self, crypto_amount: float, crypto_currency: str, 
                                          target_fiat_currency: str) -> float:
        """Simulate crypto to fiat conversion (replace with actual API calls in production)"""
        
        # Simplified simulation - in production, get actual quotes
        # This simulates the conversion with some spread/fee
        base_rates = {
            'BTC': {'USD': 45000, 'EUR': 40000, 'GBP': 35000},
            'ETH': {'USD': 3000, 'EUR': 2700, 'GBP': 2400},
            'USDC': {'USD': 1.0, 'EUR': 0.85, 'GBP': 0.75},
            'USDT': {'USD': 1.0, 'EUR': 0.85, 'GBP': 0.75},
            'DAI': {'USD': 1.0, 'EUR': 0.85, 'GBP': 0.75}
        }
        
        if crypto_currency in base_rates and target_fiat_currency in base_rates[crypto_currency]:
            rate = base_rates[crypto_currency][target_fiat_currency]
            # Apply small spread (0.1% fee)
            return crypto_amount * rate * 0.999
        else:
            # Default rate
            return crypto_amount * 0.85  # Assume 0.85 rate for unknown pairs

class CEXTransactionDisplay:
    """Display CEX integration results in human-readable format"""
    
    @staticmethod
    def format_currency(amount: float, currency: str) -> str:
        """Format currency amount with proper symbols"""
        currency_symbols = {
            'USD': '$',
            'EUR': '€',
            'GBP': '£',
            'JPY': '¥',
            'CAD': 'C$',
            'AUD': 'A$',
            'CHF': 'CHF',
            'SEK': 'kr',
            'NOK': 'kr',
            'DKK': 'kr'
        }
        
        symbol = currency_symbols.get(currency, currency + ' ')
        return f"{symbol}{amount:,.2f}"
    
    @staticmethod
    def display_cex_quotes(quotes_result: Dict):
        """Display CEX quotes in human-readable format"""
        print("\n" + "="*80)
        print("🏦 CEX FIAT-TO-CRYPTO QUOTES")
        print("="*80)
        
        print(f"\n📊 Transaction Details:")
        print(f"   Amount: {CEXTransactionDisplay.format_currency(quotes_result['fiat_amount'], quotes_result['fiat_currency'])}")
        print(f"   Target Crypto: {quotes_result['crypto_currency']}")
        print(f"   Time: {quotes_result['timestamp']}")
        
        # Display quotes from each exchange
        for exchange, quote in quotes_result['quotes'].items():
            print(f"\n🏛️  {exchange.upper()} Exchange:")
            print(f"   Rate: 1 {quote['fiat_currency']} = {quote['rate']:.6f} {quote['crypto_currency']}")
            print(f"   Crypto Amount: {quote['crypto_amount']:.8f} {quote['crypto_currency']}")
            print(f"   Product/Symbol: {quote.get('product_id', quote.get('symbol', 'N/A'))}")
        
        # Display best quote
        if quotes_result['best_quote']:
            best = quotes_result['best_quote']
            print(f"\n🏆 BEST QUOTE:")
            print(f"   Exchange: {best['exchange'].upper()}")
            print(f"   Rate: 1 {best['fiat_currency']} = {best['rate']:.6f} {best['crypto_currency']}")
            print(f"   Crypto Amount: {best['crypto_amount']:.8f} {best['crypto_currency']}")
        else:
            print(f"\n❌ No quotes available")
        
        print("\n" + "="*80)
    
    @staticmethod
    def display_optimal_route(route_result: Dict):
        """Display optimal crypto route for fiat-to-fiat conversion"""
        print("\n" + "="*80)
        print("🌐 OPTIMAL CRYPTO ROUTE ANALYSIS")
        print("="*80)
        
        print(f"\n📊 Transaction Details:")
        print(f"   Amount: {CEXTransactionDisplay.format_currency(route_result['fiat_amount'], route_result['from_fiat'])}")
        print(f"   From: {route_result['from_fiat']}")
        print(f"   To: {route_result['to_fiat']}")
        print(f"   Time: {route_result['timestamp']}")
        
        # Display all routes
        for crypto, route_data in route_result['routes'].items():
            print(f"\n🪙 {crypto} Route:")
            print(f"   Route: {route_data['route']}")
            print(f"   Crypto Amount: {route_data['crypto_amount']:.8f} {crypto}")
            print(f"   Final Amount: {CEXTransactionDisplay.format_currency(route_data['target_fiat_amount'], route_result['to_fiat'])}")
            print(f"   Efficiency: {route_data['total_efficiency']:.4f}")
            print(f"   Exchange: {route_data['fiat_to_crypto']['exchange'].upper()}")
        
        # Display best route
        if route_result['best_route']:
            best = route_result['best_route']
            print(f"\n🏆 BEST ROUTE:")
            print(f"   Crypto: {best['crypto_currency']}")
            print(f"   Route: {best['route']}")
            print(f"   Final Amount: {CEXTransactionDisplay.format_currency(best['target_fiat_amount'], route_result['to_fiat'])}")
            print(f"   Efficiency: {best['total_efficiency']:.4f}")
            print(f"   Exchange: {best['fiat_to_crypto']['exchange'].upper()}")
        else:
            print(f"\n❌ No optimal route found")
        
        print("\n" + "="*80)

def main():
    """Demo function to test CEX integration"""
    print("🚀 CEX Integration Demo")
    print("="*50)
    
    cex_service = CEXAggregatorService()
    display = CEXTransactionDisplay()
    
    # Test fiat to crypto quotes
    print("\n🔄 Testing USD to USDC quotes...")
    quotes = cex_service.get_fiat_to_crypto_quotes(1000, "USD", "USDC")
    display.display_cex_quotes(quotes)
    
    # Test optimal route
    print("\n🔄 Testing optimal route for USD to EUR...")
    route = cex_service.get_optimal_crypto_route(1000, "USD", "EUR")
    display.display_optimal_route(route)

if __name__ == "__main__":
    main()
