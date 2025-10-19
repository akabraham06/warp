import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { 
  History, 
  ArrowUpRight, 
  ArrowDownLeft, 
  Calendar,
  RefreshCw,
  Filter,
  Download,
  Star
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { transactionAPI } from '../services/api';
import toast from 'react-hot-toast';

gsap.registerPlugin(ScrollTrigger);

const HistoryContainer = styled.div`
  min-height: 100vh;
  background: ${props => props.theme.colors.background};
  padding-top: 70px; /* Account for fixed header */
`;

const HistoryContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: ${props => props.theme.spacing.xl} ${props => props.theme.spacing.md};
`;

const Header = styled.div`
  margin-bottom: ${props => props.theme.spacing.xxl};
`;

const Title = styled.h1`
  font-size: clamp(2rem, 4vw, 3rem);
  font-weight: ${props => props.theme.fonts.weights.bold};
  color: ${props => props.theme.colors.text};
  margin-bottom: ${props => props.theme.spacing.sm};
  background: ${props => props.theme.colors.gradient.primary};
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.sm};
`;

const Subtitle = styled.p`
  font-size: 1.2rem;
  color: ${props => props.theme.colors.textSecondary};
  margin-bottom: ${props => props.theme.spacing.lg};
`;

const Controls = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${props => props.theme.spacing.lg};
  flex-wrap: wrap;
  gap: ${props => props.theme.spacing.md};

  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    flex-direction: column;
    align-items: stretch;
  }
`;

const FilterGroup = styled.div`
  display: flex;
  gap: ${props => props.theme.spacing.sm};
  align-items: center;
`;

const FilterSelect = styled.select`
  padding: ${props => props.theme.spacing.sm} ${props => props.theme.spacing.md};
  background: ${props => props.theme.colors.surface};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius.md};
  color: ${props => props.theme.colors.text};
  font-size: 0.9rem;
  cursor: pointer;

  &:focus {
    border-color: ${props => props.theme.colors.primary};
    box-shadow: 0 0 0 3px rgba(79, 172, 254, 0.1);
  }
`;

const ActionButton = styled.button`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.sm};
  padding: ${props => props.theme.spacing.sm} ${props => props.theme.spacing.md};
  background: ${props => props.theme.colors.surface};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius.md};
  color: ${props => props.theme.colors.text};
  font-size: 0.9rem;
  cursor: pointer;
  transition: all ${props => props.theme.transitions.fast};

  &:hover {
    border-color: ${props => props.theme.colors.primary};
    background: rgba(79, 172, 254, 0.1);
  }

  &.primary {
    background: ${props => props.theme.colors.gradient.primary};
    color: white;
    border-color: transparent;

    &:hover {
      transform: translateY(-2px);
      box-shadow: ${props => props.theme.shadows.glow};
    }
  }
`;

const TransactionsTable = styled.div`
  background: ${props => props.theme.colors.surface};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius.lg};
  overflow: hidden;
  box-shadow: ${props => props.theme.shadows.md};
`;

const TableHeader = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1fr 1fr;
  gap: ${props => props.theme.spacing.md};
  padding: ${props => props.theme.spacing.lg};
  background: ${props => props.theme.colors.surfaceLight};
  border-bottom: 1px solid ${props => props.theme.colors.border};
  font-weight: ${props => props.theme.fonts.weights.semiBold};
  color: ${props => props.theme.colors.text};
  font-size: 0.9rem;

  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    display: none;
  }
`;

const TransactionRow = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1fr 1fr;
  gap: ${props => props.theme.spacing.md};
  padding: ${props => props.theme.spacing.lg};
  border-bottom: 1px solid ${props => props.theme.colors.borderLight};
  transition: all ${props => props.theme.transitions.fast};
  cursor: pointer;

  &:hover {
    background: rgba(79, 172, 254, 0.05);
  }

  &:last-child {
    border-bottom: none;
  }

  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    display: block;
    padding: ${props => props.theme.spacing.md};
  }
`;

const TransactionInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${props => props.theme.spacing.xs};

  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    margin-bottom: ${props => props.theme.spacing.sm};
  }
`;

const TransactionType = styled.div`
  font-weight: ${props => props.theme.fonts.weights.medium};
  color: ${props => props.theme.colors.text};
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.sm};
`;

const TransactionDetails = styled.div`
  font-size: 0.9rem;
  color: ${props => props.theme.colors.textSecondary};
`;

const TransactionAmount = styled.div`
  text-align: right;
  font-weight: ${props => props.theme.fonts.weights.semiBold};
  color: ${props => props.theme.colors.text};

  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    text-align: left;
    margin-bottom: ${props => props.theme.spacing.sm};
  }
`;

const TransactionRate = styled.div`
  text-align: right;
  font-size: 0.9rem;
  color: ${props => props.theme.colors.textSecondary};

  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    text-align: left;
    margin-bottom: ${props => props.theme.spacing.sm};
  }
`;

const TransactionDate = styled.div`
  text-align: right;
  font-size: 0.9rem;
  color: ${props => props.theme.colors.textSecondary};
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: ${props => props.theme.spacing.xs};

  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    text-align: left;
    justify-content: flex-start;
  }
`;

const TransactionStatus = styled.div`
  text-align: right;
  font-size: 0.9rem;
  font-weight: ${props => props.theme.fonts.weights.medium};

  &.completed {
    color: ${props => props.theme.colors.success};
  }

  &.pending {
    color: ${props => props.theme.colors.warning};
  }

  &.failed {
    color: ${props => props.theme.colors.error};
  }

  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    text-align: left;
  }
`;

const LoadingState = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: ${props => props.theme.spacing.xxl};
  color: ${props => props.theme.colors.textMuted};
`;

const EmptyState = styled.div`
  text-align: center;
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

const StatsCards = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: ${props => props.theme.spacing.lg};
  margin-bottom: ${props => props.theme.spacing.xxl};
`;

const StatCard = styled.div`
  background: ${props => props.theme.colors.surface};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius.lg};
  padding: ${props => props.theme.spacing.lg};
  text-align: center;
  transition: all ${props => props.theme.transitions.normal};

  &:hover {
    transform: translateY(-3px);
    box-shadow: ${props => props.theme.shadows.md};
    border-color: ${props => props.theme.colors.primary};
  }
`;

const StatValue = styled.div`
  font-size: 2rem;
  font-weight: ${props => props.theme.fonts.weights.bold};
  color: ${props => props.theme.colors.primary};
  margin-bottom: ${props => props.theme.spacing.sm};
`;

const StatLabel = styled.div`
  color: ${props => props.theme.colors.textSecondary};
  font-size: 0.9rem;
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

export default function TransactionHistory() {
  const { getIdToken } = useAuth();
  const [transactions, setTransactions] = useState([]);
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('all');
  const [sortBy, setSortBy] = useState('date');

  useEffect(() => {
    loadTransactions();
  }, []);

  useEffect(() => {
    filterTransactions();
  }, [transactions, filter, sortBy]);

  const loadTransactions = async () => {
    setLoading(true);
    setError('');

    try {
      const token = await getIdToken();
      if (!token) {
        throw new Error('Authentication required');
      }

      const data = await transactionAPI.getTransactionHistory(token);
      setTransactions(data);
    } catch (error) {
      setError(error.message);
      toast.error('Failed to load transaction history');
    } finally {
      setLoading(false);
    }
  };

  const filterTransactions = () => {
    let filtered = [...transactions];

    // Apply filter
    if (filter !== 'all') {
      filtered = filtered.filter(transaction => {
        switch (filter) {
          case 'sent':
            return transaction.sent_currency.toLowerCase() === 'usd';
          case 'received':
            return transaction.received_currency.toLowerCase() === 'usd';
          default:
            return true;
        }
      });
    }

    // Apply sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'date':
          return new Date(b.timestamp) - new Date(a.timestamp);
        case 'amount':
          return b.sent_amount - a.sent_amount;
        case 'rate':
          return b.rate - a.rate;
        default:
          return 0;
      }
    });

    setFilteredTransactions(filtered);
  };

  const formatAmount = (amount, currency) => {
    const symbol = currencySymbols[currency.toLowerCase()] || currency.toUpperCase();
    return `${symbol}${amount.toFixed(2)}`;
  };

  const formatDate = (timestamp) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getTransactionStats = () => {
    const totalTransactions = transactions.length;
    const totalSent = transactions.reduce((sum, t) => sum + t.sent_amount, 0);
    const totalReceived = transactions.reduce((sum, t) => sum + t.received_amount, 0);
    const avgRate = transactions.length > 0 
      ? transactions.reduce((sum, t) => sum + t.rate, 0) / transactions.length 
      : 0;

    return { totalTransactions, totalSent, totalReceived, avgRate };
  };

  const exportTransactions = () => {
    const csvContent = [
      ['Date', 'Type', 'Sent Amount', 'Received Amount', 'Rate', 'Status'],
      ...filteredTransactions.map(t => [
        formatDate(t.timestamp),
        `${t.sent_currency} → ${t.received_currency}`,
        formatAmount(t.sent_amount, t.sent_currency),
        formatAmount(t.received_amount, t.received_currency),
        t.rate.toFixed(4),
        'Completed'
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `flux-transactions-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const stats = getTransactionStats();

  if (loading) {
    return (
      <HistoryContainer>
        <HistoryContent>
          <LoadingState>
            <RefreshCw size={24} className="animate-spin" />
            Loading transaction history...
          </LoadingState>
        </HistoryContent>
      </HistoryContainer>
    );
  }

  if (error) {
    return (
      <HistoryContainer>
        <HistoryContent>
          <ErrorState>
            {error}
            <ActionButton onClick={loadTransactions} style={{ marginTop: '1rem' }}>
              <RefreshCw size={16} />
              Retry
            </ActionButton>
          </ErrorState>
        </HistoryContent>
      </HistoryContainer>
    );
  }

  return (
    <HistoryContainer>
      <HistoryContent>
        <Header>
          <Title>
            <History size={32} />
            Transaction History
          </Title>
          <Subtitle>
            View all your cross-currency transactions and rates
          </Subtitle>
        </Header>

        <StatsCards>
          <StatCard>
            <StatValue>{stats.totalTransactions}</StatValue>
            <StatLabel>Total Transactions</StatLabel>
          </StatCard>
          <StatCard>
            <StatValue>{formatAmount(stats.totalSent, 'USD')}</StatValue>
            <StatLabel>Total Sent</StatLabel>
          </StatCard>
          <StatCard>
            <StatValue>{formatAmount(stats.totalReceived, 'USD')}</StatValue>
            <StatLabel>Total Received</StatLabel>
          </StatCard>
          <StatCard>
            <StatValue>{stats.avgRate.toFixed(4)}</StatValue>
            <StatLabel>Average Rate</StatLabel>
          </StatCard>
        </StatsCards>

        <Controls>
          <FilterGroup>
            <Filter size={20} />
            <FilterSelect value={filter} onChange={(e) => setFilter(e.target.value)}>
              <option value="all">All Transactions</option>
              <option value="sent">Sent USD</option>
              <option value="received">Received USD</option>
            </FilterSelect>
            <FilterSelect value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
              <option value="date">Sort by Date</option>
              <option value="amount">Sort by Amount</option>
              <option value="rate">Sort by Rate</option>
            </FilterSelect>
          </FilterGroup>
          <ActionButton onClick={exportTransactions}>
            <Download size={16} />
            Export CSV
          </ActionButton>
        </Controls>

        <TransactionsTable>
          <TableHeader>
            <div>Transaction</div>
            <div>Sent</div>
            <div>Received</div>
            <div>Rate</div>
            <div>Date</div>
          </TableHeader>

          {filteredTransactions.length > 0 ? (
            filteredTransactions.map((transaction) => (
              <TransactionRow key={transaction.transaction_id}>
                <TransactionInfo>
                  <TransactionType>
                    <ArrowUpRight size={16} color="#4facfe" />
                    {transaction.sent_currency} → {transaction.received_currency}
                  </TransactionType>
                  <TransactionDetails>
                    To: {transaction.receiver_email}
                  </TransactionDetails>
                </TransactionInfo>
                <TransactionAmount>
                  {formatAmount(transaction.sent_amount, transaction.sent_currency)}
                </TransactionAmount>
                <TransactionAmount>
                  {formatAmount(transaction.received_amount, transaction.received_currency)}
                </TransactionAmount>
                <TransactionRate>
                  {transaction.rate.toFixed(4)}
                </TransactionRate>
                <TransactionDate>
                  <Calendar size={14} />
                  {formatDate(transaction.timestamp)}
                </TransactionDate>
              </TransactionRow>
            ))
          ) : (
            <EmptyState>
              <Star size={48} style={{ margin: '0 auto 1rem', opacity: 0.5 }} />
              <p>No transactions found</p>
              <p style={{ fontSize: '0.9rem', marginTop: '0.5rem' }}>
                {filter === 'all' 
                  ? 'Start your first conversion to see it here'
                  : 'No transactions match your current filter'
                }
              </p>
            </EmptyState>
          )}
        </TransactionsTable>
      </HistoryContent>
    </HistoryContainer>
  );
}
