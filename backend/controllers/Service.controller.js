import Service from "../models/Service.model.js";
import Car from "../models/Car.model.js";
import Joi from "joi";
import { SERVICE_TYPES } from "../models/Service.model.js";

// Validation schema for service data
const serviceSchema = Joi.object({
	carId: Joi.string()
		.required()
		.messages({ "any.required": "Car ID is required" }),
	serviceName: Joi.string()
		.valid(...SERVICE_TYPES)
		.required()
		.messages({ "any.required": "Service name is required" }),
	partsCost: Joi.number()
		.min(0)
		.required()
		.messages({ "any.required": "Parts cost is required" }),
	laborCost: Joi.number()
		.min(0)
		.required()
		.messages({ "any.required": "Labor cost is required" }),
	totalCost: Joi.number().min(0).optional(),
	mileage: Joi.number()
		.min(0)
		.required()
		.messages({ "any.required": "Mileage is required" }),
	serviceDate: Joi.date()
		.required()
		.messages({ "any.required": "Service date is required" }),
	serviceCenterName: Joi.string().max(300).optional().allow(""),
	comment: Joi.string().max(1000).optional().allow(""),
});

// Get all services for the current user
export const getAllServices = async (req, res) => {
	try {
		const services = await Service.find({ userId: req.user._id })
			.select("-userId")
			.lean();
		res.status(200).json(services);
	} catch (error) {
		console.error("Error in getAllServices:", error.message);
		if (error.name === "CastError") {
			return res.status(400).json({ message: "Invalid user ID" });
		}
		res.status(500).json({ message: "Server error" });
	}
};

// Create a new service
export const createService = async (req, res) => {
	try {
		const { error } = serviceSchema.validate(req.body);
		if (error) {
			return res.status(400).json({ message: error.details[0].message });
		}

		const { carId } = req.body;
		if (!mongoose.Types.ObjectId.isValid(carId)) {
			return res.status(400).json({ message: "Invalid car ID" });
		}

		// Verify car belongs to user
		const car = await Car.findOne({ _id: carId, userId: req.user._id });
		if (!car) {
			return res
				.status(403)
				.json({ message: "Unauthorized car access or car not found" });
		}

		const serviceData = {
			...req.body,
			userId: req.user._id,
		};
		const newService = new Service(serviceData);
		const savedService = await newService.save();
		res.status(201).json(savedService);
	} catch (error) {
		console.error("Error in createService:", error.message);
		if (error.name === "CastError") {
			return res.status(400).json({ message: "Invalid ID format" });
		}
		res.status(500).json({ message: "Server error" });
	}
};

// Update an existing service
export const updateService = async (req, res) => {
	try {
		if (!req.body || Object.keys(req.body).length === 0) {
			return res.status(400).json({ message: "No data provided" });
		}

		const { carId, ...updateData } = req.body;
		if (carId && !mongoose.Types.ObjectId.isValid(carId)) {
			return res.status(400).json({ message: "Invalid car ID" });
		}

		// Validate input
		const { error } = serviceSchema.validate(req.body, {
			allowUnknown: true,
		});
		if (error) {
			return res.status(400).json({ message: error.details[0].message });
		}

		// Verify car belongs to user if carId is provided
		if (carId) {
			const car = await Car.findOne({ _id: carId, userId: req.user._id });
			if (!car) {
				return res.status(403).json({
					message: "Unauthorized car access or car not found",
				});
			}
		}

		const serviceId = req.params.id;
		if (!mongoose.Types.ObjectId.isValid(serviceId)) {
			return res.status(400).json({ message: "Invalid service ID" });
		}

		const updatedService = await Service.findOneAndUpdate(
			{ _id: serviceId, userId: req.user._id },
			updateData,
			{ new: true }
		).select("-userId");

		if (!updatedService) {
			return res.status(404).json({ message: "Service not found" });
		}

		res.status(200).json(updatedService);
	} catch (error) {
		console.error("Error in updateService:", error.message);
		if (error.name === "CastError") {
			return res.status(400).json({ message: "Invalid ID format" });
		}
		res.status(500).json({ message: "Server error" });
	}
};

// Delete a single service
export const deleteService = async (req, res) => {
	try {
		const serviceId = req.params.id;
		if (!mongoose.Types.ObjectId.isValid(serviceId)) {
			return res.status(400).json({ message: "Invalid service ID" });
		}

		const deletedService = await Service.findOneAndDelete({
			_id: serviceId,
			userId: req.user._id,
		});

		if (!deletedService) {
			return res.status(404).json({ message: "Service not found" });
		}

		res.status(200).json({ message: "Service deleted successfully" });
	} catch (error) {
		console.error("Error in deleteService:", error.message);
		if (error.name === "CastError") {
			return res.status(400).json({ message: "Invalid service ID" });
		}
		res.status(500).json({ message: "Server error" });
	}
};

// Delete all services for the current user
export const deleteAllServices = async (req, res) => {
	try {
		await Service.deleteMany({ userId: req.user._id });
		res.status(200).json({ message: "All services deleted successfully" });
	} catch (error) {
		console.error("Error in deleteAllServices:", error.message);
		if (error.name === "CastError") {
			return res.status(400).json({ message: "Invalid user ID" });
		}
		res.status(500).json({ message: "Server error" });
	}
};
