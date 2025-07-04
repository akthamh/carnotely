import mongoose from "mongoose";

const carSchema = new mongoose.Schema(
	{
		userId: {
			type: String,
			required: true,
			index: true,
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
			min: 1886, // first car ever made
			max: new Date().getFullYear(),
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
			enum: ["Diesel", "Petrol", "LPG", "CNG", "Hybrid"],
		},
	},
	{
		timestamps: true,
	}
);

const Car = mongoose.model("Car", carSchema);
export default Car;
