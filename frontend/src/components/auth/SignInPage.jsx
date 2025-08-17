// frontend/src/components/auth/SignInPage.jsx
import { useState } from "react";
import { useSignIn } from "@clerk/clerk-react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FaExclamationCircle } from "react-icons/fa";

export default function SignInPage() {
	const { signIn, setActive, isLoaded } = useSignIn();
	const navigate = useNavigate();

	const [emailAddress, setEmailAddress] = useState("");
	const [password, setPassword] = useState("");
	const [error, setError] = useState("");
	const [loading, setLoading] = useState(false);

	const onSignInPress = async () => {
		if (!isLoaded) return;

		if (!emailAddress.trim()) {
			setError("Please enter an email address");
			return;
		}
		if (!password.trim()) {
			setError("Please enter a password");
			return;
		}

		try {
			setLoading(true);
			setError("");

			const signInAttempt = await signIn.create({
				identifier: emailAddress,
				password,
			});

			if (signInAttempt.status === "complete") {
				await setActive({ session: signInAttempt.createdSessionId });
				navigate("/dashboard");
			} else {
				console.error(JSON.stringify(signInAttempt, null, 2));
			}
		} catch (err) {
			const code = err.errors?.[0]?.code;
			const message = err.errors?.[0]?.message;
			const hints = {
				form_password_incorrect: "Tip: Make sure caps lock is off.",
				form_identifier_not_found:
					"You may want to create an account first.",
			};
			setError(
				`${message || "Sign in failed"} ${hints[code] || ""}`.trim()
			);
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
					Welcome Back
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
						onClick={onSignInPress}
						disabled={loading}
						className="w-full py-3 rounded-lg bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 text-white font-semibold transition-colors disabled:opacity-50"
					>
						{loading ? "Signing in..." : "Sign In"}
					</button>
				</div>

				<p className="mt-6 text-sm text-slate-600 dark:text-slate-400 text-center">
					Don’t have an account?{" "}
					<Link
						to="/sign-up"
						className="text-blue-500 hover:underline"
					>
						Sign up
					</Link>
				</p>
			</motion.div>
		</div>
	);
}
