import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Login from "./pages/Login";
import Overview from "./pages/Overview";
import CallHistory from "./pages/CallHistory";
import Configuration from "./pages/Configuration";
import Layout from "./components/Layout";

function App() {
  return (
    <Router>
      <div className="w-full h-screen">
        <Routes>
          <Route path="/" element={<Login />} />
          <Route
            path="/overview"
            element={
              <Layout>
                <Overview />
              </Layout>
            }
          />
          <Route
            path="/call-history"
            element={
              <Layout>
                <CallHistory />
              </Layout>
            }
          />
          <Route
            path="/configuration"
            element={
              <Layout>
                <Configuration />
              </Layout>
            }
          />
          {/* Redirect old call-history route to new structure */}
          <Route
            path="/call-history-old"
            element={<Navigate to="/call-history" replace />}
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
