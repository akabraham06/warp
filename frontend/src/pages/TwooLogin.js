import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';

const LoginContainer = styled.div`
  min-height: 100vh;
  background: #000000;
  color: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  position: relative;
  overflow: hidden;
`;

const LoginWrapper = styled.div`
  width: 100%;
  max-width: 1200px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4rem;
  align-items: center;
  min-height: 80vh;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 2rem;
    text-align: center;
  }
`;

const BrandSection = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 2rem 0;
`;

const BrandName = styled.h1`
  font-size: clamp(48px, 8vw, 96px);
  line-height: clamp(44px, 7vw, 88px);
  letter-spacing: -2px;
  font-weight: 700;
  color: #ffffff;
  margin-bottom: 2rem;
`;

const BrandDescription = styled.p`
  font-size: clamp(16px, 2.5vw, 20px);
  line-height: clamp(20px, 3vw, 24px);
  letter-spacing: -0.5px;
  font-weight: 400;
  color: #767676;
  max-width: 500px;
  margin-bottom: 2rem;
`;

const TimeInfo = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 2rem;
  font-size: clamp(14px, 2vw, 16px);
  color: #767676;
  max-width: 400px;

  @media (max-width: 768px) {
    justify-content: center;
    gap: 2rem;
  }
`;

const TimeColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const LoginFormSection = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 2rem 0;
`;

const FormTitle = styled.h2`
  font-size: clamp(28px, 4.5vw, 48px);
  line-height: clamp(28px, 4.5vw, 48px);
  letter-spacing: -2px;
  font-weight: 600;
  color: #ffffff;
  margin-bottom: 2rem;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  max-width: 400px;
  width: 100%;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const Label = styled.label`
  font-size: clamp(14px, 2vw, 16px);
  font-weight: 500;
  color: #ffffff;
  text-transform: uppercase;
  letter-spacing: 0.05em;
`;

const Input = styled.input`
  padding: 1rem 0;
  border: none;
  border-bottom: 1px solid #767676;
  background: transparent;
  font-size: clamp(16px, 2.5vw, 20px);
  color: #ffffff;
  transition: border-color 0.2s ease;
  
  &:focus {
    outline: none;
    border-bottom-color: #ffffff;
  }
  
  &::placeholder {
    color: #767676;
  }
`;

const Button = styled.button`
  padding: 1rem 0;
  background: transparent;
  color: #ffffff;
  border: 1px solid #ffffff;
  font-size: clamp(14px, 2vw, 16px);
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  
  &:hover:not(:disabled) {
    background: #ffffff;
    color: #000000;
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const GoogleButton = styled.button`
  padding: 1rem 0;
  background: transparent;
  color: #767676;
  border: 1px solid #767676;
  font-size: clamp(14px, 2vw, 16px);
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  
  &:hover:not(:disabled) {
    background: #767676;
    color: #000000;
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const Divider = styled.div`
  height: 1px;
  background: #767676;
  margin: 1.5rem 0;
  position: relative;
  
  &::before {
    content: 'or';
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: #000000;
    padding: 0 1rem;
    font-size: clamp(14px, 2vw, 16px);
    color: #767676;
  }
`;

const BackLink = styled(Link)`
  display: inline-block;
  margin-top: 2rem;
  font-size: clamp(14px, 2vw, 16px);
  color: #767676;
  text-decoration: none;
  transition: color 0.2s ease;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  
  &:hover {
    color: #ffffff;
  }
`;

const ErrorMessage = styled.div`
  padding: 1rem;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid #767676;
  color: #ffffff;
  font-size: clamp(14px, 2vw, 16px);
  margin-bottom: 1.5rem;
`;

const LoadingSpinner = styled.div`
  display: inline-block;
  width: 20px;
  height: 20px;
  border: 2px solid transparent;
  border-top: 2px solid currentColor;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-right: 8px;
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

const VisualElement = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  min-height: 300px;

  @media (max-width: 768px) {
    display: none;
  }
`;

const LargeNumber = styled.div`
  font-size: clamp(200px, 30vw, 400px);
  font-weight: 700;
  color: #ffffff;
  opacity: 0.1;
  line-height: 1;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
`;

const TwooLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { login, signInWithGoogle } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (error) {
      console.error('Login error:', error);
      setError('Failed to log in. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError('');

    try {
      await signInWithGoogle();
      navigate('/dashboard');
    } catch (error) {
      console.error('Google login error:', error);
      setError('Google login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <LoginContainer>
      <LoginWrapper>
        <BrandSection>
          <BrandName>WARP</BrandName>
          <BrandDescription>
            With a multicultural and open-minded approach to international
            financial technology, Warp designs and develops systems for cross-currency
            transactions, combining strategic thinking with
            refined user experience design.
          </BrandDescription>
          
          <TimeInfo>
            <TimeColumn>
              <div>Based in Barcelona</div>
              <div>7:20 AM</div>
            </TimeColumn>
            <TimeColumn>
              <div>Working worldwide</div>
              <div>12:20 AM</div>
            </TimeColumn>
          </TimeInfo>
        </BrandSection>

        <LoginFormSection>
          <FormTitle>Access Platform</FormTitle>
          
          {error && <ErrorMessage>{error}</ErrorMessage>}

          <Form onSubmit={handleSubmit}>
            <FormGroup>
              <Label>Email</Label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
              />
            </FormGroup>

            <FormGroup>
              <Label>Password</Label>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
              />
            </FormGroup>

            <Button type="submit" disabled={loading}>
              {loading ? <LoadingSpinner /> : 'Sign In'}
            </Button>
          </Form>

          <Divider />

          <GoogleButton onClick={handleGoogleLogin} disabled={loading}>
            {loading ? <LoadingSpinner /> : 'Continue with Google'}
          </GoogleButton>

          <BackLink to="/">
            ← Back to home
          </BackLink>
        </LoginFormSection>

        <VisualElement>
          <LargeNumber>2</LargeNumber>
        </VisualElement>
      </LoginWrapper>
    </LoginContainer>
  );
};

export default TwooLogin;