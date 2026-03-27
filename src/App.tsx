import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ProjectProvider } from './context/ProjectContext';
import Landing from './pages/Landing';
import DashboardLayout from './components/layout/DashboardLayout';
import Dashboard from './pages/Dashboard';
import MarketResearch from './pages/modules/MarketResearch';
import Competitors from './pages/modules/Competitors';
import WebsiteBuilder from './pages/modules/WebsiteBuilder';
import MarketingKit from './pages/modules/MarketingKit';
import FundingMatcher from './pages/modules/FundingMatcher';
import Deployments from './pages/modules/Deployments';
import MyProjects from './pages/MyProjects';

function App() {
  return (
    <ProjectProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/dashboard" element={<DashboardLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="projects" element={<MyProjects />} />
            <Route path="research" element={<MarketResearch />} />
            <Route path="competitors" element={<Competitors />} />
            <Route path="website" element={<WebsiteBuilder />} />
            <Route path="marketing" element={<MarketingKit />} />
            <Route path="funding" element={<FundingMatcher />} />
            <Route path="deployments" element={<Deployments />} />
          </Route>
        </Routes>
      </Router>
    </ProjectProvider>
  );
}

export default App;
