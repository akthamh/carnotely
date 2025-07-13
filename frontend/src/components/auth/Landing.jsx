import { useNavigate } from "react-router-dom";
import { FaCar } from "react-icons/fa";
import { motion } from "framer-motion";

function Landing() {
	const navigate = useNavigate();

	return (
		<div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 flex items-center justify-center px-4">
			<motion.div
				initial={{ opacity: 0, y: 50 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.5, ease: "easeOut" }}
				className="text-center max-w-md"
			>
				<FaCar className="text-6xl text-slate-300 mx-auto mb-6 transition-transform duration-300 hover:scale-110" />
				<h1 className="text-4xl font-bold text-slate-100 mb-4 transition-all duration-300 hover:text-slate-200">
					Car Service Tracker
				</h1>
				<p className="text-slate-300 mb-8 text-lg">
					Manage your vehicles, track services, log fuel, and store
					documents with ease.
				</p>
				<div className="flex justify-center gap-4">
					<button
						onClick={() => navigate("/sign-in")}
						className="px-6 py-3 bg-gradient-to-r from-slate-600 to-slate-700 text-white rounded-lg shadow-lg hover:from-slate-500 hover:to-slate-600 transition-all duration-300 transform hover:scale-105"
					>
						Sign In or Sign Up
					</button>
				
				</div>
			</motion.div>
		</div>
	);
}

export default Landing;
