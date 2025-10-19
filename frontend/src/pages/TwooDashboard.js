import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useAuth } from '../contexts/AuthContext';
import { userAPI, transactionAPI } from '../services/api';
import toast from 'react-hot-toast';
import QuickConverter from '../components/QuickConverter';

const DashboardContainer = styled.div`
  min-height: 100vh;
  background: ${props => props.theme.colors.background};
  padding-top: 100px; /* Account for fixed header */
`;

const DashboardContent = styled.div`
  max-width: ${props => props.theme.layout.maxWidth};
  margin: 0 auto;
  padding: ${props => props.theme.spacing.section} ${props => props.theme.layout.containerPadding};
`;

const WelcomeSection = styled.section`
  margin-bottom: ${props => props.theme.spacing.xxxl};
`;

const WelcomeTitle = styled.h1`
  font-size: ${props => props.theme.typography.h1.fontSize};
  line-height: ${props => props.theme.typography.h1.lineHeight};
  letter-spacing: ${props => props.theme.typography.h1.letterSpacing};
  font-weight: ${props => props.theme.typography.h1.fontWeight};
  color: ${props => props.theme.colors.text};
  margin-bottom: ${props => props.theme.spacing.md};
`;

const WelcomeSubtitle = styled.p`
  font-size: ${props => props.theme.typography.bodyBig.fontSize};
  line-height: ${props => props.theme.typography.bodyBig.lineHeight};
  letter-spacing: ${props => props.theme.typography.bodyBig.letterSpacing};
  color: ${props => props.theme.colors.textSecondary};
  margin-bottom: ${props => props.theme.spacing.xl};
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: ${props => props.theme.spacing.xl};
  margin-bottom: ${props => props.theme.spacing.xxxl};
  
  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    grid-template-columns: 1fr;
    gap: ${props => props.theme.spacing.lg};
  }
`;

const StatCard = styled.div`
  background: ${props => props.theme.colors.background};
  border: 1px solid ${props => props.theme.colors.border};
  padding: ${props => props.theme.spacing.xl};
  border-radius: ${props => props.theme.borderRadius.none};
  transition: ${props => props.theme.transitions.normal};
  
  &:hover {
    border-color: ${props => props.theme.colors.accent};
    background: ${props => props.theme.colors.spaceAccent};
  }
`;

const StatTitle = styled.h3`
  font-size: ${props => props.theme.typography.h3.fontSize};
  line-height: ${props => props.theme.typography.h3.lineHeight};
  letter-spacing: ${props => props.theme.typography.h3.letterSpacing};
  font-weight: ${props => props.theme.typography.h3.fontWeight};
  color: ${props => props.theme.colors.text};
  margin-bottom: ${props => props.theme.spacing.sm};
`;

const StatValue = styled.div`
  font-size: 2rem;
  font-weight: ${props => props.theme.fonts.weights.bold};
  color: ${props => props.theme.colors.text};
  margin-bottom: ${props => props.theme.spacing.xs};
`;

const StatDescription = styled.p`
  font-size: ${props => props.theme.typography.body.fontSize};
  line-height: ${props => props.theme.typography.body.lineHeight};
  letter-spacing: ${props => props.theme.typography.body.letterSpacing};
  color: ${props => props.theme.colors.textSecondary};
`;

const SectionTitle = styled.h2`
  font-size: ${props => props.theme.typography.h2.fontSize};
  line-height: ${props => props.theme.typography.h2.lineHeight};
  letter-spacing: ${props => props.theme.typography.h2.letterSpacing};
  font-weight: ${props => props.theme.typography.h2.fontWeight};
  color: ${props => props.theme.colors.text};
  margin-bottom: ${props => props.theme.spacing.xl};
`;

const ConverterSection = styled.section`
  margin-bottom: ${props => props.theme.spacing.xxxl};
`;

const RecentTransactions = styled.section`
  margin-bottom: ${props => props.theme.spacing.xxxl};
`;

const TransactionList = styled.div`
  background: ${props => props.theme.colors.background};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius.none};
  overflow: hidden;
`;

const TransactionItem = styled.div`
  padding: ${props => props.theme.spacing.lg};
  border-bottom: 1px solid ${props => props.theme.colors.borderLight};
  
  &:last-child {
    border-bottom: none;
  }
  
  &:hover {
    background: ${props => props.theme.colors.spaceAccent};
  }
`;

const TransactionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${props => props.theme.spacing.sm};
`;

const TransactionType = styled.span`
  font-size: ${props => props.theme.typography.body.fontSize};
  font-weight: ${props => props.theme.fonts.weights.medium};
  color: ${props => props.theme.colors.text};
`;

const TransactionAmount = styled.span`
  font-size: ${props => props.theme.typography.body.fontSize};
  font-weight: ${props => props.theme.fonts.weights.medium};
  color: ${props => props.theme.colors.text};
`;

const TransactionDetails = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const TransactionRate = styled.span`
  font-size: ${props => props.theme.typography.body.fontSize};
  color: ${props => props.theme.colors.textSecondary};
`;

const TransactionDate = styled.span`
  font-size: ${props => props.theme.typography.body.fontSize};
  color: ${props => props.theme.colors.textSecondary};
`;

const LoadingState = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: ${props => props.theme.spacing.xxxl};
  color: ${props => props.theme.colors.textSecondary};
`;

const ErrorState = styled.div`
  background: ${props => props.theme.colors.background};
  border: 1px solid ${props => props.theme.colors.border};
  padding: ${props => props.theme.spacing.xl};
  border-radius: ${props => props.theme.borderRadius.none};
  color: ${props => props.theme.colors.textSecondary};
  text-align: center;
`;

const TwooDashboard = () => {
  const { currentUser } = useAuth();
  const [userProfile, setUserProfile] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadDashboardData = React.useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      if (!currentUser) {
        throw new Error('User not authenticated');
      }

      // Get authentication token
      const token = await currentUser.getIdToken();

      // Load user profile
      const profile = await userAPI.getUserProfile(token);
      setUserProfile(profile);

      // Load transaction history
      const history = await transactionAPI.getTransactionHistory(token);
      setTransactions(history.slice(0, 5)); // Show only recent 5 transactions

    } catch (err) {
      console.error('Dashboard data loading error:', err);
      setError('Failed to load dashboard data');
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  }, [currentUser]);

  useEffect(() => {
    if (currentUser) {
      loadDashboardData();
    }
  }, [currentUser, loadDashboardData]);

  if (loading) {
    return (
      <DashboardContainer>
        <DashboardContent>
          <LoadingState>Loading dashboard...</LoadingState>
        </DashboardContent>
      </DashboardContainer>
    );
  }

  if (error) {
    return (
      <DashboardContainer>
        <DashboardContent>
          <ErrorState>{error}</ErrorState>
        </DashboardContent>
      </DashboardContainer>
    );
  }

  return (
    <DashboardContainer>
      <DashboardContent>
        <WelcomeSection>
          <WelcomeTitle>
            Welcome back, {userProfile?.displayName || currentUser?.email}
          </WelcomeTitle>
          <WelcomeSubtitle>
            Manage your cross-currency transactions and track your financial activity.
          </WelcomeSubtitle>
        </WelcomeSection>

        <StatsGrid>
          <StatCard>
            <StatTitle>Total Transactions</StatTitle>
            <StatValue>{transactions.length}</StatValue>
            <StatDescription>All time transactions</StatDescription>
          </StatCard>
          
          <StatCard>
            <StatTitle>Active Currencies</StatTitle>
            <StatValue>12+</StatValue>
            <StatDescription>Supported currencies</StatDescription>
          </StatCard>
          
          <StatCard>
            <StatTitle>Exchange Methods</StatTitle>
            <StatValue>4</StatValue>
            <StatDescription>FX, CEX, DEX, Hybrid</StatDescription>
          </StatCard>
          
          <StatCard>
            <StatTitle>Success Rate</StatTitle>
            <StatValue>99.9%</StatValue>
            <StatDescription>Transaction success</StatDescription>
          </StatCard>
        </StatsGrid>

        <ConverterSection>
          <SectionTitle>Quick Convert</SectionTitle>
          <QuickConverter />
        </ConverterSection>

        <RecentTransactions>
          <SectionTitle>Recent Transactions</SectionTitle>
          {transactions.length > 0 ? (
            <TransactionList>
              {transactions.map((transaction, index) => (
                <TransactionItem key={index}>
                  <TransactionHeader>
                    <TransactionType>
                      {transaction.sentCurrency} → {transaction.receivedCurrency}
                    </TransactionType>
                    <TransactionAmount>
                      {transaction.sentAmount} {transaction.sentCurrency}
                    </TransactionAmount>
                  </TransactionHeader>
                  <TransactionDetails>
                    <TransactionRate>
                      Rate: {transaction.rate}
                    </TransactionRate>
                    <TransactionDate>
                      {new Date(transaction.timestamp).toLocaleDateString()}
                    </TransactionDate>
                  </TransactionDetails>
                </TransactionItem>
              ))}
            </TransactionList>
          ) : (
            <ErrorState>No recent transactions found.</ErrorState>
          )}
        </RecentTransactions>
      </DashboardContent>
    </DashboardContainer>
  );
};

export default TwooDashboard;
