"use client"
import { useEffect } from 'react';
import { BASE_URL } from "@/constant/constants";

const usePingBackend = () => {
  useEffect(() => {
    const pingBackend = async () => {
      try {
        const response = await fetch(`${BASE_URL}/up`, { method: 'GET' });
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return await response.json();
      } 
      catch (error) {
        console.error('Failed to ping backend:', error);
        return null;
      }
    };
    pingBackend();
  }, []);
};

export default usePingBackend;
