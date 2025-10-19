import React, { useState } from 'react';
import styled from 'styled-components';
import { useAuth } from '../contexts/AuthContext';
import { quoteAPI } from '../services/api';
import toast from 'react-hot-toast';

const VerticalContainer = styled.div`
  position: relative;
  width: 100%;
  min-height: 200vh;
  background: ${props => props.theme.colors.background};
  padding: ${props => props.theme.spacing.section} 0;
`;

const StickySection = styled.div`
  position: sticky;
  top: 0;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: ${props => props.theme.spacing.section} ${props => props.theme.layout.containerPadding};
`;

const ConverterContent = styled.div`
  max-width: ${props => props.theme.layout.maxWidth};
  width: 100%;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: ${props => props.theme.spacing.xxxl};
  align-items: center;
  
  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    grid-template-columns: 1fr;
    gap: ${props => props.theme.spacing.xl};
  }
`;

const ConverterText = styled.div`
  z-index: 2;
`;

const ConverterTitle = styled.h1`
  font-size: ${props => props.theme.typography.h1.fontSize};
  line-height: ${props => props.theme.typography.h1.lineHeight};
  letter-spacing: ${props => props.theme.typography.h1.letterSpacing};
  font-weight: ${props => props.theme.typography.h1.fontWeight};
  color: ${props => props.theme.colors.text};
  margin-bottom: ${props => props.theme.spacing.lg};
`;

const ConverterSubtitle = styled.h2`
  font-size: ${props => props.theme.typography.h2.fontSize};
  line-height: ${props => props.theme.typography.h2.lineHeight};
  letter-spacing: ${props => props.theme.typography.h2.letterSpacing};
  font-weight: ${props => props.theme.typography.h2.fontWeight};
  color: ${props => props.theme.colors.text};
  margin-bottom: ${props => props.theme.spacing.xl};
`;

const ConverterDescription = styled.p`
  font-size: ${props => props.theme.typography.bodyBig.fontSize};
  line-height: ${props => props.theme.typography.bodyBig.lineHeight};
  letter-spacing: ${props => props.theme.typography.bodyBig.letterSpacing};
  color: ${props => props.theme.colors.textSecondary};
  margin-bottom: ${props => props.theme.spacing.xl};
`;

const ConverterForm = styled.div`
  background: ${props => props.theme.colors.background};
  border: 1px solid ${props => props.theme.colors.border};
  padding: ${props => props.theme.spacing.xxxl};
  border-radius: ${props => props.theme.borderRadius.none};
  z-index: 2;
`;

const FormGroup = styled.div`
  margin-bottom: ${props => props.theme.spacing.lg};
`;

const Label = styled.label`
  display: block;
  font-size: ${props => props.theme.typography.body.fontSize};
  font-weight: ${props => props.theme.fonts.weights.medium};
  color: ${props => props.theme.colors.text};
  margin-bottom: ${props => props.theme.spacing.sm};
`;

const Input = styled.input`
  width: 100%;
  padding: ${props => props.theme.spacing.md};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius.none};
  font-size: ${props => props.theme.typography.body.fontSize};
  color: ${props => props.theme.colors.text};
  background: ${props => props.theme.colors.background};
  transition: ${props => props.theme.transitions.normal};
  
  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.accent};
  }
`;

const Select = styled.select`
  width: 100%;
  padding: ${props => props.theme.spacing.md};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius.none};
  font-size: ${props => props.theme.typography.body.fontSize};
  color: ${props => props.theme.colors.text};
  background: ${props => props.theme.colors.background};
  transition: ${props => props.theme.transitions.normal};
  
  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.accent};
  }
`;

const Button = styled.button`
  width: 100%;
  padding: ${props => props.theme.spacing.lg};
  background: ${props => props.theme.colors.text};
  color: ${props => props.theme.colors.background};
  border: none;
  border-radius: ${props => props.theme.borderRadius.none};
  font-size: ${props => props.theme.typography.body.fontSize};
  font-weight: ${props => props.theme.fonts.weights.medium};
  cursor: pointer;
  transition: ${props => props.theme.transitions.normal};
  
  &:hover {
    background: ${props => props.theme.colors.textSecondary};
  }
  
  &:disabled {
    background: ${props => props.theme.colors.border};
    cursor: not-allowed;
  }
`;

const QuoteResult = styled.div`
  margin-top: ${props => props.theme.spacing.lg};
  padding: ${props => props.theme.spacing.lg};
  background: ${props => props.theme.colors.spaceAccent};
  border: 1px solid ${props => props.theme.colors.accent};
  border-radius: ${props => props.theme.borderRadius.none};
`;

const QuoteText = styled.div`
  font-size: ${props => props.theme.typography.body.fontSize};
  color: ${props => props.theme.colors.text};
  margin-bottom: ${props => props.theme.spacing.sm};
`;

const QuoteRate = styled.div`
  font-size: ${props => props.theme.typography.h3.fontSize};
  font-weight: ${props => props.theme.fonts.weights.bold};
  color: ${props => props.theme.colors.text};
`;

const LoadingSpinner = styled.div`
  display: inline-block;
  width: 20px;
  height: 20px;
  border: 2px solid ${props => props.theme.colors.border};
  border-radius: 50%;
  border-top-color: ${props => props.theme.colors.accent};
  animation: spin 1s ease-in-out infinite;
  
  @keyframes spin {
    to { transform: rotate(360deg); }
  }
`;

const VerticalParallaxConverter = () => {
  const { currentUser } = useAuth();
  const [formData, setFormData] = useState({
    fromCurrency: 'USD',
    toCurrency: 'EUR',
    amount: '',
    exchangeMethod: 'auto'
  });
  const [quote, setQuote] = useState(null);
  const [loading, setLoading] = useState(false);

  const currencies = [
    'USD', 'EUR', 'GBP', 'JPY', 'CAD', 'AUD', 'CHF', 'CNY',
    'USDC', 'USDT', 'DAI', 'ETH', 'BTC'
  ];

  const exchangeMethods = [
    { value: 'auto', label: 'Auto (Best Rate)' },
    { value: 'fx', label: 'Direct FX' },
    { value: 'cex', label: 'CEX Integration' },
    { value: 'dex', label: 'DEX Aggregation' },
    { value: 'hybrid', label: 'Hybrid Route' }
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleGetQuote = async () => {
    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }

    setLoading(true);
    try {
      const response = await quoteAPI.getQuote({
        from_currency: formData.fromCurrency,
        to_currency: formData.toCurrency,
        amount: parseFloat(formData.amount),
        exchange_method: formData.exchangeMethod
      });
      
      setQuote(response);
      toast.success('Quote received successfully');
    } catch (error) {
      console.error('Quote error:', error);
      toast.error('Failed to get quote');
    } finally {
      setLoading(false);
    }
  };

  return (
    <VerticalContainer>
      <StickySection>
        <ConverterContent>
          <ConverterText>
            <ConverterTitle>Try Our Platform</ConverterTitle>
            <ConverterSubtitle>Get an instant quote</ConverterSubtitle>
            <ConverterDescription>
              Experience the power of our cross-currency platform. 
              Get real-time quotes and see how we can optimize your transactions 
              with our intelligent routing system.
            </ConverterDescription>
          </ConverterText>
          
          <ConverterForm>
            <FormGroup>
              <Label>From Currency</Label>
              <Select
                name="fromCurrency"
                value={formData.fromCurrency}
                onChange={handleInputChange}
              >
                {currencies.map(currency => (
                  <option key={currency} value={currency}>{currency}</option>
                ))}
              </Select>
            </FormGroup>
            
            <FormGroup>
              <Label>To Currency</Label>
              <Select
                name="toCurrency"
                value={formData.toCurrency}
                onChange={handleInputChange}
              >
                {currencies.map(currency => (
                  <option key={currency} value={currency}>{currency}</option>
                ))}
              </Select>
            </FormGroup>
            
            <FormGroup>
              <Label>Amount</Label>
              <Input
                type="number"
                name="amount"
                value={formData.amount}
                onChange={handleInputChange}
                placeholder="Enter amount"
                min="0"
                step="0.01"
              />
            </FormGroup>
            
            <FormGroup>
              <Label>Exchange Method</Label>
              <Select
                name="exchangeMethod"
                value={formData.exchangeMethod}
                onChange={handleInputChange}
              >
                {exchangeMethods.map(method => (
                  <option key={method.value} value={method.value}>
                    {method.label}
                  </option>
                ))}
              </Select>
            </FormGroup>
            
            <Button 
              onClick={handleGetQuote} 
              disabled={loading || !currentUser}
            >
              {loading ? <LoadingSpinner /> : 'Get Quote'}
            </Button>
            
            {!currentUser && (
              <div style={{ 
                marginTop: '16px', 
                textAlign: 'center',
                color: '#767676',
                fontSize: '14px'
              }}>
                Please log in to get quotes
              </div>
            )}
            
            {quote && (
              <QuoteResult>
                <QuoteText>
                  {formData.amount} {formData.fromCurrency} = {quote.received_amount} {formData.toCurrency}
                </QuoteText>
                <QuoteRate>
                  Rate: {quote.rate}
                </QuoteRate>
                <QuoteText>
                  Method: {quote.exchange_method} | Time: {quote.estimated_time}
                </QuoteText>
              </QuoteResult>
            )}
          </ConverterForm>
        </ConverterContent>
      </StickySection>
    </VerticalContainer>
  );
};

export default VerticalParallaxConverter;
