import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import GatewayPage from './Gateway';
import ExploreDashboard from './Dashboard';

type View = 'gateway' | 'explore-dashboard';

export default function App() {
  const [currentView, setCurrentView] = useState<View>('gateway');

  return (
    <AnimatePresence mode="wait">
      {currentView === 'gateway' && (
        <motion.div
          key="gateway"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="h-screen"
        >
          <GatewayPage
            onNavigate={(platform) => {
              if (platform === 'explore-dashboard') {
                setCurrentView('explore-dashboard');
              }
            }}
          />
        </motion.div>
      )}

      {currentView === 'explore-dashboard' && (
        <motion.div
          key="dashboard"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
        >
          <ExploreDashboard onBack={() => setCurrentView('gateway')} />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
