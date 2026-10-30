import { createContext, useContext, useState } from "react";

const DoctorContext = createContext();

export function DoctorProvider({ children }) {
  const [doctor, setDoctor] = useState({
    doctorId: 1,
    name: "Dr. Adnan",
    specialization: "Cardiology",
    experience: 8,
    email: "doctor@hospital.com",
  });

  const [patients, setPatients] = useState([]);

  function addPatient(patient) {
    setPatients((previous) => [
      ...previous,
      {
        patientId: Date.now(),
        name: patient.name,
        age: Number(patient.age),
        disease: patient.disease,
        admissionStatus: patient.admissionStatus || "Outdoor",
        admittedDate: patient.admittedDate || "",
        releasingDate: patient.releasingDate || "",
        releasingSummary: patient.releasingSummary || "",
      },
    ]);
  }

  function removePatient(patientId) {
    setPatients((previous) =>
      previous.filter((patient) => patient.patientId !== patientId),
    );
  }

  function updatePatient(patientId, updatedData) {
    setPatients((previous) =>
      previous.map((patient) =>
        patient.patientId === patientId
          ? {
              ...patient,
              ...updatedData,
              patientId: patient.patientId,
            }
          : patient,
      ),
    );
  }

  return (
    <DoctorContext.Provider
      value={{
        doctor,
        setDoctor,
        patients,
        addPatient,
        removePatient,
        updatePatient,
      }}
    >
      {children}
    </DoctorContext.Provider>
  );
}

export function useDoctor() {
  const context = useContext(DoctorContext);

  if (!context) {
    throw new Error("useDoctor must be used inside DoctorProvider");
  }

  return context;
}
