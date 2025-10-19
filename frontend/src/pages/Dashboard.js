import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { 
  DollarSign, 
  TrendingUp, 
  ArrowRight, 
  Wallet, 
  History, 
  Zap,
  RefreshCw,
  Star
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { userAPI, transactionAPI } from '../services/api';
import toast from 'react-hot-toast';
import QuickConverter from '../components/QuickConverter';

gsap.registerPlugin(ScrollTrigger);

const DashboardContainer = styled.div`
  min-height: 100vh;
  background: ${props => props.theme.colors.background};
  padding-top: 70px; /* Account for fixed header */
`;

const DashboardContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: ${props => props.theme.spacing.xl} ${props => props.theme.spacing.md};
`;

const WelcomeSection = styled.section`
  margin-bottom: ${props => props.theme.spacing.xxl};
`;

const WelcomeTitle = styled.h1`
  font-size: clamp(2rem, 4vw, 3rem);
  font-weight: ${props => props.theme.fonts.weights.bold};
  color: ${props => props.theme.colors.text};
  margin-bottom: ${props => props.theme.spacing.sm};
  background: ${props => props.theme.colors.gradient.primary};
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`;

const WelcomeSubtitle = styled.p`
  font-size: 1.2rem;
  color: ${props => props.theme.colors.textSecondary};
  margin-bottom: ${props => props.theme.spacing.lg};
`;

const QuickActions = styled.div`
  display: flex;
  gap: ${props => props.theme.spacing.md};
  flex-wrap: wrap;
  margin-bottom: ${props => props.theme.spacing.xxl};

  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    flex-direction: column;
  }
`;

const QuickActionCard = styled(Link)`
  flex: 1;
  min-width: 200px;
  background: ${props => props.theme.colors.surface};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius.lg};
  padding: ${props => props.theme.spacing.lg};
  text-decoration: none;
  transition: all ${props => props.theme.transitions.normal};
  position: relative;
  overflow: hidden;

  &:hover {
    transform: translateY(-5px);
    box-shadow: ${props => props.theme.shadows.glow};
    border-color: ${props => props.theme.colors.primary};
  }

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: ${props => props.theme.colors.gradient.primary};
  }
`;

const QuickActionIcon = styled.div`
  width: 50px;
  height: 50px;
  background: ${props => props.theme.colors.gradient.primary};
  border-radius: ${props => props.theme.borderRadius.md};
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  margin-bottom: ${props => props.theme.spacing.md};
`;

const QuickActionTitle = styled.h3`
  font-size: 1.2rem;
  font-weight: ${props => props.theme.fonts.weights.semiBold};
  color: ${props => props.theme.colors.text};
  margin-bottom: ${props => props.theme.spacing.sm};
`;

const QuickActionDescription = styled.p`
  color: ${props => props.theme.colors.textSecondary};
  font-size: 0.9rem;
  line-height: 1.5;
`;

const BalancesSection = styled.section`
  margin-bottom: ${props => props.theme.spacing.xxl};
`;

const SectionTitle = styled.h2`
  font-size: 1.8rem;
  font-weight: ${props => props.theme.fonts.weights.bold};
  color: ${props => props.theme.colors.text};
  margin-bottom: ${props => props.theme.spacing.lg};
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.sm};
`;

const BalancesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: ${props => props.theme.spacing.lg};
`;

const BalanceCard = styled.div`
  background: ${props => props.theme.colors.surface};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius.lg};
  padding: ${props => props.theme.spacing.lg};
  transition: all ${props => props.theme.transitions.normal};

  &:hover {
    transform: translateY(-3px);
    box-shadow: ${props => props.theme.shadows.md};
    border-color: ${props => props.theme.colors.primary};
  }
`;

const BalanceHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${props => props.theme.spacing.md};
`;

const BalanceCurrency = styled.div`
  font-size: 1rem;
  font-weight: ${props => props.theme.fonts.weights.medium};
  color: ${props => props.theme.colors.textSecondary};
`;

const BalanceIcon = styled.div`
  width: 40px;
  height: 40px;
  background: ${props => props.theme.colors.gradient.primary};
  border-radius: ${props => props.theme.borderRadius.md};
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
`;

const BalanceAmount = styled.div`
  font-size: 2rem;
  font-weight: ${props => props.theme.fonts.weights.bold};
  color: ${props => props.theme.colors.text};
  margin-bottom: ${props => props.theme.spacing.sm};
`;

const BalanceValue = styled.div`
  font-size: 0.9rem;
  color: ${props => props.theme.colors.textMuted};
`;

const RecentTransactionsSection = styled.section`
  margin-bottom: ${props => props.theme.spacing.xxl};
`;

const TransactionsList = styled.div`
  background: ${props => props.theme.colors.surface};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius.lg};
  overflow: hidden;
`;

const TransactionItem = styled.div`
  padding: ${props => props.theme.spacing.md};
  border-bottom: 1px solid ${props => props.theme.colors.borderLight};
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition: all ${props => props.theme.transitions.fast};

  &:hover {
    background: rgba(79, 172, 254, 0.05);
  }

  &:last-child {
    border-bottom: none;
  }
`;

const TransactionInfo = styled.div`
  flex: 1;
`;

const TransactionType = styled.div`
  font-weight: ${props => props.theme.fonts.weights.medium};
  color: ${props => props.theme.colors.text};
  margin-bottom: ${props => props.theme.spacing.xs};
`;

const TransactionDate = styled.div`
  font-size: 0.9rem;
  color: ${props => props.theme.colors.textMuted};
`;

const TransactionAmount = styled.div`
  text-align: right;
`;

const TransactionAmountValue = styled.div`
  font-weight: ${props => props.theme.fonts.weights.semiBold};
  color: ${props => props.theme.colors.text};
  margin-bottom: ${props => props.theme.spacing.xs};
`;

const TransactionRate = styled.div`
  font-size: 0.8rem;
  color: ${props => props.theme.colors.textMuted};
`;

const EmptyState = styled.div`
  text-align: center;
  padding: ${props => props.theme.spacing.xxl};
  color: ${props => props.theme.colors.textMuted};
`;

const LoadingState = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: ${props => props.theme.spacing.xxl};
  color: ${props => props.theme.colors.textMuted};
`;

const ErrorState = styled.div`
  background: rgba(255, 107, 107, 0.1);
  border: 1px solid ${props => props.theme.colors.error};
  border-radius: ${props => props.theme.borderRadius.md};
  padding: ${props => props.theme.spacing.lg};
  color: ${props => props.theme.colors.error};
  text-align: center;
  margin-bottom: ${props => props.theme.spacing.lg};
`;

const RefreshButton = styled.button`
  background: transparent;
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius.md};
  padding: ${props => props.theme.spacing.sm};
  color: ${props => props.theme.colors.textSecondary};
  cursor: pointer;
  transition: all ${props => props.theme.transitions.fast};
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.xs};

  &:hover {
    border-color: ${props => props.theme.colors.primary};
    color: ${props => props.theme.colors.primary};
  }
`;

const currencySymbols = {
  usd: '$',
  eur: '€',
  gbp: '£',
  mxn: '$',
  jpy: '¥',
  cad: 'C$',
  aud: 'A$'
};

export default function Dashboard() {
  const { currentUser, getIdToken } = useAuth();
  const [userProfile, setUserProfile] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setLoading(true);
    setError('');

    try {
      const token = await getIdToken();
      if (!token) {
        throw new Error('Authentication required');
      }

      const [profileData, transactionsData] = await Promise.all([
        userAPI.getUserProfile(token),
        transactionAPI.getTransactionHistory(token)
      ]);

      setUserProfile(profileData);
      setTransactions(transactionsData.slice(0, 5)); // Show only recent 5 transactions
    } catch (error) {
      setError(error.message);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const formatAmount = (amount, currency) => {
    const symbol = currencySymbols[currency.toLowerCase()] || currency.toUpperCase();
    return `${symbol}${amount.toFixed(2)}`;
  };

  const formatDate = (timestamp) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  if (loading) {
    return (
      <DashboardContainer>
        <DashboardContent>
          <LoadingState>
            <RefreshCw size={24} className="animate-spin" />
            Loading dashboard...
          </LoadingState>
        </DashboardContent>
      </DashboardContainer>
    );
  }

  if (error) {
    return (
      <DashboardContainer>
        <DashboardContent>
          <ErrorState>
            {error}
            <RefreshButton onClick={loadDashboardData} style={{ marginTop: '1rem' }}>
              <RefreshCw size={16} />
              Retry
            </RefreshButton>
          </ErrorState>
        </DashboardContent>
      </DashboardContainer>
    );
  }

  return (
    <DashboardContainer>
      <DashboardContent>
        <WelcomeSection>
          <WelcomeTitle>
            Welcome back, {userProfile?.display_name || 'User'}!
          </WelcomeTitle>
          <WelcomeSubtitle>
            Here's your account overview and recent activity
          </WelcomeSubtitle>
        </WelcomeSection>

        <QuickConverter />

        <BalancesSection>
          <SectionTitle>
            <Wallet size={24} />
            Your Balances
            <RefreshButton onClick={loadDashboardData}>
              <RefreshCw size={16} />
            </RefreshButton>
          </SectionTitle>
          <BalancesGrid>
            {userProfile?.balances && Object.entries(userProfile.balances)
              .filter(([currency, amount]) => amount > 0)
              .map(([currency, amount]) => (
                <BalanceCard key={currency}>
                  <BalanceHeader>
                    <BalanceCurrency>{currency.toUpperCase()}</BalanceCurrency>
                    <BalanceIcon>
                      <DollarSign size={20} />
                    </BalanceIcon>
                  </BalanceHeader>
                  <BalanceAmount>
                    {formatAmount(amount, currency)}
                  </BalanceAmount>
                  <BalanceValue>
                    {currency.toUpperCase()} Balance
                  </BalanceValue>
                </BalanceCard>
              ))}
          </BalancesGrid>
        </BalancesSection>

        <RecentTransactionsSection>
          <SectionTitle>
            <History size={24} />
            Recent Transactions
            <Link to="/history" style={{ marginLeft: 'auto', color: '#4facfe', textDecoration: 'none' }}>
              View All <ArrowRight size={16} style={{ display: 'inline', marginLeft: '0.5rem' }} />
            </Link>
          </SectionTitle>
          <TransactionsList>
            {transactions.length > 0 ? (
              transactions.map((transaction) => (
                <TransactionItem key={transaction.transaction_id}>
                  <TransactionInfo>
                    <TransactionType>
                      Sent {formatAmount(transaction.sent_amount, transaction.sent_currency)} to {transaction.receiver_email}
                    </TransactionType>
                    <TransactionDate>
                      {formatDate(transaction.timestamp)}
                    </TransactionDate>
                  </TransactionInfo>
                  <TransactionAmount>
                    <TransactionAmountValue>
                      +{formatAmount(transaction.received_amount, transaction.received_currency)}
                    </TransactionAmountValue>
                    <TransactionRate>
                      Rate: {transaction.rate.toFixed(4)}
                    </TransactionRate>
                  </TransactionAmount>
                </TransactionItem>
              ))
            ) : (
              <EmptyState>
                <Star size={48} style={{ margin: '0 auto 1rem', opacity: 0.5 }} />
                <p>No transactions yet</p>
                <p style={{ fontSize: '0.9rem', marginTop: '0.5rem' }}>
                  Start your first conversion to see it here
                </p>
              </EmptyState>
            )}
          </TransactionsList>
        </RecentTransactionsSection>
      </DashboardContent>
    </DashboardContainer>
  );
}
