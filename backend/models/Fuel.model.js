import mongoose from "mongoose";

export const FUEL_TYPES = [
	"Diesel",
	"Petrol",
	"Ethanol",
	"LPG",
	"CNG",
	"Hybrid",
];

const fuelSchema = new mongoose.Schema(
	{
		userId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: true,
			index: true,
		},
		carId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Car",
			required: true,
			index: true,
		},
		fuelTotalCost: {
			type: Number,
			min: 0,
			// Not required — auto-calculated if not provided
		},
		fuelType: {
			type: String,
			enum: FUEL_TYPES,
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
			index: true,
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

// Auto-calculate total cost if not provided
fuelSchema.pre("save", function (next) {
	if (this.fuelTotalCost == null && this.fuelVolume && this.pricePerLiter) {
		this.fuelTotalCost = this.fuelVolume * this.pricePerLiter;
	}
	next();
});

const FuelModel = mongoose.model("Fuel", fuelSchema);

export default FuelModel;
