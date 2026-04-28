import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ClientList from "./pages/ClientList";
import ClientProfile from "./pages/ClientProfile";
import AddClient from "./pages/AddClient";
import GenerateReport from "./pages/GenerateReport";
import ReportHistory from "./pages/ReportHistory";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<ClientList />} />
        <Route path="/client/:id" element={<ClientProfile />} />
        <Route path="/add-client" element={<AddClient />} />
        <Route
          path="/client/:id/generate-report"
          element={<GenerateReport />}
        />
        <Route path="/client/:id/history" element={<ReportHistory />} />
      </Routes>
    </Router>
  );
}

export default App;
