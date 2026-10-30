import { useCallback, useState } from "react";
import styled from "styled-components";
import ApiPatientList from "./ApiPatientList";

const emptyPatient = {
  name: "",
  age: "",
  gender: "Male",
  weight: "",
  disease: "",
  symptoms: "",
  medicine_prescribed: "",
  visited_date: "",
  indoor_outdoor: "Outdoor",
  admitted_date: "",
  relieving_date: "",
  relieving_summary: "",
};

const Container = styled.main`
  max-width: 1100px;
  margin: 30px auto;
  padding: 24px;
  font-family: Arial, sans-serif;
  color: #1e293b;

  @media (max-width: 600px) {
    margin: 10px auto;
    padding: 12px;
  }
`;

const Header = styled.header`
  padding: 24px;
  margin-bottom: 24px;
  border-radius: 14px;
  background: #eaf3ff;

  h1 {
    margin-top: 0;
    color: #174a8b;
  }

  p {
    color: #475569;
  }
`;

const Section = styled.section`
  padding: 24px;
  margin-bottom: 24px;
  border: 1px solid #dbe3ed;
  border-radius: 14px;
  background: white;

  h2 {
    margin-top: 0;
    color: #174a8b;
  }

  @media (max-width: 600px) {
    padding: 16px;
  }
`;

const Form = styled.form`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 14px;
`;

const FieldGroup = styled.label`
  display: grid;
  gap: 7px;
  font-size: 14px;
  font-weight: 600;
`;

const Input = styled.input`
  width: 100%;
  box-sizing: border-box;
  padding: 11px;
  border: 1px solid #cbd5e1;
  border-radius: 7px;
  font: inherit;
`;

const Select = styled.select`
  width: 100%;
  box-sizing: border-box;
  padding: 11px;
  border: 1px solid #cbd5e1;
  border-radius: 7px;
  background: white;
  font: inherit;
`;

const TextArea = styled.textarea`
  width: 100%;
  box-sizing: border-box;
  padding: 11px;
  border: 1px solid #cbd5e1;
  border-radius: 7px;
  font: inherit;
`;

const Button = styled.button`
  padding: 11px 16px;
  border: none;
  border-radius: 7px;
  background: ${(props) => (props.$secondary ? "#64748b" : "#2563eb")};
  color: white;
  cursor: pointer;
  font-weight: 600;

  &:hover {
    opacity: 0.9;
  }
`;

const Message = styled.p`
  padding: 12px;
  border-radius: 7px;
  background: ${(props) => (props.$error ? "#fff1f2" : "#eff6ff")};
  color: ${(props) => (props.$error ? "#be123c" : "#1d4ed8")};
`;

const PatientGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 16px;
`;

const PatientCard = styled.article`
  padding: 18px;
  border: 1px solid #dbe3ed;
  border-radius: 12px;
  overflow-wrap: anywhere;

  h3 {
    margin-top: 0;
    color: #174a8b;
  }

  p {
    margin: 8px 0;
    font-size: 14px;
  }
`;

function normalizePatient(patient, index) {
  return {
    ...patient,
    id: patient.id ?? patient.patientId ?? patient._id ?? `api-${index + 1}`,
    name: patient.name ?? "",
    age: patient.age ?? "",
    gender: patient.gender ?? "Not specified",
    weight: patient.weight ?? "",
    disease: patient.disease ?? "",
    symptoms: patient.symptoms ?? "",
    medicine_prescribed: patient.medicine_prescribed ?? "",
    visited_date: patient.visited_date ?? patient.visitedDate ?? "",
    indoor_outdoor:
      patient.indoor_outdoor ?? patient.admissionStatus ?? "Outdoor",
    admitted_date: patient.admitted_date ?? patient.admittedDate ?? "",
    relieving_date:
      patient.relieving_date ??
      patient.releasing_date ??
      patient.releasingDate ??
      "",
    relieving_summary:
      patient.relieving_summary ??
      patient.releasing_summary ??
      patient.releasingSummary ??
      "",
  };
}

function PatientRecordManager() {
  const [patients, setPatients] = useState([]);
  const [formData, setFormData] = useState(emptyPatient);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [reloadKey, setReloadKey] = useState(0);

  // Receive records fetched by ApiPatientList.jsx
  const handlePatientsLoaded = useCallback((records) => {
    setPatients(records.map(normalizePatient));
    setLoading(false);
    setError("");
  }, []);

  const handleFetchError = useCallback((errorMessage) => {
    setError(errorMessage);
    setLoading(false);
  }, []);

  function handleChange(event) {
    const { name, value } = event.target;

    setFormData((previous) => {
      const updated = { ...previous, [name]: value };

      if (name === "indoor_outdoor" && value === "Outdoor") {
        updated.admitted_date = "";
        updated.relieving_date = "";
        updated.relieving_summary = "";
      }

      if (
        name === "admitted_date" &&
        updated.relieving_date &&
        updated.relieving_date < value
      ) {
        updated.relieving_date = "";
      }

      return updated;
    });

    setMessage("");
    setError("");
  }

  function handleSubmit(event) {
    event.preventDefault();
    setMessage("");
    setError("");

    const name = formData.name.trim();
    const disease = formData.disease.trim();
    const age = Number(formData.age);
    const weight = formData.weight === "" ? "" : Number(formData.weight);

    if (!name || !disease) {
      setError("Patient name and disease are required.");
      return;
    }

    if (!Number.isInteger(age) || age < 1 || age > 120) {
      setError("Age must be a whole number between 1 and 120.");
      return;
    }

    if (formData.weight !== "" && (!Number.isFinite(weight) || weight <= 0)) {
      setError("Enter a valid patient weight.");
      return;
    }

    if (formData.indoor_outdoor === "Indoor" && !formData.admitted_date) {
      setError("Admitted date is required for indoor patients.");
      return;
    }

    if (
      formData.admitted_date &&
      formData.relieving_date &&
      formData.relieving_date < formData.admitted_date
    ) {
      setError("Relieving date cannot be before admitted date.");
      return;
    }

    const patientData = {
      ...formData,
      name,
      age,
      weight,
      disease,
      symptoms: formData.symptoms.trim(),
      medicine_prescribed: formData.medicine_prescribed.trim(),
      relieving_summary: formData.relieving_summary.trim(),
    };

    if (editingId !== null) {
      setPatients((previous) =>
        previous.map((patient) =>
          patient.id === editingId ? { ...patient, ...patientData } : patient,
        ),
      );

      setMessage("Patient updated successfully.");
      setEditingId(null);
    } else {
      const newPatient = {
        ...patientData,
        id: `local-${Date.now()}`,
      };

      setPatients((previous) => [...previous, newPatient]);
      setMessage("Patient added successfully.");
    }

    setFormData({ ...emptyPatient });
  }

  function handleEdit(patient) {
    setEditingId(patient.id);

    setFormData({
      ...emptyPatient,
      name: patient.name ?? "",
      age: String(patient.age ?? ""),
      gender: patient.gender ?? "Male",
      weight: String(patient.weight ?? ""),
      disease: patient.disease ?? "",
      symptoms: patient.symptoms ?? "",
      medicine_prescribed: patient.medicine_prescribed ?? "",
      visited_date: patient.visited_date ?? "",
      indoor_outdoor: patient.indoor_outdoor ?? "Outdoor",
      admitted_date: patient.admitted_date ?? "",
      relieving_date: patient.relieving_date ?? "",
      relieving_summary: patient.relieving_summary ?? "",
    });

    setMessage("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function handleCancelEdit() {
    setEditingId(null);
    setFormData({ ...emptyPatient });
    setMessage("");
    setError("");
  }

  return (
    <Container>
      {/* This component fetches the API data and renders no UI */}
      <ApiPatientList
        reloadKey={reloadKey}
        onPatientsLoaded={handlePatientsLoaded}
        onError={handleFetchError}
      />

      <Header>
        <h1>Hospital Patient Management</h1>
        <p>Practical 5 — Fetch and manage patient records using React.</p>
      </Header>

      <Section>
        <h2>{editingId !== null ? "Edit Patient" : "Add Patient"}</h2>

        <Form onSubmit={handleSubmit}>
          <FieldGroup>
            Patient Name
            <Input
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              placeholder="Enter patient name"
            />
          </FieldGroup>

          <FieldGroup>
            Age
            <Input
              type="number"
              name="age"
              min="1"
              max="120"
              step="1"
              value={formData.age}
              onChange={handleChange}
              required
            />
          </FieldGroup>

          <FieldGroup>
            Gender
            <Select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
            >
              <option>Male</option>
              <option>Female</option>
              <option>Other</option>
            </Select>
          </FieldGroup>

          <FieldGroup>
            Weight (kg)
            <Input
              type="number"
              name="weight"
              min="0.1"
              step="0.1"
              value={formData.weight}
              onChange={handleChange}
            />
          </FieldGroup>

          <FieldGroup>
            Disease
            <Input
              name="disease"
              value={formData.disease}
              onChange={handleChange}
              required
            />
          </FieldGroup>

          <FieldGroup>
            Visit Date
            <Input
              type="date"
              name="visited_date"
              value={formData.visited_date}
              onChange={handleChange}
            />
          </FieldGroup>

          <FieldGroup>
            Symptoms
            <TextArea
              name="symptoms"
              rows="2"
              value={formData.symptoms}
              onChange={handleChange}
            />
          </FieldGroup>

          <FieldGroup>
            Medicine Prescribed
            <TextArea
              name="medicine_prescribed"
              rows="2"
              value={formData.medicine_prescribed}
              onChange={handleChange}
            />
          </FieldGroup>

          <FieldGroup>
            Admission Status
            <Select
              name="indoor_outdoor"
              value={formData.indoor_outdoor}
              onChange={handleChange}
            >
              <option value="Outdoor">Outdoor</option>
              <option value="Indoor">Indoor</option>
            </Select>
          </FieldGroup>

          {formData.indoor_outdoor === "Indoor" && (
            <>
              <FieldGroup>
                Admitted Date
                <Input
                  type="date"
                  name="admitted_date"
                  value={formData.admitted_date}
                  onChange={handleChange}
                  required
                />
              </FieldGroup>

              <FieldGroup>
                Relieving Date
                <Input
                  type="date"
                  name="relieving_date"
                  min={formData.admitted_date || undefined}
                  value={formData.relieving_date}
                  onChange={handleChange}
                />
              </FieldGroup>

              <FieldGroup>
                Relieving Summary
                <TextArea
                  name="relieving_summary"
                  rows="2"
                  value={formData.relieving_summary}
                  onChange={handleChange}
                />
              </FieldGroup>
            </>
          )}

          <div>
            <Button type="submit">
              {editingId !== null ? "Update Patient" : "Add Patient"}
            </Button>

            {editingId !== null && (
              <Button
                type="button"
                $secondary
                onClick={handleCancelEdit}
                style={{ marginLeft: 8 }}
              >
                Cancel
              </Button>
            )}
          </div>
        </Form>

        {error && <Message $error>{error}</Message>}
        {message && <Message>{message}</Message>}
      </Section>

      <Section>
        <h2>Patient Records ({patients.length})</h2>

        {error && (
          <>
            <Message $error>{error}</Message>
            <Button
              type="button"
              onClick={() => {
                setError("");
                setLoading(true);
                setReloadKey((key) => key + 1);
              }}
            >
              Retry connection
            </Button>
          </>
        )}

        {loading ? (
          <p>Loading patient records...</p>
        ) : patients.length === 0 ? (
          <p>No patient records available.</p>
        ) : (
          <PatientGrid>
            {patients.map((patient) => (
              <PatientCard key={patient.id}>
                <h3>{patient.name || "Unnamed Patient"}</h3>

                <p>
                  <strong>Age:</strong> {patient.age || "N/A"}
                </p>
                <p>
                  <strong>Gender:</strong> {patient.gender || "N/A"}
                </p>
                <p>
                  <strong>Disease:</strong> {patient.disease || "N/A"}
                </p>
                <p>
                  <strong>Weight:</strong> {patient.weight || "N/A"}
                  {patient.weight ? " kg" : ""}
                </p>
                <p>
                  <strong>Symptoms:</strong> {patient.symptoms || "N/A"}
                </p>
                <p>
                  <strong>Medicine:</strong>{" "}
                  {patient.medicine_prescribed || "N/A"}
                </p>
                <p>
                  <strong>Visit Date:</strong> {patient.visited_date || "N/A"}
                </p>
                <p>
                  <strong>Status:</strong> {patient.indoor_outdoor || "N/A"}
                </p>

                {patient.indoor_outdoor === "Indoor" && (
                  <>
                    <p>
                      <strong>Admitted:</strong>{" "}
                      {patient.admitted_date || "N/A"}
                    </p>
                    <p>
                      <strong>Relieving Date:</strong>{" "}
                      {patient.relieving_date || "N/A"}
                    </p>
                    <p>
                      <strong>Summary:</strong>{" "}
                      {patient.relieving_summary || "N/A"}
                    </p>
                  </>
                )}

                <Button type="button" onClick={() => handleEdit(patient)}>
                  Edit
                </Button>
              </PatientCard>
            ))}
          </PatientGrid>
        )}
      </Section>
    </Container>
  );
}

export default PatientRecordManager;
