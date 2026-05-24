import { Link, useLocation, useNavigate } from "react-router";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Car, Menu, X, User, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const location = useLocation();
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const isActive = (path: string) => location.pathname === path;
  const isAuthPage = location.pathname === "/login" || location.pathname === "/register";
  if (isAuthPage) return null;

  const navLinks = [
    { path: "/for-drivers", label: "For drivers" },
    { path: "/for-hosts", label: "For Hosts" },
    { path: "/trust-safety", label: "Trust & Safety" },
    { path: "/pricing", label: "Pricing" },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-[#2F8E92] flex items-center justify-center">
              <Car className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-xl text-[#0E1A1A]">ParkShare</span>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`text-sm font-medium transition-colors ${
                  isActive(link.path) ? "text-[#2F8E92]" : "text-gray-500 hover:text-[#0E1A1A]"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-3">
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center gap-2 p-2 rounded-xl hover:bg-gray-50 transition-colors"
                >
                  <div className="w-8 h-8 rounded-full bg-[#2F8E92] flex items-center justify-center">
                    <User className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-sm font-medium">{user?.name || "Account"}</span>
                </button>
                {showUserMenu && (
                  <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-2xl shadow-lg border border-gray-100 py-2">
                    <Link to="/dashboard" className="block px-4 py-2 text-sm hover:bg-gray-50">Dashboard</Link>
                    <button onClick={() => { logout(); navigate("/"); }} className="w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-gray-50 flex items-center gap-2">
                      <LogOut className="w-4 h-4" /> Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link to="/login">
                  <Button variant="ghost" className="text-sm font-medium">Sign In</Button>
                </Link>
                <Link to="/login">
                  <Button className="bg-[#2F8E92] hover:bg-[#257578] text-white rounded-full px-5">Get the App</Button>
                </Link>
              </>
            )}
          </div>

          <button className="md:hidden p-2" onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="md:hidden bg-white border-b border-gray-100">
            <div className="px-4 py-4 space-y-3">
              {navLinks.map((link) => (
                <Link key={link.path} to={link.path} onClick={() => setIsOpen(false)} className={`block py-2 font-medium ${isActive(link.path) ? "text-[#2F8E92]" : "text-[#0E1A1A]"}`}>
                  {link.label}
                </Link>
              ))}
              {isAuthenticated ? (
                <button onClick={() => { logout(); navigate("/"); setIsOpen(false); }} className="w-full text-left py-2 text-red-500 font-medium">Sign Out</button>
              ) : (
                <Link to="/login" onClick={() => setIsOpen(false)}>
                  <Button className="w-full bg-[#2F8E92] hover:bg-[#257578] text-white rounded-full">Get the App</Button>
                </Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
