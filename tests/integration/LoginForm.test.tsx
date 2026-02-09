import { render, screen, fireEvent, waitFor } from '../utils';
import { LoginForm } from '@/components/auth/LoginForm';

describe('LoginForm', () => {
    beforeEach(() => {
        global.fetch = jest.fn();
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    test('renders login form with correct fields', () => {
        render(<LoginForm loginType="user" />);

        expect(screen.getByLabelText(/Email or Username/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/Password/i)).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /Login/i })).toBeInTheDocument();
    });

    test('displays error message on failed login', async () => {
        (global.fetch as jest.Mock).mockResolvedValueOnce({
            ok: false,
            json: async () => ({ error: 'Invalid credentials' }),
        });

        render(<LoginForm loginType="user" />);

        fireEvent.change(screen.getByLabelText(/Email or Username/i), { target: { value: 'wronguser' } });
        fireEvent.change(screen.getByLabelText(/Password/i), { target: { value: 'wrongpassword' } });
        fireEvent.click(screen.getByRole('button', { name: /Login/i }));

        const errorMessage = await screen.findByText(/Invalid credentials. Please try again./i);
        expect(errorMessage).toBeInTheDocument();
    });
})
