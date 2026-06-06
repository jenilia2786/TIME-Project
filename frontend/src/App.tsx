import { useState } from 'react';
import AppDashboard from './AppDashboard'; // We will rename the original App.tsx to AppDashboard.tsx
import Onboarding from './Onboarding';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // In a real app, we would check for the JWT token here using useEffect

  if (!isAuthenticated) {
    return <Onboarding onComplete={() => setIsAuthenticated(true)} />;
  }

  return <AppDashboard />;
}

export default App;
