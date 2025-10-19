#!/usr/bin/env python3
"""
End-to-End Cross-Currency Transaction Platform
Combines CEX APIs, DEX aggregators, and traditional FX for seamless fiat-to-fiat transactions
"""

import json
from datetime import datetime
from typing import Dict, List, Optional, Tuple
from enhanced_fx_platform import EnhancedStablecoinTransaction, FXRateService, EnhancedTransactionDisplay
from dex_aggregator import DEXAggregatorService, DEXTransactionDisplay
from cex_integration import CEXAggregatorService, CEXTransactionDisplay

class EndToEndTransactionService:
    """Service for complete fiat-to-fiat transactions using all available routes"""
    
    def __init__(self):
        # Initialize all services
        self.fx_service = FXRateService()
        self.dex_service = DEXAggregatorService()
        self.cex_service = CEXAggregatorService()
        
        # Initialize transaction services
        self.enhanced_transaction = EnhancedStablecoinTransaction(self.fx_service, self.dex_service)
        
        # Transaction route types
        self.route_types = {
            'traditional': 'Traditional FX + Stablecoin',
            'dex': 'CEX On-ramp + DEX Swap + CEX Off-ramp',
            'cex_only': 'CEX On-ramp + CEX Swap + CEX Off-ramp',
            'hybrid': 'CEX On-ramp + DEX Swap + Traditional FX'
        }
    
    def analyze_complete_transaction(self, amount: float, from_currency: str, to_currency: str,
                                   preferred_chains: List[str] = None,
                                   include_cex: bool = True,
                                   include_dex: bool = True,
                                   include_traditional: bool = True) -> Dict:
        """Analyze complete transaction using all available routes"""
        
        if preferred_chains is None:
            preferred_chains = ['polygon', 'zksync', 'arbitrum']
        
        print(f"🌍 Analyzing complete transaction: {amount} {from_currency} → {to_currency}")
        print(f"   Routes to analyze: {', '.join([route for route, include in [
            ('Traditional', include_traditional),
            ('DEX', include_dex), 
            ('CEX', include_cex)
        ] if include])}")
        
        analysis = {
            'transaction_details': {
                'amount': amount,
                'from_currency': from_currency,
                'to_currency': to_currency,
                'preferred_chains': preferred_chains,
                'timestamp': datetime.now().isoformat()
            },
            'routes': {},
            'best_route': None,
            'recommendation': None
        }
        
        # 1. Traditional Route (FX + Stablecoin)
        if include_traditional:
            print(f"\n🔄 Analyzing traditional route...")
            traditional_analysis = self.enhanced_transaction.calculate_traditional_transaction_cost(
                amount, from_currency, to_currency
            )
            analysis['routes']['traditional'] = {
                'type': 'traditional',
                'name': 'Traditional FX + Stablecoin',
                'analysis': traditional_analysis,
                'final_amount': traditional_analysis['stablecoin_route']['final_amount'],
                'efficiency': 1.0,  # Baseline
                'complexity': 'Low',
                'time_estimate': '1-3 minutes',
                'fees': 'FX spread only'
            }
        
        # 2. CEX Route (Fiat → Crypto → Fiat)
        if include_cex:
            print(f"\n🔄 Analyzing CEX route...")
            cex_analysis = self.cex_service.get_optimal_crypto_route(
                amount, from_currency, to_currency
            )
            if cex_analysis['best_route']:
                best_cex = cex_analysis['best_route']
                analysis['routes']['cex'] = {
                    'type': 'cex',
                    'name': 'CEX On-ramp + CEX Swap + CEX Off-ramp',
                    'analysis': cex_analysis,
                    'final_amount': best_cex['target_fiat_amount'],
                    'efficiency': best_cex['total_efficiency'],
                    'complexity': 'Medium',
                    'time_estimate': '5-15 minutes',
                    'fees': 'CEX trading fees + spreads',
                    'crypto_route': best_cex['route'],
                    'exchange': best_cex['fiat_to_crypto']['exchange']
                }
        
        # 3. DEX Route (CEX On-ramp + DEX Swap + CEX Off-ramp)
        if include_dex:
            print(f"\n🔄 Analyzing DEX route...")
            dex_analysis = self._analyze_dex_route(amount, from_currency, to_currency, preferred_chains)
            if dex_analysis:
                analysis['routes']['dex'] = dex_analysis
        
        # 4. Hybrid Route (CEX On-ramp + DEX Swap + Traditional FX)
        if include_cex and include_dex:
            print(f"\n🔄 Analyzing hybrid route...")
            hybrid_analysis = self._analyze_hybrid_route(amount, from_currency, to_currency, preferred_chains)
            if hybrid_analysis:
                analysis['routes']['hybrid'] = hybrid_analysis
        
        # Find best route
        best_route = None
        best_final_amount = 0
        
        for route_type, route_data in analysis['routes'].items():
            if route_data['final_amount'] > best_final_amount:
                best_final_amount = route_data['final_amount']
                best_route = route_data
        
        analysis['best_route'] = best_route
        
        # Generate recommendation
        if best_route:
            savings_vs_traditional = 0
            if 'traditional' in analysis['routes']:
                traditional_amount = analysis['routes']['traditional']['final_amount']
                savings_vs_traditional = best_final_amount - traditional_amount
            
            analysis['recommendation'] = {
                'best_route_type': best_route['type'],
                'best_route_name': best_route['name'],
                'final_amount': best_final_amount,
                'savings_vs_traditional': savings_vs_traditional,
                'savings_percentage': (savings_vs_traditional / analysis['routes'].get('traditional', {}).get('final_amount', 1) * 100) if 'traditional' in analysis['routes'] else 0,
                'complexity': best_route['complexity'],
                'time_estimate': best_route['time_estimate']
            }
        
        return analysis
    
    def _analyze_dex_route(self, amount: float, from_currency: str, to_currency: str,
                          preferred_chains: List[str]) -> Optional[Dict]:
        """Analyze DEX route: CEX On-ramp + DEX Swap + CEX Off-ramp"""
        
        # Step 1: Get CEX on-ramp quote
        cex_on_ramp = self.cex_service.get_optimal_crypto_route(amount, from_currency, 'USDC')
        if not cex_on_ramp['best_route']:
            return None
        
        crypto_amount = cex_on_ramp['best_route']['crypto_amount']
        
        # Step 2: Simulate DEX swap (USDC to target stablecoin)
        # In production, you'd use actual DEX quotes
        target_stablecoin = 'USDT'  # Assume USDT for target
        dex_swap_amount = crypto_amount * 0.999  # 0.1% DEX fee
        
        # Step 3: Simulate CEX off-ramp
        cex_off_ramp = self.cex_service.get_optimal_crypto_route(dex_swap_amount, target_stablecoin, to_currency)
        if not cex_off_ramp['best_route']:
            return None
        
        final_amount = cex_off_ramp['best_route']['target_fiat_amount']
        
        return {
            'type': 'dex',
            'name': 'CEX On-ramp + DEX Swap + CEX Off-ramp',
            'final_amount': final_amount,
            'efficiency': final_amount / amount,
            'complexity': 'High',
            'time_estimate': '10-30 minutes',
            'fees': 'CEX fees + DEX fees + gas costs',
            'steps': [
                f"{from_currency} → USDC (CEX)",
                f"USDC → {target_stablecoin} (DEX)",
                f"{target_stablecoin} → {to_currency} (CEX)"
            ],
            'crypto_amount': crypto_amount,
            'dex_swap_amount': dex_swap_amount
        }
    
    def _analyze_hybrid_route(self, amount: float, from_currency: str, to_currency: str,
                             preferred_chains: List[str]) -> Optional[Dict]:
        """Analyze hybrid route: CEX On-ramp + DEX Swap + Traditional FX"""
        
        # Step 1: Get CEX on-ramp quote
        cex_on_ramp = self.cex_service.get_optimal_crypto_route(amount, from_currency, 'USDC')
        if not cex_on_ramp['best_route']:
            return None
        
        crypto_amount = cex_on_ramp['best_route']['crypto_amount']
        
        # Step 2: Simulate DEX swap
        dex_swap_amount = crypto_amount * 0.999  # 0.1% DEX fee
        
        # Step 3: Use traditional FX for final conversion
        # This is a simplified approach - in reality you'd need to handle crypto-to-fiat differently
        traditional_rate = self.fx_service.get_rate('USD', to_currency)
        final_amount = dex_swap_amount * traditional_rate
        
        return {
            'type': 'hybrid',
            'name': 'CEX On-ramp + DEX Swap + Traditional FX',
            'final_amount': final_amount,
            'efficiency': final_amount / amount,
            'complexity': 'Medium',
            'time_estimate': '5-20 minutes',
            'fees': 'CEX fees + DEX fees + FX spread',
            'steps': [
                f"{from_currency} → USDC (CEX)",
                f"USDC → USDT (DEX)",
                f"USDT → {to_currency} (Traditional FX)"
            ],
            'crypto_amount': crypto_amount,
            'dex_swap_amount': dex_swap_amount
        }
    
    def get_route_comparison(self, analysis: Dict) -> Dict:
        """Get detailed comparison of all routes"""
        comparison = {
            'transaction_details': analysis['transaction_details'],
            'route_comparison': [],
            'summary': {}
        }
        
        # Compare all routes
        for route_type, route_data in analysis['routes'].items():
            comparison['route_comparison'].append({
                'route_type': route_type,
                'name': route_data['name'],
                'final_amount': route_data['final_amount'],
                'efficiency': route_data['efficiency'],
                'complexity': route_data['complexity'],
                'time_estimate': route_data['time_estimate'],
                'fees': route_data['fees']
            })
        
        # Sort by final amount (descending)
        comparison['route_comparison'].sort(key=lambda x: x['final_amount'], reverse=True)
        
        # Generate summary
        if comparison['route_comparison']:
            best = comparison['route_comparison'][0]
            worst = comparison['route_comparison'][-1]
            
            comparison['summary'] = {
                'best_route': best['name'],
                'best_amount': best['final_amount'],
                'worst_route': worst['name'],
                'worst_amount': worst['final_amount'],
                'max_savings': best['final_amount'] - worst['final_amount'],
                'max_savings_percentage': ((best['final_amount'] - worst['final_amount']) / worst['final_amount'] * 100) if worst['final_amount'] > 0 else 0
            }
        
        return comparison

class EndToEndTransactionDisplay:
    """Display end-to-end transaction analysis"""
    
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
    def display_complete_analysis(analysis: Dict):
        """Display complete transaction analysis"""
        print("\n" + "="*80)
        print("🌍 END-TO-END CROSS-CURRENCY TRANSACTION ANALYSIS")
        print("="*80)
        
        details = analysis['transaction_details']
        print(f"\n📊 Transaction Details:")
        print(f"   Amount: {EndToEndTransactionDisplay.format_currency(details['amount'], details['from_currency'])}")
        print(f"   From: {details['from_currency']}")
        print(f"   To: {details['to_currency']}")
        print(f"   Chains: {', '.join(details['preferred_chains'])}")
        print(f"   Time: {details['timestamp']}")
        
        # Display all routes
        print(f"\n🛤️  Available Routes:")
        for route_type, route_data in analysis['routes'].items():
            print(f"\n   {route_data['name']}:")
            print(f"      Final Amount: {EndToEndTransactionDisplay.format_currency(route_data['final_amount'], details['to_currency'])}")
            print(f"      Efficiency: {route_data['efficiency']:.4f}")
            print(f"      Complexity: {route_data['complexity']}")
            print(f"      Time: {route_data['time_estimate']}")
            print(f"      Fees: {route_data['fees']}")
            
            if 'steps' in route_data:
                print(f"      Steps: {' → '.join(route_data['steps'])}")
        
        # Display best route
        if analysis['best_route']:
            best = analysis['best_route']
            print(f"\n🏆 BEST ROUTE:")
            print(f"   Route: {best['name']}")
            print(f"   Final Amount: {EndToEndTransactionDisplay.format_currency(best['final_amount'], details['to_currency'])}")
            print(f"   Efficiency: {best['efficiency']:.4f}")
            print(f"   Complexity: {best['complexity']}")
            print(f"   Time: {best['time_estimate']}")
        
        # Display recommendation
        if analysis['recommendation']:
            rec = analysis['recommendation']
            print(f"\n🎯 RECOMMENDATION:")
            print(f"   Best Route: {rec['best_route_name']}")
            print(f"   Final Amount: {EndToEndTransactionDisplay.format_currency(rec['final_amount'], details['to_currency'])}")
            
            if rec['savings_vs_traditional'] > 0:
                print(f"   💰 Savings vs Traditional: {EndToEndTransactionDisplay.format_currency(rec['savings_vs_traditional'], details['to_currency'])}")
                print(f"   📈 Improvement: {rec['savings_percentage']:.2f}%")
            elif rec['savings_vs_traditional'] < 0:
                print(f"   ⚠️  Loss vs Traditional: {EndToEndTransactionDisplay.format_currency(abs(rec['savings_vs_traditional']), details['to_currency'])}")
                print(f"   📉 Loss: {abs(rec['savings_percentage']):.2f}%")
            else:
                print(f"   ⚖️  Same as Traditional Route")
            
            print(f"   ⏱️  Estimated Time: {rec['time_estimate']}")
            print(f"   🔧 Complexity: {rec['complexity']}")
        
        print("\n" + "="*80)
    
    @staticmethod
    def display_route_comparison(comparison: Dict):
        """Display route comparison table"""
        print("\n" + "="*80)
        print("📊 ROUTE COMPARISON TABLE")
        print("="*80)
        
        details = comparison['transaction_details']
        print(f"\nTransaction: {details['amount']} {details['from_currency']} → {details['to_currency']}")
        
        # Display comparison table
        print(f"\n{'Route':<30} {'Final Amount':<15} {'Efficiency':<12} {'Complexity':<12} {'Time':<15}")
        print("-" * 80)
        
        for route in comparison['route_comparison']:
            final_amount = EndToEndTransactionDisplay.format_currency(route['final_amount'], details['to_currency'])
            print(f"{route['name']:<30} {final_amount:<15} {route['efficiency']:<12.4f} {route['complexity']:<12} {route['time_estimate']:<15}")
        
        # Display summary
        if comparison['summary']:
            summary = comparison['summary']
            print(f"\n📈 SUMMARY:")
            print(f"   Best Route: {summary['best_route']}")
            print(f"   Best Amount: {EndToEndTransactionDisplay.format_currency(summary['best_amount'], details['to_currency'])}")
            print(f"   Max Savings: {EndToEndTransactionDisplay.format_currency(summary['max_savings'], details['to_currency'])}")
            print(f"   Max Savings %: {summary['max_savings_percentage']:.2f}%")
        
        print("\n" + "="*80)

def main():
    """Demo function for end-to-end transaction analysis"""
    print("🚀 End-to-End Cross-Currency Transaction Platform Demo")
    print("="*70)
    
    # Initialize services
    service = EndToEndTransactionService()
    display = EndToEndTransactionDisplay()
    
    # Test scenarios
    test_scenarios = [
        {
            "name": "Small Transaction (USD → EUR)",
            "amount": 500,
            "from": "USD",
            "to": "EUR",
            "chains": ["polygon", "zksync"]
        },
        {
            "name": "Medium Transaction (GBP → JPY)",
            "amount": 2000,
            "from": "GBP",
            "to": "JPY",
            "chains": ["arbitrum", "optimism"]
        },
        {
            "name": "Large Transaction (EUR → USD)",
            "amount": 10000,
            "from": "EUR",
            "to": "USD",
            "chains": ["polygon", "zksync", "arbitrum"]
        }
    ]
    
    for i, scenario in enumerate(test_scenarios, 1):
        print(f"\n🔄 Test Scenario {i}: {scenario['name']}")
        print(f"   Amount: {scenario['amount']} {scenario['from']} → {scenario['to']}")
        print("-" * 70)
        
        # Analyze complete transaction
        analysis = service.analyze_complete_transaction(
            scenario["amount"],
            scenario["from"],
            scenario["to"],
            scenario["chains"]
        )
        
        # Display results
        display.display_complete_analysis(analysis)
        
        # Get and display comparison
        comparison = service.get_route_comparison(analysis)
        display.display_route_comparison(comparison)
        
        if i < len(test_scenarios):
            input("\nPress Enter to continue to next scenario...")

if __name__ == "__main__":
    main()
