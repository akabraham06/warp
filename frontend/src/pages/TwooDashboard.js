import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { transactionAPI } from '../services/api';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../config/firebase';
import toast from 'react-hot-toast';
import QuickConverter from '../components/QuickConverter';

const DashboardContainer = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: ${props => props.theme.colors.background};
`;

const TopNav = styled.nav`
  position: sticky;
  top: 0;
  z-index: 30;
  background: ${props => props.theme.colors.background};
  border-bottom: 1px solid ${props => props.theme.colors.borderLight};
  box-shadow: 0 4px 18px rgba(0, 0, 0, 0.05);
`;

const NavInner = styled.div`
  width: 100%;
  max-width: ${props => props.theme.layout.maxWidth};
  margin: 0 auto;
  padding: ${props => props.theme.spacing.md} ${props => props.theme.layout.containerPadding};
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${props => props.theme.spacing.lg};

  @media (max-width: ${props => props.theme.breakpoints.tablet}) {
    flex-wrap: wrap;
    gap: ${props => props.theme.spacing.md};
  }
`;

const NavBrand = styled.div`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.sm};
  font-size: 1.1rem;
  font-weight: ${props => props.theme.fonts.weights.semiBold};
  color: ${props => props.theme.colors.text};
`;

const NavAccent = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0 ${props => props.theme.spacing.xs};
  font-size: 0.75rem;
  font-weight: ${props => props.theme.fonts.weights.bold};
  background: ${props => props.theme.colors.text};
  color: ${props => props.theme.colors.background};
  border-radius: ${props => props.theme.borderRadius.sm};
`;

const NavLinks = styled.div`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.sm};
  flex-wrap: wrap;
`;

const NavLinkButton = styled.button`
  background: transparent;
  border: none;
  padding: ${props => props.theme.spacing.xs} ${props => props.theme.spacing.sm};
  font-size: 0.9rem;
  font-weight: ${props => props.theme.fonts.weights.medium};
  color: ${props => props.theme.colors.textSecondary};
  cursor: pointer;
  border-radius: ${props => props.theme.borderRadius.sm};
  transition: color ${props => props.theme.transitions.fast}, background ${props => props.theme.transitions.fast};

  &:hover,
  &:focus-visible {
    color: ${props => props.theme.colors.text};
    background: ${props => props.theme.colors.spaceAccent};
  }
`;

const NavLogoutButton = styled(NavLinkButton)`
  color: ${props => props.theme.colors.text};
  border: 1px solid ${props => props.theme.colors.borderLight};
  padding: ${props => props.theme.spacing.xs} ${props => props.theme.spacing.md};

  &:hover,
  &:focus-visible {
    background: ${props => props.theme.colors.text};
    color: ${props => props.theme.colors.background};
  }
`;

const NavUser = styled.div`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.sm};
`;

const UserAvatar = styled.div`
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: ${props => props.theme.colors.text};
  color: ${props => props.theme.colors.background};
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: ${props => props.theme.fonts.weights.semiBold};
  font-size: 0.95rem;
`;

const NavUserInfo = styled.div`
  display: flex;
  flex-direction: column;
  line-height: 1.2;
`;

const NavUserName = styled.span`
  font-size: 0.9rem;
  font-weight: ${props => props.theme.fonts.weights.semiBold};
  color: ${props => props.theme.colors.text};
`;

const NavUserEmail = styled.span`
  font-size: 0.75rem;
  color: ${props => props.theme.colors.textSecondary};
`;

const DashboardContent = styled.div`
  flex: 1;
  width: 100%;
  max-width: ${props => props.theme.layout.maxWidth};
  margin: 0 auto;
  padding: ${props => props.theme.spacing.xl} ${props => props.theme.layout.containerPadding} ${props => props.theme.spacing.xxxl};
  display: flex;
  flex-direction: column;
  gap: ${props => props.theme.spacing.xl};

  @media (max-width: ${props => props.theme.breakpoints.tablet}) {
    padding: ${props => props.theme.spacing.lg} ${props => props.theme.spacing.lg} ${props => props.theme.spacing.xxxl};
  }
`;

const WelcomeSection = styled.section`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: flex-start;
  gap: ${props => props.theme.spacing.lg};
`;

const WelcomeText = styled.div`
  flex: 1;
  min-width: 260px;
`;

const WelcomeTitle = styled.h1`
  font-size: clamp(28px, 3vw, 36px);
  line-height: 1.15;
  letter-spacing: -0.5px;
  font-weight: ${props => props.theme.fonts.weights.semiBold};
  color: ${props => props.theme.colors.text};
  margin-bottom: ${props => props.theme.spacing.sm};
`;

const WelcomeSubtitle = styled.p`
  font-size: 0.95rem;
  line-height: 1.5;
  color: ${props => props.theme.colors.textSecondary};
  max-width: 520px;
`;

const WelcomeMeta = styled.div`
  display: grid;
  gap: ${props => props.theme.spacing.sm};
  min-width: 220px;
`;

const MetaItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${props => props.theme.spacing.xs};
  padding: ${props => props.theme.spacing.sm};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius.md};
  background: ${props => props.theme.colors.surface};
`;

const MetaLabel = styled.span`
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: ${props => props.theme.colors.textSecondary};
`;

const MetaValue = styled.span`
  font-size: 0.95rem;
  font-weight: ${props => props.theme.fonts.weights.medium};
  color: ${props => props.theme.colors.text};
`;

const MainGrid = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 2fr) minmax(0, 1fr);
  gap: ${props => props.theme.spacing.xl};
  align-items: stretch;

  @media (max-width: ${props => props.theme.breakpoints.tablet}) {
    grid-template-columns: 1fr;
  }
`;

const Column = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${props => props.theme.spacing.xl};
  min-height: 0;
`;

const Card = styled.section`
  background: ${props => props.theme.colors.surface};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius.md};
  padding: ${props => props.theme.spacing.lg};
  display: flex;
  flex-direction: column;
  gap: ${props => props.theme.spacing.md};
  min-height: 0;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.04);
`;

const CardHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${props => props.theme.spacing.sm};
`;

const CardTitle = styled.h3`
  margin: 0;
  font-size: 1rem;
  font-weight: ${props => props.theme.fonts.weights.semiBold};
  color: ${props => props.theme.colors.text};
`;

const CardSubtitle = styled.span`
  font-size: 0.8rem;
  color: ${props => props.theme.colors.textSecondary};
`;

const QuickConverterWrapper = styled.div`
  flex: 1;
  min-height: 0;
  max-height: 560px;
  overflow-y: auto;
  padding-right: 4px;
`;

const BalanceGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
  gap: ${props => props.theme.spacing.md};
`;

const BalanceCard = styled.div`
  border: 1px solid ${props => props.theme.colors.borderLight};
  border-radius: ${props => props.theme.borderRadius.md};
  padding: ${props => props.theme.spacing.md};
  background: ${props => props.theme.colors.background};
  display: flex;
  flex-direction: column;
  gap: ${props => props.theme.spacing.xs};
`;

const BalanceCurrency = styled.div`
  font-size: 0.85rem;
  font-weight: ${props => props.theme.fonts.weights.medium};
  color: ${props => props.theme.colors.textSecondary};
  text-transform: uppercase;
  letter-spacing: 0.08em;
`;

const BalanceAmount = styled.div`
  font-size: 1.4rem;
  font-weight: ${props => props.theme.fonts.weights.bold};
  color: ${props => props.theme.colors.text};
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
  gap: ${props => props.theme.spacing.md};
`;

const StatCard = styled.div`
  border: 1px solid ${props => props.theme.colors.borderLight};
  border-radius: ${props => props.theme.borderRadius.md};
  padding: ${props => props.theme.spacing.md};
  background: ${props => props.theme.colors.background};
  display: flex;
  flex-direction: column;
  gap: ${props => props.theme.spacing.xs};
`;

const StatTitle = styled.span`
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: ${props => props.theme.colors.textSecondary};
`;

const StatValue = styled.div`
  font-size: 1.6rem;
  font-weight: ${props => props.theme.fonts.weights.bold};
  color: ${props => props.theme.colors.text};
`;

const StatDescription = styled.span`
  font-size: 0.8rem;
  color: ${props => props.theme.colors.textSecondary};
`;

const TransactionList = styled.div`
  flex: 1;
  border: 1px solid ${props => props.theme.colors.borderLight};
  border-radius: ${props => props.theme.borderRadius.md};
  background: ${props => props.theme.colors.background};
  max-height: 360px;
  overflow-y: auto;
`;

const TransactionItem = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  gap: ${props => props.theme.spacing.sm};
  padding: ${props => props.theme.spacing.md};
  border-bottom: 1px solid ${props => props.theme.colors.borderLight};

  &:last-child {
    border-bottom: none;
  }

  &:hover {
    background: ${props => props.theme.colors.spaceAccent};
  }

  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    grid-template-columns: 1fr;
  }
`;

const TransactionHeader = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${props => props.theme.spacing.xs};
`;

const TransactionType = styled.span`
  font-size: 0.9rem;
  font-weight: ${props => props.theme.fonts.weights.semiBold};
  color: ${props => props.theme.colors.text};
`;

const TransactionAmount = styled.span`
  font-size: 0.85rem;
  color: ${props => props.theme.colors.textSecondary};
`;

const TransactionDetails = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  justify-content: center;
  gap: ${props => props.theme.spacing.xs};
  font-size: 0.8rem;
  color: ${props => props.theme.colors.textSecondary};

  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    align-items: flex-start;
  }
`;

const TransactionMeta = styled.span`
  font-size: 0.8rem;
  color: inherit;
`;

const LoadingState = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: ${props => props.theme.spacing.xxxl};
  color: ${props => props.theme.colors.textSecondary};
`;

const ErrorState = styled.div`
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius.md};
  padding: ${props => props.theme.spacing.lg};
  color: ${props => props.theme.colors.textSecondary};
  text-align: center;
  background: ${props => props.theme.colors.surface};
`;

const TwooDashboard = () => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const [userProfile, setUserProfile] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const overviewRef = useRef(null);
  const convertRef = useRef(null);
  const balancesRef = useRef(null);
  const historyRef = useRef(null);

  const loadDashboardData = React.useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      if (!currentUser) {
        throw new Error('User not authenticated');
      }

      // Fetch user data from Firestore
      const userDocRef = doc(db, 'users', currentUser.uid);
      const userDoc = await getDoc(userDocRef);
      
      if (userDoc.exists()) {
        const userData = userDoc.data();
        setUserProfile({
          ...userData,
          createdAt: userData.createdAt?.toDate?.() || new Date(userData.createdAt)
        });
      } else {
        // Fallback to currentUser data
        setUserProfile({
          displayName: currentUser.displayName || 'User',
          email: currentUser.email,
          createdAt: new Date()
        });
      }

      // Try to load transaction history from backend
      try {
        const token = await currentUser.getIdToken();
        const history = await transactionAPI.getTransactionHistory(token);
        setTransactions(history.slice(0, 5)); // Show only recent 5 transactions
      } catch (apiError) {
        console.warn('Backend API unavailable, using mock transaction data:', apiError);
        
        // Mock transaction data
        setTransactions([
          {
            sentCurrency: 'USD',
            receivedCurrency: 'MXN',
            sentAmount: 100,
            rate: 17.45,
            timestamp: new Date(Date.now() - 86400000).toISOString()
          },
          {
            sentCurrency: 'EUR',
            receivedCurrency: 'USD',
            sentAmount: 50,
            rate: 1.08,
            timestamp: new Date(Date.now() - 172800000).toISOString()
          }
        ]);
      }

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

  const displayName = userProfile?.displayName || currentUser?.displayName || currentUser?.email || 'User';
  const email = userProfile?.email || currentUser?.email || '—';
  const initials = (displayName || email || 'U')
    .split(' ')
    .map(part => part.charAt(0))
    .join('')
    .slice(0, 2)
    .toUpperCase() || 'U';
  const createdAt = userProfile?.createdAt ? new Date(userProfile.createdAt) : null;
  const totalCurrencies = userProfile?.balances ? Object.keys(userProfile.balances).length : 0;
  const activeBalanceCount = userProfile?.balances
    ? Object.values(userProfile.balances).filter(amount => amount > 0).length
    : 0;

  const statsData = [
    {
      title: 'Total Transactions',
      value: transactions.length,
      description: 'All time transactions',
    },
    {
      title: 'Active Currencies',
      value: totalCurrencies || '12+',
      description: 'Wallet currencies tracked',
    },
    {
      title: 'Exchange Methods',
      value: '4',
      description: 'FX, CEX, DEX, Hybrid',
    },
    {
      title: 'Success Rate',
      value: '99.9%',
      description: 'Transaction success',
    },
  ];

  const scrollToSection = React.useCallback((ref) => {
    if (ref?.current) {
      ref.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, []);

  const renderTopNav = () => (
    <TopNav>
      <NavInner>
        <NavBrand>
          Warp
          <NavAccent>Dashboard</NavAccent>
        </NavBrand>
        <NavLinks>
          <NavLinkButton onClick={() => navigate('/')}>Home</NavLinkButton>
          <NavLinkButton onClick={() => scrollToSection(overviewRef)}>Overview</NavLinkButton>
          <NavLinkButton onClick={() => scrollToSection(convertRef)}>Convert</NavLinkButton>
          <NavLinkButton onClick={() => scrollToSection(balancesRef)}>Balances</NavLinkButton>
          <NavLinkButton onClick={() => scrollToSection(historyRef)}>History</NavLinkButton>
        </NavLinks>
        <NavUser>
          <UserAvatar>{initials}</UserAvatar>
          <NavUserInfo>
            <NavUserName>{displayName}</NavUserName>
            <NavUserEmail>{email}</NavUserEmail>
          </NavUserInfo>
          <NavLogoutButton
            onClick={async () => {
              try {
                await logout();
                navigate('/');
              } catch (err) {
                toast.error('Failed to log out');
              }
            }}
          >
            Logout
          </NavLogoutButton>
        </NavUser>
      </NavInner>
    </TopNav>
  );

  if (loading) {
    return (
      <DashboardContainer>
        {renderTopNav()}
        <DashboardContent>
          <LoadingState>Loading dashboard...</LoadingState>
        </DashboardContent>
      </DashboardContainer>
    );
  }

  if (error) {
    return (
      <DashboardContainer>
        {renderTopNav()}
        <DashboardContent>
          <ErrorState>{error}</ErrorState>
        </DashboardContent>
      </DashboardContainer>
    );
  }

  return (
    <DashboardContainer>
      {renderTopNav()}
      <DashboardContent>
        <WelcomeSection ref={overviewRef}>
          <WelcomeText>
            <WelcomeTitle>Welcome back, {displayName}</WelcomeTitle>
            <WelcomeSubtitle>
              Manage your cross-currency transactions and track your financial activity.
            </WelcomeSubtitle>
          </WelcomeText>
          <WelcomeMeta>
            <MetaItem>
              <MetaLabel>Account Email</MetaLabel>
              <MetaValue>{email}</MetaValue>
            </MetaItem>
            {createdAt && (
              <MetaItem>
                <MetaLabel>Member Since</MetaLabel>
                <MetaValue>{createdAt.toLocaleDateString()}</MetaValue>
              </MetaItem>
            )}
            <MetaItem>
              <MetaLabel>Active Balances</MetaLabel>
              <MetaValue>{activeBalanceCount || '—'}</MetaValue>
            </MetaItem>
          </WelcomeMeta>
        </WelcomeSection>

        <MainGrid>
          <Column>
            <Card ref={convertRef}>
              <QuickConverterWrapper>
                <QuickConverter />
              </QuickConverterWrapper>
            </Card>

            <Card ref={historyRef}>
              <CardHeader>
                <div>
                  <CardTitle>Recent Transactions</CardTitle>
                  <CardSubtitle>Latest activity across your accounts</CardSubtitle>
                </div>
              </CardHeader>
              {transactions.length > 0 ? (
                <TransactionList>
                  {transactions.map((transaction, index) => {
                    const numericRate = Number(transaction.rate);

                    return (
                      <TransactionItem key={`${transaction.timestamp}-${index}`}>
                      <TransactionHeader>
                        <TransactionType>
                          {transaction.sentCurrency} → {transaction.receivedCurrency}
                        </TransactionType>
                        <TransactionAmount>
                          {transaction.sentAmount} {transaction.sentCurrency}
                        </TransactionAmount>
                      </TransactionHeader>
                      <TransactionDetails>
                        <TransactionMeta>
                          Rate: {Number.isFinite(numericRate) ? numericRate.toFixed(4) : transaction.rate}
                        </TransactionMeta>
                        <TransactionMeta>
                          {new Date(transaction.timestamp).toLocaleString()}
                        </TransactionMeta>
                      </TransactionDetails>
                      </TransactionItem>
                    );
                  })}
                </TransactionList>
              ) : (
                <ErrorState>No recent transactions found.</ErrorState>
              )}
            </Card>
          </Column>

          <Column>
            <Card ref={balancesRef}>
              <CardHeader>
                <div>
                  <CardTitle>Your Balances</CardTitle>
                  <CardSubtitle>Available currency reserves</CardSubtitle>
                </div>
              </CardHeader>
              {userProfile?.balances ? (
                <BalanceGrid>
                  {Object.entries(userProfile.balances).map(([currency, amount]) => (
                    <BalanceCard key={currency}>
                      <BalanceCurrency>{currency.toUpperCase()}</BalanceCurrency>
                      <BalanceAmount>{amount.toFixed(2)}</BalanceAmount>
                    </BalanceCard>
                  ))}
                </BalanceGrid>
              ) : (
                <ErrorState>No balances available.</ErrorState>
              )}
            </Card>

            <Card>
              <CardHeader>
                <div>
                  <CardTitle>Platform Insights</CardTitle>
                  <CardSubtitle>Operational coverage at a glance</CardSubtitle>
                </div>
              </CardHeader>
              <StatsGrid>
                {statsData.map(stat => (
                  <StatCard key={stat.title}>
                    <StatTitle>{stat.title}</StatTitle>
                    <StatValue>{stat.value}</StatValue>
                    <StatDescription>{stat.description}</StatDescription>
                  </StatCard>
                ))}
              </StatsGrid>
            </Card>
          </Column>
        </MainGrid>
      </DashboardContent>
    </DashboardContainer>
  );
};

export default TwooDashboard;
