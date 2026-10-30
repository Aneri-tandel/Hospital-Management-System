const express = require("express");
const cors = require("cors");
const fs = require("fs/promises");
const path = require("path");
const mongoose = require("mongoose");
const Doctor = require("./Models/Doctor");

const app = express();
const PORT = Number(process.env.PORT) || 8000;
const MONGODB_URI =
  process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/citycare_hospital";
const DATA_FILE = path.join(__dirname, "Data", "doctors.json");

app.use(cors());
app.use(express.json({ limit: "100kb" }));

const counterSchema = new mongoose.Schema({
  _id: { type: String, required: true },
  sequence: { type: Number, required: true, default: 0 },
});

const Counter = mongoose.model("Counter", counterSchema);

class HttpError extends Error {
  constructor(status, message) {
    super(message);
    this.status = status;
  }
}

function parseId(value, label) {
  const id = Number(value);
  if (!Number.isSafeInteger(id) || id < 1) {
    throw new HttpError(400, `A valid ${label} is required.`);
  }
  return id;
}

function validDate(value) {
  return (
    typeof value === "string" &&
    /^\d{4}-\d{2}-\d{2}$/.test(value) &&
    !Number.isNaN(Date.parse(`${value}T00:00:00.000Z`)) &&
    new Date(`${value}T00:00:00.000Z`).toISOString().slice(0, 10) === value
  );
}

function validatePatient(input) {
  const name = typeof input.name === "string" ? input.name.trim() : "";
  const disease = typeof input.disease === "string" ? input.disease.trim() : "";
  const age = Number(input.age);
  const admissionStatus = input.admissionStatus;
  const admittedDate = input.admittedDate || "";
  const releasingDate = input.releasingDate || "";
  const releasingSummary =
    typeof input.releasingSummary === "string"
      ? input.releasingSummary.trim()
      : "";

  if (
    !name ||
    name.length > 100 ||
    !Number.isInteger(age) ||
    age < 1 ||
    age > 120 ||
    !disease ||
    disease.length > 300 ||
    !["Indoor", "Outdoor"].includes(admissionStatus)
  ) {
    throw new HttpError(
      400,
      "Enter a valid name, age from 1 to 120, disease, and admission status.",
    );
  }

  if (
    admissionStatus === "Indoor" &&
    (!validDate(admittedDate) ||
      !validDate(releasingDate) ||
      releasingDate < admittedDate ||
      !releasingSummary ||
      releasingSummary.length > 1000)
  ) {
    throw new HttpError(
      400,
      "Indoor patients need valid admission and release dates and a discharge summary.",
    );
  }

  return {
    name,
    age,
    disease,
    admissionStatus,
    admittedDate: admissionStatus === "Indoor" ? admittedDate : "",
    releasingDate: admissionStatus === "Indoor" ? releasingDate : "",
    releasingSummary: admissionStatus === "Indoor" ? releasingSummary : "",
  };
}

async function nextSequence(name) {
  const counter = await Counter.findByIdAndUpdate(
    name,
    { $inc: { sequence: 1 } },
    { new: true, upsert: true, setDefaultsOnInsert: true },
  );
  return counter.sequence;
}

async function seedFromJsonWhenEmpty() {
  if (await Doctor.exists({})) return;

  const source = JSON.parse(await fs.readFile(DATA_FILE, "utf8"));
  const doctors = Array.isArray(source.doctors) ? source.doctors : [];
  if (doctors.length === 0) return;

  await Doctor.insertMany(
    doctors.map((doctor) => ({
      doctorId: doctor.doctorId,
      name: doctor.name,
      specialization: doctor.specialization,
      experience: doctor.experience,
      patients: (doctor.patients || []).map((patient) => ({
        patientId: patient.patientId,
        name: patient.name,
        age: patient.age,
        disease: patient.disease,
        admissionStatus: patient.admissionStatus,
        admittedDate: patient.admittedDate || "",
        releasingDate: patient.releasingDate || "",
        releasingSummary: patient.releasingSummary || "",
      })),
    })),
  );

  await Counter.updateOne(
    { _id: "doctorId" },
    { $max: { sequence: Math.max(...doctors.map((doctor) => doctor.doctorId)) } },
    { upsert: true },
  );
  const patientIds = doctors.flatMap((doctor) =>
    (doctor.patients || []).map((patient) => patient.patientId),
  );
  if (patientIds.length > 0) {
    await Counter.updateOne(
      { _id: "patientId" },
      { $max: { sequence: Math.max(...patientIds) } },
      { upsert: true },
    );
  }

  console.log(`Imported ${doctors.length} doctor records from the JSON seed.`);
}

app.get("/", (req, res) => {
  res.json({ message: "CityCare Hospital API is running" });
});

app.get("/api/health", (req, res) => {
  const connected = mongoose.connection.readyState === 1;
  res.status(connected ? 200 : 503).json({
    status: connected ? "ok" : "unavailable",
    database: connected ? "connected" : "disconnected",
  });
});

app.get("/api/doctors", async (req, res) => {
  const doctors = await Doctor.find().sort({ doctorId: 1 }).lean();
  res.json(doctors);
});

app.get("/api/doctors/:id", async (req, res) => {
  const doctorId = parseId(req.params.id, "doctor ID");
  const doctor = await Doctor.findOne({ doctorId }).lean();
  if (!doctor) throw new HttpError(404, "Doctor not found.");
  res.json(doctor);
});

app.post("/api/doctors", async (req, res) => {
  const name = typeof req.body.name === "string" ? req.body.name.trim() : "";
  const specialization =
    typeof req.body.specialization === "string"
      ? req.body.specialization.trim()
      : "";
  const experience = Number(req.body.experience);

  if (
    !name ||
    name.length > 100 ||
    !specialization ||
    specialization.length > 100 ||
    !Number.isInteger(experience) ||
    experience < 0 ||
    experience > 80
  ) {
    throw new HttpError(
      400,
      "Enter a doctor name, specialization, and experience from 0 to 80 years.",
    );
  }

  const doctor = await Doctor.create({
    doctorId: await nextSequence("doctorId"),
    name,
    specialization,
    experience,
  });
  res.status(201).json(doctor);
});

app.put("/api/doctors/:id", async (req, res) => {
  const doctorId = parseId(req.params.id, "doctor ID");
  const doctor = await Doctor.findOne({ doctorId });
  if (!doctor) throw new HttpError(404, "Doctor not found.");

  if (req.body.name !== undefined) doctor.name = req.body.name;
  if (req.body.specialization !== undefined) {
    doctor.specialization = req.body.specialization;
  }
  if (req.body.experience !== undefined) {
    doctor.experience = Number(req.body.experience);
  }

  await doctor.save();
  res.json(doctor);
});

app.post("/api/doctors/:doctorId/patients", async (req, res) => {
  const doctorId = parseId(req.params.doctorId, "doctor ID");
  const doctor = await Doctor.findOne({ doctorId });
  if (!doctor) throw new HttpError(404, "Doctor not found.");

  const patient = validatePatient(req.body);
  patient.patientId = await nextSequence("patientId");
  doctor.patients.push(patient);
  await doctor.save();

  res.status(201).json({
    message: "Patient assigned successfully.",
    doctor,
  });
});

app.put("/api/doctors/:doctorId/patients/:patientId", async (req, res) => {
  const doctorId = parseId(req.params.doctorId, "doctor ID");
  const patientId = parseId(req.params.patientId, "patient ID");
  const doctor = await Doctor.findOne({ doctorId });
  if (!doctor) throw new HttpError(404, "Doctor not found.");

  const patient = doctor.patients.find(
    (record) => record.patientId === patientId,
  );
  if (!patient) throw new HttpError(404, "Patient not found for this doctor.");

  Object.assign(patient, validatePatient({ ...patient.toObject(), ...req.body }));
  await doctor.save();

  res.json({
    message: "Patient assignment updated successfully.",
    doctor,
    patient,
  });
});

app.delete("/api/doctors/:doctorId/patients/:patientId", async (req, res) => {
  const doctorId = parseId(req.params.doctorId, "doctor ID");
  const patientId = parseId(req.params.patientId, "patient ID");
  const doctor = await Doctor.findOne({ doctorId });
  if (!doctor) throw new HttpError(404, "Doctor not found.");

  const patientExists = doctor.patients.some(
    (patient) => patient.patientId === patientId,
  );
  if (!patientExists) {
    throw new HttpError(404, "Patient not found for this doctor.");
  }

  doctor.patients = doctor.patients.filter(
    (patient) => patient.patientId !== patientId,
  );
  await doctor.save();
  res.json({ message: "Patient removed successfully.", doctor });
});

app.get("/api/doctors/:id/patients", async (req, res) => {
  const doctorId = parseId(req.params.id, "doctor ID");
  const doctor = await Doctor.findOne(
    { doctorId },
    { patients: 1, _id: 0 },
  ).lean();
  if (!doctor) throw new HttpError(404, "Doctor not found.");
  res.json(doctor.patients);
});

app.delete("/api/doctors/:id", async (req, res) => {
  const doctorId = parseId(req.params.id, "doctor ID");
  const doctor = await Doctor.findOneAndDelete({
    doctorId,
  });
  if (!doctor) throw new HttpError(404, "Doctor not found.");
  res.json({ message: "Doctor and assigned patients deleted successfully." });
});

app.use((error, req, res, next) => {
  if (res.headersSent) return next(error);

  if (error instanceof mongoose.Error.ValidationError) {
    return res.status(400).json({
      message: Object.values(error.errors)
        .map((item) => item.message)
        .join(" "),
    });
  }

  if (error.code === 11000) {
    return res.status(409).json({ message: "This record already exists." });
  }

  const status = error.status || 500;
  if (status >= 500) console.error("API error:", error);
  res.status(status).json({
    message: status < 500 ? error.message : "An internal server error occurred.",
  });
});

app.use((req, res) => {
  res.status(404).json({
    message: `Route not found: ${req.method} ${req.originalUrl}`,
  });
});

async function startServer() {
  await mongoose.connect(MONGODB_URI, { serverSelectionTimeoutMS: 5000 });
  console.log(`Connected to MongoDB: ${mongoose.connection.name}`);
  await seedFromJsonWhenEmpty();

  app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
  });
}

startServer().catch((error) => {
  console.error(
    `Unable to start the API. Check that MongoDB is available and MONGODB_URI is correct. ${error.message}`,
  );
  process.exitCode = 1;
});
