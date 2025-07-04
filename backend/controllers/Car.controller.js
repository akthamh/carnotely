import Car from "../models/Car.model.js";
import Joi from "joi";

// Validation schema for car data
const carSchema = Joi.object({
	make: Joi.string()
		.required()
		.messages({ "any.required": "Make is required" }),
	model: Joi.string()
		.required()
		.messages({ "any.required": "Model is required" }),
	year: Joi.number()
		.integer()
		.min(1886)
		.max(new Date().getFullYear())
		.required()
		.messages({
			"any.required": "Year is required",
			"number.min": "Year must be 1886 or later",
		}),
	registrationNumber: Joi.string()
		.required()
		.messages({ "any.required": "Registration number is required" }),
	vin: Joi.string().optional().allow(""),
	color: Joi.string().optional().allow(""),
	fuelType: Joi.string()
		.valid("Diesel", "Petrol", "Ethanol", "LPG", "CNG", "Hybrid")
		.optional()
		.messages({ "any.only": "Invalid fuel type" }),
});

// Get all cars for the logged-in user
export const getAllCars = async (req, res) => {
	try {
		const userId = req.user.id; // ✅ not _id
		console.log("User ID from req.user:", userId);

		const cars = await Car.find({ userId }).select("-userId").lean();
		res.status(200).json(cars);

		console.log("Cars:", cars);
	} catch (error) {
		console.error("Error in getAllCars:", error.message);
		if (error.name === "CastError") {
			return res.status(400).json({ message: "Invalid user ID" });
		}
		res.status(500).json({ message: "Server error" });
	}
};

// Get one car by ID (must belong to the user)
export const getCarById = async (req, res) => {
	try {
		const carId = req.params.id;
		if (!mongoose.Types.ObjectId.isValid(carId)) {
			return res.status(400).json({ message: "Invalid car ID" });
		}
		const car = await Car.findOne({ _id: carId, userId: req.user._id })
			.select("-userId")
			.lean();
		if (!car) {
			return res.status(404).json({ message: "Car not found" });
		}
		res.status(200).json(car);
	} catch (error) {
		console.error("Error in getCarById:", error.message);
		if (error.name === "CastError") {
			return res.status(400).json({ message: "Invalid car ID" });
		}
		res.status(500).json({ message: "Server error" });
	}
};

// Create a new car
export const createCar = async (req, res) => {
	try {
		const { error } = carSchema.validate(req.body);
		if (error) {
			return res.status(400).json({ message: error.details[0].message });
		}
		const carData = {
			...req.body,
			userId: req.auth.userId, // or req.auth?.userId
		};

		const newCar = new Car(carData);
		const savedCar = await newCar.save();
		res.status(201).json(savedCar);
	} catch (error) {
		console.error("Error in createCar:", error.message);
		if (error.code === 11000) {
			return res
				.status(400)
				.json({ message: "Registration number already exists" });
		}
		res.status(500).json({ message: "Server error" });
	}
};

// Update a car (must belong to the user)
export const updateCar = async (req, res) => {
	try {
		if (!req.body || Object.keys(req.body).length === 0) {
			return res.status(400).json({ message: "No data provided" });
		}
		const { error } = carSchema.validate(req.body, { allowUnknown: true });
		if (error) {
			return res.status(400).json({ message: error.details[0].message });
		}

		const carId = req.params.id;
		if (!mongoose.Types.ObjectId.isValid(carId)) {
			return res.status(400).json({ message: "Invalid car ID" });
		}

		const updatedCar = await Car.findOneAndUpdate(
			{ _id: carId, userId: req.user._id },
			req.body,
			{ new: true }
		).select("-userId");

		if (!updatedCar) {
			return res.status(404).json({ message: "Car not found" });
		}

		res.status(200).json(updatedCar);
	} catch (error) {
		console.error("Error in updateCar:", error.message);
		if (error.name === "CastError") {
			return res.status(400).json({ message: "Invalid car ID" });
		}
		if (error.code === 11000) {
			return res
				.status(400)
				.json({ message: "Registration number already exists" });
		}
		res.status(500).json({ message: "Server error" });
	}
};

// Delete a car (must belong to the user)
export const deleteCar = async (req, res) => {
	try {
		const carId = req.params.id;
		if (!mongoose.Types.ObjectId.isValid(carId)) {
			return res.status(400).json({ message: "Invalid car ID" });
		}

		const deletedCar = await Car.findOneAndDelete({
			_id: carId,
			userId: req.user._id,
		});

		if (!deletedCar) {
			return res.status(404).json({ message: "Car not found" });
		}

		res.status(200).json({ message: "Car deleted successfully" });
	} catch (error) {
		console.error("Error in deleteCar:", error.message);
		if (error.name === "CastError") {
			return res.status(400).json({ message: "Invalid car ID" });
		}
		res.status(500).json({ message: "Server error" });
	}
};
