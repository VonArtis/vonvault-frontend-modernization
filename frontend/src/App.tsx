import React, { useState, useEffect } from "react";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import axios from "axios";
import { ScreenType } from "./types";

// Import the 4 core staking screens (PHASE 1)
import StakingDashboardScreen from "./components/screens/StakingDashboardScreen.V28";
import StakingFlowConvertScreen from "./components/screens/StakingFlowConvertScreen.V3";
import CreateStakingScreen from "./components/screens/CreateStakingScreen.V24";
import StakingCompletionScreen from "./components/screens/StakingCompletionScreen.V3";

// Import the 3 supporting staking screens (PHASE 2)  
import StakingHistoryScreen from "./components/screens/StakingHistoryScreen.V17";
import StakingAnalyticsScreen from "./components/screens/StakingAnalyticsScreen.V24";
import StakingTiersScreen from "./components/screens/StakingTiersScreen.V6";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const Home: React.FC = () => {
  const helloWorldApi = async () => {
    try {
      const response = await axios.get(`${API}/`);
      console.log(response.data.message);
    } catch (e) {
      console.error(e, `errored out requesting / api`);
    }
  };

  useEffect(() => {
    helloWorldApi();
  }, []);

  return (
    <div>
      <header className="App-header">
        <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg width="32" height="32" viewBox="0 0 200 200" className="flex-shrink-0">
            <circle cx="100" cy="100" r="100" fill="#000000"/>
            <circle cx="100" cy="100" r="85" fill="none" stroke="#8B5CF6" strokeWidth="8"/>
            <path d="M 65 65 L 100 135 L 135 65" 
                  fill="none" 
                  stroke="#8B5CF6" 
                  strokeWidth="16" 
                  strokeLinecap="square" 
                  strokeLinejoin="miter"/>
          </svg>
        </div>
        <h1 className="text-3xl font-bold text-white mb-4">VonVault Staking Platform</h1>
        <p className="text-gray-300 mb-8">PHASE 1 & 2: Complete Staking Integration</p>
        
        <div className="grid grid-cols-2 gap-4 max-w-2xl mx-auto">
          {/* PHASE 1: Core Staking Flow */}
          <a
            href="/dashboard"
            className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-6 rounded-xl transition-all text-center"
          >
            📊 Dashboard
          </a>
          <a
            href="/convert"
            className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-xl transition-all text-center"
          >
            💱 Convert Assets
          </a>
          <a
            href="/create"
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-xl transition-all text-center"
          >
            ➕ Create Stake
          </a>
          <a
            href="/completion"
            className="bg-amber-600 hover:bg-amber-700 text-white font-bold py-3 px-6 rounded-xl transition-all text-center"
          >
            ✅ Completion
          </a>
          
          {/* PHASE 2: Supporting Features */}
          <a
            href="/history"
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-6 rounded-xl transition-all text-center"
          >
            📜 History
          </a>
          <a
            href="/analytics"
            className="bg-cyan-600 hover:bg-cyan-700 text-white font-bold py-3 px-6 rounded-xl transition-all text-center"
          >
            📈 Analytics
          </a>
          <a
            href="/tiers"
            className="bg-pink-600 hover:bg-pink-700 text-white font-bold py-3 px-6 rounded-xl transition-all text-center col-span-2"
          >
            🏆 Staking Tiers
          </a>
        </div>
      </header>
    </div>
  );
};

const AppRouter: React.FC = () => {
  const [currentScreen, setCurrentScreen] = useState<ScreenType>('dashboard');

  const handleNavigate = (screen: string) => {
    setCurrentScreen(screen as ScreenType);
  };

  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route 
            path="/dashboard" 
            element={
              <StakingDashboardScreen 
                onNavigate={handleNavigate} 
              />
            } 
          />
          <Route 
            path="/convert" 
            element={
              <StakingFlowConvertScreen />
            } 
          />
          <Route 
            path="/create" 
            element={
              <CreateStakingScreen 
                onBack={() => handleNavigate('staking-flow-convert')}
                onNavigate={handleNavigate}
              />
            } 
          />
          <Route 
            path="/completion" 
            element={
              <StakingCompletionScreen />
            } 
          />
        </Routes>
      </BrowserRouter>
    </div>
  );
};

function App() {
  return <AppRouter />;
}

export default App;