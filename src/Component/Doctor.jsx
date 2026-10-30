import { useEffect, useState } from "react";

const API_URL = "http://localhost:8000/api/doctors";

const emptyDoctor = { name: "", specialization: "", experience: "" };
const emptyPatient = {
  name: "",
  age: "",
  disease: "",
  admissionStatus: "Outdoor",
  admittedDate: "",
  releasingDate: "",
  releasingSummary: "",
};

async function request(url, options) {
  let response;

  try {
    response = await fetch(url, options);
  } catch {
    throw new Error(
      `Cannot connect to ${API_URL}. Start MongoDB and run the backend with "npm run dev".`,
    );
  }

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || "The request could not be completed.");
  }
  return data;
}

function Doctor({ darkMode = false }) {
  const [doctors, setDoctors] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [doctorForm, setDoctorForm] = useState(emptyDoctor);
  const [patientForm, setPatientForm] = useState(emptyPatient);
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const [loading, setLoading] = useState(true);
  const [savingDoctor, setSavingDoctor] = useState(false);
  const [savingPatient, setSavingPatient] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    let active = true;

    async function loadDoctors() {
      try {
        const data = await request(API_URL);
        if (!Array.isArray(data)) {
          throw new Error("The doctors API returned an invalid response.");
        }
        if (!active) return;

        setDoctors(data);
        setSelectedDoctor((selected) =>
          selected
            ? data.find((doctor) => doctor.doctorId === selected.doctorId) ||
              null
            : null,
        );
        setMessage("");
        setIsError(false);
      } catch (error) {
        if (active) {
          setIsError(true);
          setMessage(error.message);
        }
      } finally {
        if (active) setLoading(false);
      }
    }

    loadDoctors();

    return () => {
      active = false;
    };
  }, [refreshKey]);

  async function showDoctor(doctorId) {
    try {
      const doctor = await request(`${API_URL}/${doctorId}`);
      setSelectedDoctor(doctor);
      setMessage("");
      setIsError(false);
    } catch (error) {
      setIsError(true);
      setMessage(error.message);
    }
  }

  async function addDoctor(event) {
    event.preventDefault();
    const experience = Number(doctorForm.experience);

    if (
      !doctorForm.name.trim() ||
      !doctorForm.specialization.trim() ||
      !Number.isInteger(experience) ||
      experience < 0 ||
      experience > 80
    ) {
      setIsError(true);
      setMessage("Enter a name, specialization, and experience from 0 to 80.");
      return;
    }

    setSavingDoctor(true);
    try {
      const doctor = await request(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: doctorForm.name.trim(),
          specialization: doctorForm.specialization.trim(),
          experience,
        }),
      });
      setDoctors((current) => [...current, doctor]);
      setDoctorForm(emptyDoctor);
      setSelectedDoctor(doctor);
      setMessage("Doctor added successfully.");
      setIsError(false);
    } catch (error) {
      setIsError(true);
      setMessage(error.message);
    } finally {
      setSavingDoctor(false);
    }
  }

  async function addPatient(event) {
    event.preventDefault();
    if (!selectedDoctor) {
      setIsError(true);
      setMessage("Select a doctor before assigning a patient.");
      return;
    }

    const age = Number(patientForm.age);
    if (
      !patientForm.name.trim() ||
      !Number.isInteger(age) ||
      age < 1 ||
      age > 120 ||
      !patientForm.disease.trim()
    ) {
      setIsError(true);
      setMessage("Enter a patient name, age from 1 to 120, and condition.");
      return;
    }

    if (
      patientForm.admissionStatus === "Indoor" &&
      (!patientForm.admittedDate ||
        !patientForm.releasingDate ||
        patientForm.releasingDate < patientForm.admittedDate ||
        !patientForm.releasingSummary.trim())
    ) {
      setIsError(true);
      setMessage(
        "Indoor patients need valid admission and release dates and a discharge summary.",
      );
      return;
    }

    setSavingPatient(true);
    try {
      const result = await request(
        `${API_URL}/${selectedDoctor.doctorId}/patients`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: patientForm.name.trim(),
            age,
            disease: patientForm.disease.trim(),
            admissionStatus: patientForm.admissionStatus,
            admittedDate:
              patientForm.admissionStatus === "Indoor"
                ? patientForm.admittedDate
                : "",
            releasingDate:
              patientForm.admissionStatus === "Indoor"
                ? patientForm.releasingDate
                : "",
            releasingSummary:
              patientForm.admissionStatus === "Indoor"
                ? patientForm.releasingSummary.trim()
                : "",
          }),
        },
      );
      setSelectedDoctor(result.doctor);
      setDoctors((current) =>
        current.map((doctor) =>
          doctor.doctorId === result.doctor.doctorId ? result.doctor : doctor,
        ),
      );
      setPatientForm(emptyPatient);
      setMessage(result.message || "Patient assigned successfully.");
      setIsError(false);
    } catch (error) {
      setIsError(true);
      setMessage(error.message);
    } finally {
      setSavingPatient(false);
    }
  }

  async function removePatient(patient) {
    if (
      !selectedDoctor ||
      !window.confirm(`Remove ${patient.name} from ${selectedDoctor.name}?`)
    ) {
      return;
    }

    try {
      const result = await request(
        `${API_URL}/${selectedDoctor.doctorId}/patients/${patient.patientId}`,
        { method: "DELETE" },
      );
      setSelectedDoctor(result.doctor);
      setDoctors((current) =>
        current.map((doctor) =>
          doctor.doctorId === result.doctor.doctorId ? result.doctor : doctor,
        ),
      );
      setMessage(result.message);
      setIsError(false);
    } catch (error) {
      setIsError(true);
      setMessage(error.message);
    }
  }

  async function deleteDoctor(doctor) {
    if (
      !window.confirm(
        `Delete ${doctor.name} and all of their assigned patient records?`,
      )
    ) {
      return;
    }

    try {
      const result = await request(`${API_URL}/${doctor.doctorId}`, {
        method: "DELETE",
      });
      setDoctors((current) =>
        current.filter((item) => item.doctorId !== doctor.doctorId),
      );
      if (selectedDoctor?.doctorId === doctor.doctorId) {
        setSelectedDoctor(null);
      }
      setMessage(result.message);
      setIsError(false);
    } catch (error) {
      setIsError(true);
      setMessage(error.message);
    }
  }

  const pageClass = `container-xxl py-4 py-lg-5 ${darkMode ? "text-light" : ""}`;

  return (
    <main className={pageClass}>
      <header className="d-flex flex-wrap justify-content-between align-items-end gap-3 mb-4">
        <div>
          <span className="badge text-bg-primary rounded-pill mb-2">
            PRACTICAL 10 · BOOTSTRAP
          </span>
          <h1 className="h2 fw-bold mb-2">Medical team</h1>
          <p className="text-secondary mb-0">
            Manage doctors and their patient assignments from one place.
          </p>
        </div>
        <button
          type="button"
          className="btn btn-outline-primary"
          onClick={() => {
            setLoading(true);
            setRefreshKey((key) => key + 1);
          }}
          disabled={loading}
        >
          {loading ? "Refreshing..." : "Refresh data"}
        </button>
      </header>

      {message && (
        <div
          className={`alert ${isError ? "alert-danger" : "alert-success"} alert-dismissible fade show`}
          role="alert"
        >
          {message}
          <button
            type="button"
            className="btn-close"
            aria-label="Dismiss message"
            onClick={() => setMessage("")}
          />
        </div>
      )}

      <div className="row g-4 align-items-start">
        <section className="col-12 col-xl-4">
          <div className="card border-0 shadow-sm">
            <div className="card-body p-4">
              <h2 className="h5 fw-bold">Add a doctor</h2>
              <p className="text-secondary small mb-4">
                Create a new medical team profile.
              </p>
              <form onSubmit={addDoctor} className="vstack gap-3">
                <div>
                  <label className="form-label" htmlFor="doctor-name">
                    Doctor name
                  </label>
                  <input
                    id="doctor-name"
                    className="form-control"
                    value={doctorForm.name}
                    onChange={(event) =>
                      setDoctorForm((form) => ({
                        ...form,
                        name: event.target.value,
                      }))
                    }
                    maxLength={100}
                    placeholder="Dr. Asha Mehta"
                    required
                  />
                </div>
                <div>
                  <label className="form-label" htmlFor="doctor-specialization">
                    Specialization
                  </label>
                  <input
                    id="doctor-specialization"
                    className="form-control"
                    value={doctorForm.specialization}
                    onChange={(event) =>
                      setDoctorForm((form) => ({
                        ...form,
                        specialization: event.target.value,
                      }))
                    }
                    maxLength={100}
                    placeholder="Cardiologist"
                    required
                  />
                </div>
                <div>
                  <label className="form-label" htmlFor="doctor-experience">
                    Experience (years)
                  </label>
                  <input
                    id="doctor-experience"
                    className="form-control"
                    type="number"
                    min="0"
                    max="80"
                    step="1"
                    value={doctorForm.experience}
                    onChange={(event) =>
                      setDoctorForm((form) => ({
                        ...form,
                        experience: event.target.value,
                      }))
                    }
                    required
                  />
                </div>
                <button
                  className="btn btn-primary w-100"
                  type="submit"
                  disabled={savingDoctor}
                >
                  {savingDoctor ? "Adding doctor..." : "Add doctor"}
                </button>
              </form>
            </div>
          </div>
        </section>

        <section className="col-12 col-xl-8">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <div>
              <h2 className="h5 fw-bold mb-1">Doctor directory</h2>
              <p className="small text-secondary mb-0">
                {doctors.length} registered{" "}
                {doctors.length === 1 ? "doctor" : "doctors"}
              </p>
            </div>
          </div>
          {loading ? (
            <div className="card border-0 shadow-sm">
              <div className="card-body text-center p-5">
                <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">Loading doctors...</span>
                </div>
                <p className="text-secondary mt-3 mb-0">Loading directory...</p>
              </div>
            </div>
          ) : doctors.length === 0 ? (
            <div className="alert alert-info">
              No doctors found. Use the form to add the first doctor.
            </div>
          ) : (
            <div className="row g-3">
              {doctors.map((doctor) => (
                <div className="col-12 col-md-6" key={doctor.doctorId}>
                  <article
                    className={`card h-100 shadow-sm ${selectedDoctor?.doctorId === doctor.doctorId ? "border-primary" : "border-0"}`}
                  >
                    <div className="card-body">
                      <div className="d-flex align-items-start gap-3">
                        <div
                          className="rounded-circle bg-primary-subtle text-primary d-flex align-items-center justify-content-center fw-bold flex-shrink-0"
                          style={{ width: 48, height: 48 }}
                        >
                          {doctor.name
                            .replace(/^Dr\.?\s*/i, "")
                            .split(/\s+/)
                            .slice(0, 2)
                            .map((part) => part[0]?.toUpperCase())
                            .join("")}
                        </div>
                        <div className="min-w-0">
                          <h3 className="h6 fw-bold mb-1">{doctor.name}</h3>
                          <p className="text-secondary small mb-2">
                            {doctor.specialization}
                          </p>
                          <span className="badge text-bg-light border me-1">
                            {doctor.experience} years experience
                          </span>
                          <span className="badge text-bg-light border">
                            {doctor.patients?.length ?? 0} patients
                          </span>
                        </div>
                      </div>
                      <div className="d-flex gap-2 mt-3">
                        <button
                          type="button"
                          className="btn btn-sm btn-outline-primary flex-grow-1"
                          onClick={() => showDoctor(doctor.doctorId)}
                        >
                          View details
                        </button>
                        <button
                          type="button"
                          className="btn btn-sm btn-outline-danger"
                          onClick={() => deleteDoctor(doctor)}
                          aria-label={`Delete ${doctor.name}`}
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </article>
                </div>
              ))}
            </div>
          )}
        </section>

        {selectedDoctor && (
          <section className="col-12" aria-live="polite">
            <div className="card border-0 shadow-sm">
              <div className="card-header bg-white p-3 p-md-4 d-flex flex-wrap justify-content-between align-items-center gap-3">
                <div>
                  <span className="badge text-bg-success-subtle text-success mb-2">
                    DOCTOR PROFILE · #{selectedDoctor.doctorId}
                  </span>
                  <h2 className="h4 fw-bold mb-1">{selectedDoctor.name}</h2>
                  <p className="text-secondary mb-0">
                    {selectedDoctor.specialization} ·{" "}
                    {selectedDoctor.experience} years of experience
                  </p>
                </div>
                <button
                  type="button"
                  className="btn btn-outline-secondary btn-sm"
                  onClick={() => setSelectedDoctor(null)}
                >
                  Close details
                </button>
              </div>
              <div className="card-body p-3 p-md-4">
                <div className="row g-4">
                  <div className="col-12 col-lg-5">
                    <h3 className="h6 fw-bold mb-3">Assign a patient</h3>
                    <form onSubmit={addPatient} className="vstack gap-3">
                      <div>
                        <label className="form-label" htmlFor="assigned-patient-name">
                          Patient name
                        </label>
                        <input
                          id="assigned-patient-name"
                          className="form-control"
                          value={patientForm.name}
                          onChange={(event) =>
                            setPatientForm((form) => ({
                              ...form,
                              name: event.target.value,
                            }))
                          }
                          maxLength={100}
                          required
                        />
                      </div>
                      <div className="row g-3">
                        <div className="col-5">
                          <label className="form-label" htmlFor="assigned-patient-age">
                            Age
                          </label>
                          <input
                            id="assigned-patient-age"
                            className="form-control"
                            type="number"
                            min="1"
                            max="120"
                            step="1"
                            value={patientForm.age}
                            onChange={(event) =>
                              setPatientForm((form) => ({
                                ...form,
                                age: event.target.value,
                              }))
                            }
                            required
                          />
                        </div>
                        <div className="col-7">
                          <label className="form-label" htmlFor="assigned-patient-status">
                            Admission
                          </label>
                          <select
                            id="assigned-patient-status"
                            className="form-select"
                            value={patientForm.admissionStatus}
                            onChange={(event) =>
                              setPatientForm((form) => ({
                                ...form,
                                admissionStatus: event.target.value,
                              }))
                            }
                          >
                            <option value="Outdoor">Outdoor</option>
                            <option value="Indoor">Indoor</option>
                          </select>
                        </div>
                      </div>
                      <div>
                        <label className="form-label" htmlFor="assigned-patient-disease">
                          Disease / condition
                        </label>
                        <input
                          id="assigned-patient-disease"
                          className="form-control"
                          value={patientForm.disease}
                          onChange={(event) =>
                            setPatientForm((form) => ({
                              ...form,
                              disease: event.target.value,
                            }))
                          }
                          maxLength={300}
                          required
                        />
                      </div>
                      {patientForm.admissionStatus === "Indoor" && (
                        <>
                          <div>
                            <label className="form-label" htmlFor="assigned-admitted-date">
                              Admission date
                            </label>
                            <input
                              id="assigned-admitted-date"
                              className="form-control"
                              type="date"
                              value={patientForm.admittedDate}
                              onChange={(event) =>
                                setPatientForm((form) => ({
                                  ...form,
                                  admittedDate: event.target.value,
                                }))
                              }
                              required
                            />
                          </div>
                          <div>
                            <label className="form-label" htmlFor="assigned-release-date">
                              Release date
                            </label>
                            <input
                              id="assigned-release-date"
                              className="form-control"
                              type="date"
                              min={patientForm.admittedDate || undefined}
                              value={patientForm.releasingDate}
                              onChange={(event) =>
                                setPatientForm((form) => ({
                                  ...form,
                                  releasingDate: event.target.value,
                                }))
                              }
                              required
                            />
                          </div>
                          <div>
                            <label className="form-label" htmlFor="assigned-release-summary">
                              Discharge summary
                            </label>
                            <textarea
                              id="assigned-release-summary"
                              className="form-control"
                              rows="2"
                              maxLength={1000}
                              value={patientForm.releasingSummary}
                              onChange={(event) =>
                                setPatientForm((form) => ({
                                  ...form,
                                  releasingSummary: event.target.value,
                                }))
                              }
                              required
                            />
                          </div>
                        </>
                      )}
                      <button
                        type="submit"
                        className="btn btn-primary"
                        disabled={savingPatient}
                      >
                        {savingPatient ? "Assigning..." : "Assign patient"}
                      </button>
                    </form>
                  </div>

                  <div className="col-12 col-lg-7">
                    <div className="d-flex justify-content-between align-items-center mb-3">
                      <h3 className="h6 fw-bold mb-0">Assigned patients</h3>
                      <span className="badge rounded-pill text-bg-primary">
                        {selectedDoctor.patients?.length ?? 0}
                      </span>
                    </div>
                    {selectedDoctor.patients?.length ? (
                      <div className="list-group">
                        {selectedDoctor.patients.map((patient) => (
                          <article
                            className="list-group-item p-3"
                            key={patient.patientId}
                          >
                            <div className="d-flex justify-content-between align-items-start gap-3">
                              <div>
                                <h4 className="h6 fw-bold mb-1">
                                  {patient.name}
                                </h4>
                                <p className="text-secondary small mb-2">
                                  Patient #{patient.patientId} · Age {patient.age}
                                </p>
                              </div>
                              <button
                                type="button"
                                className="btn btn-sm btn-outline-danger"
                                onClick={() => removePatient(patient)}
                              >
                                Remove
                              </button>
                            </div>
                            <p className="small mb-2">
                              <strong>Condition:</strong> {patient.disease}
                              <span className="badge text-bg-light border ms-2">
                                {patient.admissionStatus}
                              </span>
                            </p>
                            {patient.admissionStatus === "Indoor" && (
                              <p className="small text-secondary mb-0">
                                Admitted {patient.admittedDate} · Release{" "}
                                {patient.releasingDate}
                                {patient.releasingSummary
                                  ? ` · ${patient.releasingSummary}`
                                  : ""}
                              </p>
                            )}
                          </article>
                        ))}
                      </div>
                    ) : (
                      <div className="alert alert-light border mb-0">
                        No patients are assigned to this doctor yet.
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}
      </div>
    </main>
  );
}

export default Doctor;
