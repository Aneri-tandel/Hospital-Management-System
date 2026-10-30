const mongoose = require("mongoose");

const patientSchema = new mongoose.Schema(
  {
    patientId: { type: Number, required: true, min: 1 },
    name: { type: String, required: true, trim: true, maxlength: 100 },
    age: {
      type: Number,
      required: true,
      min: 1,
      max: 120,
      validate: Number.isInteger,
    },
    disease: { type: String, required: true, trim: true, maxlength: 300 },
    admissionStatus: {
      type: String,
      required: true,
      enum: ["Indoor", "Outdoor"],
    },
    admittedDate: { type: String, default: "" },
    releasingDate: { type: String, default: "" },
    releasingSummary: { type: String, default: "", maxlength: 1000 },
  },
  { _id: false },
);

const doctorSchema = new mongoose.Schema(
  {
    doctorId: { type: Number, required: true, unique: true, min: 1 },
    name: { type: String, required: true, trim: true, maxlength: 100 },
    specialization: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },
    experience: {
      type: Number,
      required: true,
      min: 0,
      max: 80,
      validate: Number.isInteger,
    },
    patients: { type: [patientSchema], default: [] },
  },
  { timestamps: true },
);

module.exports =
  mongoose.models.Doctor || mongoose.model("Doctor", doctorSchema);
