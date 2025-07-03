import mongoose from "mongoose";

const serviceSchema = new mongoose.Schema(
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
    serviceName: {
      type: String,
      enum: [
        "Periodic Maintenance",
        "Engine Engine Air Filter",
        "Oil Filter",
        "Brake Fluid",
        "Oil Change",
        "Tire Change",
        "Battery Replacement",
        "Brake Repair",
        "Brake Pad Replacement",
        "Brake Discs and Pads",
        "Spark Plugs",
        "Clutch Repair",
        "Wheels",
        "Steering Repair",
        "Wash",
        "Suspension Repair",
        "Tire Repair",
        "Transmission Repair",
        "Diagnostic Service",
        "Other",
      ],
      required: true,
    },
    partsCost: {
      type: Number,
      required: true,
      min: 0,
    },
    laborCost: {
      type: Number,
      required: true,
      min: 0,
    },
    totalCost: {
      type: Number,
      min: 0,
    },
    mileage: {
      type: Number,
      required: true,
      min: 0,
    },
    serviceDate: {
      type: Date,
      required: true,
    },
    serviceCenterName: {
      type: String,
      maxlength: 300,
      trim: true,
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

serviceSchema.pre("save", function (next) {
  this.totalCost = this.partsCost + this.laborCost;
  next();
});

const Service = mongoose.model("Service", serviceSchema);
export default Service;
