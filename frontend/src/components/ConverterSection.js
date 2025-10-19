import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight, Loader, CheckCircle, AlertCircle, Zap } from 'lucide-react';
import { quoteAPI } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';

gsap.registerPlugin(ScrollTrigger);

const ConverterSectionStyled = styled.section`
  padding: ${props => props.theme.spacing.xxxl} 0;
  background: ${props => props.theme.colors.background};
  position: relative;
  overflow: hidden;
`;

const SectionTitle = styled.h2`
  text-align: center;
  font-size: clamp(2.5rem, 5vw, 4rem);
  font-weight: ${props => props.theme.fonts.weights.bold};
  color: ${props => props.theme.colors.text};
  margin-bottom: ${props => props.theme.spacing.xxl};
  letter-spacing: -0.02em;
`;

const ConverterContainer = styled.div`
  max-width: 900px;
  margin: 0 auto;
  padding: 0 ${props => props.theme.spacing.lg};
`;

const ConverterCard = styled.div`
  background: ${props => props.theme.colors.surface};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius.xl};
  padding: ${props => props.theme.spacing.xxxl};
  box-shadow: ${props => props.theme.shadows.lg};
  position: relative;
  overflow: hidden;
`;

const InputSection = styled.div`
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  gap: ${props => props.theme.spacing.xl};
  align-items: end;
  margin-bottom: ${props => props.theme.spacing.xxl};

  @media (max-width: ${props => props.theme.breakpoints.tablet}) {
    grid-template-columns: 1fr;
    gap: ${props => props.theme.spacing.lg};
  }
`;

const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${props => props.theme.spacing.sm};
`;

const Label = styled.label`
  font-size: 0.9rem;
  font-weight: ${props => props.theme.fonts.weights.medium};
  color: ${props => props.theme.colors.textSecondary};
  text-transform: uppercase;
  letter-spacing: 0.05em;
`;

const AmountInput = styled.input`
  background: ${props => props.theme.colors.surfaceLight};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius.lg};
  padding: ${props => props.theme.spacing.lg};
  font-size: 1.5rem;
  font-weight: ${props => props.theme.fonts.weights.semiBold};
  color: ${props => props.theme.colors.text};
  transition: all ${props => props.theme.transitions.fast};

  &:focus {
    border-color: ${props => props.theme.colors.primary};
    box-shadow: 0 0 0 3px rgba(255, 255, 255, 0.1);
  }

  &::placeholder {
    color: ${props => props.theme.colors.textMuted};
  }
`;

const CurrencySelect = styled.select`
  background: ${props => props.theme.colors.surfaceLight};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius.lg};
  padding: ${props => props.theme.spacing.lg};
  font-size: 1.1rem;
  font-weight: ${props => props.theme.fonts.weights.medium};
  color: ${props => props.theme.colors.text};
  cursor: pointer;
  transition: all ${props => props.theme.transitions.fast};

  &:focus {
    border-color: ${props => props.theme.colors.primary};
    box-shadow: 0 0 0 3px rgba(255, 255, 255, 0.1);
  }
`;

const SwapButton = styled.button`
  background: ${props => props.theme.colors.surfaceLight};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius.full};
  width: 50px;
  height: 50px;
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

const QuoteButton = styled.button`
  background: ${props => props.theme.colors.primary};
  color: ${props => props.theme.colors.background};
  border: none;
  border-radius: ${props => props.theme.borderRadius.lg};
  padding: ${props => props.theme.spacing.lg} ${props => props.theme.spacing.xxl};
  font-size: 1.1rem;
  font-weight: ${props => props.theme.fonts.weights.semiBold};
  cursor: pointer;
  transition: all ${props => props.theme.transitions.fast};
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${props => props.theme.spacing.sm};
  width: 100%;
  margin-bottom: ${props => props.theme.spacing.xl};

  &:hover:not(:disabled) {
    background: ${props => props.theme.colors.secondary};
    transform: translateY(-2px);
    box-shadow: ${props => props.theme.shadows.glow};
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const LoadingState = styled.div`
  text-align: center;
  padding: ${props => props.theme.spacing.xl} 0;
`;

const LoadingIcon = styled.div`
  margin-bottom: ${props => props.theme.spacing.lg};
`;

const LoadingText = styled.p`
  font-size: 1.2rem;
  font-weight: ${props => props.theme.fonts.weights.medium};
  color: ${props => props.theme.colors.text};
  margin-bottom: ${props => props.theme.spacing.lg};
`;

const LoadingSteps = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${props => props.theme.spacing.md};
  max-width: 400px;
  margin: 0 auto;
`;

const LoadingStep = styled.div`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.sm};
  color: ${props => props.theme.colors.textSecondary};
  font-size: 0.95rem;
`;

const ErrorState = styled.div`
  background: rgba(255, 68, 68, 0.1);
  border: 1px solid ${props => props.theme.colors.error};
  border-radius: ${props => props.theme.borderRadius.lg};
  padding: ${props => props.theme.spacing.lg};
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.sm};
  color: ${props => props.theme.colors.error};
  margin-bottom: ${props => props.theme.spacing.lg};
`;

const ResultsContainer = styled.div`
  background: ${props => props.theme.colors.surfaceLight};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius.lg};
  padding: ${props => props.theme.spacing.xl};
  margin-bottom: ${props => props.theme.spacing.xl};
`;

const RateComparison = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: ${props => props.theme.spacing.lg};
  margin-bottom: ${props => props.theme.spacing.lg};

  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    grid-template-columns: 1fr;
  }
`;

const RateCard = styled.div`
  text-align: center;
  padding: ${props => props.theme.spacing.lg};
  border-radius: ${props => props.theme.borderRadius.lg};
  border: 1px solid ${props => props.theme.colors.border};
  
  &.our-rate {
    background: rgba(0, 255, 136, 0.1);
    border-color: ${props => props.theme.colors.success};
  }
  
  &.market-rate {
    background: ${props => props.theme.colors.surface};
  }
`;

const RateLabel = styled.div`
  font-size: 0.9rem;
  font-weight: ${props => props.theme.fonts.weights.medium};
  color: ${props => props.theme.colors.textSecondary};
  margin-bottom: ${props => props.theme.spacing.sm};
  text-transform: uppercase;
  letter-spacing: 0.05em;
`;

const RateValue = styled.div`
  font-size: 1.8rem;
  font-weight: ${props => props.theme.fonts.weights.bold};
  color: ${props => props.theme.colors.text};
  margin-bottom: ${props => props.theme.spacing.sm};
`;

const RateAmount = styled.div`
  font-size: 1.1rem;
  color: ${props => props.theme.colors.textSecondary};
`;

const SavingsIndicator = styled.div`
  text-align: center;
  padding: ${props => props.theme.spacing.lg};
  background: rgba(0, 255, 136, 0.1);
  border: 1px solid ${props => props.theme.colors.success};
  border-radius: ${props => props.theme.borderRadius.lg};
  color: ${props => props.theme.colors.success};
  font-weight: ${props => props.theme.fonts.weights.semiBold};
  margin-bottom: ${props => props.theme.spacing.lg};
`;

const ConfirmButton = styled.button`
  background: ${props => props.theme.colors.success};
  color: ${props => props.theme.colors.background};
  border: none;
  border-radius: ${props => props.theme.borderRadius.lg};
  padding: ${props => props.theme.spacing.lg} ${props => props.theme.spacing.xxl};
  font-size: 1.1rem;
  font-weight: ${props => props.theme.fonts.weights.semiBold};
  cursor: pointer;
  transition: all ${props => props.theme.transitions.fast};
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${props => props.theme.spacing.sm};
  width: 100%;

  &:hover {
    background: #00e677;
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(0, 255, 136, 0.3);
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

export default function ConverterSection() {
  const { currentUser } = useAuth();
  const [sendAmount, setSendAmount] = useState('100');
  const [sendCurrency, setSendCurrency] = useState('USD');
  const [receiveCurrency, setReceiveCurrency] = useState('MXN');
  const [loading, setLoading] = useState(false);
  const [quote, setQuote] = useState(null);
  const [error, setError] = useState(null);

  const converterRef = React.useRef(null);

  useEffect(() => {
    // Animate converter section on scroll
    gsap.fromTo(converterRef.current,
      { y: 100, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: converterRef.current,
          start: 'top 80%',
          toggleActions: 'play none none reverse'
        }
      }
    );
  }, []);

  const handleGetQuote = async () => {
    console.log('🚀 Getting quote for:', { sendCurrency, receiveCurrency, sendAmount });
    
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
      console.log('📡 Calling quoteAPI.getQuote...');
      const result = await quoteAPI.getQuote(sendCurrency, receiveCurrency, parseFloat(sendAmount));
      console.log('✅ Quote result:', result);
      setQuote(result);
      toast.success('Quote generated successfully!');
    } catch (error) {
      console.error('❌ Quote error:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmTransfer = () => {
    if (!currentUser) {
      toast.error('Please log in to execute transfers');
      return;
    }
    // TODO: Implement transfer execution
    toast.success('Transfer executed successfully!');
  };

  const handleSwapCurrencies = () => {
    setSendCurrency(receiveCurrency);
    setReceiveCurrency(sendCurrency);
  };

  const formatCurrency = (amount, currency) => {
    const symbols = {
      USD: '$', EUR: '€', GBP: '£', MXN: '$', JPY: '¥', CAD: 'C$', AUD: 'A$'
    };
    return `${symbols[currency] || currency} ${amount.toFixed(2)}`;
  };

  return (
    <ConverterSectionStyled ref={converterRef}>
      <SectionTitle>Get Your Quote</SectionTitle>
      <ConverterContainer>
        <ConverterCard>
          <InputSection>
            <InputGroup>
              <Label>Send Amount</Label>
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
              <ArrowRight size={20} />
            </SwapButton>
            
            <InputGroup>
              <Label>Receive Currency</Label>
              <CurrencySelect
                value={receiveCurrency}
                onChange={(e) => setReceiveCurrency(e.target.value)}
              >
                {currencies.map(currency => (
                  <option key={currency.code} value={currency.code}>
                    {currency.code} - {currency.name}
                  </option>
                ))}
              </CurrencySelect>
            </InputGroup>
          </InputSection>

          <InputSection>
            <InputGroup>
              <Label>Send Currency</Label>
              <CurrencySelect
                value={sendCurrency}
                onChange={(e) => setSendCurrency(e.target.value)}
              >
                {currencies.map(currency => (
                  <option key={currency.code} value={currency.code}>
                    {currency.code} - {currency.name}
                  </option>
                ))}
              </CurrencySelect>
            </InputGroup>
          </InputSection>

          <QuoteButton onClick={handleGetQuote} disabled={loading}>
            {loading ? (
              <>
                <Loader size={20} />
                Getting Quote...
              </>
            ) : (
              <>
                <Zap size={20} />
                Get Best Quote
                <ArrowRight size={20} />
              </>
            )}
          </QuoteButton>

          {loading && (
            <LoadingState>
              <LoadingIcon>
                <Loader size={40} color="#ffffff" />
              </LoadingIcon>
              <LoadingText>Scanning 15+ exchanges for the best rate...</LoadingText>
              <LoadingSteps>
                <LoadingStep>
                  <CheckCircle size={16} color="#00ff88" />
                  Fetching mid-market rates
                </LoadingStep>
                <LoadingStep>
                  <CheckCircle size={16} color="#00ff88" />
                  Checking competitor rates
                </LoadingStep>
                <LoadingStep>
                  <Loader size={16} color="#ffffff" />
                  Analyzing crypto paths
                </LoadingStep>
                <LoadingStep>
                  <Loader size={16} color="#ffffff" />
                  Optimizing for best rate
                </LoadingStep>
              </LoadingSteps>
            </LoadingState>
          )}

          {error && (
            <ErrorState>
              <AlertCircle size={20} />
              {error}
            </ErrorState>
          )}

          {quote && (
            <ResultsContainer>
              <RateComparison>
                <RateCard className="our-rate">
                  <RateLabel>Our Rate</RateLabel>
                  <RateValue>{quote.our_rate.toFixed(4)}</RateValue>
                  <RateAmount>{formatCurrency(quote.our_amount, quote.receive_currency)}</RateAmount>
                </RateCard>
                <RateCard className="market-rate">
                  <RateLabel>Mid-Market Rate</RateLabel>
                  <RateValue>{quote.mid_market_rate.toFixed(4)}</RateValue>
                  <RateAmount>{formatCurrency(quote.mid_market_amount, quote.receive_currency)}</RateAmount>
                </RateCard>
              </RateComparison>
              
              <SavingsIndicator>
                You save {formatCurrency(quote.our_amount - quote.mid_market_amount, quote.receive_currency)} with our rate!
              </SavingsIndicator>

              {currentUser && (
                <ConfirmButton onClick={handleConfirmTransfer}>
                  Confirm & Send
                  <ArrowRight size={20} />
                </ConfirmButton>
              )}
            </ResultsContainer>
          )}
        </ConverterCard>
      </ConverterContainer>
    </ConverterSectionStyled>
  );
}