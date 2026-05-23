import { Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Dashboard from "./dashboard/Dashboard";
import DesignStudio from "./dashboard/DesignStudio";
import Settings from "./dashboard/Settings";

import ProtectedRoute from "./routes/ProtectedRoute";
import DashLayout from "./layout/DashLayout";

function App() {
  return (
    <Routes>
      {/* HOME PAGE */}
      <Route path="/" element={<Home />} />

      {/* DASHBOARD LAYOUT */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <DashLayout />
          </ProtectedRoute>
        }
      >
        {/* DEFAULT DASHBOARD PAGE */}
        <Route index element={<Dashboard />} />

        {/* SIDEBAR ROUTES */}
        <Route path="design-studio" element={<DesignStudio />} />
        <Route path="settings" element={<Settings />} />
      </Route>
    </Routes>
  );
}

export default App;