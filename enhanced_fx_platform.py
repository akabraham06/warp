#!/usr/bin/env python3
"""
Enhanced Cross-Currency Transaction Platform with DEX Aggregator Integration
This platform enables cross-currency transactions using stablecoins as intermediaries
and DEX aggregators to find the best swap rates across multiple chains.
"""

import requests
import json
from datetime import datetime
from typing import Dict, List, Optional
import os
from dotenv import load_dotenv
from dex_aggregator import DEXAggregatorService, DEXTransactionDisplay

# Load environment variables
load_dotenv()

class FXRateService:
    """Service to fetch real-time FX rates from ExchangeRate API"""
    
    def __init__(self, api_key: Optional[str] = None):
        self.api_key = api_key or os.getenv('EXCHANGERATE_API_KEY')
        self.base_url = "https://v6.exchangerate-api.com/v6"
        
    def get_latest_rates(self, base_currency: str = "USD") -> Dict:
        """Fetch latest exchange rates"""
        if not self.api_key:
            # Use free tier (limited requests)
            url = f"https://api.exchangerate-api.com/v4/latest/{base_currency}"
        else:
            url = f"{self.base_url}/{self.api_key}/latest/{base_currency}"
        
        try:
            response = requests.get(url, timeout=10)
            response.raise_for_status()
            return response.json()
        except requests.exceptions.RequestException as e:
            print(f"Error fetching FX rates: {e}")
            return {}
    
    def get_rate(self, from_currency: str, to_currency: str) -> float:
        """Get exchange rate between two currencies"""
        rates_data = self.get_latest_rates(from_currency)
        if 'rates' in rates_data:
            return rates_data['rates'].get(to_currency, 0)
        return 0

class EnhancedStablecoinTransaction:
    """Enhanced stablecoin transaction handler with DEX aggregator integration"""
    
    def __init__(self, fx_service: FXRateService, dex_service: DEXAggregatorService = None):
        self.fx_service = fx_service
        self.dex_service = dex_service or DEXAggregatorService()
        
        # Major stablecoins and their pegged currencies
        self.stablecoins = {
            'USDT': 'USD',
            'USDC': 'USD', 
            'DAI': 'USD',
            'BUSD': 'USD',
            'TUSD': 'USD',
            'FRAX': 'USD',
            'LUSD': 'USD',
            'SUSD': 'USD',
            'GUSD': 'USD',
            'PAXG': 'USD'
        }
        
        # Supported chains for DEX operations
        self.supported_chains = ['polygon', 'zksync', 'arbitrum', 'optimism', 'ethereum']
    
    def calculate_traditional_transaction_cost(self, amount: float, from_currency: str, to_currency: str) -> Dict:
        """Calculate traditional transaction costs (original method)"""
        
        # Direct conversion
        direct_rate = self.fx_service.get_rate(from_currency, to_currency)
        direct_amount = amount * direct_rate
        
        # Find best stablecoin route
        best_route = None
        best_final_amount = 0
        best_stablecoin = None
        
        for stablecoin, pegged_currency in self.stablecoins.items():
            # Step 1: Convert to stablecoin
            rate_to_stable = self.fx_service.get_rate(from_currency, pegged_currency)
            stable_amount = amount * rate_to_stable
            
            # Step 2: Convert from stablecoin to target
            rate_from_stable = self.fx_service.get_rate(pegged_currency, to_currency)
            final_amount = stable_amount * rate_from_stable
            
            if final_amount > best_final_amount:
                best_final_amount = final_amount
                best_stablecoin = stablecoin
                best_route = {
                    'stablecoin': stablecoin,
                    'pegged_currency': pegged_currency,
                    'rate_to_stable': rate_to_stable,
                    'stable_amount': stable_amount,
                    'rate_from_stable': rate_from_stable,
                    'final_amount': final_amount
                }
        
        # Calculate savings
        savings = best_final_amount - direct_amount
        savings_percentage = (savings / direct_amount * 100) if direct_amount > 0 else 0
        
        return {
            'original_amount': amount,
            'from_currency': from_currency,
            'to_currency': to_currency,
            'direct_conversion': {
                'rate': direct_rate,
                'final_amount': direct_amount
            },
            'stablecoin_route': best_route,
            'savings': {
                'amount': savings,
                'percentage': savings_percentage
            },
            'timestamp': datetime.now().isoformat()
        }
    
    def calculate_dex_transaction_cost(self, amount: float, from_currency: str, to_currency: str,
                                     preferred_chains: List[str] = None) -> Dict:
        """Calculate transaction costs using DEX aggregators"""
        
        if preferred_chains is None:
            preferred_chains = ['polygon', 'zksync', 'arbitrum']
        
        print(f"🔄 Calculating DEX-based transaction for {amount} {from_currency} → {to_currency}")
        
        # Traditional calculation for comparison
        traditional_analysis = self.calculate_traditional_transaction_cost(amount, from_currency, to_currency)
        
        # DEX-based calculation
        dex_analysis = {
            'traditional_analysis': traditional_analysis,
            'dex_quotes': {},
            'best_dex_route': None,
            'chain_comparison': {},
            'recommendation': None
        }
        
        # For each supported chain, try to find stablecoin swaps
        for chain in preferred_chains:
            print(f"🔗 Checking {chain} chain...")
            
            # Get stablecoin addresses for this chain
            chain_stablecoins = {}
            for stablecoin in ['USDT', 'USDC', 'DAI']:
                address = self.dex_service.get_stablecoin_address(chain, stablecoin)
                if address:
                    chain_stablecoins[stablecoin] = address
            
            if not chain_stablecoins:
                print(f"   ⚠️  No stablecoin addresses found for {chain}")
                continue
            
            # Try different stablecoin routes
            chain_quotes = {}
            for stablecoin, address in chain_stablecoins.items():
                try:
                    # This is a simplified example - in reality you'd need proper token addresses
                    # and handle the conversion from fiat to crypto amounts
                    print(f"   🪙 Testing {stablecoin} route on {chain}...")
                    
                    # For demo purposes, we'll simulate DEX quotes
                    # In production, you'd call the actual DEX APIs
                    simulated_quote = self._simulate_dex_quote(
                        chain, stablecoin, amount, from_currency, to_currency
                    )
                    
                    if simulated_quote:
                        chain_quotes[stablecoin] = simulated_quote
                        
                except Exception as e:
                    print(f"   ❌ Error getting {stablecoin} quote on {chain}: {e}")
            
            if chain_quotes:
                dex_analysis['dex_quotes'][chain] = chain_quotes
                
                # Find best quote for this chain
                best_chain_quote = max(chain_quotes.values(), key=lambda x: x['final_amount'])
                dex_analysis['chain_comparison'][chain] = best_chain_quote
        
        # Find overall best DEX route
        if dex_analysis['chain_comparison']:
            best_dex_route = max(
                dex_analysis['chain_comparison'].values(), 
                key=lambda x: x['final_amount']
            )
            dex_analysis['best_dex_route'] = best_dex_route
            
            # Compare with traditional route
            traditional_final = traditional_analysis['stablecoin_route']['final_amount']
            dex_final = best_dex_route['final_amount']
            
            if dex_final > traditional_final:
                dex_analysis['recommendation'] = {
                    'type': 'dex',
                    'chain': best_dex_route['chain'],
                    'stablecoin': best_dex_route['stablecoin'],
                    'savings': dex_final - traditional_final,
                    'savings_percentage': ((dex_final - traditional_final) / traditional_final * 100) if traditional_final > 0 else 0
                }
            else:
                dex_analysis['recommendation'] = {
                    'type': 'traditional',
                    'reason': 'Traditional route provides better rates'
                }
        
        dex_analysis['timestamp'] = datetime.now().isoformat()
        return dex_analysis
    
    def _simulate_dex_quote(self, chain: str, stablecoin: str, amount: float, 
                           from_currency: str, to_currency: str) -> Optional[Dict]:
        """Simulate DEX quote (replace with actual DEX API calls in production)"""
        
        # Get traditional rates for comparison
        rate_to_stable = self.fx_service.get_rate(from_currency, 'USD')
        rate_from_stable = self.fx_service.get_rate('USD', to_currency)
        
        if rate_to_stable == 0 or rate_from_stable == 0:
            return None
        
        # Simulate DEX improvements (slightly better rates due to liquidity)
        dex_improvement = 0.001  # 0.1% improvement
        
        stable_amount = amount * rate_to_stable
        final_amount = stable_amount * rate_from_stable * (1 + dex_improvement)
        
        return {
            'chain': chain,
            'stablecoin': stablecoin,
            'stablecoin_address': self.dex_service.get_stablecoin_address(chain, stablecoin),
            'amount_in': amount,
            'stable_amount': stable_amount,
            'final_amount': final_amount,
            'dex_improvement': dex_improvement,
            'estimated_gas': self.dex_service.estimate_gas_cost(chain),
            'protocols': ['Uniswap', 'SushiSwap', 'QuickSwap'] if chain == 'polygon' else ['SyncSwap', 'Mute.io']
        }
    

class EnhancedTransactionDisplay:
    """Enhanced display for transaction analysis including DEX results"""
    
    @staticmethod
    def format_currency(amount: float, currency: str) -> str:
        """Format currency amount with proper symbols"""
        currency_symbols = {
            'USD': '$',
            'EUR': '€',
            'GBP': '£',
            'JPY': '¥',
            'CNY': '¥',
            'INR': '₹',
            'CAD': 'C$',
            'AUD': 'A$',
            'CHF': 'CHF',
            'SEK': 'kr',
            'NOK': 'kr',
            'DKK': 'kr',
            'PLN': 'zł',
            'CZK': 'Kč',
            'HUF': 'Ft',
            'RUB': '₽',
            'BRL': 'R$',
            'MXN': '$',
            'KRW': '₩',
            'SGD': 'S$',
            'HKD': 'HK$',
            'NZD': 'NZ$',
            'ZAR': 'R',
            'TRY': '₺',
            'THB': '฿',
            'MYR': 'RM',
            'PHP': '₱',
            'IDR': 'Rp',
            'VND': '₫'
        }
        
        symbol = currency_symbols.get(currency, currency + ' ')
        return f"{symbol}{amount:,.2f}"
    
    @staticmethod
    def display_enhanced_analysis(analysis: Dict):
        """Display enhanced transaction analysis including DEX results"""
        print("\n" + "="*80)
        print("🌍 ENHANCED CROSS-CURRENCY TRANSACTION ANALYSIS")
        print("="*80)
        
        traditional = analysis['traditional_analysis']
        
        # Basic transaction info
        print(f"\n📊 Transaction Details:")
        print(f"   Amount: {EnhancedTransactionDisplay.format_currency(traditional['original_amount'], traditional['from_currency'])}")
        print(f"   From: {traditional['from_currency']}")
        print(f"   To: {traditional['to_currency']}")
        print(f"   Time: {analysis['timestamp']}")
        
        # Traditional analysis
        print(f"\n💱 Traditional Route Analysis:")
        direct = traditional['direct_conversion']
        print(f"   Direct Conversion: {EnhancedTransactionDisplay.format_currency(direct['final_amount'], traditional['to_currency'])}")
        
        if traditional['stablecoin_route']:
            route = traditional['stablecoin_route']
            print(f"   Best Stablecoin Route ({route['stablecoin']}): {EnhancedTransactionDisplay.format_currency(route['final_amount'], traditional['to_currency'])}")
        
        # DEX analysis
        if analysis['dex_quotes']:
            print(f"\n🪙 DEX Aggregator Analysis:")
            
            for chain, chain_quotes in analysis['dex_quotes'].items():
                print(f"\n   🔗 {chain.upper()} Chain:")
                for stablecoin, quote in chain_quotes.items():
                    print(f"      {stablecoin}: {EnhancedTransactionDisplay.format_currency(quote['final_amount'], traditional['to_currency'])}")
                    print(f"         Gas Cost: ~${quote['estimated_gas']['cost_usd']:.2f}")
                    print(f"         Protocols: {', '.join(quote['protocols'])}")
        
        # Best DEX route
        if analysis['best_dex_route']:
            best_dex = analysis['best_dex_route']
            print(f"\n🏆 Best DEX Route:")
            print(f"   Chain: {best_dex['chain'].upper()}")
            print(f"   Stablecoin: {best_dex['stablecoin']}")
            print(f"   Final Amount: {EnhancedTransactionDisplay.format_currency(best_dex['final_amount'], traditional['to_currency'])}")
            print(f"   Gas Cost: ~${best_dex['estimated_gas']['cost_usd']:.2f}")
        
        # Recommendation
        if analysis['recommendation']:
            rec = analysis['recommendation']
            print(f"\n🎯 RECOMMENDATION:")
            
            if rec['type'] == 'dex':
                print(f"   ✅ Use DEX Route on {rec['chain'].upper()}")
                print(f"   💰 Additional Savings: {EnhancedTransactionDisplay.format_currency(rec['savings'], traditional['to_currency'])}")
                print(f"   📈 Improvement: {rec['savings_percentage']:.2f}%")
                print(f"   ⚡ Lower gas costs on {rec['chain']}")
            else:
                print(f"   💱 Use Traditional Route")
                print(f"   📝 {rec['reason']}")
        
        print("\n" + "="*80)

def main():
    """Enhanced main application function with DEX integration"""
    print("🚀 Enhanced Cross-Currency Transaction Platform")
    print("With DEX Aggregator Integration for Optimal Rates")
    
    # Initialize services
    fx_service = FXRateService()
    dex_service = DEXAggregatorService()
    transaction_service = EnhancedStablecoinTransaction(fx_service, dex_service)
    display = EnhancedTransactionDisplay()
    
    # Example transactions with DEX analysis
    test_transactions = [
        {"amount": 1000, "from": "USD", "to": "EUR", "chains": ["polygon", "zksync"]},
        {"amount": 500, "from": "GBP", "to": "JPY", "chains": ["arbitrum", "optimism"]},
        {"amount": 2000, "from": "EUR", "to": "USD", "chains": ["polygon", "zksync", "arbitrum"]},
    ]
    
    print(f"\n📈 Testing {len(test_transactions)} enhanced transactions...")
    
    for i, transaction in enumerate(test_transactions, 1):
        print(f"\n🔄 Processing Enhanced Transaction {i}/{len(test_transactions)}")
        
        analysis = transaction_service.calculate_dex_transaction_cost(
            transaction["amount"],
            transaction["from"],
            transaction["to"],
            transaction.get("chains", ["polygon", "zksync"])
        )
        
        display.display_enhanced_analysis(analysis)
        
        if i < len(test_transactions):
            input("\nPress Enter to continue to next transaction...")

if __name__ == "__main__":
    main()
