import styled from "styled-components";
import { DoctorProvider } from "../Context/DoctorContext";
import DoctorProfile from "./DoctorProfile";
import AssignPatientForm from "./AssignPatientForm";
import PatientList from "./PatientList";

const Dashboard = styled.main`
  min-height: 100vh;
  padding: 36px 24px 60px;
  background: #f1f5f9;
  box-sizing: border-box;

  @media (max-width: 600px) {
    padding: 24px 14px 40px;
  }
`;

const Container = styled.div`
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
`;

const Header = styled.header`
  margin-bottom: 32px;
  padding-bottom: 22px;
  border-bottom: 1px solid #dbe5f1;

  h1 {
    margin: 0 0 8px;
    color: #174a8b;
    font-size: clamp(26px, 4vw, 34px);
    font-weight: 750;
  }

  p {
    margin: 0;
    color: #64748b;
    font-size: 15px;
    line-height: 1.6;
  }
`;

const Section = styled.section`
  min-width: 0;
  margin-bottom: 32px;

  h2 {
    margin: 0 0 16px;
    color: #1e293b;
    font-size: 21px;
    font-weight: 700;
  }
`;

const RecordsHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 10px;
  margin-bottom: 8px;

  h2 {
    margin: 0;
  }

  span {
    color: #64748b;
    font-size: 13px;
  }
`;

function DashboardContent() {
  return (
    <Dashboard>
      <Container>
        <Header>
          <h1>Hospital Management System</h1>
          <p>
            Manage doctor information, register patients, and monitor assigned
            patient records.
          </p>
        </Header>

        <Section>
          <h2>Doctor Information</h2>
          <DoctorProfile />
        </Section>

        <Section>
          <h2>Patient Registration</h2>
          <AssignPatientForm />
        </Section>

        <Section>
          <RecordsHeader>
            <h2>Patient Records</h2>
            <span>Assigned patients</span>
          </RecordsHeader>

          <PatientList />
        </Section>
      </Container>
    </Dashboard>
  );
}

export default function DoctorDashboard() {
  return (
    <DoctorProvider>
      <DashboardContent />
    </DoctorProvider>
  );
}
