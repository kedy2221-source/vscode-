import { useState } from "react";
import { Link, useSearchParams } from "react-router";
import { MapPin, Filter, Star, Navigation, Heart, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { trpc } from "@/providers/trpc";

export function SearchPage() {
  const [searchParams] = useSearchParams();
  const cityParam = searchParams.get("city") || "";
  const [showFilters, setShowFilters] = useState(false);
  const [priceRange, setPriceRange] = useState([50]);
  const [searchQuery, setSearchQuery] = useState(cityParam);
  const [selectedSpot, setSelectedSpot] = useState<number | null>(null);

  const { data: listings, isLoading } = trpc.listing.search.useQuery({
    city: searchQuery || undefined,
    maxPrice: priceRange[0],
    limit: 20,
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "bg-[#27C078]";
      case "pending": return "bg-[#F2B33D]";
      case "booked": return "bg-[#E74C4C]";
      default: return "bg-gray-400";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "active": return "Available now";
      case "pending": return "Limited";
      default: return status;
    }
  };

  const mapUrl = searchQuery
    ? `https://www.google.com/maps/search/parking+near+${encodeURIComponent(searchQuery)}`
    : "https://www.google.com/maps/search/parking+spots+near+me";

  const mapEmbedUrl = searchQuery
    ? `https://www.google.com/maps/embed?pb=!1m16!1m12!1m3!1d50000!2d-79.3832!3d43.6532!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!2m1!1s${encodeURIComponent("parking near " + searchQuery)}!5e0!3m2!1sen!2sca`
    : "https://www.google.com/maps/embed?pb=!1m16!1m12!1m3!1d184552.19592613167!2d-79.542864!3d43.718155!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!2m1!1sparking!5e0!3m2!1sen!2sca!4v1700000000000!5m2!1sen!2sca";

  return (
    <div className="min-h-screen bg-[#F6F8FC] pt-16">
      {/* Search Header */}
      <div className="sticky top-16 z-40 bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input placeholder="Search location..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-12 h-12 rounded-xl" />
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setShowFilters(!showFilters)} className={`h-12 px-4 rounded-xl ${showFilters ? "bg-[#2F8E92]/10 border-[#2F8E92]" : ""}`}>
                <Filter className="w-4 h-4 mr-2" /> Filters
              </Button>
              <a href={mapUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 h-12 px-4 bg-[#2F8E92] hover:bg-[#257578] text-white rounded-xl font-medium transition-colors">
                <Navigation className="w-4 h-4" /> Open in Google Maps
              </a>
            </div>
          </div>

          {showFilters && (
            <div className="mt-4 pt-4 border-t border-gray-100">
              <div className="grid sm:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-2">Max price: ${priceRange[0]}/day</label>
                  <Slider value={priceRange} onValueChange={setPriceRange} max={100} step={1} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-2">Spot type</label>
                  <div className="flex flex-wrap gap-2">
                    {["Driveway", "Garage", "Lot"].map((type) => (
                      <Badge key={type} variant="outline" className="cursor-pointer hover:bg-[#2F8E92]/10">{type}</Badge>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Results */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="font-bold text-2xl text-[#0E1A1A]">{listings?.length || 0} spots near you</h1>
        </div>

        {isLoading ? (
          <div className="text-center py-12">
            <div className="animate-spin w-8 h-8 border-2 border-[#2F8E92] border-t-transparent rounded-full mx-auto mb-4" />
            <p className="text-gray-500">Loading spots...</p>
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Spots List */}
            <div className="lg:col-span-2 space-y-4">
              {listings?.map((item) => (
                <div key={item.listing.id} onClick={() => setSelectedSpot(item.listing.id)} className={`bg-white rounded-[28px] p-4 shadow-lg cursor-pointer transition-all hover:shadow-xl ${selectedSpot === item.listing.id ? "ring-2 ring-[#2F8E92]" : ""}`}>
                  <div className="flex gap-4">
                    <div className="relative w-32 h-32 flex-shrink-0">
                      <img src={item.listing.photos?.[0] ? String(item.listing.photos[0]) : "/images/host-driveway.jpg"} alt="" className="w-full h-full object-cover rounded-xl" />
                      <button className="absolute top-2 right-2 w-8 h-8 bg-white/90 rounded-full flex items-center justify-center hover:bg-white">
                        <Heart className="w-4 h-4 text-gray-400" />
                      </button>
                      <div className={`absolute bottom-2 left-2 px-2 py-1 rounded-full text-xs text-white font-medium ${getStatusColor(item.listing.status || "active")}`}>
                        {getStatusText(item.listing.status || "active")}
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-bold text-lg text-[#0E1A1A]">{item.listing.title || item.listing.address}</h3>
                          <p className="text-sm text-gray-500">{item.listing.city}</p>
                        </div>
                        <div className="font-bold text-xl text-[#2F8E92]">${item.listing.pricePerDay}<span className="text-sm font-normal text-gray-500">/day</span></div>
                      </div>
                      <div className="flex items-center gap-4 mt-2 text-sm">
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                          <span className="font-medium">{item.listing.rating || "4.5"}</span>
                          <span className="text-gray-500">({item.listing.reviewCount || 0})</span>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-2 mt-3">
                        {(item.listing.features as string[] || []).slice(0, 3).map((feature, i) => (
                          <Badge key={i} variant="secondary" className="text-xs">{feature}</Badge>
                        ))}
                      </div>
                      <div className="flex items-center justify-between mt-4">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-[#2F8E92]/10 flex items-center justify-center text-[#2F8E92] font-bold text-sm">
                            {item.ownerName?.[0] || "U"}
                          </div>
                          <div className="text-sm">
                            <span className="text-[#0E1A1A]">{item.ownerName || "Host"}</span>
                          </div>
                        </div>
                        <Link to={`/book/${item.listing.id}`}>
                          <Button size="sm" className="bg-[#2F8E92] hover:bg-[#257578] text-white rounded-lg">
                            Book now <ChevronRight className="w-4 h-4 ml-1" />
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Google Maps Embed */}
            <div className="hidden lg:block">
              <div className="sticky top-40">
                <div className="bg-white rounded-[28px] shadow-lg overflow-hidden h-[500px] relative">
                  <iframe width="100%" height="100%" style={{ border: 0 }} loading="lazy" allowFullScreen referrerPolicy="no-referrer-when-downgrade" src={mapEmbedUrl} />
                  <a href={mapUrl} target="_blank" rel="noopener noreferrer" className="absolute bottom-4 left-4 right-4 bg-[#2F8E92] hover:bg-[#257578] text-white text-center py-3 rounded-xl font-medium transition-colors shadow-lg">
                    <Navigation className="w-4 h-4 inline mr-2" /> View on Google Maps
                  </a>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
