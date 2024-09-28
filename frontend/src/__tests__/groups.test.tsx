import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import AllGroups from '@/app/group/AllGroups';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

interface NextImageProps {
    src: string;
    alt?: string;
    height?: number;
    width?: number;
}

vi.mock('next/image', () => {
    return ({
        default: ({ src, alt, height, width }: NextImageProps) => {
            return <img src={src} alt={alt} height={height} width={width} />;
        },
    });
});

const mockPush = vi.fn();
vi.mock('next/navigation', () => ({
    useRouter: () => ({
        push: mockPush,
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

const mockGroups = [
    {
        id: '1',
        name: 'Group 1',
        owner: { id: 'owner1', name: 'Owner One' },
    },
    {
        id: '2',
        name: 'Group 2',
        owner: { id: 'owner2', name: 'Owner Two' },
    },
];

describe('AllGroups Component', () => {
    beforeEach(() => {
        localStorage.setItem('user-storage', JSON.stringify({ 
            state: { 
                user: { id: 'owner1', name: 'Owner One', uid: 'uid1', client: 'client1', accessToken: 'token1' }
            }
        }));
        
        vi.spyOn(global, 'fetch').mockResolvedValue({
            ok: true,
            json: async () => mockGroups,
        } as Response);
        
        renderWithQueryProvider(<AllGroups/>);
    });

    afterEach(() => {
        vi.clearAllMocks();
        localStorage.clear();
    });

    it('renders without crashing', async () => {
        expect(await screen.findByText("All Groups")).toBeInTheDocument();
    });
    it('fetches and displays groups', async () => {
        expect(await screen.findByText("Group 1")).toBeInTheDocument();
        expect(await screen.findByText("Group 2")).toBeInTheDocument();
    });
    it('allows owner to edit a group', async () => {
        const editButton = await screen.findByRole('button', {name:'Edit'});
        fireEvent.click(editButton);
        expect(mockPush).toHaveBeenCalledWith('/group/edit/1');
    });
    it('allows owner to delete a group', async () => {
        const deleteButton = await screen.findByRole('button', {name:'Delete'});
        fireEvent.click(deleteButton);
        expect(await screen.findByText("Are you sure you want to delete this group?")).toBeInTheDocument();
        const confirmDeletion = screen.getByRole('button', {name:'Yes, delete it'});
        fireEvent.click(confirmDeletion);
        vi.spyOn(global, 'fetch').mockResolvedValue({ok: true} as Response);
        expect(await screen.findByText("All Groups")).toBeInTheDocument();
    });
});