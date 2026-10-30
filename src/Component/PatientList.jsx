import styled from "styled-components";
import { useDoctor } from "../Context/DoctorContext";

const List = styled.div`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 20px;
  margin-top: 20px;

  @media (max-width: 1000px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  @media (max-width: 650px) {
    grid-template-columns: 1fr;
  }
`;

const Card = styled.article`
  min-width: 0;
  padding: 22px;
  border: 1px solid #dbe5f1;
  border-top: 4px solid #2563eb;
  border-radius: 14px;
  background: #fff;
  box-shadow: 0 4px 14px rgba(15, 23, 42, 0.06);
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease;

  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 10px 24px rgba(15, 23, 42, 0.1);
  }
`;

const CardHeader = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 10px;
  margin-bottom: 18px;
`;

const PatientName = styled.h3`
  min-width: 0;
  margin: 0;
  color: #174a8b;
  font-size: 19px;
  line-height: 1.4;
  overflow-wrap: anywhere;
`;

const PatientId = styled.span`
  flex-shrink: 0;
  padding: 5px 9px;
  border-radius: 7px;
  background: #eff6ff;
  color: #1d4ed8;
  font-size: 12px;
  font-weight: 700;
`;

const Details = styled.div`
  display: grid;
  gap: 13px;
`;

const DetailRow = styled.div`
  display: grid;
  grid-template-columns: 105px minmax(0, 1fr);
  align-items: start;
  gap: 8px;
  font-size: 14px;
  line-height: 1.5;

  @media (max-width: 360px) {
    grid-template-columns: 90px minmax(0, 1fr);
  }
`;

const Label = styled.span`
  color: #64748b;
  font-weight: 600;
`;

const Value = styled.span`
  min-width: 0;
  color: #1e293b;
  overflow-wrap: anywhere;
  white-space: pre-wrap;
`;

const StatusBadge = styled.span`
  display: inline-block;
  width: fit-content;
  padding: 5px 10px;
  border-radius: 20px;
  background: ${({ $status }) =>
    $status === "Indoor" ? "#dbeafe" : "#dcfce7"};
  color: ${({ $status }) => ($status === "Indoor" ? "#1d4ed8" : "#166534")};
  font-size: 12px;
  font-weight: 700;
`;

const EmptyMessage = styled.div`
  margin-top: 20px;
  padding: 28px 16px;
  border: 1px dashed #cbd5e1;
  border-radius: 12px;
  background: #f8fafc;
  color: #64748b;
  text-align: center;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  margin-top: 20px;
`;

const ActionButton = styled.button`
  padding: 9px 13px;
  border: none;
  border-radius: 7px;
  background: ${({ $remove }) => ($remove ? "#dc2626" : "#2563eb")};
  color: #fff;
  font-weight: 600;
  cursor: pointer;

  &:hover {
    background: ${({ $remove }) => ($remove ? "#b91c1c" : "#1d4ed8")};
  }
`;

function getText(value, fallback = "Not specified") {
  if (value === null || value === undefined || value === "") {
    return fallback;
  }

  return typeof value === "string" || typeof value === "number"
    ? String(value)
    : fallback;
}

function normalizePatient(record) {
  if (!record || typeof record !== "object" || Array.isArray(record)) {
    return null;
  }

  // Support older records where the patient object was nested in name.
  const nested =
    record.name &&
    typeof record.name === "object" &&
    !Array.isArray(record.name)
      ? record.name
      : {};

  return {
    ...nested,
    ...record,
    name:
      typeof record.name === "string"
        ? record.name
        : typeof nested.name === "string"
          ? nested.name
          : "",
    age: record.age ?? nested.age,
    disease: record.disease ?? nested.disease,
    admissionStatus:
      record.admissionStatus ??
      record.indoor_outdoor ??
      nested.admissionStatus ??
      nested.indoor_outdoor,
    admittedDate:
      record.admittedDate ??
      record.admitted_date ??
      nested.admittedDate ??
      nested.admitted_date,
    releasingDate:
      record.releasingDate ??
      record.releasing_date ??
      record.relieving_date ??
      nested.releasingDate ??
      nested.releasing_date ??
      nested.relieving_date,
    releasingSummary:
      record.releasingSummary ??
      record.releasing_summary ??
      record.relieving_summary ??
      nested.releasingSummary ??
      nested.releasing_summary ??
      nested.relieving_summary,
  };
}

function PatientList({ onEdit }) {
  const { patients = [], removePatient } = useDoctor();

  const records = Array.isArray(patients)
    ? patients.map(normalizePatient).filter(Boolean)
    : [];

  if (records.length === 0) {
    return (
      <EmptyMessage>
        No patient records available. Add a patient to get started.
      </EmptyMessage>
    );
  }

  return (
    <List>
      {records.map((patient, index) => {
        const patientId = patient.patientId ?? patient.id ?? index + 1;
        const status = getText(patient.admissionStatus, "");

        return (
          <Card key={patientId}>
            <CardHeader>
              <PatientName>
                {getText(patient.name, "Unnamed Patient")}
              </PatientName>

              <PatientId>#{patientId}</PatientId>
            </CardHeader>

            <Details>
              <DetailRow>
                <Label>Age</Label>
                <Value>{getText(patient.age)}</Value>
              </DetailRow>

              <DetailRow>
                <Label>Disease</Label>
                <Value>{getText(patient.disease)}</Value>
              </DetailRow>

              <DetailRow>
                <Label>Admission</Label>
                {status ? (
                  <StatusBadge $status={status}>{status}</StatusBadge>
                ) : (
                  <Value>Not specified</Value>
                )}
              </DetailRow>

              {status === "Indoor" && (
                <>
                  <DetailRow>
                    <Label>Admitted Date</Label>
                    <Value>{getText(patient.admittedDate)}</Value>
                  </DetailRow>

                  <DetailRow>
                    <Label>Releasing Date</Label>
                    <Value>{getText(patient.releasingDate)}</Value>
                  </DetailRow>

                  <DetailRow>
                    <Label>Summary</Label>
                    <Value>{getText(patient.releasingSummary)}</Value>
                  </DetailRow>
                </>
              )}
            </Details>

            <ButtonGroup>
              <ActionButton type="button" onClick={() => onEdit?.(patient)}>
                Edit Patient
              </ActionButton>

              <ActionButton
                type="button"
                $remove
                onClick={() => removePatient?.(patientId)}
              >
                Remove Patient
              </ActionButton>
            </ButtonGroup>
          </Card>
        );
      })}
    </List>
  );
}

export default PatientList;
