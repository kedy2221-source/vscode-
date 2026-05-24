import { useState } from "react";
import { Link } from "react-router";
import { motion } from "framer-motion";
import { MapPin, Search, Calendar, CheckCircle, Mail, Smartphone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { trpc } from "@/providers/trpc";

const smoothEase: [number, number, number, number] = [0.22, 0.61, 0.36, 1];

export function HomePage() {
  const [mode, setMode] = useState<"renter" | "host">("renter");
  const [searchQuery, setSearchQuery] = useState("");
  const { data: listings } = trpc.listing.search.useQuery({ limit: 6 });

  return (
    <div className="min-h-screen bg-[#F6F8FC]">
      {/* Hero */}
      <section className="relative min-h-screen pt-16 overflow-hidden">
        <motion.div initial={{ scale: 1.04 }} animate={{ scale: 1 }} transition={{ duration: 0.9, ease: smoothEase }} className="absolute inset-0 z-0">
          <img src="/images/hero-map.jpg" alt="City Map" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-b from-[#F6F8FC]/30 via-transparent to-[#F6F8FC]" />
        </motion.div>

        {/* Animated pins */}
        <div className="absolute inset-0 z-0 pointer-events-none">
          {[
            { top: "25%", left: "15%", color: "bg-[#27C078]", delay: 0.3 },
            { top: "35%", left: "35%", color: "bg-[#F2B33D]", delay: 0.5 },
            { top: "20%", right: "25%", color: "bg-[#27C078]", delay: 0.7 },
            { top: "45%", right: "15%", color: "bg-[#E74C4C]", delay: 0.9 },
            { bottom: "35%", left: "25%", color: "bg-[#27C078]", delay: 1.1 },
            { bottom: "30%", right: "30%", color: "bg-[#F2B33D]", delay: 1.3 },
          ].map((pin, i) => (
            <motion.div key={i} initial={{ opacity: 0, scale: 0.6 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: pin.delay, duration: 0.4 }} className="absolute" style={{ top: pin.top, left: pin.left, right: pin.right, bottom: pin.bottom }}>
              <div className={`w-10 h-10 rounded-full ${pin.color} border-4 border-white shadow-lg animate-pulse flex items-center justify-center`}>
                <div className="w-3 h-3 rounded-full bg-white" />
              </div>
            </motion.div>
          ))}
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 min-h-[calc(100vh-64px)] flex items-center">
          <div className="grid lg:grid-cols-2 gap-10 items-center w-full py-12">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
              <motion.h1 initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }} className="font-extrabold text-4xl sm:text-5xl lg:text-6xl text-[#0E1A1A] leading-tight mb-4">
                Park nearby.<br /><span className="text-[#2F8E92]">Rent your spot.</span>
              </motion.h1>
              <motion.p initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.16 }} className="text-lg text-gray-500 max-w-md">
                Find affordable parking in minutes—or earn by sharing your space.
              </motion.p>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 28, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ duration: 0.65, delay: 0.2, ease: smoothEase }} className="lg:justify-self-end w-full max-w-md">
              <div className="bg-white rounded-[28px] shadow-xl p-6 sm:p-8">
                <div className="flex items-center justify-center gap-4 mb-6">
                  <span className={`text-sm font-medium ${mode === "renter" ? "text-[#0E1A1A]" : "text-gray-400"}`}>I need parking</span>
                  <Switch checked={mode === "host"} onCheckedChange={(checked) => setMode(checked ? "host" : "renter")} />
                  <span className={`text-sm font-medium ${mode === "host" ? "text-[#0E1A1A]" : "text-gray-400"}`}>I have a spot</span>
                </div>
                <div className="space-y-4">
                  <div className="relative">
                    <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <Input placeholder={mode === "renter" ? "Where do you need parking?" : "Where is your parking spot?"} value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-12 h-14 rounded-xl" />
                  </div>
                  <Link to={`/search${searchQuery ? `?city=${encodeURIComponent(searchQuery)}` : ""}`}>
                    <Button className="w-full h-14 bg-[#2F8E92] hover:bg-[#257578] text-white rounded-xl font-semibold text-base">
                      <Search className="w-5 h-5 mr-2" />
                      {mode === "renter" ? "Search spots" : "List your spot"}
                    </Button>
                  </Link>
                </div>
                <div className="mt-6 pt-6 border-t border-gray-100 grid grid-cols-3 gap-4 text-center">
                  <div><div className="font-bold text-xl text-[#0E1A1A]">{listings?.length || "12K+"}</div><div className="text-xs text-gray-500">Spots listed</div></div>
                  <div><div className="font-bold text-xl text-[#0E1A1A]">35K+</div><div className="text-xs text-gray-500">Happy drivers</div></div>
                  <div><div className="font-bold text-xl text-[#0E1A1A]">$2.4M</div><div className="text-xs text-gray-500">Paid to hosts</div></div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-[#F6F8FC]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="font-bold text-3xl sm:text-4xl text-[#0E1A1A] mb-4">Three steps to park (or earn)</h2>
            <p className="text-gray-500 max-w-xl mx-auto">Whether you&apos;re looking for a spot or listing one, we&apos;ve made it simple.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { icon: <Search className="w-7 h-7" />, title: "Search & filter", desc: "Set your time, choose a neighborhood, and see real-time availability on the map." },
              { icon: <Calendar className="w-7 h-7" />, title: "Book instantly", desc: "Reserve in seconds. Get directions and access details sent right to your phone." },
              { icon: <CheckCircle className="w-7 h-7" />, title: "Park & go", desc: "Snap a quick photo at arrival and departure—done. No hassle, no waiting." },
            ].map((step, index) => (
              <div key={index} className="bg-white rounded-[28px] p-8 shadow-lg hover:shadow-xl transition-all hover:-translate-y-1">
                <div className="w-14 h-14 rounded-2xl bg-[#2F8E92]/10 flex items-center justify-center text-[#2F8E92] mb-6">{step.icon}</div>
                <Badge className="bg-[#2F8E92]/10 text-[#2F8E92] font-semibold mb-3">Step {index + 1}</Badge>
                <h3 className="font-bold text-xl text-[#0E1A1A] mb-2">{step.title}</h3>
                <p className="text-gray-500 leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-[#F6F8FC]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-[#2F8E92] rounded-[28px] p-8 sm:p-12 lg:p-16 text-center relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />
            <div className="relative z-10 max-w-xl mx-auto">
              <h2 className="font-bold text-3xl sm:text-4xl text-white mb-4">Get the app & hit the road</h2>
              <p className="text-white/80 mb-8">Download ParkShare and start finding or listing parking spots in minutes.</p>
              <div className="flex flex-col sm:flex-row gap-3 mb-8">
                <div className="relative flex-1">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <Input placeholder="Enter your email" className="pl-12 h-14 rounded-xl border-0 bg-white" />
                </div>
                <Button className="h-14 px-8 bg-[#0E1A1A] hover:bg-[#0E1A1A]/90 text-white rounded-xl font-semibold">
                  <Smartphone className="w-5 h-5 mr-2" /> Send me the link
                </Button>
              </div>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <a href="https://www.google.com/search?q=download+ParkShare+iOS+app+Apple+App+Store" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 bg-black text-white px-6 py-3 rounded-xl hover:bg-black/90">
                  <svg className="w-7 h-7" viewBox="0 0 24 24" fill="currentColor"><path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.21-1.96 1.07-3.11-1.05.05-2.31.72-3.06 1.61-.67.78-1.26 2.03-1.1 3.12 1.19.09 2.4-.61 3.09-1.62z"/></svg>
                  <div className="text-left"><div className="text-xs opacity-80">Download on the</div><div className="text-sm font-semibold">App Store</div></div>
                </a>
                <a href="https://www.google.com/search?q=download+ParkShare+Android+app+Google+Play+Store" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 bg-black text-white px-6 py-3 rounded-xl hover:bg-black/90">
                  <svg className="w-7 h-7" viewBox="0 0 24 24" fill="currentColor"><path d="M3,20.5V3.5C3,2.91 3.34,2.39 3.84 2.15L13.69 12L3.84 21.85C3.34 21.6 3 21.09 3 20.5M16.81 15.12L6.05 21.34L14.54 12.85L16.81 15.12M20.16 10.81C20.5 11.08 20.75 11.5 20.75 12C20.75 12.5 20.53 12.9 20.18 13.18L17.89 14.5L15.39 12L17.89 9.5L20.16 10.81M6.05 2.66L16.81 8.88L14.54 11.15L6.05 2.66Z"/></svg>
                  <div className="text-left"><div className="text-xs opacity-80">Get it on</div><div className="text-sm font-semibold">Google Play</div></div>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
