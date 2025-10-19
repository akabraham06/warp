#!/usr/bin/env python3
"""
Seamless Transaction UI for End-to-End Cross-Currency Platform
Provides a user-friendly interface for complete fiat-to-fiat transactions
"""

import sys
import json
from typing import Dict, List, Optional
from end_to_end_platform import EndToEndTransactionService, EndToEndTransactionDisplay
from cex_integration import CEXAggregatorService, CEXTransactionDisplay
from dex_aggregator import DEXAggregatorService, DEXTransactionDisplay
from enhanced_fx_platform import EnhancedStablecoinTransaction, FXRateService, EnhancedTransactionDisplay

class SeamlessTransactionUI:
    """User-friendly interface for seamless cross-currency transactions"""
    
    def __init__(self):
        # Initialize all services
        self.end_to_end_service = EndToEndTransactionService()
        self.cex_service = CEXAggregatorService()
        self.dex_service = DEXAggregatorService()
        self.fx_service = FXRateService()
        
        # Initialize displays
        self.end_to_end_display = EndToEndTransactionDisplay()
        self.cex_display = CEXTransactionDisplay()
        self.dex_display = DEXTransactionDisplay()
        self.enhanced_display = EnhancedTransactionDisplay()
        
        # Available options
        self.available_currencies = [
            "USD", "EUR", "GBP", "JPY", "CAD", "AUD", "CHF", "CNY", "SEK", "NZD",
            "MXN", "SGD", "HKD", "NOK", "TRY", "RUB", "INR", "BRL", "ZAR", "KRW"
        ]
        
        self.available_chains = [
            "polygon", "zksync", "arbitrum", "optimism", "ethereum"
        ]
        
        self.transaction_sizes = {
            "small": {"min": 0, "max": 1000, "description": "Personal transfers (< $1,000)"},
            "medium": {"min": 1000, "max": 10000, "description": "Business transfers ($1,000 - $10,000)"},
            "large": {"min": 10000, "max": 100000, "description": "Large transfers ($10,000+)"}
        }
    
    def show_welcome_screen(self):
        """Display welcome screen with platform overview"""
        print("\n" + "="*80)
        print("🌍 SEAMLESS CROSS-CURRENCY TRANSACTION PLATFORM")
        print("="*80)
        print("Welcome to the most advanced cross-currency transaction platform!")
        print("We combine traditional FX, DEX aggregators, and CEX APIs to find")
        print("the best rates and lowest fees for your transactions.")
        print("\n✨ Features:")
        print("   • Real-time quotes from multiple sources")
        print("   • Multi-chain DEX integration (Polygon, zkSync, Arbitrum, etc.)")
        print("   • CEX integration (Coinbase, Binance)")
        print("   • End-to-end fiat-to-fiat transactions")
        print("   • Gas cost optimization")
        print("   • Professional-grade security")
        print("="*80)
    
    def get_transaction_details(self) -> Optional[Dict]:
        """Get transaction details from user with validation"""
        print("\n" + "="*60)
        print("📝 TRANSACTION DETAILS")
        print("="*60)
        
        try:
            # Get amount
            while True:
                amount_input = input("\n💰 Enter amount to convert: ").strip()
                try:
                    amount = float(amount_input)
                    if amount <= 0:
                        print("❌ Amount must be positive. Please try again.")
                        continue
                    break
                except ValueError:
                    print("❌ Invalid amount. Please enter a valid number.")
            
            # Get source currency
            while True:
                from_currency = input("📤 From currency (e.g., USD, EUR, GBP): ").upper().strip()
                if from_currency in self.available_currencies:
                    break
                else:
                    print(f"❌ Unsupported currency. Available: {', '.join(self.available_currencies[:10])}...")
            
            # Get target currency
            while True:
                to_currency = input("📥 To currency (e.g., USD, EUR, GBP): ").upper().strip()
                if to_currency in self.available_currencies:
                    if to_currency != from_currency:
                        break
                    else:
                        print("❌ Source and target currencies must be different.")
                else:
                    print(f"❌ Unsupported currency. Available: {', '.join(self.available_currencies[:10])}...")
            
            # Get preferred chains
            print(f"\n🔗 Select preferred chains (comma-separated):")
            print(f"   Available: {', '.join(self.available_chains)}")
            print(f"   Recommended: polygon, zksync, arbitrum")
            
            chains_input = input("   Chains (or press Enter for recommended): ").strip()
            if chains_input:
                chains = [chain.strip().lower() for chain in chains_input.split(',')]
                # Validate chains
                valid_chains = [chain for chain in chains if chain in self.available_chains]
                if not valid_chains:
                    print("⚠️  No valid chains selected. Using recommended chains.")
                    chains = ['polygon', 'zksync', 'arbitrum']
                else:
                    chains = valid_chains
            else:
                chains = ['polygon', 'zksync', 'arbitrum']
            
            # Get transaction preferences
            print(f"\n⚙️  Transaction Preferences:")
            include_cex = input("   Include CEX routes? (y/n, default: y): ").strip().lower()
            include_cex = include_cex != 'n'
            
            include_dex = input("   Include DEX routes? (y/n, default: y): ").strip().lower()
            include_dex = include_dex != 'n'
            
            include_traditional = input("   Include traditional routes? (y/n, default: y): ").strip().lower()
            include_traditional = include_traditional != 'n'
            
            return {
                'amount': amount,
                'from_currency': from_currency,
                'to_currency': to_currency,
                'chains': chains,
                'include_cex': include_cex,
                'include_dex': include_dex,
                'include_traditional': include_traditional
            }
            
        except KeyboardInterrupt:
            print("\n\n👋 Transaction cancelled by user.")
            return None
        except Exception as e:
            print(f"\n❌ Error getting transaction details: {e}")
            return None
    
    def show_transaction_size_analysis(self, amount: float) -> str:
        """Analyze transaction size and provide recommendations"""
        print(f"\n📊 Transaction Size Analysis:")
        
        if amount < 1000:
            size_category = "small"
            print(f"   Category: Small Transaction (< $1,000)")
            print(f"   Recommendation: Focus on low-fee chains (zkSync, Polygon)")
            print(f"   Best Routes: Traditional FX or CEX-only routes")
        elif amount < 10000:
            size_category = "medium"
            print(f"   Category: Medium Transaction ($1,000 - $10,000)")
            print(f"   Recommendation: Compare all available routes")
            print(f"   Best Routes: DEX routes may provide savings")
        else:
            size_category = "large"
            print(f"   Category: Large Transaction ($10,000+)")
            print(f"   Recommendation: DEX routes likely to provide significant savings")
            print(f"   Best Routes: Multi-chain DEX optimization")
        
        return size_category
    
    def execute_transaction_analysis(self, transaction_details: Dict):
        """Execute complete transaction analysis"""
        print(f"\n🔄 Analyzing transaction...")
        print(f"   Amount: {transaction_details['amount']} {transaction_details['from_currency']}")
        print(f"   Target: {transaction_details['to_currency']}")
        print(f"   Chains: {', '.join(transaction_details['chains'])}")
        
        # Show transaction size analysis
        size_category = self.show_transaction_size_analysis(transaction_details['amount'])
        
        # Perform analysis
        analysis = self.end_to_end_service.analyze_complete_transaction(
            transaction_details['amount'],
            transaction_details['from_currency'],
            transaction_details['to_currency'],
            transaction_details['chains'],
            transaction_details['include_cex'],
            transaction_details['include_dex'],
            transaction_details['include_traditional']
        )
        
        # Display results
        self.end_to_end_display.display_complete_analysis(analysis)
        
        # Get and display comparison
        comparison = self.end_to_end_service.get_route_comparison(analysis)
        self.end_to_end_display.display_route_comparison(comparison)
        
        return analysis
    
    def show_route_details(self, analysis: Dict):
        """Show detailed information about each route"""
        print(f"\n🔍 DETAILED ROUTE ANALYSIS")
        print("="*60)
        
        for route_type, route_data in analysis['routes'].items():
            print(f"\n📋 {route_data['name']}:")
            print(f"   Final Amount: {self.end_to_end_display.format_currency(route_data['final_amount'], analysis['transaction_details']['to_currency'])}")
            print(f"   Efficiency: {route_data['efficiency']:.4f}")
            print(f"   Complexity: {route_data['complexity']}")
            print(f"   Time: {route_data['time_estimate']}")
            print(f"   Fees: {route_data['fees']}")
            
            if 'steps' in route_data:
                print(f"   Steps:")
                for i, step in enumerate(route_data['steps'], 1):
                    print(f"      {i}. {step}")
            
            if route_type == 'traditional' and 'analysis' in route_data:
                print(f"   Traditional Analysis Available: ✅")
            elif route_type == 'cex' and 'analysis' in route_data:
                print(f"   CEX Analysis Available: ✅")
            elif route_type == 'dex':
                print(f"   DEX Analysis Available: ✅")
    
    def show_quick_quotes(self):
        """Show quick quotes for common transactions"""
        print(f"\n⚡ QUICK QUOTES")
        print("="*50)
        
        quick_transactions = [
            {"amount": 1000, "from": "USD", "to": "EUR"},
            {"amount": 500, "from": "GBP", "to": "JPY"},
            {"amount": 2000, "from": "EUR", "to": "USD"},
        ]
        
        for i, transaction in enumerate(quick_transactions, 1):
            print(f"\n🔄 Quick Quote {i}: {transaction['amount']} {transaction['from']} → {transaction['to']}")
            
            try:
                # Get traditional quote
                traditional = self.end_to_end_service.enhanced_transaction.calculate_traditional_transaction_cost(
                    transaction['amount'], transaction['from'], transaction['to']
                )
                
                final_amount = traditional['stablecoin_route']['final_amount']
                print(f"   Traditional Route: {self.end_to_end_display.format_currency(final_amount, transaction['to'])}")
                
                # Get CEX quote
                cex_route = self.cex_service.get_optimal_crypto_route(
                    transaction['amount'], transaction['from'], transaction['to']
                )
                
                if cex_route['best_route']:
                    cex_amount = cex_route['best_route']['target_fiat_amount']
                    print(f"   CEX Route: {self.end_to_end_display.format_currency(cex_amount, transaction['to'])}")
                    
                    savings = cex_amount - final_amount
                    if savings > 0:
                        print(f"   💰 CEX Savings: {self.end_to_end_display.format_currency(savings, transaction['to'])}")
                    elif savings < 0:
                        print(f"   ⚠️  CEX Loss: {self.end_to_end_display.format_currency(abs(savings), transaction['to'])}")
                
            except Exception as e:
                print(f"   ❌ Error getting quote: {e}")
    
    def show_platform_info(self):
        """Show platform information and features"""
        print(f"\n📚 PLATFORM INFORMATION")
        print("="*50)
        
        print(f"\n🌐 Supported Currencies ({len(self.available_currencies)}):")
        for i, currency in enumerate(self.available_currencies, 1):
            print(f"   {currency}", end="  ")
            if i % 10 == 0:
                print()
        
        print(f"\n\n🔗 Supported Chains ({len(self.available_chains)}):")
        chain_info = {
            'polygon': 'Low fees (~$0.10), fast transactions',
            'zksync': 'Ultra-low fees (~$0.05), zk-rollup',
            'arbitrum': 'Ethereum L2, moderate fees (~$0.50)',
            'optimism': 'Ethereum L2, low fees (~$0.10)',
            'ethereum': 'Mainnet, highest security (~$30.00)'
        }
        
        for chain, description in chain_info.items():
            print(f"   {chain.upper()}: {description}")
        
        print(f"\n🏛️  Integrated Exchanges:")
        print(f"   • Coinbase Advanced Trade API")
        print(f"   • Binance API")
        print(f"   • 1inch DEX Aggregator")
        print(f"   • 0x Protocol")
        
        print(f"\n🛡️  Security Features:")
        print(f"   • API key encryption")
        print(f"   • Rate limiting")
        print(f"   • Error handling")
        print(f"   • Transaction validation")
    
    def show_main_menu(self):
        """Show main menu options"""
        print(f"\n" + "="*60)
        print("📋 MAIN MENU")
        print("="*60)
        print("1. 🚀 Start New Transaction")
        print("2. ⚡ Quick Quotes")
        print("3. 🔍 Route Details (from last analysis)")
        print("4. 📚 Platform Information")
        print("5. 🧪 Test Different Scenarios")
        print("6. 🚪 Exit")
        print("="*60)
    
    def run_test_scenarios(self):
        """Run predefined test scenarios"""
        print(f"\n🧪 TEST SCENARIOS")
        print("="*50)
        
        scenarios = [
            {"name": "Small Personal Transfer", "amount": 500, "from": "USD", "to": "EUR"},
            {"name": "Medium Business Transfer", "amount": 5000, "from": "GBP", "to": "JPY"},
            {"name": "Large International Transfer", "amount": 25000, "from": "EUR", "to": "USD"},
        ]
        
        for i, scenario in enumerate(scenarios, 1):
            print(f"\n🔄 Scenario {i}: {scenario['name']}")
            print(f"   {scenario['amount']} {scenario['from']} → {scenario['to']}")
            
            try:
                analysis = self.end_to_end_service.analyze_complete_transaction(
                    scenario['amount'], scenario['from'], scenario['to']
                )
                
                if analysis['best_route']:
                    best = analysis['best_route']
                    print(f"   ✅ Best Route: {best['name']}")
                    print(f"   💰 Final Amount: {self.end_to_end_display.format_currency(best['final_amount'], scenario['to'])}")
                    print(f"   ⏱️  Time: {best['time_estimate']}")
                else:
                    print(f"   ❌ No routes available")
                    
            except Exception as e:
                print(f"   ❌ Error: {e}")
            
            if i < len(scenarios):
                input(f"\n   Press Enter to continue to next scenario...")
    
    def run(self):
        """Main application loop"""
        self.show_welcome_screen()
        
        last_analysis = None
        
        while True:
            try:
                self.show_main_menu()
                choice = input("\nSelect an option (1-6): ").strip()
                
                if choice == "1":
                    # Start new transaction
                    transaction_details = self.get_transaction_details()
                    if transaction_details:
                        last_analysis = self.execute_transaction_analysis(transaction_details)
                
                elif choice == "2":
                    # Quick quotes
                    self.show_quick_quotes()
                
                elif choice == "3":
                    # Route details
                    if last_analysis:
                        self.show_route_details(last_analysis)
                    else:
                        print("\n❌ No previous analysis available. Please run a transaction first.")
                
                elif choice == "4":
                    # Platform information
                    self.show_platform_info()
                
                elif choice == "5":
                    # Test scenarios
                    self.run_test_scenarios()
                
                elif choice == "6":
                    # Exit
                    print("\n👋 Thank you for using the Seamless Cross-Currency Transaction Platform!")
                    print("   We hope you found the best rates for your transactions! 🚀")
                    sys.exit(0)
                
                else:
                    print("\n❌ Invalid choice. Please select 1-6.")
                
            except KeyboardInterrupt:
                print("\n\n👋 Goodbye! Thanks for using our platform!")
                sys.exit(0)
            except Exception as e:
                print(f"\n❌ An error occurred: {e}")
                print("   Please try again or contact support.")

def main():
    """Main function to run the seamless transaction UI"""
    ui = SeamlessTransactionUI()
    ui.run()

if __name__ == "__main__":
    main()
