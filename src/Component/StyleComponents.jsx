import styled, { createGlobalStyle, keyframes } from "styled-components";

/* ================= GLOBAL STYLE ================= */

export const GlobalStyle = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  html {
    scroll-behavior: smooth;
  }

  body {
    font-family: "Segoe UI", Arial, sans-serif;
    background: ${({ $darkMode }) => ($darkMode ? "#0f172a" : "#f4f8fb")};
    color: ${({ $darkMode }) => ($darkMode ? "#e2e8f0" : "#172b4d")};
    transition: background 0.3s ease, color 0.3s ease;
  }

  button, input, select, textarea {
    font-family: inherit;
  }

  a {
    text-decoration: none;
  }
`;

/* ================= ANIMATIONS ================= */

const fadeUp = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

const floatAnimation = keyframes`
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
`;

const pulse = keyframes`
  0%, 100% { box-shadow: 0 0 0 0 rgba(14,165,233,0.35); }
  70% { box-shadow: 0 0 0 12px rgba(14,165,233,0); }
`;

/* ================= APP ================= */

export const AppContainer = styled.div`
  min-height: 100vh;
  background: ${({ $darkMode }) => ($darkMode ? "#0f172a" : "#f4f8fb")};
  color: ${({ $darkMode }) => ($darkMode ? "#e2e8f0" : "#172b4d")};
  transition:
    background 0.3s ease,
    color 0.3s ease;
`;

export const PageContainer = styled.main`
  width: 92%;
  max-width: 1250px;
  margin: 0 auto;
  padding: 40px 0 60px;
`;

/* ================= NAVBAR ================= */

export const NavbarContainer = styled.nav`
  width: 100%;
  background: ${({ $darkMode }) =>
    $darkMode ? "rgba(15,23,42,0.97)" : "rgba(255,255,255,0.97)"};
  border-bottom: 1px solid
    ${({ $darkMode }) => ($darkMode ? "#26364d" : "#e4edf4")};
  box-shadow: 0 5px 20px rgba(20, 60, 90, 0.08);
  position: sticky;
  top: 0;
  z-index: 1000;
  transition: all 0.3s ease;
`;

export const NavbarInner = styled.div`
  width: 92%;
  max-width: 1250px;
  min-height: 75px;
  margin: auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 18px;

  @media (max-width: 650px) {
    flex-direction: column;
    padding: 15px 0;
  }
`;

export const Logo = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

export const LogoIcon = styled.div`
  width: 45px;
  height: 45px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #0ea5e9, #2563eb);
  color: white;
  font-size: 23px;
`;

export const LogoText = styled.div`
  strong {
    display: block;
    color: ${({ $darkMode }) => ($darkMode ? "#f1f5f9" : "#12304a")};
    font-size: 18px;
  }

  span {
    display: block;
    color: ${({ $darkMode }) => ($darkMode ? "#94a3b8" : "#6b8295")};
    font-size: 12px;
  }
`;

export const NavLinks = styled.ul`
  list-style: none;
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  justify-content: center;
  gap: 8px;
`;

export const NavItem = styled.li`
  a {
    display: block;
    padding: 10px 13px;
    border-radius: 10px;
    color: ${({ $darkMode }) => ($darkMode ? "#cbd5e1" : "#526b7d")};
    font-size: 14px;
    font-weight: 600;
    transition: all 0.2s ease;
  }

  a:hover {
    background: ${({ $darkMode }) => ($darkMode ? "#1e3a5f" : "#eaf6fd")};
    color: #0284c7;
  }

  a.active {
    background: ${({ $darkMode }) => ($darkMode ? "#164e63" : "#e0f2fe")};
    color: ${({ $darkMode }) => ($darkMode ? "#67e8f9" : "#0284c7")};
  }
`;

export const ThemeButton = styled.button`
  min-height: 42px;
  padding: 0 13px;
  border: 1px solid ${({ $darkMode }) => ($darkMode ? "#475569" : "#bae6fd")};
  border-radius: 10px;
  background: ${({ $darkMode }) => ($darkMode ? "#1e293b" : "#e0f2fe")};
  color: ${({ $darkMode }) => ($darkMode ? "#f8fafc" : "#075985")};
  font-size: 16px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
`;

export const ThemeText = styled.span`
  font-size: 13px;
  font-weight: 700;
`;

/* ================= COMMON FORM COMPONENTS ================= */

export const Card = styled.section`
  background: ${({ $darkMode }) => ($darkMode ? "#1e293b" : "#ffffff")};
  color: ${({ $darkMode }) => ($darkMode ? "#e2e8f0" : "#172b4d")};
  padding: 24px;
  margin-bottom: 22px;
  border: 1px solid ${({ $darkMode }) => ($darkMode ? "#334155" : "#e2e8f0")};
  border-radius: 16px;
  box-shadow: 0 8px 25px rgba(15, 23, 42, 0.06);
  animation: ${fadeUp} 0.4s ease;
`;

export const Heading = styled.h2`
  font-size: 23px;
  margin-bottom: 18px;
  color: inherit;
`;

export const Form = styled.form`
  display: grid;
  gap: 13px;
  margin-bottom: 18px;
`;

export const Input = styled.input`
  width: 100%;
  min-width: 0;
  padding: 12px 14px;
  border: 1px solid #cbd5e1;
  border-radius: 9px;
  background: #ffffff;
  color: #172b4d;
  font-size: 14px;

  &:focus {
    outline: 2px solid #93c5fd;
    border-color: #2563eb;
  }
`;

export const Select = styled.select`
  width: 100%;
  padding: 12px 14px;
  border: 1px solid #cbd5e1;
  border-radius: 9px;
  background: #ffffff;
  color: #172b4d;
  font-size: 14px;

  &:focus {
    outline: 2px solid #93c5fd;
  }
`;

export const TextArea = styled.textarea`
  width: 100%;
  min-height: 100px;
  padding: 12px 14px;
  border: 1px solid #cbd5e1;
  border-radius: 9px;
  resize: vertical;
  background: #ffffff;
  color: #172b4d;
  font-size: 14px;
`;

export const Button = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 11px 18px;
  border: none;
  border-radius: 9px;
  background: ${({ $secondary }) => ($secondary ? "#475569" : "#2563eb")};
  color: white;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: ${({ $secondary }) => ($secondary ? "#334155" : "#1d4ed8")};
    transform: translateY(-1px);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }
`;

export const Message = styled.p`
  padding: 12px;
  margin: 14px 0;
  border-radius: 9px;
  background: ${({ $error }) => ($error ? "#fee2e2" : "#dcfce7")};
  color: ${({ $error }) => ($error ? "#991b1b" : "#166534")};
  font-size: 14px;
`;

export const Item = styled.div`
  padding: 15px;
  margin-top: 12px;
  border: 1px solid ${({ $darkMode }) => ($darkMode ? "#475569" : "#e2e8f0")};
  border-radius: 10px;
  background: ${({ $darkMode }) => ($darkMode ? "#0f172a" : "#f8fafc")};
  color: ${({ $darkMode }) => ($darkMode ? "#e2e8f0" : "#334155")};
`;

/* ================= HERO ================= */

export const Hero = styled.section`
  min-height: 430px;
  padding: 60px;
  border-radius: 25px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 30px;
  color: white;
  background: linear-gradient(135deg, #075985, #0284c7 55%, #38bdf8);
  animation: ${fadeUp} 0.6s ease;

  @media (max-width: 650px) {
    padding: 35px 22px;
    flex-direction: column;
    text-align: center;
  }
`;

export const HeroContent = styled.div`
  max-width: 650px;
`;

export const HeroBadge = styled.span`
  display: inline-block;
  padding: 8px 14px;
  margin-bottom: 18px;
  border-radius: 30px;
  background: rgba(255, 255, 255, 0.15);
`;

export const HeroTitle = styled.h1`
  font-size: clamp(34px, 5vw, 60px);
  line-height: 1.1;
  margin-bottom: 20px;
`;

export const HeroText = styled.p`
  font-size: 17px;
  line-height: 1.7;
  margin-bottom: 25px;
`;

export const HeroButton = styled.button`
  padding: 13px 22px;
  border: none;
  border-radius: 10px;
  background: white;
  color: #0369a1;
  font-weight: 700;
  cursor: pointer;
`;

export const HeroVisual = styled.div`
  width: 240px;
  height: 240px;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.15);
  font-size: 100px;
  animation: ${floatAnimation} 4s ease-in-out infinite;
`;

/* ================= DASHBOARD STATISTICS ================= */

export const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 20px;
  margin: 30px 0;

  @media (max-width: 900px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  @media (max-width: 600px) {
    grid-template-columns: 1fr;
  }
`;

export const StatCard = styled.div`
  padding: 24px;
  border-radius: 16px;
  background: ${({ $darkMode }) => ($darkMode ? "#1e293b" : "#ffffff")};
  border: 1px solid ${({ $darkMode }) => ($darkMode ? "#334155" : "#e3edf5")};
  animation: ${fadeUp} 0.5s ease;
`;

export const StatIcon = styled.div`
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 12px;
  background: ${({ $darkMode }) => ($darkMode ? "#164e63" : "#e0f2fe")};
  font-size: 22px;
  margin-bottom: 14px;
`;

export const StatNumber = styled.h2`
  font-size: 30px;
  color: ${({ $darkMode }) => ($darkMode ? "#f1f5f9" : "#12304a")};
`;

export const StatLabel = styled.p`
  margin-top: 5px;
  color: ${({ $darkMode }) => ($darkMode ? "#94a3b8" : "#7890a2")};
`;

/* ================= SECTIONS ================= */

export const Section = styled.section`
  margin-top: 40px;
`;

export const SectionHeader = styled.div`
  margin-bottom: 22px;

  h2 {
    font-size: 27px;
    color: ${({ $darkMode }) => ($darkMode ? "#f1f5f9" : "#12304a")};
  }

  p {
    margin-top: 7px;
    color: ${({ $darkMode }) => ($darkMode ? "#94a3b8" : "#7890a2")};
  }
`;

/* ================= PATIENT COMPONENTS ================= */

export const PatientGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 20px;

  @media (max-width: 900px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  @media (max-width: 650px) {
    grid-template-columns: 1fr;
  }
`;

export const PatientCard = styled.div`
  padding: 22px;
  border-radius: 18px;
  background: ${({ $darkMode }) => ($darkMode ? "#1e293b" : "#ffffff")};
  color: ${({ $darkMode }) => ($darkMode ? "#e2e8f0" : "#172b4d")};
  border: 1px solid ${({ $darkMode }) => ($darkMode ? "#334155" : "#e2e8f0")};
  box-shadow: 0 8px 25px rgba(15, 23, 42, 0.06);
  transition: transform 0.25s ease;

  &:hover {
    transform: translateY(-4px);
  }
`;

export const PatientHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding-bottom: 16px;
  border-bottom: 1px solid
    ${({ $darkMode }) => ($darkMode ? "#334155" : "#edf2f7")};
`;

export const PatientAvatar = styled.div`
  width: 52px;
  height: 52px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background: #e0f2fe;
  font-size: 24px;
`;

export const PatientInfo = styled.div`
  flex: 1;

  h3 {
    font-size: 18px;
    color: ${({ $darkMode }) => ($darkMode ? "#f8fafc" : "#12304a")};
  }
`;

export const PatientId = styled.span`
  font-size: 12px;
  color: #7890a2;
`;

export const PatientStatus = styled.span`
  padding: 6px 10px;
  border-radius: 20px;
  font-size: 11px;
  font-weight: 700;

  color: ${({ $status }) =>
    $status === "Critical"
      ? "#dc2626"
      : $status === "Under Treatment"
        ? "#d97706"
        : "#16a34a"};

  background: ${({ $status }) =>
    $status === "Critical"
      ? "#fee2e2"
      : $status === "Under Treatment"
        ? "#fef3c7"
        : "#dcfce7"};
`;

export const PatientDetails = styled.div`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 12px;
  padding: 18px 0;
`;

export const DetailItem = styled.div`
  margin-bottom: 12px;
`;

export const DetailLabel = styled.div`
  margin-bottom: 5px;
  color: #8ca0af;
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

export const DetailValue = styled.div`
  color: ${({ $darkMode }) => ($darkMode ? "#e2e8f0" : "#334e68")};
  font-size: 14px;
  font-weight: 600;
`;

export const PatientFooter = styled.div`
  display: flex;
  justify-content: flex-end;
  padding-top: 12px;
  border-top: 1px solid
    ${({ $darkMode }) => ($darkMode ? "#334155" : "#edf2f7")};
`;

export const ViewButton = styled.button`
  padding: 9px 15px;
  border: none;
  border-radius: 9px;
  background: #e0f2fe;
  color: #0284c7;
  font-size: 13px;
  font-weight: 700;
  cursor: pointer;

  &:hover {
    background: #0284c7;
    color: white;
  }
`;

export const PatientIcon = styled.div`
  width: 50px;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background: ${({ $darkMode }) => ($darkMode ? "#164e63" : "#e0f2fe")};
  font-size: 23px;
  margin-bottom: 15px;
`;

/* ================= DOCTOR COMPONENTS ================= */

export const DoctorGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 20px;

  @media (max-width: 900px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  @media (max-width: 650px) {
    grid-template-columns: 1fr;
  }
`;

export const DoctorCard = styled.div`
  padding: 25px;
  border-radius: 20px;
  background: ${({ $darkMode, $bgc }) =>
    $darkMode ? "#1e293b" : $bgc || "#ffffff"};
  color: ${({ $darkMode }) => ($darkMode ? "#e2e8f0" : "#17324d")};
  border: 1px solid ${({ $darkMode }) => ($darkMode ? "#334155" : "#e2e8f2")};
  box-shadow: 0 8px 25px rgba(40, 80, 110, 0.08);
  animation: ${fadeUp} 0.5s ease;
  transition: transform 0.25s ease;

  &:hover {
    transform: translateY(-5px);
  }

  h2 {
    margin-bottom: 15px;
  }

  p {
    color: ${({ $darkMode }) => ($darkMode ? "#cbd5e1" : "#526b7d")};
    margin: 9px 0;
  }
`;

export const DoctorIcon = styled.div`
  width: 65px;
  height: 65px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background: ${({ $darkMode }) => ($darkMode ? "#334155" : "#e0f2fe")};
  font-size: 32px;
  margin-bottom: 15px;
  animation: ${pulse} 2.5s infinite;
`;

/* ================= FOOTER ================= */

export const Footer = styled.footer`
  margin-top: 50px;
  padding: 28px;
  text-align: center;
  background: ${({ $darkMode }) => ($darkMode ? "#020617" : "#0f2940")};
  color: ${({ $darkMode }) => ($darkMode ? "#94a3b8" : "#b7cad8")};
  border-radius: 18px;
`;

/* ================= RESPONSIVE STYLE ================= */

export const ResponsiveStyle = createGlobalStyle`
  @media (max-width: 650px) {
    ${PatientDetails} {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }
  }
`;

export const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 20px;
  align-items: start;

  @media (max-width: 650px) {
    grid-template-columns: 1fr;
  }
`;
export const Page = styled.div`
  width: 100%;
  min-height: 100vh;
  padding: 24px;
  box-sizing: border-box;

  @media (max-width: 768px) {
    padding: 16px;
  }
`;
export const Subtitle = styled.p`
  font-size: 16px;
  color: #64748b;
  line-height: 1.6;
  margin: 8px 0 20px;

  @media (max-width: 768px) {
    font-size: 14px;
  }
`;
