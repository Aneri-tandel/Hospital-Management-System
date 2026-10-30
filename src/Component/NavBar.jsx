import React from "react";
import { NavLink } from "react-router-dom";

import {
  NavbarContainer,
  NavbarInner,
  Logo,
  LogoIcon,
  LogoText,
  NavLinks,
  NavItem,
  ThemeButton,
  ThemeText,
} from "./StyleComponents";

function NavBar({ darkMode, setDarkMode }) {
  return (
    <NavbarContainer $darkMode={darkMode}>
      <NavbarInner>
        {/* LOGO */}
        <Logo>
          <LogoIcon>🏥</LogoIcon>

          <LogoText $darkMode={darkMode}>
            <strong>CityCare Hospital</strong>
            <span>Patient Management System</span>
          </LogoText>
        </Logo>

        {/* NAVIGATION */}
        <NavLinks>
          <NavItem $darkMode={darkMode}>
            <NavLink to="/" end>
              🏠 Home
            </NavLink>
          </NavItem>

          <NavItem $darkMode={darkMode}>
            <NavLink to="/patient">👤 Patients</NavLink>
          </NavItem>

          <NavItem $darkMode={darkMode}>
            <NavLink to="/doctor">🩺 Doctors</NavLink>
          </NavItem>

          <NavItem $darkMode={darkMode}>
            <NavLink to="/patient-records">📋 Patient Records</NavLink>
          </NavItem>

          <NavItem $darkMode={darkMode}>
            <NavLink to="/doctor-dashboard">📊 Doctor Dashboard</NavLink>
          </NavItem>

          {/* DARK MODE */}
          <ThemeButton
            type="button"
            $darkMode={darkMode}
            onClick={() => setDarkMode((previous) => !previous)}
            title="Toggle Dark Mode"
            aria-label="Toggle dark mode"
          >
            {darkMode ? "☀️" : "🌙"}
            <ThemeText>{darkMode ? "Light" : "Dark"}</ThemeText>
          </ThemeButton>
        </NavLinks>
      </NavbarInner>
    </NavbarContainer>
  );
}

export default NavBar;
