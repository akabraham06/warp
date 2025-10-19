#!/usr/bin/env python3
"""
DEX Aggregator Integration for Cross-Currency Platform
Integrates with 1inch and 0x APIs to find best swap rates across multiple chains
"""

import requests
import json
from typing import Dict, List, Optional, Tuple
from datetime import datetime
import time

class DEXAggregatorService:
    """Service to interact with DEX aggregators (1inch, 0x) for optimal swap rates"""
    
    def __init__(self):
        # Chain configurations
        self.chains = {
            'ethereum': {
                'chain_id': 1,
                'name': 'Ethereum',
                'native_token': 'ETH',
                'usd_stablecoins': {
                    'USDT': '0xdAC17F958D2ee523a2206206994597C13D831ec7',
                    'USDC': '0xA0b86a33E6441b8c4C8C0e4b8b2c2C2C2C2C2C2C',
                    'DAI': '0x6B175474E89094C44Da98b954EedeAC495271d0F',
                    'BUSD': '0x4Fabb145d64652a948d72533023f6E7A623C7C53'
                }
            },
            'polygon': {
                'chain_id': 137,
                'name': 'Polygon',
                'native_token': 'MATIC',
                'usd_stablecoins': {
                    'USDT': '0xc2132D05D31c914a87C6611C10748AEb04B58e8F',
                    'USDC': '0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174',
                    'DAI': '0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063',
                    'BUSD': '0x9C9e5fD8bbc25984B178FdCE6117Defa39d2db39'
                }
            },
            'zksync': {
                'chain_id': 324,
                'name': 'zkSync Era',
                'native_token': 'ETH',
                'usd_stablecoins': {
                    'USDT': '0x493257fD37EDB34451f62EDf8D2a0C418852bA4C',
                    'USDC': '0x3355df6D4c9C3035724Fd0e3914dE96A5a83aaf4',
                    'DAI': '0x4B9eb6c0a6eaef240e3Fb5F52bCf7e0C637F9a9C'
                }
            },
            'arbitrum': {
                'chain_id': 42161,
                'name': 'Arbitrum One',
                'native_token': 'ETH',
                'usd_stablecoins': {
                    'USDT': '0xFd086bC7CD5C481DCC9C85ebE478A1C0b69FCbb9',
                    'USDC': '0xaf88d065e77c8cC2239327C5EDb3A432268e5831',
                    'DAI': '0xDA10009cBd5D07dd0CeCc66161FC93D7c9000da1'
                }
            },
            'optimism': {
                'chain_id': 10,
                'name': 'Optimism',
                'native_token': 'ETH',
                'usd_stablecoins': {
                    'USDT': '0x94b008aA00579c1307B0EF2c499aD98a8ce58e58',
                    'USDC': '0x0b2C639c533813f4Aa9D7837CAf62653d097Ff85',
                    'DAI': '0xDA10009cBd5D07dd0CeCc66161FC93D7c9000da1'
                }
            }
        }
        
        # API endpoints
        self.apis = {
            '1inch': {
                'base_url': 'https://api.1inch.io/v5.0',
                'quote_url': '/{chain_id}/quote',
                'swap_url': '/{chain_id}/swap',
                'tokens_url': '/{chain_id}/tokens'
            },
            '0x': {
                'base_url': 'https://api.0x.org',
                'quote_url': '/swap/v1/quote',
                'swap_url': '/swap/v1/quote'
            }
        }
    
    def get_chain_info(self, chain_name: str) -> Optional[Dict]:
        """Get chain information by name"""
        return self.chains.get(chain_name.lower())
    
    def get_stablecoin_address(self, chain_name: str, stablecoin: str) -> Optional[str]:
        """Get stablecoin contract address for a specific chain"""
        chain_info = self.get_chain_info(chain_name)
        if chain_info and 'usd_stablecoins' in chain_info:
            return chain_info['usd_stablecoins'].get(stablecoin)
        return None
    
    def get_1inch_quote(self, chain_id: int, from_token: str, to_token: str, 
                       amount: int, slippage: float = 0.5) -> Optional[Dict]:
        """Get quote from 1inch API"""
        try:
            url = f"{self.apis['1inch']['base_url']}/{chain_id}/quote"
            params = {
                'fromTokenAddress': from_token,
                'toTokenAddress': to_token,
                'amount': amount,
                'slippage': slippage
            }
            
            response = requests.get(url, params=params, timeout=10)
            response.raise_for_status()
            return response.json()
            
        except requests.exceptions.RequestException as e:
            print(f"1inch API error: {e}")
            return None
    
    def get_0x_quote(self, chain_id: int, sell_token: str, buy_token: str, 
                    sell_amount: int, slippage: float = 0.5) -> Optional[Dict]:
        """Get quote from 0x API"""
        try:
            url = f"{self.apis['0x']['base_url']}/swap/v1/quote"
            params = {
                'sellToken': sell_token,
                'buyToken': buy_token,
                'sellAmount': sell_amount,
                'slippagePercentage': slippage / 100,
                'chainId': chain_id
            }
            
            response = requests.get(url, params=params, timeout=10)
            response.raise_for_status()
            return response.json()
            
        except requests.exceptions.RequestException as e:
            print(f"0x API error: {e}")
            return None
    
    def compare_dex_quotes(self, chain_name: str, from_token: str, to_token: str, 
                          amount: int, from_token_decimals: int = 18, 
                          to_token_decimals: int = 18) -> Dict:
        """Compare quotes from multiple DEX aggregators"""
        chain_info = self.get_chain_info(chain_name)
        if not chain_info:
            return {'error': f'Unsupported chain: {chain_name}'}
        
        chain_id = chain_info['chain_id']
        amount_wei = int(amount * (10 ** from_token_decimals))
        
        quotes = {}
        
        # Get 1inch quote
        print(f"🔍 Getting 1inch quote for {chain_name}...")
        inch_quote = self.get_1inch_quote(chain_id, from_token, to_token, amount_wei)
        if inch_quote:
            quotes['1inch'] = {
                'protocol': '1inch',
                'chain': chain_name,
                'from_token': from_token,
                'to_token': to_token,
                'amount_in': amount,
                'amount_out': int(inch_quote.get('toTokenAmount', 0)) / (10 ** to_token_decimals),
                'price_impact': float(inch_quote.get('estimatedGas', 0)) / 1000000,  # Rough estimate
                'gas_estimate': inch_quote.get('estimatedGas', 0),
                'protocols': inch_quote.get('protocols', []),
                'raw_quote': inch_quote
            }
        
        # Get 0x quote
        print(f"🔍 Getting 0x quote for {chain_name}...")
        zero_x_quote = self.get_0x_quote(chain_id, from_token, to_token, amount_wei)
        if zero_x_quote:
            quotes['0x'] = {
                'protocol': '0x',
                'chain': chain_name,
                'from_token': from_token,
                'to_token': to_token,
                'amount_in': amount,
                'amount_out': int(zero_x_quote.get('buyAmount', 0)) / (10 ** to_token_decimals),
                'price_impact': float(zero_x_quote.get('estimatedPriceImpact', 0)),
                'gas_estimate': zero_x_quote.get('gas', 0),
                'protocols': zero_x_quote.get('sources', []),
                'raw_quote': zero_x_quote
            }
        
        # Find best quote
        best_quote = None
        best_amount_out = 0
        
        for protocol, quote in quotes.items():
            if quote['amount_out'] > best_amount_out:
                best_amount_out = quote['amount_out']
                best_quote = quote
        
        return {
            'chain': chain_name,
            'from_token': from_token,
            'to_token': to_token,
            'amount_in': amount,
            'quotes': quotes,
            'best_quote': best_quote,
            'timestamp': datetime.now().isoformat()
        }
    
    def get_multi_chain_quotes(self, from_token: str, to_token: str, amount: int,
                              chains: List[str] = None, from_token_decimals: int = 18,
                              to_token_decimals: int = 18) -> Dict:
        """Get quotes across multiple chains and find the best one"""
        if chains is None:
            chains = ['polygon', 'zksync', 'arbitrum', 'optimism']
        
        print(f"🌐 Getting quotes across {len(chains)} chains...")
        
        all_quotes = {}
        best_overall_quote = None
        best_amount_out = 0
        
        for chain in chains:
            print(f"\n🔗 Checking {chain}...")
            chain_quotes = self.compare_dex_quotes(
                chain, from_token, to_token, amount, from_token_decimals, to_token_decimals
            )
            
            if 'error' not in chain_quotes and chain_quotes.get('best_quote'):
                all_quotes[chain] = chain_quotes
                
                # Check if this is the best overall quote
                if chain_quotes['best_quote']['amount_out'] > best_amount_out:
                    best_amount_out = chain_quotes['best_quote']['amount_out']
                    best_overall_quote = chain_quotes['best_quote']
        
        return {
            'from_token': from_token,
            'to_token': to_token,
            'amount_in': amount,
            'chains_checked': chains,
            'chain_quotes': all_quotes,
            'best_overall_quote': best_overall_quote,
            'timestamp': datetime.now().isoformat()
        }
    
    def estimate_gas_cost(self, chain: str) -> Dict:
        """Estimate gas costs for different chains"""
        gas_estimates = {
            'ethereum': {'gas_price': 20, 'gas_limit': 150000, 'cost_usd': 30},
            'polygon': {'gas_price': 30, 'gas_limit': 200000, 'cost_usd': 0.1},
            'zksync': {'gas_price': 0.25, 'gas_limit': 100000, 'cost_usd': 0.05},
            'arbitrum': {'gas_price': 0.1, 'gas_limit': 120000, 'cost_usd': 0.5},
            'optimism': {'gas_price': 0.001, 'gas_limit': 100000, 'cost_usd': 0.1}
        }
        return gas_estimates.get(chain, {'cost_usd': 1.0})

class DEXTransactionDisplay:
    """Display DEX aggregator results in human-readable format"""
    
    @staticmethod
    def format_token_amount(amount: float, token_symbol: str) -> str:
        """Format token amount with proper decimals"""
        if amount >= 1000000:
            return f"{amount/1000000:.2f}M {token_symbol}"
        elif amount >= 1000:
            return f"{amount/1000:.2f}K {token_symbol}"
        else:
            return f"{amount:.6f} {token_symbol}"
    
    @staticmethod
    def display_chain_quotes(quotes_result: Dict):
        """Display quotes from multiple chains"""
        print("\n" + "="*80)
        print("🌐 MULTI-CHAIN DEX AGGREGATOR RESULTS")
        print("="*80)
        
        print(f"\n📊 Transaction Details:")
        print(f"   Amount: {DEXTransactionDisplay.format_token_amount(quotes_result['amount_in'], 'tokens')}")
        print(f"   From: {quotes_result['from_token']}")
        print(f"   To: {quotes_result['to_token']}")
        print(f"   Chains Checked: {', '.join(quotes_result['chains_checked'])}")
        print(f"   Time: {quotes_result['timestamp']}")
        
        # Display results for each chain
        for chain, chain_data in quotes_result['chain_quotes'].items():
            print(f"\n🔗 {chain.upper()} CHAIN:")
            
            for protocol, quote in chain_data['quotes'].items():
                print(f"   📈 {protocol.upper()}:")
                print(f"      Amount Out: {DEXTransactionDisplay.format_token_amount(quote['amount_out'], quote['to_token'])}")
                print(f"      Price Impact: {quote['price_impact']:.4f}%")
                print(f"      Gas Estimate: {quote['gas_estimate']}")
                if quote['protocols']:
                    print(f"      Protocols: {', '.join(quote['protocols'][:3])}...")
        
        # Display best overall quote
        if quotes_result['best_overall_quote']:
            best = quotes_result['best_overall_quote']
            print(f"\n🏆 BEST OVERALL QUOTE:")
            print(f"   Chain: {best['chain'].upper()}")
            print(f"   Protocol: {best['protocol'].upper()}")
            print(f"   Amount Out: {DEXTransactionDisplay.format_token_amount(best['amount_out'], best['to_token'])}")
            print(f"   Price Impact: {best['price_impact']:.4f}%")
            print(f"   Gas Estimate: {best['gas_estimate']}")
        else:
            print(f"\n❌ No quotes found across any chains")
        
        print("\n" + "="*80)

def main():
    """Demo function to test DEX aggregator integration"""
    print("🚀 DEX Aggregator Integration Demo")
    print("="*50)
    
    dex_service = DEXAggregatorService()
    display = DEXTransactionDisplay()
    
    # Example: USDC to USDT on multiple chains
    print("\n🔄 Testing USDC → USDT swap across multiple chains...")
    
    # Use USDC address on Polygon as example
    usdc_polygon = "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174"
    usdt_polygon = "0xc2132D05D31c914a87C6611C10748AEb04B58e8F"
    
    # Get quotes for 1000 USDC
    quotes = dex_service.get_multi_chain_quotes(
        from_token=usdc_polygon,
        to_token=usdt_polygon,
        amount=1000,
        chains=['polygon', 'arbitrum', 'optimism'],
        from_token_decimals=6,  # USDC has 6 decimals
        to_token_decimals=6     # USDT has 6 decimals
    )
    
    display.display_chain_quotes(quotes)

if __name__ == "__main__":
    main()
