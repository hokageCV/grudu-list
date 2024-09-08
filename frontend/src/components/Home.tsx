import { useEffect, useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useUserGroups } from '@/hooks/useUserGroups';
import { useGroupStore } from '@/context/groupStore';
import { UserType } from '@/context/authStore';

const queryClient = new QueryClient();

const HomePage = () => {
  const [user, setUser] = useState<UserType | null>(null);

  const setGroups = useGroupStore((state) => state.setGroups);
  const { isLoading, isError, groupsData } = useUserGroups();

  useEffect(() => {
    const userData = localStorage.getItem('user-storage');
    if (userData) {
      const userObject = JSON.parse(userData || '{}');
      setUser(userObject?.state?.user);
    }
  }, []);

  useEffect(() => {
    if (user && groupsData) {
      const userGroups = groupsData.filter(
        (group: { owner: { id: string } }) => group.owner.id === user?.id
      );
      setGroups(userGroups);
    }
  }, [user, groupsData, setGroups]);

  if (isLoading) {
    return (
      <div className="h-[90vh] sm:h-[100vh] flex justify-center items-center bg-backgroundOffset">
        <div className="text-center">
          <div className="text-2xl font-semibold text-primary">Loading...</div>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="h-[90vh] sm:h-[100vh] flex justify-center items-center bg-backgroundOffset">
        <div className="text-center">
          <div className="text-2xl font-semibold text-red-600">Error</div>
          <div className="mt-2 text-sm text-secondary">
            There was an error loading your groups
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-[90vh] sm:h-[100vh] flex justify-center items-center bg-backgroundOffset">
      <h1 className="text-4xl font-bold text-primary">
        Welcome {user?.name}
      </h1>
    </div>
  );
};

export default function Home() {
  return (
    <QueryClientProvider client={queryClient}>
      <HomePage />
    </QueryClientProvider>
  );
}