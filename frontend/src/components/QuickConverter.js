import React, { useState } from 'react';
import styled from 'styled-components';
import { ArrowRight, Loader, CheckCircle, AlertCircle, Zap } from 'lucide-react';
import { quoteAPI, transactionAPI } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';

const QuickConverterContainer = styled.div`
  background: ${props => props.theme.colors.surface};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius.lg};
  padding: ${props => props.theme.spacing.xl};
  margin-bottom: ${props => props.theme.spacing.xl};
`;

const Title = styled.h3`
  font-size: 1.5rem;
  font-weight: ${props => props.theme.fonts.weights.semiBold};
  color: ${props => props.theme.colors.text};
  margin-bottom: ${props => props.theme.spacing.lg};
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.sm};
`;

const InputRow = styled.div`
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  gap: ${props => props.theme.spacing.md};
  align-items: end;
  margin-bottom: ${props => props.theme.spacing.lg};

  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    grid-template-columns: 1fr;
    gap: ${props => props.theme.spacing.sm};
  }
`;

const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${props => props.theme.spacing.xs};
`;

const Label = styled.label`
  font-size: 0.8rem;
  font-weight: ${props => props.theme.fonts.weights.medium};
  color: ${props => props.theme.colors.textSecondary};
  text-transform: uppercase;
  letter-spacing: 0.05em;
`;

const AmountInput = styled.input`
  background: ${props => props.theme.colors.surfaceLight};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius.md};
  padding: ${props => props.theme.spacing.md};
  font-size: 1.2rem;
  font-weight: ${props => props.theme.fonts.weights.semiBold};
  color: ${props => props.theme.colors.text};
  transition: all ${props => props.theme.transitions.fast};

  &:focus {
    border-color: ${props => props.theme.colors.primary};
    box-shadow: 0 0 0 3px rgba(255, 255, 255, 0.1);
  }
`;

const CurrencySelect = styled.select`
  background: ${props => props.theme.colors.surfaceLight};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius.md};
  padding: ${props => props.theme.spacing.md};
  font-size: 1rem;
  font-weight: ${props => props.theme.fonts.weights.medium};
  color: ${props => props.theme.colors.text};
  cursor: pointer;
  transition: all ${props => props.theme.transitions.fast};

  &:focus {
    border-color: ${props => props.theme.colors.primary};
    box-shadow: 0 0 0 3px rgba(255, 255, 255, 0.1);
  }
`;

const RouteSummary = styled.div`
  background: ${props => props.theme.colors.surface};
  border-radius: ${props => props.theme.borderRadius.md};
  padding: ${props => props.theme.spacing.md};
  margin-top: ${props => props.theme.spacing.md};
`;

const RouteSummaryLabel = styled.span`
  display: block;
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: ${props => props.theme.colors.textSecondary};
  margin-bottom: ${props => props.theme.spacing.xs};
`;

const RouteSummaryValue = styled.span`
  font-size: 0.95rem;
  font-weight: ${props => props.theme.fonts.weights.semiBold};
  color: ${props => props.theme.colors.text};
`;

const RouteAnalysis = styled.div`
  margin-top: ${props => props.theme.spacing.lg};
  display: flex;
  flex-direction: column;
  gap: ${props => props.theme.spacing.sm};
`;

const RouteAnalysisTitle = styled.h4`
  font-size: 0.95rem;
  font-weight: ${props => props.theme.fonts.weights.semiBold};
  color: ${props => props.theme.colors.text};
  margin: 0;
`;

const RouteList = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${props => props.theme.spacing.sm};
`;

const RouteItem = styled.div`
  border: 1px solid ${props => props.$isBest ? props.theme.colors.primary : props.theme.colors.borderLight};
  background: ${props => props.$isBest ? props.theme.colors.surface : props.theme.colors.background};
  border-radius: ${props => props.theme.borderRadius.md};
  padding: ${props => props.theme.spacing.md};
  display: grid;
  grid-template-columns: minmax(0, 1.6fr) minmax(0, 1fr) minmax(0, 1fr);
  gap: ${props => props.theme.spacing.md};
  align-items: center;

  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    grid-template-columns: 1fr;
  }
`;

const RouteInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${props => props.theme.spacing.xs};
`;

const RouteTitle = styled.div`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.xs};
  font-weight: ${props => props.theme.fonts.weights.semiBold};
  color: ${props => props.theme.colors.text};
`;

const RouteSubtitle = styled.span`
  font-size: 0.8rem;
  color: ${props => props.theme.colors.textSecondary};
`;

const RouteMetric = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${props => props.theme.spacing.xs};
`;

const RouteMetricLabel = styled.span`
  font-size: 0.75rem;
  color: ${props => props.theme.colors.textSecondary};
  text-transform: uppercase;
  letter-spacing: 0.05em;
`;

const RouteMetricValue = styled.span`
  font-size: 1rem;
  font-weight: ${props => props.theme.fonts.weights.semiBold};
  color: ${props => props.theme.colors.text};
`;

const RouteDelta = styled.span`
  font-size: 0.8rem;
  color: ${props => props.theme.colors.textSecondary};
`;

const RouteBadge = styled.span`
  font-size: 0.7rem;
  font-weight: ${props => props.theme.fonts.weights.medium};
  text-transform: uppercase;
  padding: 0 ${props => props.theme.spacing.xs};
  background: ${props => props.theme.colors.accent};
  color: ${props => props.theme.colors.background};
  border-radius: ${props => props.theme.borderRadius.sm};
`;

const SwapButton = styled.button`
  background: ${props => props.theme.colors.surfaceLight};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius.full};
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${props => props.theme.colors.textSecondary};
  cursor: pointer;
  transition: all ${props => props.theme.transitions.fast};
  margin: 0 auto;

  &:hover {
    background: ${props => props.theme.colors.primary};
    color: ${props => props.theme.colors.background};
    transform: rotate(180deg);
  }
`;

const ActionButton = styled.button`
  background: ${props => props.theme.colors.primary};
  color: ${props => props.theme.colors.background};
  border: none;
  border-radius: ${props => props.theme.borderRadius.md};
  padding: ${props => props.theme.spacing.md} ${props => props.theme.spacing.lg};
  font-size: 1rem;
  font-weight: ${props => props.theme.fonts.weights.semiBold};
  cursor: pointer;
  transition: all ${props => props.theme.transitions.fast};
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${props => props.theme.spacing.sm};
  width: 100%;

  &:hover:not(:disabled) {
    background: ${props => props.theme.colors.secondary};
    transform: translateY(-1px);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const LoadingState = styled.div`
  text-align: center;
  padding: ${props => props.theme.spacing.lg} 0;
`;

const LoadingText = styled.p`
  font-size: 1rem;
  color: ${props => props.theme.colors.textSecondary};
  margin-bottom: ${props => props.theme.spacing.md};
`;

const ErrorState = styled.div`
  background: rgba(255, 68, 68, 0.1);
  border: 1px solid ${props => props.theme.colors.error};
  border-radius: ${props => props.theme.borderRadius.md};
  padding: ${props => props.theme.spacing.md};
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.sm};
  color: ${props => props.theme.colors.error};
  margin-bottom: ${props => props.theme.spacing.md};
  font-size: 0.9rem;
`;

const ResultsContainer = styled.div`
  background: ${props => props.theme.colors.surfaceLight};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius.md};
  padding: ${props => props.theme.spacing.lg};
  margin-top: ${props => props.theme.spacing.lg};
`;

const RateDisplay = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${props => props.theme.spacing.md};
`;

const RateLabel = styled.span`
  color: ${props => props.theme.colors.textSecondary};
  font-size: 0.9rem;
`;

const RateValue = styled.span`
  color: ${props => props.theme.colors.text};
  font-weight: ${props => props.theme.fonts.weights.semiBold};
  font-size: 1.1rem;
`;

const ReceiverInput = styled.input`
  background: ${props => props.theme.colors.surfaceLight};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius.md};
  padding: ${props => props.theme.spacing.md};
  font-size: 1rem;
  color: ${props => props.theme.colors.text};
  width: 100%;
  margin-bottom: ${props => props.theme.spacing.md};
  transition: all ${props => props.theme.transitions.fast};

  &:focus {
    border-color: ${props => props.theme.colors.primary};
    box-shadow: 0 0 0 3px rgba(255, 255, 255, 0.1);
  }

  &::placeholder {
    color: ${props => props.theme.colors.textMuted};
  }
`;

const currencies = [
  { code: 'USD', name: 'US Dollar' },
  { code: 'EUR', name: 'Euro' },
  { code: 'GBP', name: 'British Pound' },
  { code: 'MXN', name: 'Mexican Peso' },
  { code: 'JPY', name: 'Japanese Yen' },
  { code: 'CAD', name: 'Canadian Dollar' },
  { code: 'AUD', name: 'Australian Dollar' },
];

export default function QuickConverter() {
  const { currentUser, getIdToken } = useAuth();
  const [sendAmount, setSendAmount] = useState('100');
  const [sendCurrency, setSendCurrency] = useState('USD');
  const [receiveCurrency, setReceiveCurrency] = useState('MXN');
  const [receiverEmail, setReceiverEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [quote, setQuote] = useState(null);
  const [error, setError] = useState(null);

  const isNumber = (value) => typeof value === 'number' && Number.isFinite(value);

  const formatCurrency = (amount, currency) => {
    const symbols = {
      USD: '$', EUR: '€', GBP: '£', MXN: '$', JPY: '¥', CAD: 'C$', AUD: 'A$'
    };
    if (!isNumber(amount)) {
      return '--';
    }
    const formatted = Math.abs(amount).toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
    return `${symbols[currency] || currency} ${formatted}`;
  };

  const formatRate = (rate) => (isNumber(rate) ? rate.toFixed(4) : '--');

  const formatSignedCurrency = (amount, currency) => {
    if (!isNumber(amount)) {
      return '--';
    }
    const sign = amount >= 0 ? '+' : '-';
    return `${sign}${formatCurrency(amount, currency)}`;
  };

  const formatSignedPercent = (value) => {
    if (!isNumber(value)) {
      return '--';
    }
    const sign = value >= 0 ? '+' : '-';
    return `${sign}${Math.abs(value).toFixed(2)}%`;
  };

  const getRouteDifferenceLabel = (diffAmount, diffPct, currency) => {
    if (!isNumber(diffAmount) || Math.abs(diffAmount) < 1e-6) {
      return 'Best route';
    }
    const amountLabel = formatSignedCurrency(-diffAmount, currency);
    const pctLabel = formatSignedPercent(-(diffPct ?? 0));
    return `${amountLabel} vs best (${pctLabel})`;
  };

  const routeOptions = quote?.route_options ?? quote?.crypto_path?.routes ?? [];
  const bestRoute = quote?.crypto_path?.best_path
    ?? (quote?.crypto_path?.final_amount ? quote.crypto_path : null);
  const savingsAmount = quote && isNumber(quote.mid_market_amount)
    ? quote.our_amount - quote.mid_market_amount
    : null;
  const savingsPct = savingsAmount !== null && quote && isNumber(quote.mid_market_amount) && quote.mid_market_amount
    ? (savingsAmount / quote.mid_market_amount) * 100
    : null;
  const savingsLabel = quote && savingsAmount !== null
    ? formatSignedCurrency(savingsAmount, quote.receive_currency)
    : null;
  const savingsPctLabel = savingsPct !== null ? formatSignedPercent(savingsPct) : null;
  const processingTimeMs = quote?.processing_time_ms;
  const processingLabel = isNumber(processingTimeMs) ? `${Math.round(processingTimeMs)} ms` : null;

  const handleGetQuote = async () => {
    if (!sendAmount || parseFloat(sendAmount) <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }

    if (sendCurrency === receiveCurrency) {
      toast.error('Send and receive currencies must be different');
      return;
    }

    setLoading(true);
    setError(null);
    setQuote(null);

    try {
      const result = await quoteAPI.getQuote(sendCurrency, receiveCurrency, parseFloat(sendAmount));
      setQuote(result);
      toast.success('Quote generated successfully!');
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleExecuteTransfer = async () => {
    if (!currentUser) {
      toast.error('Please log in to execute transfers');
      return;
    }

    if (!receiverEmail) {
      toast.error('Please enter receiver email');
      return;
    }

    if (!quote) {
      toast.error('Please get a quote first');
      return;
    }

    try {
      const token = await getIdToken();
      await transactionAPI.executeTransfer(quote.quote_id, receiverEmail, token);
      toast.success('Transfer executed successfully!');
      setQuote(null);
      setReceiverEmail('');
    } catch (error) {
      toast.error('Failed to execute transfer');
    }
  };

  const handleSwapCurrencies = () => {
    setSendCurrency(receiveCurrency);
    setReceiveCurrency(sendCurrency);
  };

  return (
    <QuickConverterContainer>
      <Title>
        <Zap size={20} />
        Quick Convert
      </Title>

      <InputRow>
        <InputGroup>
          <Label>Amount</Label>
          <AmountInput
            type="number"
            value={sendAmount}
            onChange={(e) => setSendAmount(e.target.value)}
            placeholder="0.00"
            min="0"
            step="0.01"
          />
        </InputGroup>
        
        <SwapButton onClick={handleSwapCurrencies}>
          <ArrowRight size={16} />
        </SwapButton>
        
        <InputGroup>
          <Label>To</Label>
          <CurrencySelect
            value={receiveCurrency}
            onChange={(e) => setReceiveCurrency(e.target.value)}
          >
            {currencies.map(currency => (
              <option key={currency.code} value={currency.code}>
                {currency.code}
              </option>
            ))}
          </CurrencySelect>
        </InputGroup>
      </InputRow>

      <InputRow>
        <InputGroup>
          <Label>From</Label>
          <CurrencySelect
            value={sendCurrency}
            onChange={(e) => setSendCurrency(e.target.value)}
          >
            {currencies.map(currency => (
              <option key={currency.code} value={currency.code}>
                {currency.code}
              </option>
            ))}
          </CurrencySelect>
        </InputGroup>
      </InputRow>

      <ActionButton onClick={handleGetQuote} disabled={loading}>
        {loading ? (
          <>
            <Loader size={16} />
            Getting Quote...
          </>
        ) : (
          <>
            <Zap size={16} />
            Get Quote
          </>
        )}
      </ActionButton>

      {loading && (
        <LoadingState>
          <LoadingText>Scanning 15+ exchanges for the best rate...</LoadingText>
        </LoadingState>
      )}

      {error && (
        <ErrorState>
          <AlertCircle size={16} />
          {error}
        </ErrorState>
      )}

      {quote && (
        <ResultsContainer>
          <RateDisplay>
            <RateLabel>Our Rate</RateLabel>
            <RateValue>{formatRate(quote.our_rate)}</RateValue>
          </RateDisplay>
          <RateDisplay>
            <RateLabel>You'll Receive</RateLabel>
            <RateValue>{formatCurrency(quote.our_amount, quote.receive_currency)}</RateValue>
          </RateDisplay>
          {isNumber(quote.mid_market_rate) && (
            <RateDisplay>
              <RateLabel>Mid-Market Rate</RateLabel>
              <RateValue>{formatRate(quote.mid_market_rate)}</RateValue>
            </RateDisplay>
          )}
          {isNumber(quote.mid_market_amount) && (
            <RateDisplay>
              <RateLabel>Mid-Market Receive</RateLabel>
              <RateValue>{formatCurrency(quote.mid_market_amount, quote.receive_currency)}</RateValue>
            </RateDisplay>
          )}
          {savingsLabel && savingsPctLabel && (
            <RateDisplay>
              <RateLabel>Your Advantage</RateLabel>
              <RateValue>{`${savingsLabel} (${savingsPctLabel})`}</RateValue>
            </RateDisplay>
          )}
          {processingLabel && (
            <RateDisplay>
              <RateLabel>Route Search Time</RateLabel>
              <RateValue>{processingLabel}</RateValue>
            </RateDisplay>
          )}

          {bestRoute?.path && (
            <RouteSummary>
              <RouteSummaryLabel>Selected Route</RouteSummaryLabel>
              <RouteSummaryValue>{bestRoute.path}</RouteSummaryValue>
            </RouteSummary>
          )}

          {routeOptions.length > 0 && (
            <RouteAnalysis>
              <RouteAnalysisTitle>Route Comparison</RouteAnalysisTitle>
              <RouteList>
                {routeOptions.map((route, index) => {
                  const diffAmount = route.difference_from_best_batched ?? route.difference_from_best;
                  const routeKey = route.chain || `route-${index}`;
                  const routeLabel = route.chain ? route.chain.toUpperCase() : `Path ${index + 1}`;
                  const routeSubtitle = route.path || `${quote.send_currency || sendCurrency} → ${quote.receive_currency || receiveCurrency}`;
                  return (
                    <RouteItem key={routeKey} $isBest={route.is_best}>
                      <RouteInfo>
                        <RouteTitle>
                          {routeLabel}
                          {route.is_best && <RouteBadge>Selected</RouteBadge>}
                        </RouteTitle>
                        <RouteSubtitle>{routeSubtitle}</RouteSubtitle>
                      </RouteInfo>
                      <RouteMetric>
                        <RouteMetricLabel>Projected Receive</RouteMetricLabel>
                        <RouteMetricValue>
                          {formatCurrency(
                            route.projected_batched_amount ?? route.expected_final_amount,
                            quote.receive_currency
                          )}
                        </RouteMetricValue>
                      </RouteMetric>
                      <RouteMetric>
                        <RouteMetricLabel>Effective Rate</RouteMetricLabel>
                        <RouteMetricValue>
                          {formatRate(route.projected_batched_rate ?? route.effective_rate)}
                        </RouteMetricValue>
                        <RouteDelta>
                          {getRouteDifferenceLabel(diffAmount, route.difference_pct, quote.receive_currency)}
                        </RouteDelta>
                      </RouteMetric>
                    </RouteItem>
                  );
                })}
              </RouteList>
            </RouteAnalysis>
          )}

          <ReceiverInput
            type="email"
            placeholder="Enter receiver email"
            value={receiverEmail}
            onChange={(e) => setReceiverEmail(e.target.value)}
          />
          
          <ActionButton onClick={handleExecuteTransfer}>
            <CheckCircle size={16} />
            Confirm & Send
          </ActionButton>
        </ResultsContainer>
      )}
    </QuickConverterContainer>
  );
}
