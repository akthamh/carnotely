import mongoose from "mongoose";
import Fuel from "../models/Fuel.model.js";
import Car from "../models/Car.model.js";
import Joi from "joi";
import { FUEL_TYPES } from "../models/Fuel.model.js";

// Validation schema for fuel data
const fuelSchema = Joi.object({
	carId: Joi.string()
		.required()
		.messages({ "any.required": "Car ID is required" }),
	fuelType: Joi.string()
		.valid(...FUEL_TYPES)
		.required()
		.messages({ "any.required": "Fuel type is required" }),
	pricePerLiter: Joi.number()
		.min(0)
		.required()
		.messages({ "any.required": "Price per liter is required" }),
	fuelVolume: Joi.number()
		.min(0)
		.required()
		.messages({ "any.required": "Fuel volume is required" }),
	fuelTotalCost: Joi.number().min(0).optional(),
	isFullTank: Joi.boolean().optional(),
	mileage: Joi.number()
		.min(0)
		.required()
		.messages({ "any.required": "Mileage is required" }),
	fuelDate: Joi.date()
		.required()
		.messages({ "any.required": "Fuel date is required" }),
	comment: Joi.string().max(1000).optional().allow(""),
});

// 🔁 Reusable helper
const findUserFuelById = async (fuelId, userId) => {
	if (!mongoose.Types.ObjectId.isValid(fuelId)) return null;
	return await Fuel.findOne({ _id: fuelId, userId }).select("-userId").lean();
};

// 📄 Get all fuels for logged-in user
export const getAllFuels = async (req, res) => {
	try {
		const fuels = await Fuel.find({ userId: req.user.id })
			.sort({ fuelDate: -1 })
			.select("-userId")
			.lean();
		res.status(200).json(fuels);
	} catch (error) {
		console.error("Error in getAllFuels:", error.message);
		if (error.name === "CastError") {
			return res.status(400).json({ message: "Invalid user ID" });
		}
		res.status(500).json({ message: "Server error" });
	}
};

// ➕ Create a new fuel log
export const createFuel = async (req, res) => {
	try {
		const { error } = fuelSchema.validate(req.body);
		if (error) {
			return res.status(400).json({ message: error.details[0].message });
		}

		const { carId } = req.body;
		if (!mongoose.Types.ObjectId.isValid(carId)) {
			return res.status(400).json({ message: "Invalid car ID" });
		}

		// Verify car belongs to user
		const car = await Car.findOne({ _id: carId, userId: req.user.id });
		if (!car) {
			return res
				.status(403)
				.json({ message: "Unauthorized car access or car not found" });
		}

		const newFuel = new Fuel({
			...req.body,
			userId: req.user.id,
		});

		const savedFuel = await newFuel.save();
		res.status(201).json(savedFuel);
	} catch (error) {
		console.error("Error in createFuel:", error.message);
		if (error.name === "CastError") {
			return res.status(400).json({ message: "Invalid ID format" });
		}
		res.status(500).json({ message: "Server error" });
	}
};

// ✏️ Update a fuel entry
export const updateFuel = async (req, res) => {
	try {
		const fuelId = req.params.id;
		if (!mongoose.Types.ObjectId.isValid(fuelId)) {
			return res.status(400).json({ message: "Invalid fuel ID" });
		}

		const { carId, ...updateData } = req.body;
		if (carId && !mongoose.Types.ObjectId.isValid(carId)) {
			return res.status(400).json({ message: "Invalid car ID" });
		}

		// Validate input
		const { error } = fuelSchema.validate(req.body, { allowUnknown: true });
		if (error) {
			return res.status(400).json({ message: error.details[0].message });
		}

		// Verify car belongs to user if carId is provided
		if (carId) {
			const car = await Car.findOne({ _id: carId, userId: req.user.id });
			if (!car) {
				return res.status(403).json({
					message: "Unauthorized car access or car not found",
				});
			}
		}

		const updatedFuel = await Fuel.findOneAndUpdate(
			{ _id: fuelId, userId: req.user.id },
			updateData,
			{ new: true }
		).select("-userId");

		if (!updatedFuel) {
			return res.status(404).json({ message: "Fuel not found" });
		}

		res.status(200).json(updatedFuel);
	} catch (error) {
		console.error("Error in updateFuel:", error.message);
		if (error.name === "CastError") {
			return res.status(400).json({ message: "Invalid ID format" });
		}
		res.status(500).json({ message: "Server error" });
	}
};

// ❌ Delete a fuel entry
export const deleteFuel = async (req, res) => {
	try {
		const fuelId = req.params.id;
		if (!mongoose.Types.ObjectId.isValid(fuelId)) {
			return res.status(400).json({ message: "Invalid fuel ID" });
		}

		const deletedFuel = await Fuel.findOneAndDelete({
			_id: fuelId,
			userId: req.user.id,
		});

		if (!deletedFuel) {
			return res.status(404).json({ message: "Fuel not found" });
		}

		res.status(200).json({ message: "Fuel deleted successfully" });
	} catch (error) {
		console.error("Error in deleteFuel:", error.message);
		if (error.name === "CastError") {
			return res.status(400).json({ message: "Invalid fuel ID" });
		}
		res.status(500).json({ message: "Server error" });
	}
};

// 🔍 Get single fuel entry by ID
export const getFuelById = async (req, res) => {
	try {
		const fuel = await findUserFuelById(req.params.id, req.user._id);
		if (!fuel) {
			return res.status(404).json({ message: "Fuel not found" });
		}
		res.status(200).json(fuel);
	} catch (error) {
		console.error("Error in getFuelById:", error.message);
		if (error.name === "CastError") {
			return res.status(400).json({ message: "Invalid fuel ID" });
		}
		res.status(500).json({ message: "Server error" });
	}
};

// 💰 Get total fuel cost summary
export const getFuelCostSummary = async (req, res) => {
	try {
		const fuels = await Fuel.find({ userId: req.user._id })
			.select("fuelTotalCost")
			.lean();
		const totalCost = fuels.reduce(
			(sum, f) => sum + (f.fuelTotalCost || 0),
			0
		);
		res.status(200).json({ totalFuelCost: totalCost });
	} catch (error) {
		console.error("Error in getFuelCostSummary:", error.message);
		if (error.name === "CastError") {
			return res.status(400).json({ message: "Invalid user ID" });
		}
		res.status(500).json({ message: "Server error" });
	}
};

// 📊 Get monthly fuel cost summary
export const getMonthlyFuelCost = async (req, res) => {
	try {
		const monthlyData = await Fuel.aggregate([
			{ $match: { userId: req.user._id } },
			{
				$group: {
					_id: {
						year: { $year: "$fuelDate" },
						month: { $month: "$fuelDate" },
					},
					totalFuelCost: { $sum: "$fuelTotalCost" },
					count: { $sum: 1 },
				},
			},
			{ $sort: { "_id.year": -1, "_id.month": -1 } },
		]);
		res.status(200).json(monthlyData);
	} catch (error) {
		console.error("Error in getMonthlyFuelCost:", error.message);
		if (error.name === "CastError") {
			return res.status(400).json({ message: "Invalid user ID" });
		}
		res.status(500).json({ message: "Server error" });
	}
};
