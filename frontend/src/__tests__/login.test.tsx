import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { vi } from 'vitest'
import Login from '@/app/auth/login/Login';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const mockPush = vi.fn();
vi.mock('next/navigation', () => ({
    useRouter: ()=>({
        push:mockPush,
    }),
  }));

const queryClient = new QueryClient();
const renderWithQueryProvider = (component: JSX.Element) => {
    return render(
      <QueryClientProvider client={queryClient}>
        {component}
      </QueryClientProvider>
    );
  };

const fillLoginForm = (email: string, password: string) => {
  fireEvent.change(screen.getByPlaceholderText('Email'), { target: { value: email } });
  fireEvent.change(screen.getByPlaceholderText('Password'), { target: { value: password } });
};

describe('Login Component', () => {
  beforeEach(()=>{
    renderWithQueryProvider(<Login/>)
  })
  afterEach(() => {
    vi.clearAllMocks();
  })
  it('renders the login form with an email input', () => {
    expect(screen.getByPlaceholderText('Email')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Password')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: "Login" })).toBeInTheDocument();
  });
  it('shows error message if login fails', async () => {
    vi.spyOn(global,'fetch').mockRejectedValue(new Error('Login failed'));
    fillLoginForm('test@gmail.com','testpass')
    fireEvent.click(screen.getByRole('button', { name: "Login" }));
    await waitFor(() => {
        expect(screen.getByText('Login failed')).toBeInTheDocument();
    });
  })
  it('redirects to /home after successful login', async() => {
    const mockResponse = new Response(
      JSON.stringify({ data: { name: 'Test User', id: '123' } }), {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'client': 'client123',
          'access-token': 'token123',
          'uid': 'uid123',
        },
      }
    );
    vi.spyOn(global,'fetch').mockResolvedValueOnce(mockResponse);
    fillLoginForm('test@gmail.com', 'testpass');
    fireEvent.click(screen.getByRole('button', { name: 'Login' }));
    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith('/home');
    });
  })
});
