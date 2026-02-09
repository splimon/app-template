import '@testing-library/jest-dom'
import { render, screen, fireEvent } from '@testing-library/react';
import { LoginForm } from '@/components/auth/LoginForm';
import { AuthProvider } from '@/hooks/contexts/AuthContext';

const TestWrapper = ({ children }: { children: React.ReactNode }) => {
  return <AuthProvider>{children}</AuthProvider>;
};

describe('LoginForm', () => {

    it('renders login form with System Administrator text', () => {
        render(<LoginForm loginType="sysadmin" />, { wrapper: TestWrapper });

        // card title should be Internal Login for sysadmin login
        expect(screen.getByText(/Internal Login/i)).toBeInTheDocument();
    });    
    
})
