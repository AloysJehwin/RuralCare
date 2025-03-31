import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  dob: { type: Date, required: true },
  height: { type: Number, required: true }, // Height in cm
  weight: { type: Number, required: true }, // Weight in kg
  age: { type: Number, required: true }, // Calculated Age
}, { timestamps: true });

export default mongoose.models.User || mongoose.model("User", UserSchema);
