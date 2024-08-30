import React, {createContext, useState, useContext, useEffect} from 'react';
import {fetchHomes} from '../utils/api';

interface HomeContextType {
  homes: Array<any>;
  loading: boolean;
}

const HomeContext = createContext<HomeContextType | undefined>(undefined);

export const HomeProvider = ({children}: {children: React.ReactNode}) => {
  const [homes, setHomes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHomes().then(data => {
      setHomes(data as any);
      setLoading(false);
    });
  }, []);

  return (
    <HomeContext.Provider value={{homes, loading}}>
      {children}
    </HomeContext.Provider>
  );
};

export const useHomes = () => {
  const context = useContext(HomeContext);
  if (!context) throw new Error('useHomes must be used within a HomeProvider');
  return context;
};
