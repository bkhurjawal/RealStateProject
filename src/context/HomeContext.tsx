import React, {createContext, useState, useContext, useEffect} from 'react';
import {fetchHomes} from '../utils/api';

interface Home {
  id: string;
  address: string;
  description: string;
  image: string;
  latitude: number;
  longitude: number;
}

interface HomeContextType {
  homes: Array<Home>;
  loading: boolean;
  addHome: (home: Home) => void;
}

const HomeContext = createContext<HomeContextType | undefined>(undefined);

export const HomeProvider = ({children}: {children: React.ReactNode}) => {
  const [homes, setHomes] = useState<Home[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHomes().then(data => {
      setHomes(data as Home[]);
      setLoading(false);
    });
  }, []);

  const addHome = (home: Home) => {
    setHomes(prevHomes => [...prevHomes, home]);
  };

  return (
    <HomeContext.Provider value={{homes, loading, addHome}}>
      {children}
    </HomeContext.Provider>
  );
};

export const useHomes = () => {
  const context = useContext(HomeContext);
  if (!context) throw new Error('useHomes must be used within a HomeProvider');
  return context;
};
