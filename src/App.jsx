import { useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

import Home from "./Component/Home";
import NavBar from "./Component/NavBar";
import Patient from "./Component/Patient";
import Doctor from "./Component/Doctor";
import PatientRecordManager from "./Component/PatientRecordManager";
import DoctorDashboard from "./Component/DoctorDashboard";

import { AppContainer, GlobalStyle, ResponsiveStyle } from "./Component/StyleComponents";

function App() {
  const [darkMode, setDarkMode] = useState(false);

  return (
    <Router>
      <GlobalStyle $darkMode={darkMode} />
      <ResponsiveStyle />
      <AppContainer $darkMode={darkMode}>
        <NavBar darkMode={darkMode} setDarkMode={setDarkMode} />

        <Routes>
          <Route path="/" element={<Home darkMode={darkMode} />} />
          <Route path="/patient" element={<Patient darkMode={darkMode} />} />
          <Route path="/doctor" element={<Doctor darkMode={darkMode} />} />
          <Route path="/patient-records" element={<PatientRecordManager />} />
          <Route path="/doctor-dashboard" element={<DoctorDashboard />} />
        </Routes>
      </AppContainer>
    </Router>
  );
}

export default App;
