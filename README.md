# Real Estate App

## Overview

This project is a React Native application for real estate companies that allows users to view homes, see details, and unlock or lock homes based on their location. The following tasks have been successfully completed:

## Task Requirements

### 1. Basic UI/UX

- Created a clean and basic UI with a focus on functionality.
- The design emphasizes usability and practical features rather than advanced aesthetics.

### 2. Mock API

- Implemented mock API responses using JSON files to simulate API interactions.
- The mock APIs include endpoints for fetching home lists and simulating unlock and lock operations.

### 3. Home List

- After logging in, users are presented with a list of homes available for unlocking.
- Each home in the list displays basic information, including:
  - Address
  - Image
  - Description
- Mock API used to fetch the list of homes.

### 4. Home Details and Unlock Feature

- Users can select a home from the list to navigate to a detailed view of the home.
- The details screen provides more comprehensive information about the home and includes an "Unlock" button.
- The "Unlock" button is only visible if the user’s current location is within 30 meters of the home.
- Pressing the "Unlock" button simulates an API call to unlock the home and displays a success or error message based on the response.

### 5. Lock and Unlock Functionality

- The functionality for locking and unlocking homes is simulated with mock API functions.
- Both `unlockHome` and `lockHome` functions have a 50% chance of success or failure:

  - `unlockHome`: Simulates unlocking a home with a random success or failure response.
  - `lockHome`: Simulates locking a home with a random success or failure response.

  ```typescript
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

  export const lockHome = async (homeId: string) => {
    return new Promise((resolve, reject) => {
      // Simulate success/failure response
      if (Math.random() > 0.5) {
        resolve({message: 'Home locked successfully!'});
      } else {
        reject({message: 'Failed to lock home.'});
      }
    });
  };
  ```

## Start your Application

Let Metro Bundler run in its _own_ terminal. Open a _new_ terminal from the _root_ of your React Native project. Run the following command to start your _Android_ or _iOS_ app:

### For Android

```bash
# using npm
npm run android

# OR using Yarn
yarn android
```

### For iOS

```bash
# using npm
npm run ios

# OR using Yarn
yarn ios
```
