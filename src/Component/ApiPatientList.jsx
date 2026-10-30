import { useEffect } from "react";

const API_URL = "http://localhost:8000/api/doctors";

function getPatientList(doctors) {
  if (!Array.isArray(doctors)) {
    throw new Error("The doctors API returned an invalid response.");
  }

  return doctors.flatMap((doctor) => {
    if (!Array.isArray(doctor.patients)) return [];

    return doctor.patients.map((patient) => ({
      ...patient,
      doctorId: doctor.doctorId,
      doctorName: doctor.name,
    }));
  });
}

function ApiPatientList({ onPatientsLoaded, onError, reloadKey }) {
  useEffect(() => {
    let active = true;

    async function fetchPatients() {
      try {
        const response = await fetch(API_URL);

        if (!response.ok) {
          throw new Error(`The doctors API returned HTTP ${response.status}.`);
        }

        const records = getPatientList(await response.json());

        if (active) {
          onPatientsLoaded(records);
        }
      } catch {
        if (active) {
          onError(
            `Could not connect to ${API_URL}. Start the backend from the Backend folder with "npm run dev", then retry.`,
          );
        }
      }
    }

    fetchPatients();

    return () => {
      active = false;
    };
  }, [onPatientsLoaded, onError, reloadKey]);

  return null;
}

export default ApiPatientList;
