import {homes} from './mockData';

export const fetchHomes = async () => {
  return new Promise(resolve => {
    setTimeout(() => resolve(homes), 1000);
  });
};

export const unlockHome = async (homeId: string) => {
  return new Promise((resolve, reject) => {
    // Simulate success/failure response
    if (Math.random() > 0.5) {
      resolve({message: 'Home unlocked successfully!'});
    } else {
      reject({message: 'Failed to unlock home.'});
    }
  });
};
