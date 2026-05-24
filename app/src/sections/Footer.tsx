import { Link } from "react-router";
import { Car } from "lucide-react";

export function Footer() {
  const links = [
    { title: "About", href: "/about" },
    { title: "Help Center", href: "/help-center" },
    { title: "Terms", href: "/terms" },
    { title: "Privacy", href: "/privacy" },
    { title: "Host resources", href: "/host-resources" },
    { title: "City guides", href: "/city-guides" },
  ];

  return (
    <footer className="bg-[#EEF2F7] py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#2F8E92] flex items-center justify-center">
              <Car className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-lg text-[#0E1A1A]">ParkShare</span>
          </Link>

          <div className="flex flex-wrap items-center justify-center gap-6">
            {links.map((link, index) => (
              <Link key={index} to={link.href} className="text-sm text-gray-500 hover:text-[#0E1A1A] transition-colors">
                {link.title}
              </Link>
            ))}
          </div>

          <div className="text-sm text-gray-500">&copy; {new Date().getFullYear()} ParkShare</div>
        </div>
      </div>
    </footer>
  );
}
