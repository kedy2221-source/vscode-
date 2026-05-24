import { useState } from "react";
import { Link, useParams, useNavigate } from "react-router";
import { motion } from "framer-motion";
import { ArrowLeft, Calendar, Clock, Star, Shield, CheckCircle, CreditCard, User, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { trpc } from "@/providers/trpc";

export function BookingPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [date, setDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvc, setCvc] = useState("");
  const [cardName, setCardName] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  const { data: listing } = trpc.listing.byId.useQuery({ id: Number(id) });
  const createBooking = trpc.booking.create.useMutation();
  const paymentIntent = trpc.payment.createPaymentIntent.useMutation();
  const pricingQuery = trpc.payment.calculatePricing.useQuery(
    { pricePerDay: Number(listing?.pricePerDay || 0), days: 1 },
    { enabled: !!listing }
  );

  const handleNext = async () => {
    if (step < 3) {
      setStep(step + 1);
    } else {
      setIsProcessing(true);
      try {
        // Create booking first
        const bookingResult = await createBooking.mutateAsync({
          listingId: Number(id),
          startTime: new Date(`${date}T${startTime}`).toISOString(),
          endTime: new Date(`${date}T${endTime}`).toISOString(),
          totalPrice: pricingQuery.data?.total || 0,
          platformFee: pricingQuery.data?.platformFee || 0,
          hostPayout: pricingQuery.data?.hostPayout || 0,
        });

        // Process payment
        await paymentIntent.mutateAsync({
          bookingId: bookingResult.id as number,
          amount: Math.round((pricingQuery.data?.total || 0) * 100),
        });

        navigate("/dashboard");
      } catch (error) {
        alert("Payment failed. Please try again.");
      } finally {
        setIsProcessing(false);
      }
    }
  };

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "");
    const parts = [];
    for (let i = 0; i < v.length && i < 16; i += 4) {
      parts.push(v.substring(i, i + 4));
    }
    return parts.join(" ");
  };

  const pricing = pricingQuery.data;

  return (
    <div className="min-h-screen bg-[#F6F8FC] pt-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center gap-4 mb-8">
          <Link to="/search" className="p-2 hover:bg-gray-100 rounded-lg"><ArrowLeft className="w-5 h-5" /></Link>
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <h1 className="font-bold text-2xl text-[#0E1A1A]">{step === 1 ? "Select date & time" : step === 2 ? "Review & confirm" : "Payment"}</h1>
              <span className="text-sm text-gray-500">Step {step} of 3</span>
            </div>
            <div className="h-2 bg-gray-100 rounded-full overflow-hidden mt-2">
              <div className="h-full bg-[#2F8E92] transition-all" style={{ width: `${(step / 3) * 100}%` }} />
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} key={step} className="bg-white rounded-[28px] p-6 shadow-lg">
              {step === 1 && (
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-2">Date</label>
                    <div className="relative">
                      <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <Input type="date" className="pl-12 h-14 rounded-xl" value={date} onChange={(e) => setDate(e.target.value)} />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-500 mb-2">Start time</label>
                      <div className="relative">
                        <Clock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <Input type="time" className="pl-12 h-14 rounded-xl" value={startTime} onChange={(e) => setStartTime(e.target.value)} />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-500 mb-2">End time</label>
                      <div className="relative">
                        <Clock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <Input type="time" className="pl-12 h-14 rounded-xl" value={endTime} onChange={(e) => setEndTime(e.target.value)} />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {step === 2 && listing && (
                <div className="space-y-6">
                  <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl">
                    <img src={listing.photos?.[0] ? String(listing.photos[0]) : "/images/host-driveway.jpg"} alt="" className="w-24 h-24 rounded-xl object-cover" />
                    <div>
                      <h3 className="font-bold text-lg text-[#0E1A1A]">{listing.title || listing.address}</h3>
                      <p className="text-gray-500">{listing.city}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm">{listing.rating} ({listing.reviewCount} reviews)</span>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h3 className="font-medium text-[#0E1A1A] mb-3">Trip details</h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <span className="text-gray-500">Date</span>
                        <span className="font-medium">{date || "Select date"}</span>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <span className="text-gray-500">Time</span>
                        <span className="font-medium">{startTime || "?"} - {endTime || "?"}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-4 bg-[#2F8E92]/10 rounded-xl">
                    <Shield className="w-5 h-5 text-[#2F8E92] flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium text-[#0E1A1A]">Cancellation policy</p>
                      <p className="text-sm text-gray-500">Free cancellation up to 24 hours before your reservation starts.</p>
                    </div>
                  </div>
                </div>
              )}

              {step === 3 && (
                <div className="space-y-6">
                  <div className="text-center mb-6">
                    <div className="w-16 h-16 rounded-2xl bg-[#2F8E92]/10 flex items-center justify-center mx-auto mb-4">
                      <CreditCard className="w-8 h-8 text-[#2F8E92]" />
                    </div>
                    <h2 className="font-bold text-2xl text-[#0E1A1A]">Payment details</h2>
                    <p className="text-gray-500">Secure payment via Stripe</p>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-500 mb-2">Card number</label>
                      <div className="relative">
                        <CreditCard className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <Input placeholder="1234 5678 9012 3456" className="pl-12 h-14 rounded-xl" value={cardNumber} onChange={(e) => setCardNumber(formatCardNumber(e.target.value))} maxLength={19} />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-500 mb-2">Expiry</label>
                        <Input placeholder="MM/YY" className="h-14 rounded-xl" value={expiry} onChange={(e) => setExpiry(e.target.value)} maxLength={5} />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-500 mb-2">CVC</label>
                        <div className="relative">
                          <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                          <Input placeholder="123" className="pl-12 h-14 rounded-xl" value={cvc} onChange={(e) => setCvc(e.target.value)} maxLength={4} />
                        </div>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-500 mb-2">Name on card</label>
                      <div className="relative">
                        <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <Input placeholder="John Doe" className="pl-12 h-14 rounded-xl" value={cardName} onChange={(e) => setCardName(e.target.value)} />
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-center gap-4 py-4">
                    {["Visa", "Mastercard", "Amex"].map((brand) => (
                      <div key={brand} className="px-4 py-2 bg-gray-50 rounded-lg"><span className="text-sm font-medium text-gray-500">{brand}</span></div>
                    ))}
                  </div>
                  <div className="flex items-start gap-3 p-4 bg-[#27C078]/10 rounded-xl">
                    <CheckCircle className="w-5 h-5 text-[#27C078] flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium text-[#0E1A1A]">Secure payment</p>
                      <p className="text-sm text-gray-500">Your payment is processed securely via Stripe. We never store your card details.</p>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex gap-4 mt-8">
                {step > 1 && <Button variant="outline" onClick={() => setStep(step - 1)} className="flex-1 h-14 rounded-xl">Back</Button>}
                <Button onClick={handleNext} disabled={isProcessing} className="flex-1 h-14 bg-[#2F8E92] hover:bg-[#257578] text-white rounded-xl font-semibold">
                  {isProcessing ? "Processing..." : step === 3 ? `Pay $${pricing?.total.toFixed(2) || "0.00"}` : "Continue"}
                </Button>
              </div>
            </motion.div>
          </div>

          {/* Price sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 bg-white rounded-[28px] p-6 shadow-lg">
              {listing && (
                <>
                  <img src={listing.photos?.[0] ? String(listing.photos[0]) : "/images/host-driveway.jpg"} alt="" className="w-full h-40 rounded-xl object-cover mb-4" />
                  <h3 className="font-bold text-lg text-[#0E1A1A]">{listing.title || listing.address}</h3>
                  <div className="flex items-center gap-2 mt-1 mb-4">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm">{listing.rating} · {listing.reviewCount} reviews</span>
                  </div>
                </>
              )}
              <Separator className="my-4" />
              <h4 className="font-medium text-[#0E1A1A] mb-3">Price details</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between"><span className="text-gray-500">Subtotal</span><span>${pricing?.subtotal.toFixed(2) || "0.00"}</span></div>
                <div className="flex justify-between"><span className="text-gray-500">Service fee (30%)</span><span>${pricing?.platformFee.toFixed(2) || "0.00"}</span></div>
                <Separator className="my-2" />
                <div className="flex justify-between font-bold text-lg"><span>Total</span><span className="text-[#2F8E92]">${pricing?.total.toFixed(2) || "0.00"}</span></div>
              </div>
              <div className="mt-4 p-3 bg-gray-50 rounded-xl">
                <div className="flex items-center gap-2 mb-1">
                  <Lock className="w-4 h-4 text-gray-500" />
                  <span className="text-xs font-medium">{pricing ? `70% to host · 30% to ParkShare` : "Loading..."}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
