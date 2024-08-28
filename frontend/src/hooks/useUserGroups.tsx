import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { BASE_URL } from '../../constants';

const fetchGroups = async (user: any) => {
  const response = await fetch(`${BASE_URL}/groups`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'uid': user.uid,
      'client': user.client,
      'access-token': user.accessToken,
    },
  });

  if (!response.ok) {
    throw new Error('Error fetching groups');
  }

  return response.json();
};

export const useUserGroups = () => {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const userData = localStorage.getItem('user-storage');
    if (userData) {
      const parsedUserData = JSON.parse(userData || '{}');
      setUser(parsedUserData.state.user);
    }
  }, []);

  const { data: groupsData, isError, isLoading } = useQuery({
    queryKey: ['groups'],
    queryFn: () => fetchGroups(user),
    enabled: !!user,
  });

  return { isLoading, isError, groupsData };
};
