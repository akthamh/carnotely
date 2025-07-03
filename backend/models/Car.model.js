import mongoose from "mongoose";

const carSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    make: {
      type: String,
      required: true,
    },
    model: {
      type: String,
      required: true,
    },
    year: {
      type: Number,
      required: true,
    },
    registrationNumber: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    vin: {
      type: String,
      trim: true,
    },
    color: {
      type: String,
    },
    fuelType: {
      type: String,
      enum: ["Diesel", "Petrol", "Ethanol", "LPG", "CNG", "Hybrid", "Electric"],
    },
  },
  {
    timestamps: true,
  }
);

const Car = mongoose.model("Car", carSchema);
export default Car;
