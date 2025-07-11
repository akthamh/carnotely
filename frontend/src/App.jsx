import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import {
	ClerkProvider,
	SignUp,
	SignedIn,
	SignedOut,
	RedirectToSignIn,
} from "@clerk/clerk-react";
import Dashboard from "./components/Dashboard";
import Cars from "./components/car/Cars";
import Landing from "./components/auth/Landing";
import Fuels from "./components/feul/Fuel";
import Service from "./components/carService/Services";

const clerkPubKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!clerkPubKey) {
	throw new Error("Missing Clerk Publishable Key");
}

function App() {
	return (
		<ClerkProvider
			publishableKey={clerkPubKey}
			signOutUrl="/sign-in"
			appearance={{
				cssLayerName: "clerk",
			}}
		>
			<Router>
				<Toaster />
				<SignedOut>
					<Routes>
						<Route
							path="/sign-up/*"
							element={<SignUp routing="path" path="/sign-up" />}
						/>
						<Route path="*" element={<RedirectToSignIn />} />
						<Route path="/" element={<Landing />} />
					</Routes>
				</SignedOut>
				<SignedIn>
					<Routes>
						<Route path="/dashboard" element={<Dashboard />} />
						<Route path="/cars" element={<Cars />} />
						<Route path="/fuel" element={<Fuels />} />
						<Route path="/service" element={<Service />} />
						<Route
							path="/sign-up/*"
							element={<SignUp routing="path" path="/sign-up" />}
						/>
						<Route path="*" element={<Dashboard />} />
					</Routes>
				</SignedIn>
			</Router>
		</ClerkProvider>
	);
}

export default App;
