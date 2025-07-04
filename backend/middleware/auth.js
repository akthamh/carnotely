import { ClerkExpressRequireAuth } from "@clerk/clerk-sdk-node";
import mongoose from "mongoose";

// Middleware to require authentication and map Clerk's userId to req.user._id
export const auth = async (req, res, next) => {
	try {
		await ClerkExpressRequireAuth()(req, res, () => {
			if (!req.auth?.userId) {
				return res
					.status(401)
					.json({ message: "Authentication failed: No user ID" });
			}
			req.user = { id: req.auth.userId }; // No ObjectId conversion
			next();
		});
	} catch (error) {
		console.error("Authentication error:", error);
		res.status(401).json({ message: "Authentication failed" });
	}
};

// Middleware to require admin role
export const adminOnly = async (req, res, next) => {
	try {
		const { role } = req.auth.sessionClaims || {};
		if (!role || role !== "admin") {
			return res.status(403).json({ message: "Admin access required" });
		}
		next();
	} catch (error) {
		console.error("Admin access error:", error.message);
		res.status(403).json({ message: "Access denied" });
	}
};
