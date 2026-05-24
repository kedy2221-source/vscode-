import { useState, useRef } from "react";
import { Link, useNavigate } from "react-router";
import { ArrowLeft, MapPin, Camera, DollarSign, CheckCircle, Home, Upload, ChevronRight, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { trpc } from "@/providers/trpc";

export function ListSpotPage() {
  const [step, setStep] = useState(1);
  const [price, setPrice] = useState(12);
  const [uploadedPhotos, setUploadedPhotos] = useState<string[]>([]);
  const [title, setTitle] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [spotType, setSpotType] = useState<"driveway" | "garage" | "lot" | "street" | " covered">("driveway");
  const [features, setFeatures] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const createListing = trpc.listing.create.useMutation();

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      Array.from(files).forEach((file) => {
        const reader = new FileReader();
        reader.onload = (event) => {
          if (event.target?.result) {
            setUploadedPhotos((prev) => [...prev, event.target!.result as string]);
          }
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const toggleFeature = (feature: string) => {
    setFeatures((prev) => prev.includes(feature) ? prev.filter((f) => f !== feature) : [...prev, feature]);
  };

  const handleNext = async () => {
    if (step < 4) {
      setStep(step + 1);
    } else {
      try {
        await createListing.mutateAsync({
          title,
          address,
          city,
          pricePerDay: price,
          spotType,
          features,
          photos: uploadedPhotos,
        });
        navigate("/dashboard");
      } catch (error) {
        alert("Failed to create listing. Please try again.");
      }
    }
  };

  const featureList = ["Covered parking", "Security camera", "Well-lit", "Gated", "EV charging", "24/7 access", "Handicap accessible", "Large vehicle friendly"];

  return (
    <div className="min-h-screen bg-[#F6F8FC] pt-16">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center gap-4 mb-8">
          <Link to="/" className="p-2 hover:bg-gray-100 rounded-lg"><ArrowLeft className="w-5 h-5" /></Link>
          <div className="flex-1">
            <div className="flex items-center justify-between mb-2">
              <h1 className="font-bold text-2xl text-[#0E1A1A]">List your parking spot</h1>
              <span className="text-sm text-gray-500">Step {step} of 4</span>
            </div>
            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
              <div className="h-full bg-[#2F8E92] transition-all" style={{ width: `${(step / 4) * 100}%` }} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-[28px] p-8 shadow-lg">
          {step === 1 && (
            <>
              <div className="text-center mb-8">
                <div className="w-16 h-16 rounded-2xl bg-[#2F8E92]/10 flex items-center justify-center mx-auto mb-4"><MapPin className="w-8 h-8 text-[#2F8E92]" /></div>
                <h2 className="font-bold text-2xl text-[#0E1A1A] mb-2">Where is your spot?</h2>
                <p className="text-gray-500">Enter the address of your parking space</p>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-2">Title</label>
                  <Input placeholder="e.g. Private Driveway Downtown" value={title} onChange={(e) => setTitle(e.target.value)} className="h-14 rounded-xl" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-2">Street address</label>
                  <div className="relative">
                    <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <Input placeholder="e.g. 123 Main Street" value={address} onChange={(e) => setAddress(e.target.value)} className="pl-12 h-14 rounded-xl" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-2">City</label>
                    <Input placeholder="City" value={city} onChange={(e) => setCity(e.target.value)} className="h-14 rounded-xl" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-2">Spot type</label>
                    <select value={spotType} onChange={(e) => setSpotType(e.target.value as typeof spotType)} className="w-full h-14 rounded-xl border border-gray-200 px-4">
                      <option value="driveway">Driveway</option>
                      <option value="garage">Garage</option>
                      <option value="lot">Lot</option>
                      <option value="street">Street</option>
                      <option value=" covered">Covered</option>
                    </select>
                  </div>
                </div>
              </div>
            </>
          )}

          {step === 2 && (
            <>
              <div className="text-center mb-8">
                <div className="w-16 h-16 rounded-2xl bg-[#2F8E92]/10 flex items-center justify-center mx-auto mb-4"><Camera className="w-8 h-8 text-[#2F8E92]" /></div>
                <h2 className="font-bold text-2xl text-[#0E1A1A] mb-2">Add photos</h2>
                <p className="text-gray-500">Help drivers see what your spot looks like</p>
              </div>
              <input ref={fileInputRef} type="file" accept="image/*" multiple onChange={handleFileSelect} className="hidden" />
              <div className="space-y-4">
                <button onClick={() => fileInputRef.current?.click()} className="w-full border-2 border-dashed border-gray-200 rounded-[28px] p-12 text-center hover:border-[#2F8E92] hover:bg-[#2F8E92]/5 transition-colors">
                  <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="font-medium text-[#0E1A1A] mb-2">Click to upload photos</p>
                  <p className="text-sm text-gray-500 mb-4">or drag and drop</p>
                  <p className="text-xs text-gray-400">Supports JPG, PNG, WEBP</p>
                </button>
                {uploadedPhotos.length > 0 && (
                  <div className="grid grid-cols-3 gap-3">
                    {uploadedPhotos.map((photo, index) => (
                      <div key={index} className="relative aspect-square rounded-xl overflow-hidden">
                        <img src={photo} alt="" className="w-full h-full object-cover" />
                        <button onClick={() => setUploadedPhotos((prev) => prev.filter((_, i) => i !== index))} className="absolute top-2 right-2 w-6 h-6 bg-white/90 rounded-full flex items-center justify-center"><X className="w-3 h-3" /></button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </>
          )}

          {step === 3 && (
            <>
              <div className="text-center mb-8">
                <div className="w-16 h-16 rounded-2xl bg-[#2F8E92]/10 flex items-center justify-center mx-auto mb-4"><DollarSign className="w-8 h-8 text-[#2F8E92]" /></div>
                <h2 className="font-bold text-2xl text-[#0E1A1A] mb-2">Set your price</h2>
                <p className="text-gray-500">How much do you want to charge per day?</p>
              </div>
              <div className="space-y-6">
                <div className="text-center">
                  <div className="font-bold text-5xl text-[#2F8E92] mb-2">${price}</div>
                  <p className="text-gray-500">per day</p>
                </div>
                <Slider value={[price]} onValueChange={(v) => setPrice(v[0])} min={5} max={50} step={1} />
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-3">Features & amenities</label>
                  <div className="flex flex-wrap gap-2">
                    {featureList.map((feature) => (
                      <Badge key={feature} onClick={() => toggleFeature(feature)} className={`cursor-pointer transition-colors py-2 px-3 ${features.includes(feature) ? "bg-[#2F8E92] text-white" : "border border-gray-200 hover:bg-gray-50"}`}>
                        {feature}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </>
          )}

          {step === 4 && (
            <>
              <div className="text-center mb-8">
                <div className="w-16 h-16 rounded-2xl bg-[#27C078]/10 flex items-center justify-center mx-auto mb-4"><CheckCircle className="w-8 h-8 text-[#27C078]" /></div>
                <h2 className="font-bold text-2xl text-[#0E1A1A] mb-2">Set availability</h2>
                <p className="text-gray-500">Review your listing before publishing</p>
              </div>
              <div className="bg-[#2F8E92]/10 rounded-xl p-4">
                <h3 className="font-bold text-lg text-[#0E1A1A] mb-2">Preview your listing</h3>
                <div className="flex items-center gap-4">
                  {uploadedPhotos.length > 0 ? <img src={uploadedPhotos[0]} alt="" className="w-20 h-20 rounded-xl object-cover" /> : <div className="w-20 h-20 rounded-xl bg-gray-100 flex items-center justify-center"><Home className="w-8 h-8 text-gray-400" /></div>}
                  <div>
                    <p className="font-medium text-[#0E1A1A]">{title || "123 Main Street"}</p>
                    <p className="text-[#2F8E92] font-bold">${price}/day</p>
                    <p className="text-sm text-gray-500">{city || "Your City"}</p>
                  </div>
                </div>
              </div>
            </>
          )}

          <div className="flex gap-4 mt-8">
            {step > 1 && <Button variant="outline" onClick={() => setStep(step - 1)} className="flex-1 h-14 rounded-xl">Back</Button>}
            <Button onClick={handleNext} disabled={createListing.isPending} className="flex-1 h-14 bg-[#2F8E92] hover:bg-[#257578] text-white rounded-xl font-semibold">
              {createListing.isPending ? "Publishing..." : step === 4 ? "Publish listing" : "Continue"}
              <ChevronRight className="w-5 h-5 ml-2" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
