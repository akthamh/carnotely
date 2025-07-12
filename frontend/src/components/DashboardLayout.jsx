import Navbar from "../components/layout/Navbar";
import Sidebar from "../components/layout/Sidebar";

export default function DashboardLayout({ children }) {
  return (
    <div className="min-h-screen bg-slate-100 flex transition-all duration-300">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Navbar />
        <main className="flex-1 bg-slate-100 px-4 sm:px-6 lg:px-8 py-6 transition-all duration-300">
          {children}
        </main>
      </div>
    </div>
  );
}