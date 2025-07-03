import mongoose from "mongoose";

const userSettingsSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true, // one settings document per user
    },
    currency: {
      type: String,
      enum: ["AFN", "USD", "EUR", "INR", "PKR", "AED", "Other"],
      default: "AFN",
    },
    distanceUnit: {
      type: String,
      enum: ["km", "miles"],
      default: "km",
    },
    timeFormat: {
      type: String,
      enum: ["12h", "24h"],
      default: "24h",
    },
    defaultCarId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Car",
    },

    dateFormat: {
      type: String,
      enum: ["DD/MM/YYYY", "MM/DD/YYYY", "YYYY-MM-DD"],
      default: "DD/MM/YYYY",
    },
  },
  {
    timestamps: true,
  }
);

const UserSettings = mongoose.model("UserSettings", userSettingsSchema);
export default UserSettings;
