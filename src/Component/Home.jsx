import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";

const API = "http://localhost:8000/api/doctors";

const HomePage = styled.main`
  min-height: 100vh;
  padding: 28px;
  background: ${({ $dark }) => ($dark ? "#0f172a" : "#f1f5f9")};
  color: ${({ $dark }) => ($dark ? "#e2e8f0" : "#172554")};

  @media (max-width: 640px) {
    padding: 16px;
  }
`;

const Welcome = styled.section`
  position: relative;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
  padding: 34px;
  border-radius: 22px;
  color: white;
  background: linear-gradient(120deg, #1d4ed8, #0891b2);
  box-shadow: 0 12px 30px rgba(37, 99, 235, 0.18);

  @media (max-width: 700px) {
    padding: 24px;
    flex-direction: column;
    align-items: flex-start;
  }
`;

const WelcomeContent = styled.div`
  position: relative;
  z-index: 1;
  max-width: 650px;
`;

const Eyebrow = styled.div`
  font-size: 12px;
  font-weight: 800;
  letter-spacing: 2px;
  text-transform: uppercase;
  opacity: 0.85;
`;

const WelcomeTitle = styled.h1`
  margin: 12px 0;
  font-size: clamp(27px, 4vw, 40px);
  line-height: 1.2;
  font-weight: 800;
`;

const WelcomeText = styled.p`
  margin: 0;
  max-width: 560px;
  color: #e0f2fe;
  font-size: 15px;
  line-height: 1.8;
`;

const WelcomeIcon = styled.div`
  font-size: 90px;
  opacity: 0.9;

  @media (max-width: 700px) {
    display: none;
  }
`;

const Actions = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-top: 24px;
`;

const ActionLink = styled(Link)`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 12px 18px;
  border-radius: 10px;
  text-decoration: none;
  font-weight: 700;
  font-size: 13px;
  transition:
    transform 0.2s,
    background 0.2s;

  &:hover {
    transform: translateY(-2px);
  }
`;

const PrimaryAction = styled(ActionLink)`
  color: #1d4ed8;
  background: white;

  &:hover {
    background: #eff6ff;
  }
`;

const SecondaryAction = styled(ActionLink)`
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.5);
  background: rgba(255, 255, 255, 0.1);

  &:hover {
    background: rgba(255, 255, 255, 0.2);
  }
`;

const Section = styled.section`
  margin-top: 30px;
`;

const SectionHeading = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 12px;
  margin-bottom: 18px;
`;

const Title = styled.h2`
  margin: 0;
  font-size: 21px;
  font-weight: 800;
  color: ${({ $dark }) => ($dark ? "#f8fafc" : "#172554")};
`;

const Description = styled.p`
  margin: 6px 0 0;
  color: ${({ $dark }) => ($dark ? "#94a3b8" : "#64748b")};
  font-size: 13px;
  line-height: 1.6;
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 18px;

  @media (max-width: 1000px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  @media (max-width: 480px) {
    grid-template-columns: 1fr;
  }
`;

const StatCard = styled.div`
  padding: 22px;
  border: 1px solid ${({ $dark }) => ($dark ? "#334155" : "#e2e8f0")};
  border-radius: 16px;
  background: ${({ $dark }) => ($dark ? "#1e293b" : "#ffffff")};
  box-shadow: 0 4px 12px rgba(15, 23, 42, 0.03);
`;

const StatTop = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
`;

const StatIcon = styled.div`
  display: grid;
  place-items: center;
  width: 46px;
  height: 46px;
  border-radius: 13px;
  background: ${({ $color }) => $color}18;
  font-size: 23px;
`;

const StatValue = styled.div`
  margin-top: 20px;
  font-size: 32px;
  font-weight: 800;
  color: ${({ $dark }) => ($dark ? "#f8fafc" : "#0f172a")};
`;

const StatLabel = styled.div`
  margin-top: 5px;
  color: ${({ $dark }) => ($dark ? "#94a3b8" : "#64748b")};
  font-size: 13px;
  font-weight: 600;
`;

const Status = styled.span`
  padding: 6px 10px;
  border-radius: 20px;
  background: ${({ $ok }) => ($ok ? "#dcfce7" : "#fef3c7")};
  color: ${({ $ok }) => ($ok ? "#166534" : "#92400e")};
  font-size: 11px;
  font-weight: 800;
`;

const MainGrid = styled.div`
  display: block;
`;

const Panel = styled.div`
  min-width: 0;
  padding: 24px;
  border: 1px solid ${({ $dark }) => ($dark ? "#334155" : "#e2e8f0")};
  border-radius: 18px;
  background: ${({ $dark }) => ($dark ? "#1e293b" : "#ffffff")};
`;

const FeatureList = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 13px;

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
`;

const FeatureLink = styled(Link)`
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 16px;
  border: 1px solid ${({ $dark }) => ($dark ? "#334155" : "#e2e8f0")};
  border-radius: 13px;
  text-decoration: none;
  color: inherit;
  transition:
    border 0.2s,
    transform 0.2s;

  &:hover {
    transform: translateY(-2px);
    border-color: #60a5fa;
  }
`;

const FeatureIcon = styled.div`
  flex-shrink: 0;
  display: grid;
  place-items: center;
  width: 45px;
  height: 45px;
  border-radius: 12px;
  background: ${({ $color }) => $color}18;
  font-size: 23px;
`;

const FeatureInfo = styled.div`
  flex: 1;
  min-width: 0;
`;

const FeatureTitle = styled.div`
  font-size: 14px;
  font-weight: 800;
`;

const FeatureText = styled.div`
  margin-top: 5px;
  color: ${({ $dark }) => ($dark ? "#94a3b8" : "#64748b")};
  font-size: 12px;
  line-height: 1.6;
`;

const Arrow = styled.span`
  color: ${({ $dark }) => ($dark ? "#93c5fd" : "#64748b")};
  font-size: 20px;
`;

const Footer = styled.footer`
  margin-top: 30px;
  padding: 20px 0 5px;
  text-align: center;
  font-size: 12px;
  color: ${({ $dark }) => ($dark ? "#64748b" : "#94a3b8")};
`;

const RetryButton = styled.button`
  margin-top: 12px;
  padding: 9px 14px;
  border: 0;
  border-radius: 8px;
  background: #2563eb;
  color: #fff;
  font: inherit;
  font-weight: 700;
  cursor: pointer;
`;

export default function Home({ darkMode = false }) {
  const [doctors, setDoctors] = useState([]);
  const [patients, setPatients] = useState([]);
  const [apiStatus, setApiStatus] = useState("loading");
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    let active = true;

    async function loadDashboard() {
      try {
        const response = await fetch(API);
        if (!response.ok) {
          throw new Error(`The doctor API returned HTTP ${response.status}.`);
        }
        const doctorData = await response.json();
        if (!Array.isArray(doctorData)) {
          throw new Error("The doctor API returned an invalid response.");
        }

        if (!active) return;
        setDoctors(doctorData);
        setPatients(
          doctorData.flatMap((doctor) =>
            (Array.isArray(doctor.patients) ? doctor.patients : []).map(
              (patient) => ({
                ...patient,
                doctorName: doctor.name,
              }),
            ),
          ),
        );
        setApiStatus("connected");
      } catch {
        if (active) setApiStatus("error");
      }
    }

    loadDashboard();

    return () => {
      active = false;
    };
  }, [refreshKey]);

  const indoorPatients = patients.filter((patient) => {
    const type = String(
      patient.indoor_outdoor || patient.admissionType || "",
    ).toLowerCase();

    return type.includes("indoor");
  }).length;

  const outdoorPatients = patients.filter((patient) => {
    const type = String(
      patient.indoor_outdoor || patient.admissionType || "",
    ).toLowerCase();

    return type.includes("outdoor");
  }).length;

  const stats = [
    {
      label: "Total Patients",
      value: patients.length,
      icon: "🧑‍⚕️",
      color: "#2563eb",
      note: "Registered patient records",
    },
    {
      label: "Total Doctors",
      value: doctors.length,
      icon: "👨‍⚕️",
      color: "#0d9488",
      note: "Available doctor records",
    },
    {
      label: "Indoor Patients",
      value: indoorPatients,
      icon: "🏥",
      color: "#8b5cf6",
      note: "Indoor admission records",
    },
    {
      label: "Outdoor Patients",
      value: outdoorPatients,
      icon: "🩺",
      color: "#ea580c",
      note: "Outdoor visit records",
    },
  ];

  return (
    <HomePage $dark={darkMode}>
      <Welcome>
        <WelcomeContent>
          <Eyebrow>CityCare · Hospital Administration</Eyebrow>

          <WelcomeTitle>
            Good to see you! 👋
            <br />
            Welcome to CityCare Hospital
          </WelcomeTitle>

          <WelcomeText>
            Manage your hospital in one place. Access patient records,
            coordinate medical staff, and review admission information through
            your hospital management dashboard.
          </WelcomeText>

          <Actions>
            <PrimaryAction to="/patient">+ Manage Patients</PrimaryAction>

            <SecondaryAction to="/doctor">+ Manage Doctors</SecondaryAction>
          </Actions>
        </WelcomeContent>

        <WelcomeIcon>🏥</WelcomeIcon>
      </Welcome>

      <Section>
        <SectionHeading>
          <div>
            <Title $dark={darkMode}>Hospital Overview</Title>
            <Description $dark={darkMode}>
              A summary of the records currently available in your system.
            </Description>
          </div>

          <Status $ok={apiStatus === "connected"}>
            {apiStatus === "connected"
              ? "● SYSTEM CONNECTED"
              : apiStatus === "loading"
                ? "● LOADING DATA"
                : "● CONNECTION ISSUE"}
          </Status>
        </SectionHeading>

        {apiStatus === "error" && (
          <div>
            <Description $dark={darkMode}>
              Could not connect to the backend at {API}. Start the backend from
              the Backend folder with <code>npm run dev</code>, then retry.
            </Description>
            <RetryButton
              type="button"
              onClick={() => {
                setApiStatus("loading");
                setRefreshKey((key) => key + 1);
              }}
            >
              Retry connection
            </RetryButton>
          </div>
        )}

        <StatsGrid>
          {stats.map((stat) => (
            <StatCard key={stat.label} $dark={darkMode}>
              <StatTop>
                <StatLabel $dark={darkMode}>{stat.label}</StatLabel>
                <StatIcon $color={stat.color}>{stat.icon}</StatIcon>
              </StatTop>

              <StatValue $dark={darkMode}>
                {apiStatus === "loading" ? "—" : stat.value}
              </StatValue>

              <Description $dark={darkMode}>{stat.note}</Description>
            </StatCard>
          ))}
        </StatsGrid>
      </Section>

      <Section>
        <MainGrid>
          <Panel $dark={darkMode}>
            <SectionHeading>
              <div>
                <Title $dark={darkMode}>Quick Access</Title>
                <Description $dark={darkMode}>
                  Navigate to the tools you use every day.
                </Description>
              </div>
            </SectionHeading>

            <FeatureList>
              <FeatureLink to="/patient" $dark={darkMode}>
                <FeatureIcon $color="#2563eb">👥</FeatureIcon>
                <FeatureInfo>
                  <FeatureTitle>Patient Management</FeatureTitle>
                  <FeatureText $dark={darkMode}>
                    Register patients and manage admission details.
                  </FeatureText>
                </FeatureInfo>
                <Arrow $dark={darkMode}>→</Arrow>
              </FeatureLink>

              <FeatureLink to="/doctor" $dark={darkMode}>
                <FeatureIcon $color="#0d9488">🩺</FeatureIcon>
                <FeatureInfo>
                  <FeatureTitle>Doctor Directory</FeatureTitle>
                  <FeatureText $dark={darkMode}>
                    Add doctors and review their specializations.
                  </FeatureText>
                </FeatureInfo>
                <Arrow $dark={darkMode}>→</Arrow>
              </FeatureLink>

              <FeatureLink to="/patient-records" $dark={darkMode}>
                <FeatureIcon $color="#8b5cf6">📋</FeatureIcon>
                <FeatureInfo>
                  <FeatureTitle>Patient Records</FeatureTitle>
                  <FeatureText $dark={darkMode}>
                    View and review existing patient information.
                  </FeatureText>
                </FeatureInfo>
                <Arrow $dark={darkMode}>→</Arrow>
              </FeatureLink>

              <FeatureLink to="/doctor-dashboard" $dark={darkMode}>
                <FeatureIcon $color="#ea580c">📊</FeatureIcon>
                <FeatureInfo>
                  <FeatureTitle>Doctor Dashboard</FeatureTitle>
                  <FeatureText $dark={darkMode}>
                    Access your existing doctor dashboard.
                  </FeatureText>
                </FeatureInfo>
                <Arrow $dark={darkMode}>→</Arrow>
              </FeatureLink>
            </FeatureList>
          </Panel>

        </MainGrid>
      </Section>

      <Footer $dark={darkMode}>
        © {new Date().getFullYear()} CityCare Hospital Management System ·
        Patient care, organized.
      </Footer>
    </HomePage>
  );
}
