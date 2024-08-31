import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { BASE_URL } from '@/constant/constants';
import { UserType } from '@/context/authStore';

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
  const [user, setUser] = useState<UserType|null>(null);

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
