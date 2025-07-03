import mongoose from "mongoose";

const fuelSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    carId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Car",
      required: true,
    },

    fuelTotalCost: {
      type: Number,
      required: true,
      min: 0,
    },
    fuelType: {
      type: String,
      enum: ["Diesel", "Petrol", "Ethanol", "LPG", "CNG", "Hybrid"],
      required: true,
    },
    pricePerLiter: {
      type: Number,
      required: true,
      min: 0,
    },
    fuelVolume: {
      type: Number,
      required: true,
      min: 0,
    },
    isFullTank: {
      type: Boolean,
      default: false,
    },
    mileage: {
      type: Number,
      required: true,
      min: 0,
    },
    fuelDate: {
      type: Date,
      required: true,
    },
    comment: {
      type: String,
      maxlength: 1000,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

fuelSchema.pre("save", function (next) {
  if (this.fuelTotalCost == null && this.fuelVolume && this.pricePerLiter) {
    this.fuelTotalCost = this.fuelVolume * this.pricePerLiter;
  }
  next();
});

const FuelModel = mongoose.model("Fuel", fuelSchema);

export default FuelModel;
