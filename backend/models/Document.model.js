import mongoose from "mongoose";

const documentSchema = new mongoose.Schema(
	{
		userId: {
			type: String,
			required: true,
			index: true,
		},
		carId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Car", // optional: only if you support multiple cars
		},
		serviceId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Service", // optional: link to a service record
		},
		name: {
			type: String,
			required: true,
			enum: [
				"Fine",
				"Invoice",
				"Receipt",
				"Jawas Sair",
				"Manual",
				"Other",
			],
			trim: true,
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

const Document = mongoose.model("Document", documentSchema);
export default Document;
