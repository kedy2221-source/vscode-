import { Routes, Route } from "react-router";
import { Navigation } from "@/sections/Navigation";
import { Footer } from "@/sections/Footer";
import { HomePage } from "@/sections/HomePage";
import { SearchPage } from "@/sections/SearchPage";
import { BookingPage } from "@/sections/BookingPage";
import { ListSpotPage } from "@/sections/ListSpotPage";
import { DashboardPage } from "@/sections/DashboardPage";
import { AboutPage } from "@/sections/AboutPage";
import { HelpCenterPage } from "@/sections/HelpCenterPage";
import Login from "@/pages/Login";
import NotFound from "@/pages/NotFound";
import ForDrivers from "@/pages/ForDrivers";
import ForHosts from "@/pages/ForHosts";
import TrustSafety from "@/pages/TrustSafety";
import Pricing from "@/pages/Pricing";
import Terms from "@/pages/Terms";
import Privacy from "@/pages/Privacy";
import HostResources from "@/pages/HostResources";
import CityGuides from "@/pages/CityGuides";
import ListingDetail from "@/pages/ListingDetail";

export default function App() {
  return (
    <div className="min-h-screen bg-[#F6F8FC]">
      <Navigation />
      <main>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/for-drivers" element={<ForDrivers />} />
          <Route path="/for-hosts" element={<ForHosts />} />
          <Route path="/trust-safety" element={<TrustSafety />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/listing/:id" element={<ListingDetail />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/list-spot" element={<ListSpotPage />} />
          <Route path="/book/:id" element={<BookingPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/help-center" element={<HelpCenterPage />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/host-resources" element={<HostResources />} />
          <Route path="/city-guides" element={<CityGuides />} />
          <Route path="/login" element={<Login />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}
