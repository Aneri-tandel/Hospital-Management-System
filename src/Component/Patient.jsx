import { useEffect, useState } from "react";
import styled from "styled-components";
import {
  Button,
  Card,
  Form,
  Heading,
  Input,
  Message,
  Select,
  TextArea,
} from "../Component/StyleComponents";

const API_URL = "http://localhost:8000/api/doctors";

const Page = styled.main`
  width: min(1180px, 92%);
  margin: 0 auto;
  padding: 40px 0 64px;
`;

const PageHeader = styled.header`
  margin-bottom: 28px;

  h1 {
    margin: 0;
    color: #12304a;
    font-size: clamp(26px, 4vw, 34px);
    letter-spacing: -0.7px;
  }

  p {
    margin: 8px 0 0;
    color: #64748b;
    font-size: 15px;
  }

  ${({ $darkMode }) =>
    $darkMode &&
    `
      h1 { color: #f1f5f9; }
      p { color: #94a3b8; }
    `}
`;

const FormCard = styled(Card)`
  padding: 26px;
  border-radius: 18px;

  @media (max-width: 600px) {
    padding: 18px;
  }
`;

const FormIntro = styled.div`
  margin: -8px 0 20px;
  color: #64748b;
  font-size: 14px;
  line-height: 1.6;
`;

const FieldLabel = styled.label`
  margin-bottom: -7px;
  color: #475569;
  font-size: 13px;
  font-weight: 700;
`;

const RecordsSection = styled.section`
  margin-top: 34px;
`;

const RecordsHeading = styled.div`
  display: flex;
  align-items: end;
  justify-content: space-between;
  gap: 14px;
  margin-bottom: 16px;

  h2 {
    margin: 0;
    color: ${({ $darkMode }) => ($darkMode ? "#f1f5f9" : "#12304a")};
    font-size: 22px;
  }

  p {
    margin: 5px 0 0;
    color: #64748b;
    font-size: 13px;
  }
`;

const DoctorGroup = styled.section`
  overflow: hidden;
  margin-top: 16px;
  border: 1px solid ${({ $darkMode }) => ($darkMode ? "#334155" : "#dce6ef")};
  border-radius: 16px;
  background: ${({ $darkMode }) => ($darkMode ? "#172337" : "#fff")};
  box-shadow: 0 5px 18px rgba(15, 23, 42, 0.045);
`;

const DoctorHeader = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 14px;
  padding: 17px 20px;
  border-bottom: 1px solid ${({ $darkMode }) => ($darkMode ? "#334155" : "#e8eef4")};
  background: ${({ $darkMode }) => ($darkMode ? "#1e293b" : "#f8fafc")};

  h3 {
    margin: 0;
    color: ${({ $darkMode }) => ($darkMode ? "#f1f5f9" : "#12304a")};
    font-size: 16px;
  }

  p {
    margin: 4px 0 0;
    color: #64748b;
    font-size: 13px;
  }
`;

const CountBadge = styled.span`
  flex-shrink: 0;
  padding: 6px 10px;
  border-radius: 999px;
  background: #e0f2fe;
  color: #0369a1;
  font-size: 12px;
  font-weight: 700;
`;

const PatientGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(100%, 310px), 1fr));
  gap: 14px;
  padding: 18px;
`;

const PatientCard = styled.article`
  min-width: 0;
  padding: 17px;
  border: 1px solid ${({ $darkMode }) => ($darkMode ? "#334155" : "#e2e8f0")};
  border-radius: 13px;
  background: ${({ $darkMode }) => ($darkMode ? "#0f172a" : "#fff")};
`;

const PatientCardHeader = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 14px;

  h4 {
    margin: 0;
    color: ${({ $darkMode }) => ($darkMode ? "#f1f5f9" : "#12304a")};
    font-size: 16px;
    overflow-wrap: anywhere;
  }

  p {
    margin: 5px 0 0;
    color: #64748b;
    font-size: 12px;
  }
`;

const AdmissionBadge = styled.span`
  flex-shrink: 0;
  padding: 5px 9px;
  border-radius: 999px;
  background: ${({ $indoor }) => ($indoor ? "#ede9fe" : "#dcfce7")};
  color: ${({ $indoor }) => ($indoor ? "#6d28d9" : "#15803d")};
  font-size: 11px;
  font-weight: 800;
`;

const PatientDetails = styled.dl`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
  margin: 0;

  div {
    min-width: 0;
  }

  dt {
    margin-bottom: 4px;
    color: #64748b;
    font-size: 11px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.04em;
  }

  dd {
    margin: 0;
    color: ${({ $darkMode }) => ($darkMode ? "#e2e8f0" : "#334155")};
    font-size: 13px;
    line-height: 1.5;
    overflow-wrap: anywhere;
  }

  @media (max-width: 380px) {
    grid-template-columns: 1fr;
  }
`;

const Summary = styled.div`
  margin-top: 13px;
  padding: 11px 12px;
  border-radius: 9px;
  background: ${({ $darkMode }) => ($darkMode ? "#1e293b" : "#f1f5f9")};

  span {
    display: block;
    margin-bottom: 4px;
    color: #64748b;
    font-size: 11px;
    font-weight: 700;
    text-transform: uppercase;
  }

  p {
    margin: 0;
    color: ${({ $darkMode }) => ($darkMode ? "#e2e8f0" : "#334155")};
    font-size: 13px;
    line-height: 1.5;
  }
`;

const EmptyState = styled.p`
  margin: 0;
  padding: 20px;
  color: #64748b;
  font-size: 14px;
`;

async function readResponse(response) {
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "The request could not be completed.");
  }

  return data;
}

const emptyForm = {
  name: "",
  age: "",
  disease: "",
  doctorId: "",
  admissionStatus: "Outdoor",
  admittedDate: "",
  releasingDate: "",
  releasingSummary: "",
};

export default function Patient({ darkMode = false }) {
  const [doctors, setDoctors] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let active = true;

    async function loadDoctors() {
      try {
        const response = await fetch(API_URL);
        const data = await readResponse(response);

        if (!Array.isArray(data)) {
          throw new Error("The doctors API returned an invalid response.");
        }

        if (active) {
          setDoctors(data);
          setIsError(false);
          setMessage("");
        }
      } catch (error) {
        if (active) {
          setIsError(true);
          setMessage(
            error instanceof TypeError
              ? `Cannot connect to ${API_URL}. Start the backend from the Backend folder with "npm run dev".`
              : error.message || "Unable to load doctors.",
          );
        }
      } finally {
        if (active) setLoading(false);
      }
    }

    loadDoctors();

    return () => {
      active = false;
    };
  }, [reloadKey]);

  function handleChange(event) {
    const { name, value } = event.target;
    setForm((currentForm) => ({ ...currentForm, [name]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();

    const age = Number(form.age);
    if (
      !form.name.trim() ||
      !Number.isInteger(age) ||
      age < 1 ||
      age > 120 ||
      !form.disease.trim() ||
      !form.doctorId
    ) {
      setIsError(true);
      setMessage("Enter a valid name, age, disease, and select a doctor.");
      return;
    }

    if (!["Indoor", "Outdoor"].includes(form.admissionStatus)) {
      setIsError(true);
      setMessage("Select a valid admission status.");
      return;
    }

    if (
      form.admissionStatus === "Indoor" &&
      (!form.admittedDate ||
        !form.releasingDate ||
        form.releasingDate < form.admittedDate ||
        !form.releasingSummary.trim())
    ) {
      setIsError(true);
      setMessage(
        "Indoor patients need valid admission and releasing dates and a releasing summary.",
      );
      return;
    }

    const doctorId = Number(form.doctorId);
    if (!doctors.some((doctor) => doctor.doctorId === doctorId)) {
      setIsError(true);
      setMessage("Select a doctor from the current medical team.");
      return;
    }

    setSaving(true);
    setMessage("");

    try {
      const response = await fetch(
        `${API_URL}/${doctorId}/patients`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: form.name.trim(),
            age,
            disease: form.disease.trim(),
            admissionStatus: form.admissionStatus,
            admittedDate:
              form.admissionStatus === "Indoor" ? form.admittedDate : "",
            releasingDate:
              form.admissionStatus === "Indoor" ? form.releasingDate : "",
            releasingSummary:
              form.admissionStatus === "Indoor"
                ? form.releasingSummary.trim()
                : "",
          }),
        },
      );
      const data = await readResponse(response);

      if (!data.doctor || !Array.isArray(data.doctor.patients)) {
        throw new Error("The patient assignment response was invalid.");
      }

      setDoctors((currentDoctors) =>
        currentDoctors.map((doctor) =>
          doctor.doctorId === doctorId ? data.doctor : doctor,
        ),
      );
      setForm(emptyForm);
      setIsError(false);
      setMessage("Patient assigned successfully.");
    } catch (error) {
      setIsError(true);
      setMessage(error.message || "Unable to assign patient.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <Page>
      <PageHeader $darkMode={darkMode}>
        <h1>Patient Management</h1>
        <p>Assign patients to the right care team and review admission details.</p>
      </PageHeader>

      <FormCard $darkMode={darkMode}>
        <Heading>Assign Patient to Doctor</Heading>
        <FormIntro>
          Add patient details below. Indoor admissions include admission,
          release, and discharge summary information.
        </FormIntro>
        <Form onSubmit={handleSubmit}>
          <FieldLabel htmlFor="patient-name">Patient name</FieldLabel>
          <Input
            id="patient-name"
            aria-label="Patient name"
            name="name"
            placeholder="Patient name"
            value={form.name}
            onChange={handleChange}
            maxLength={100}
            required
          />
          <FieldLabel htmlFor="patient-age">Age</FieldLabel>
          <Input
            id="patient-age"
            aria-label="Patient age"
            name="age"
            type="number"
            min="1"
            max="120"
            step="1"
            placeholder="Age"
            value={form.age}
            onChange={handleChange}
            required
          />
          <FieldLabel htmlFor="patient-disease">Disease or reason for visit</FieldLabel>
          <Input
            id="patient-disease"
            aria-label="Disease or reason for visit"
            name="disease"
            placeholder="Disease or reason for visit"
            value={form.disease}
            onChange={handleChange}
            maxLength={300}
            required
          />
          <FieldLabel htmlFor="patient-doctor">Attending doctor</FieldLabel>
          <Select
            id="patient-doctor"
            aria-label="Select doctor"
            name="doctorId"
            value={form.doctorId}
            onChange={handleChange}
            required
            disabled={loading || doctors.length === 0}
          >
            <option value="">
              {loading ? "Loading doctors..." : "Select doctor"}
            </option>
            {doctors.map((doctor) => (
              <option key={doctor.doctorId} value={doctor.doctorId}>
                {doctor.name} — {doctor.specialization}
              </option>
            ))}
          </Select>
          <FieldLabel htmlFor="patient-admission">Admission status</FieldLabel>
          <Select
            id="patient-admission"
            aria-label="Admission status"
            name="admissionStatus"
            value={form.admissionStatus}
            onChange={handleChange}
          >
            <option value="Outdoor">Outdoor</option>
            <option value="Indoor">Indoor</option>
          </Select>

          {form.admissionStatus === "Indoor" && (
            <>
              <FieldLabel htmlFor="admitted-date">Admitted date</FieldLabel>
              <Input
                id="admitted-date"
                name="admittedDate"
                type="date"
                value={form.admittedDate}
                onChange={handleChange}
                required
              />
              <FieldLabel htmlFor="releasing-date">Expected release date</FieldLabel>
              <Input
                id="releasing-date"
                name="releasingDate"
                type="date"
                min={form.admittedDate || undefined}
                value={form.releasingDate}
                onChange={handleChange}
                required
              />
              <FieldLabel htmlFor="releasing-summary">Discharge summary</FieldLabel>
              <TextArea
                id="releasing-summary"
                name="releasingSummary"
                placeholder="Enter patient condition or discharge summary"
                value={form.releasingSummary}
                onChange={handleChange}
                maxLength={1000}
                required
              />
            </>
          )}
          <Button type="submit" disabled={saving || loading || doctors.length === 0}>
            {saving ? "Assigning..." : "Assign Patient"}
          </Button>
        </Form>
        {message && <Message $error={isError}>{message}</Message>}
        {isError && !saving && (
          <Button
            type="button"
            onClick={() => {
              setIsError(false);
              setMessage("");
              setLoading(true);
              setReloadKey((key) => key + 1);
            }}
          >
            Retry connection
          </Button>
        )}
        {!loading && doctors.length === 0 && !isError && (
          <Message $error>
            Add a doctor before assigning a patient.
          </Message>
        )}
      </FormCard>

      <RecordsSection>
        <RecordsHeading $darkMode={darkMode}>
          <div>
            <h2>Care team assignments</h2>
            <p>Patient records organized by attending doctor.</p>
          </div>
          {!loading && (
            <CountBadge>
              {doctors.reduce(
                (total, doctor) =>
                  total +
                  (Array.isArray(doctor.patients) ? doctor.patients.length : 0),
                0,
              )}{" "}
              patients
            </CountBadge>
          )}
        </RecordsHeading>
        {loading ? (
          <EmptyState>Loading patient assignments...</EmptyState>
        ) : doctors.length === 0 ? (
          <EmptyState>No doctor records are available.</EmptyState>
        ) : (
          doctors.map((doctor) => (
            <DoctorGroup key={doctor.doctorId} $darkMode={darkMode}>
              <DoctorHeader $darkMode={darkMode}>
                <div>
                  <h3>{doctor.name}</h3>
                  <p>{doctor.specialization}</p>
                </div>
                <CountBadge>
                  {(doctor.patients || []).length}{" "}
                  {(doctor.patients || []).length === 1 ? "patient" : "patients"}
                </CountBadge>
              </DoctorHeader>
              {(doctor.patients || []).length === 0 ? (
                <EmptyState>No patients assigned to this doctor yet.</EmptyState>
              ) : (
                <PatientGrid>
                  {doctor.patients.map((patient) => (
                    <PatientCard key={patient.patientId} $darkMode={darkMode}>
                      <PatientCardHeader $darkMode={darkMode}>
                        <div>
                          <h4>{patient.name}</h4>
                          <p>Patient record #{patient.patientId}</p>
                        </div>
                        <AdmissionBadge
                          $indoor={patient.admissionStatus === "Indoor"}
                        >
                          {patient.admissionStatus}
                        </AdmissionBadge>
                      </PatientCardHeader>
                      <PatientDetails $darkMode={darkMode}>
                        <div>
                          <dt>Age</dt>
                          <dd>{patient.age} years</dd>
                        </div>
                        <div>
                          <dt>Condition</dt>
                          <dd>{patient.disease}</dd>
                        </div>
                        {patient.admissionStatus === "Indoor" && (
                          <>
                            <div>
                              <dt>Admitted</dt>
                              <dd>{patient.admittedDate || "Not recorded"}</dd>
                            </div>
                            <div>
                              <dt>Release date</dt>
                              <dd>{patient.releasingDate || "Not recorded"}</dd>
                            </div>
                          </>
                        )}
                      </PatientDetails>
                      {patient.admissionStatus === "Indoor" &&
                        patient.releasingSummary && (
                          <Summary $darkMode={darkMode}>
                            <span>Discharge summary</span>
                            <p>{patient.releasingSummary}</p>
                          </Summary>
                        )}
                    </PatientCard>
                  ))}
                </PatientGrid>
              )}
            </DoctorGroup>
          ))
        )}
      </RecordsSection>
    </Page>
  );
}
