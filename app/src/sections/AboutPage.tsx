import { Target, Lightbulb, Car, Shield, Mail } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export function AboutPage() {
  return (
    <div className="min-h-screen bg-[#F6F8FC] pt-16">
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <Badge className="bg-[#2F8E92]/10 text-[#2F8E92] mb-4">About Us</Badge>
            <h1 className="font-bold text-4xl sm:text-5xl text-[#0E1A1A] mb-6">About ParkShare</h1>
            <p className="text-lg text-gray-500 leading-relaxed">
              ParkShare is a digital platform and social enterprise designed to solve one of the most persistent challenges in urban life: access to affordable, reliable parking.
            </p>
          </div>

          <div className="space-y-8">
            <div className="bg-white rounded-[28px] p-8 shadow-lg">
              <div className="flex items-center gap-3 mb-4"><div className="w-10 h-10 rounded-xl bg-[#2F8E92]/10 flex items-center justify-center"><Lightbulb className="w-5 h-5 text-[#2F8E92]" /></div><h2 className="font-bold text-2xl text-[#0E1A1A]">Our Story</h2></div>
              <p className="text-gray-500 leading-relaxed">Founded by Keiday Ali, ParkShare was created to rethink how cities use space—by transforming underutilized private parking into accessible, community-driven solutions. In many cities, parking shortages create daily stress for commuters, while countless private parking spaces remain unused for large portions of the day. ParkShare bridges this gap.</p>
            </div>

            <div className="bg-white rounded-[28px] p-8 shadow-lg">
              <div className="flex items-center gap-3 mb-4"><div className="w-10 h-10 rounded-xl bg-[#2F8E92]/10 flex items-center justify-center"><Target className="w-5 h-5 text-[#2F8E92]" /></div><h2 className="font-bold text-2xl text-[#0E1A1A]">Our Mission</h2></div>
              <p className="text-gray-500 leading-relaxed">Our mission is to make urban parking more efficient, affordable, and community-oriented by connecting people who have unused parking spaces with those who need them.</p>
            </div>

            <div className="bg-white rounded-[28px] p-8 shadow-lg">
              <div className="flex items-center gap-3 mb-4"><div className="w-10 h-10 rounded-xl bg-[#2F8E92]/10 flex items-center justify-center"><Car className="w-5 h-5 text-[#2F8E92]" /></div><h2 className="font-bold text-2xl text-[#0E1A1A]">What We Do</h2></div>
              <p className="text-gray-500 mb-4">ParkShare enables individuals to:</p>
              <ul className="space-y-2 mb-6">
                <li className="flex items-start gap-2 text-gray-500"><span className="text-[#2F8E92]">&#8226;</span> Find affordable parking within their desired location</li>
                <li className="flex items-start gap-2 text-gray-500"><span className="text-[#2F8E92]">&#8226;</span> Book short-term (starting at 8 hours) or long-term parking options</li>
                <li className="flex items-start gap-2 text-gray-500"><span className="text-[#2F8E92]">&#8226;</span> Access parking that is typically priced at least 20% lower than standard city rates</li>
              </ul>
            </div>

            <div className="bg-white rounded-[28px] p-8 shadow-lg">
              <div className="flex items-center gap-3 mb-4"><div className="w-10 h-10 rounded-xl bg-[#2F8E92]/10 flex items-center justify-center"><Shield className="w-5 h-5 text-[#2F8E92]" /></div><h2 className="font-bold text-2xl text-[#0E1A1A]">Trust, Safety, and Community</h2></div>
              <p className="text-gray-500 leading-relaxed">To ensure a secure and reliable experience, all users are required to complete a verified profile, including identity confirmation. ParkShare integrates safety measures such as user verification systems and smart monitoring technologies to build trust across the platform.</p>
            </div>

            <div className="bg-[#2F8E92] rounded-[28px] p-8 text-center">
              <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center mx-auto mb-4"><Mail className="w-6 h-6 text-white" /></div>
              <h2 className="font-bold text-xl text-white mb-2">Contact Us</h2>
              <p className="text-white/80 mb-4">For inquiries, partnerships, or collaborations:</p>
              <a href="mailto:hello@parkshare.com" className="inline-flex items-center gap-2 px-6 py-3 bg-white text-[#2F8E92] rounded-xl font-medium">hello@parkshare.com</a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
