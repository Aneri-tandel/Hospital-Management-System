import styled from "styled-components";
import { useDoctor } from "../Context/DoctorContext";

const ProfileCard = styled.article`
  padding: 26px;
  border: 1px solid #dbe5f1;
  border-top: 4px solid #2563eb;
  border-radius: 16px;
  background: #ffffff;
  box-shadow: 0 4px 16px rgba(15, 23, 42, 0.06);
`;

const ProfileHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 18px;
  margin-bottom: 26px;
  padding-bottom: 22px;
  border-bottom: 1px solid #e2e8f0;

  @media (max-width: 480px) {
    align-items: flex-start;
    flex-direction: column;
  }
`;

const Avatar = styled.div`
  display: grid;
  place-items: center;
  flex-shrink: 0;
  width: 68px;
  height: 68px;
  border-radius: 18px;
  background: #dbeafe;
  color: #1d4ed8;
  font-size: 25px;
  font-weight: 800;
`;

const HeaderInfo = styled.div`
  min-width: 0;
  flex: 1;

  h3 {
    margin: 0 0 6px;
    color: #174a8b;
    font-size: 23px;
    overflow-wrap: anywhere;
  }

  p {
    margin: 0;
    color: #64748b;
    font-size: 14px;
  }
`;

const IdBadge = styled.span`
  display: inline-block;
  margin-top: 10px;
  padding: 5px 10px;
  border-radius: 20px;
  background: #eff6ff;
  color: #1d4ed8;
  font-size: 12px;
  font-weight: 700;
`;

const DetailsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 16px;

  @media (max-width: 500px) {
    grid-template-columns: 1fr;
  }
`;

const DetailCard = styled.div`
  min-width: 0;
  padding: 17px;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  background: #f8fafc;

  span {
    display: block;
    margin-bottom: 8px;
    color: #64748b;
    font-size: 13px;
    font-weight: 600;
  }

  strong {
    display: block;
    color: #1e293b;
    font-size: 15px;
    overflow-wrap: anywhere;
  }
`;

const SpecializationBadge = styled.strong`
  display: inline-block !important;
  width: fit-content;
  padding: 6px 10px;
  border-radius: 7px;
  background: #dcfce7;
  color: #166534 !important;
  font-size: 13px !important;
`;

function getInitials(name) {
  if (!name || typeof name !== "string") return "DR";

  return (
    name
      .replace(/^Dr\.?\s*/i, "")
      .trim()
      .split(/\s+/)
      .slice(0, 2)
      .map((part) => part.charAt(0).toUpperCase())
      .join("") || "DR"
  );
}

function DoctorProfile() {
  const { doctor } = useDoctor();

  if (!doctor || typeof doctor !== "object") {
    return (
      <ProfileCard>Doctor profile information is not available.</ProfileCard>
    );
  }

  const doctorName = typeof doctor.name === "string" ? doctor.name : "Doctor";

  const specialization =
    typeof doctor.specialization === "string"
      ? doctor.specialization
      : "Not specified";

  const email =
    typeof doctor.email === "string" ? doctor.email : "Not specified";

  return (
    <ProfileCard>
      <ProfileHeader>
        <Avatar>{getInitials(doctorName)}</Avatar>

        <HeaderInfo>
          <h3>{doctorName}</h3>
          <p>Hospital Medical Staff</p>
          <IdBadge>Doctor ID: {doctor.doctorId ?? "Not assigned"}</IdBadge>
        </HeaderInfo>
      </ProfileHeader>

      <DetailsGrid>
        <DetailCard>
          <span>Specialization</span>
          <SpecializationBadge>{specialization}</SpecializationBadge>
        </DetailCard>

        <DetailCard>
          <span>Professional Experience</span>
          <strong>
            {doctor.experience ?? "Not specified"}
            {doctor.experience != null ? " years" : ""}
          </strong>
        </DetailCard>

        <DetailCard>
          <span>Email Address</span>
          <strong>{email}</strong>
        </DetailCard>

        <DetailCard>
          <span>Profile Status</span>
          <strong>Registered Doctor</strong>
        </DetailCard>
      </DetailsGrid>
    </ProfileCard>
  );
}

export default DoctorProfile;
