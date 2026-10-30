import { useState } from "react";
import styled from "styled-components";
import { useDoctor } from "../Context/DoctorContext";

const FormCard = styled.form`
  padding: 24px;
  border: 1px solid #dbe5f1;
  border-radius: 16px;
  background: #ffffff;
  box-shadow: 0 5px 18px rgba(15, 23, 42, 0.06);
`;

const FormGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 18px;

  @media (max-width: 600px) {
    grid-template-columns: 1fr;
  }
`;

const Field = styled.div`
  display: flex;
  flex-direction: column;
  gap: 7px;

  label {
    color: #334155;
    font-size: 14px;
    font-weight: 600;
  }

  input,
  select,
  textarea {
    width: 100%;
    box-sizing: border-box;
    padding: 11px 12px;
    border: 1px solid #cbd5e1;
    border-radius: 8px;
    background: #fff;
    color: #0f172a;
    font: inherit;
  }

  input:focus,
  select:focus,
  textarea:focus {
    outline: none;
    border-color: #2563eb;
    box-shadow: 0 0 0 3px #dbeafe;
  }
`;

const SubmitButton = styled.button`
  margin-top: 20px;
  padding: 12px 18px;
  border: none;
  border-radius: 9px;
  background: #2563eb;
  color: #fff;
  font-weight: 700;
  cursor: pointer;

  &:hover {
    background: #1d4ed8;
  }
`;

export default function AssignPatientForm() {
  const { addPatient } = useDoctor();

  const emptyForm = {
    name: "",
    age: "",
    disease: "",
    admissionStatus: "Outdoor",
    admittedDate: "",
    releasingDate: "",
    releasingSummary: "",
  };

  const [form, setForm] = useState(emptyForm);

  function handleChange(e) {
    const { name, value } = e.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  }

  function handleSubmit(e) {
    e.preventDefault();

    const patient = {
      name: form.name.trim(),
      age: Number(form.age),
      disease: form.disease.trim(),
      admissionStatus: form.admissionStatus,
      admittedDate: form.admissionStatus === "Indoor" ? form.admittedDate : "",
      releasingDate:
        form.admissionStatus === "Indoor" ? form.releasingDate : "",
      releasingSummary:
        form.admissionStatus === "Indoor" ? form.releasingSummary.trim() : "",
    };

    if (!patient.name || !patient.disease || patient.age < 1) return;

    if (
      patient.admissionStatus === "Indoor" &&
      (!patient.admittedDate ||
        !patient.releasingDate ||
        !patient.releasingSummary)
    ) {
      return;
    }

    if (
      patient.admissionStatus === "Indoor" &&
      patient.releasingDate < patient.admittedDate
    ) {
      return;
    }

    addPatient(patient);
    setForm({ ...emptyForm });
  }

  return (
    <FormCard onSubmit={handleSubmit}>
      <h3 style={{ marginTop: 0, marginBottom: 22 }}>Register New Patient</h3>

      <FormGrid>
        <Field>
          <label htmlFor="patient-name">Patient Name</label>
          <input
            id="patient-name"
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Enter patient name"
            required
          />
        </Field>

        <Field>
          <label htmlFor="patient-age">Age</label>
          <input
            id="patient-age"
            name="age"
            type="number"
            min="1"
            max="120"
            value={form.age}
            onChange={handleChange}
            placeholder="Enter age"
            required
          />
        </Field>

        <Field>
          <label htmlFor="patient-disease">Disease</label>
          <input
            id="patient-disease"
            name="disease"
            value={form.disease}
            onChange={handleChange}
            placeholder="Enter disease"
            required
          />
        </Field>

        <Field>
          <label htmlFor="patient-status">Admission Status</label>
          <select
            id="patient-status"
            name="admissionStatus"
            value={form.admissionStatus}
            onChange={handleChange}
          >
            <option value="Outdoor">Outdoor</option>
            <option value="Indoor">Indoor</option>
          </select>
        </Field>

        {form.admissionStatus === "Indoor" && (
          <>
            <Field>
              <label htmlFor="admitted-date">Admitted Date</label>
              <input
                id="admitted-date"
                name="admittedDate"
                type="date"
                value={form.admittedDate}
                onChange={handleChange}
                required
              />
            </Field>

            <Field>
              <label htmlFor="releasing-date">Releasing Date</label>
              <input
                id="releasing-date"
                name="releasingDate"
                type="date"
                min={form.admittedDate || undefined}
                value={form.releasingDate}
                onChange={handleChange}
                required
              />
            </Field>

            <Field>
              <label htmlFor="releasing-summary">Releasing Summary</label>
              <textarea
                id="releasing-summary"
                name="releasingSummary"
                rows="3"
                value={form.releasingSummary}
                onChange={handleChange}
                placeholder="Enter patient condition or discharge summary"
                required
              />
            </Field>
          </>
        )}
      </FormGrid>

      <SubmitButton type="submit">Register Patient</SubmitButton>
    </FormCard>
  );
}
