// frontend/src/components/auth/SignUpPage.jsx
import { useState } from "react";
import { useSignUp } from "@clerk/clerk-react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FaExclamationCircle } from "react-icons/fa";

export default function SignUpPage() {
	const { signUp, setActive, isLoaded } = useSignUp();
	const navigate = useNavigate();

	const [emailAddress, setEmailAddress] = useState("");
	const [password, setPassword] = useState("");
	const [code, setCode] = useState("");
	const [error, setError] = useState("");
	const [loading, setLoading] = useState(false);
	const [pendingVerification, setPendingVerification] = useState(false);

	const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

	const onSignUpPress = async () => {
		if (!isLoaded) return;

		if (!validateEmail(emailAddress)) {
			setError("Please enter a valid email address");
			return;
		}
		if (password.length < 8) {
			setError("Password must be at least 8 characters");
			return;
		}

		try {
			setLoading(true);
			setError("");
			await signUp.create({ emailAddress, password });
			await signUp.prepareEmailAddressVerification({
				strategy: "email_code",
			});
			setPendingVerification(true);
		} catch (err) {
			setError(err.errors?.[0]?.message || "Sign up failed");
		} finally {
			setLoading(false);
		}
	};

	const onVerifyPress = async () => {
		if (!isLoaded) return;

		if (code.length !== 6) {
			setError("Verification code must be 6 digits");
			return;
		}

		try {
			setLoading(true);
			setError("");
			const attempt = await signUp.attemptEmailAddressVerification({
				code,
			});
			if (attempt.status === "complete") {
				await setActive({ session: attempt.createdSessionId });
				navigate("/dashboard");
			} else {
				setError("Invalid verification code");
			}
		} catch (err) {
			setError(err.errors?.[0]?.message || "Verification failed");
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900 px-4">
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.4 }}
				className="w-full max-w-md bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-8"
			>
				<h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-6">
					Create Account
				</h1>

				{error && (
					<div className="flex items-center gap-2 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 p-3 rounded-lg mb-4">
						<FaExclamationCircle />
						<span className="flex-1">{error}</span>
						<button
							onClick={() => setError("")}
							className="text-slate-500 hover:text-slate-700 dark:hover:text-slate-200"
						>
							✕
						</button>
					</div>
				)}

				{!pendingVerification ? (
					<div className="space-y-4">
						<input
							type="email"
							value={emailAddress}
							onChange={(e) => setEmailAddress(e.target.value)}
							placeholder="Enter email"
							className="w-full px-4 py-3 rounded-lg border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
						/>

						<input
							type="password"
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							placeholder="Enter password"
							className="w-full px-4 py-3 rounded-lg border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
						/>

						<button
							onClick={onSignUpPress}
							disabled={loading}
							className="w-full py-3 rounded-lg bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 text-white font-semibold transition-colors disabled:opacity-50"
						>
							{loading ? "Signing up..." : "Sign Up"}
						</button>
					</div>
				) : (
					<div className="space-y-4">
						<input
							type="text"
							value={code}
							onChange={(e) =>
								setCode(e.target.value.replace(/\D/g, ""))
							}
							placeholder="Enter verification code"
							maxLength={6}
							className="w-full px-4 py-3 rounded-lg border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
						/>

						<button
							onClick={onVerifyPress}
							disabled={loading}
							className="w-full py-3 rounded-lg bg-green-500 hover:bg-green-600 dark:bg-green-600 dark:hover:bg-green-700 text-white font-semibold transition-colors disabled:opacity-50"
						>
							{loading ? "Verifying..." : "Verify Email"}
						</button>

						<button
							onClick={async () => {
								await signUp.prepareEmailAddressVerification({
									strategy: "email_code",
								});
							}}
							className="w-full py-2 text-sm text-blue-500 hover:underline"
						>
							Resend code
						</button>
					</div>
				)}

				<p className="mt-6 text-sm text-slate-600 dark:text-slate-400 text-center">
					Already have an account?{" "}
					<Link to="/" className="text-blue-500 hover:underline">
						Sign in
					</Link>
				</p>
			</motion.div>
		</div>
	);
}
