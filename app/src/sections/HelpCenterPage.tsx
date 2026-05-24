import { useState } from "react";
import { Search, MapPin, CreditCard, Home, Shield, Mail, HelpCircle, ChevronDown } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export function HelpCenterPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const faqs = [
    { q: "How do I create an account?", a: "To use ParkShare, you must create a verified account. This includes providing your name, contact information, and completing identity verification. Once registered, you can search for available parking or list your own parking space." },
    { q: "How do I find a parking spot?", a: "Use the search bar to enter a street name, postal code, or city. The map will display available parking within a 3 km radius. Click on a listing to view details, pricing, and the host profile before booking." },
    { q: "How do bookings and payments work?", a: "All bookings require confirmation before payment. Payments are processed securely via credit card. Once confirmed, your reservation is locked for the selected time period." },
    { q: "How do I list my parking space?", a: "Hosts can list their parking spaces by providing location details, availability, and pricing. ParkShare recommends pricing at least 20% below average city parking rates to stay competitive." },
    { q: "What safety measures are in place?", a: "All users must complete identity verification. We use secure systems, including facial verification, to ensure a trusted community." },
  ];

  return (
    <div className="min-h-screen bg-[#F6F8FC] pt-16">
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <Badge className="bg-[#2F8E92]/10 text-[#2F8E92] mb-4">Support</Badge>
            <h1 className="font-bold text-4xl sm:text-5xl text-[#0E1A1A] mb-6">Help Center</h1>
            <p className="text-lg text-gray-500">Welcome to ParkShare&apos;s Help Center. We&apos;re here to make your parking experience simple, secure, and reliable.</p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
            {[
              { icon: <Search className="w-6 h-6" />, title: "Finding a Spot", desc: "Search and book parking" },
              { icon: <Home className="w-6 h-6" />, title: "Listing Your Space", desc: "Become a host and earn" },
              { icon: <CreditCard className="w-6 h-6" />, title: "Payments & Fees", desc: "Pricing and payouts" },
              { icon: <Shield className="w-6 h-6" />, title: "Safety & Trust", desc: "Verification and security" },
            ].map((g, i) => (
              <div key={i} className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow cursor-pointer">
                <div className="w-12 h-12 rounded-xl bg-[#2F8E92]/10 flex items-center justify-center text-[#2F8E92] mb-4">{g.icon}</div>
                <h3 className="font-bold text-lg text-[#0E1A1A] mb-1">{g.title}</h3>
                <p className="text-sm text-gray-500">{g.desc}</p>
              </div>
            ))}
          </div>

          <div className="space-y-8">
            {[
              { icon: <HelpCircle className="w-5 h-5" />, title: "Getting Started", text: "To use ParkShare, you must create a verified account. This includes providing your name, contact information, and completing identity verification. Once registered, you can search for available parking or list your own parking space." },
              { icon: <MapPin className="w-5 h-5" />, title: "Finding a Parking Spot", text: "Use the search bar to enter a street name, postal code, or city. The map will display available parking within a 3 km radius. Green means available now, yellow means available within 2 hours, and red means not available." },
              { icon: <CreditCard className="w-5 h-5" />, title: "Booking & Payments", text: "All bookings require confirmation before payment. Payments are processed securely via credit card. Once confirmed, your reservation is locked for the selected time period." },
              { icon: <Home className="w-5 h-5" />, title: "Listing Your Parking Space", text: "Hosts can list their parking spaces by providing location details, availability, and pricing. ParkShare recommends pricing at least 20% below average city parking rates to stay competitive." },
              { icon: <Shield className="w-5 h-5" />, title: "Safety & Verification", text: "All users must complete identity verification. We use secure systems, including facial verification, to ensure a trusted community." },
            ].map((section, i) => (
              <div key={i} className="bg-white rounded-[28px] p-8 shadow-lg">
                <div className="flex items-center gap-3 mb-4"><div className="w-10 h-10 rounded-xl bg-[#2F8E92]/10 flex items-center justify-center text-[#2F8E92]">{section.icon}</div><h2 className="font-bold text-2xl text-[#0E1A1A]">{section.title}</h2></div>
                <p className="text-gray-500 leading-relaxed">{section.text}</p>
              </div>
            ))}
          </div>

          <div className="mt-12">
            <h2 className="font-bold text-2xl text-[#0E1A1A] mb-6 text-center">Frequently Asked Questions</h2>
            <div className="space-y-3">
              {faqs.map((faq, i) => (
                <div key={i} className="bg-white rounded-xl shadow-lg overflow-hidden">
                  <button onClick={() => setOpenFaq(openFaq === i ? null : i)} className="w-full flex items-center justify-between p-5 text-left">
                    <span className="font-medium text-[#0E1A1A]">{faq.q}</span>
                    <ChevronDown className={`w-5 h-5 text-gray-500 transition-transform ${openFaq === i ? "rotate-180" : ""}`} />
                  </button>
                  {openFaq === i && <div className="px-5 pb-5"><p className="text-gray-500">{faq.a}</p></div>}
                </div>
              ))}
            </div>
          </div>

          <div className="mt-12 bg-[#2F8E92] rounded-[28px] p-8 text-center">
            <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center mx-auto mb-4"><Mail className="w-6 h-6 text-white" /></div>
            <h2 className="font-bold text-xl text-white mb-2">Need Help?</h2>
            <p className="text-white/80 mb-4">If you experience issues with bookings, payments, or accounts, please contact our support team.</p>
            <a href="mailto:support@parkshare.com" className="inline-flex items-center gap-2 px-6 py-3 bg-white text-[#2F8E92] rounded-xl font-medium">support@parkshare.com</a>
          </div>
        </div>
      </section>
    </div>
  );
}
