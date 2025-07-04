import mongoose from "mongoose";

export const connectToDatabase = async () => {
	try {
		if (!process.env.MONGO_URI) {
			throw new Error("MONGO_URI environment variable not defined");
		}

		if (!process.env.DB_NAME) {
			throw new Error("DB_NAME environment variable not defined");
		}

		if (mongoose.connection.readyState === 1) {
			console.log("✅ Already connected to MongoDB");
			return;
		}

		if (mongoose.connection.readyState === 2) {
			console.log("⏳ Connection in progress, awaiting completion...");
			await mongoose.connection.asPromise();
			return;
		}

		await mongoose.connect(process.env.MONGO_URI, {
			dbName: process.env.DB_NAME,
			serverSelectionTimeoutMS: 5000,
			connectTimeoutMS: 10000,
			retryWrites: true,
		});

		console.log(`✅ MongoDB Connected to database: ${process.env.DB_NAME}`);
	} catch (error) {
		console.error(`❌ MongoDB Connection Error: ${error.message}`);
		throw error;
	}
};
