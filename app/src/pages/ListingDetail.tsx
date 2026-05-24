import { useParams, useNavigate } from "react-router";
import { motion } from "framer-motion";
import type { Variants } from "framer-motion";
import {
  MapPin,
  Star,
  ArrowLeft,
  Calendar,
  Clock,
  Shield,
  Camera,
  Wifi,
  Accessibility,
  Sun,
  Snowflake,
  ChevronRight,
  Heart,
  Share2,
  Navigation,
  CheckCircle,
  MessageSquare,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { trpc } from "@/providers/trpc";
import { useState } from "react";

const smoothEase: [number, number, number, number] = [0.22, 0.61, 0.36, 1];

const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: smoothEase } },
};

const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const amenityIconMap: Record<string, React.ReactNode> = {
  "24/7 Access": <Clock className="w-5 h-5" />,
  "Security Camera": <Camera className="w-5 h-5" />,
  Gated: <Shield className="w-5 h-5" />,
  "EV Charging": <Zap className="w-5 h-5" />,
  Covered: <Sun className="w-5 h-5" />,
  WiFi: <Wifi className="w-5 h-5" />,
  Accessible: <Accessibility className="w-5 h-5" />,
  Heated: <Snowflake className="w-5 h-5" />,
};

function getAmenityIcon(amenity: string): React.ReactNode {
  return amenityIconMap[amenity] || <CheckCircle className="w-5 h-5" />;
}

export default function ListingDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const listingId = Number(id);
  const [liked, setLiked] = useState(false);
  const [selectedImage, setSelectedImage] = useState(0);

  const { data: listing, isLoading } = trpc.listing.byId.useQuery(
    { id: listingId },
    { enabled: !isNaN(listingId) }
  );

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#F6F8FC] pt-20 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
      </div>
    );
  }

  if (!listing) {
    return (
      <div className="min-h-screen bg-[#F6F8FC] pt-20">
        <div className="max-w-4xl mx-auto px-4 text-center py-20">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Listing not found</h1>
          <Button onClick={() => navigate("/search")}>Back to Search</Button>
        </div>
      </div>
    );
  }

  const reviews = listing.reviews || [];
  const avgRating = reviews.length
    ? (reviews.reduce((sum: number, r: { rating: number }) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : "4.8";

  const photos = (listing.photos as string[])?.length
    ? (listing.photos as string[])
    : ["https://images.unsplash.com/photo-1506521781263-d8422e82f27a?w=800&h=500&fit=crop"];

  const features = (listing.features as string[])?.length
    ? (listing.features as string[])
    : ["24/7 Access", "Security Camera", "Gated"];

  const ownerName = listing.owner?.name || "Host";
  const price = Number(listing.pricePerDay);
  const serviceFee = price * 0.15;
  const taxes = price * 0.08;
  const total = price + serviceFee + taxes;

  return (
    <div className="min-h-screen bg-[#F6F8FC] pt-16">
      {/* Breadcrumb */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="text-sm">Back</span>
        </button>
      </div>

      {/* Image Gallery */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={staggerContainer}
        className="max-w-6xl mx-auto px-4 sm:px-6"
      >
        <motion.div variants={fadeInUp} className="relative rounded-2xl overflow-hidden bg-gray-200 aspect-[16/9] sm:aspect-[21/9]">
          <img
            src={photos[selectedImage] || photos[0]}
            alt={listing.title}
            className="w-full h-full object-cover"
          />
          {photos.length > 1 && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
              {photos.map((_: string, idx: number) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(idx)}
                  className={`w-2 h-2 rounded-full transition-all ${
                    idx === selectedImage ? "bg-white w-6" : "bg-white/60"
                  }`}
                />
              ))}
            </div>
          )}
          <div className="absolute top-4 right-4 flex gap-2">
            <button
              onClick={() => setLiked(!liked)}
              className="p-2.5 rounded-full bg-white/90 backdrop-blur-sm hover:bg-white transition-colors shadow-lg"
            >
              <Heart className={`w-5 h-5 ${liked ? "fill-red-500 text-red-500" : "text-gray-700"}`} />
            </button>
            <button className="p-2.5 rounded-full bg-white/90 backdrop-blur-sm hover:bg-white transition-colors shadow-lg">
              <Share2 className="w-5 h-5 text-gray-700" />
            </button>
          </div>
        </motion.div>

        {/* Thumbnail strip */}
        {photos.length > 1 && (
          <div className="flex gap-2 mt-3 overflow-x-auto pb-2">
            {photos.map((photo: string, idx: number) => (
              <button
                key={idx}
                onClick={() => setSelectedImage(idx)}
                className={`flex-shrink-0 w-20 h-16 rounded-lg overflow-hidden border-2 transition-colors ${
                  idx === selectedImage ? "border-blue-600" : "border-transparent"
                }`}
              >
                <img src={photo} alt="" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        )}
      </motion.div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Details */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="lg:col-span-2 space-y-6"
          >
            {/* Title & Rating */}
            <motion.div variants={fadeInUp}>
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
                    {listing.title}
                  </h1>
                  <div className="flex items-center gap-3 text-gray-600 flex-wrap">
                    <div className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      <span className="text-sm">{listing.address}{listing.city ? `, ${listing.city}` : ""}</span>
                    </div>
                    <span className="text-gray-300 hidden sm:inline">|</span>
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm font-medium">{avgRating}</span>
                      <span className="text-sm text-gray-500">({reviews.length || 12} reviews)</span>
                    </div>
                  </div>
                </div>
                <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100 capitalize text-sm px-3 py-1">
                  {listing.spotType}
                </Badge>
              </div>
            </motion.div>

            <Separator />

            {/* Host Info */}
            <motion.div variants={fadeInUp} className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-white font-bold text-lg shadow-lg">
                {ownerName.charAt(0).toUpperCase()}
              </div>
              <div>
                <p className="font-semibold text-gray-900">Hosted by {ownerName}</p>
                <p className="text-sm text-gray-500">Superhost · Joined 2024</p>
              </div>
              <Button variant="outline" size="sm" className="ml-auto gap-2">
                <MessageSquare className="w-4 h-4" />
                Contact
              </Button>
            </motion.div>

            <Separator />

            {/* Description */}
            <motion.div variants={fadeInUp}>
              <h2 className="text-xl font-bold text-gray-900 mb-3">About this spot</h2>
              <p className="text-gray-600 leading-relaxed">
                {listing.description || "A convenient parking spot in a prime location. Safe, secure, and easily accessible. Perfect for daily commuters or visitors to the area."}
              </p>
            </motion.div>

            <Separator />

            {/* Amenities */}
            <motion.div variants={fadeInUp}>
              <h2 className="text-xl font-bold text-gray-900 mb-4">Amenities</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {features.map((amenity: string) => (
                  <div key={amenity} className="flex items-center gap-3 p-3 rounded-xl bg-white shadow-sm border border-gray-100">
                    <div className="text-blue-600">{getAmenityIcon(amenity)}</div>
                    <span className="text-sm font-medium text-gray-700">{amenity}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            <Separator />

            {/* Reviews */}
            <motion.div variants={fadeInUp}>
              <div className="flex items-center gap-2 mb-4">
                <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                <h2 className="text-xl font-bold text-gray-900">
                  {avgRating} · {reviews.length || 12} reviews
                </h2>
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                {(reviews.slice(0, 4) || []).map((review: { id: number; rating: number; comment: string | null; userName: string | null; userAvatar: string | null; createdAt: Date }, idx: number) => (
                  <div key={review.id || idx} className="p-4 rounded-xl bg-white shadow-sm border border-gray-100">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gray-400 to-gray-600 flex items-center justify-center text-white font-bold">
                        {(review.userName || "U").charAt(0)}
                      </div>
                      <div>
                        <p className="font-medium text-sm text-gray-900">{review.userName || "User"}</p>
                        <p className="text-xs text-gray-500">
                          {review.createdAt ? new Date(review.createdAt).toLocaleDateString() : "Recently"}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-1 mb-2">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={`w-3 h-3 ${
                            i < review.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                          }`}
                        />
                      ))}
                    </div>
                    <p className="text-sm text-gray-600">{review.comment}</p>
                  </div>
                ))}
                {reviews.length === 0 && (
                  <div className="col-span-2 text-center py-8 text-gray-500">
                    No reviews yet. Be the first to book and review!
                  </div>
                )}
              </div>
            </motion.div>

            <Separator />

            {/* Location Map */}
            <motion.div variants={fadeInUp}>
              <h2 className="text-xl font-bold text-gray-900 mb-4">Location</h2>
              <div className="rounded-2xl overflow-hidden border border-gray-200 shadow-sm aspect-[16/9]">
                <iframe
                  width="100%"
                  height="100%"
                  style={{ border: 0, minHeight: "300px" }}
                  loading="lazy"
                  allowFullScreen
                  referrerPolicy="no-referrer-when-downgrade"
                  src={`https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3022!2d-74.006!3d40.7128!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNDDCsDQyJzQ2LjEiTiA3NMKwMDAnMjEuNiJX!5e0!3m2!1sen!2sus!4v1&q=${encodeURIComponent(listing.address + " " + (listing.city || ""))}`}
                />
              </div>
              <a
                href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(listing.address + " " + (listing.city || ""))}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 mt-3 text-blue-600 hover:text-blue-700 font-medium text-sm"
              >
                <Navigation className="w-4 h-4" />
                Get Directions
                <ChevronRight className="w-4 h-4" />
              </a>
            </motion.div>
          </motion.div>

          {/* Right Column - Booking Card */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.3, ease: smoothEase }}
            className="lg:col-span-1"
          >
            <div className="sticky top-24 bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
              <div className="flex items-baseline gap-2 mb-4">
                <span className="text-3xl font-bold text-gray-900">${price.toFixed(2)}</span>
                <span className="text-gray-500">/day</span>
              </div>

              <div className="space-y-3 mb-6">
                <div className="p-3 rounded-xl border border-gray-200 hover:border-blue-300 transition-colors cursor-pointer">
                  <div className="flex items-center gap-2 mb-1">
                    <Calendar className="w-4 h-4 text-gray-500" />
                    <span className="text-xs font-semibold text-gray-700 uppercase tracking-wide">Date</span>
                  </div>
                  <p className="text-sm text-gray-600 ml-6">Select your parking date</p>
                </div>
                <div className="p-3 rounded-xl border border-gray-200 hover:border-blue-300 transition-colors cursor-pointer">
                  <div className="flex items-center gap-2 mb-1">
                    <Clock className="w-4 h-4 text-gray-500" />
                    <span className="text-xs font-semibold text-gray-700 uppercase tracking-wide">Time</span>
                  </div>
                  <p className="text-sm text-gray-600 ml-6">Arrival & departure time</p>
                </div>
              </div>

              <Button
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-6 rounded-xl text-lg shadow-lg shadow-blue-600/20 transition-all hover:shadow-xl hover:shadow-blue-600/30"
                onClick={() => navigate(`/book/${listing.id}`)}
              >
                Book Now
                <ChevronRight className="w-5 h-5 ml-1" />
              </Button>

              <p className="text-center text-sm text-gray-500 mt-3">You won&apos;t be charged yet</p>

              <div className="mt-6 pt-6 border-t border-gray-100 space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">${price.toFixed(2)} x 1 day</span>
                  <span className="font-medium">${price.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Service fee</span>
                  <span className="font-medium">${serviceFee.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Taxes</span>
                  <span className="font-medium">${taxes.toFixed(2)}</span>
                </div>
                <Separator />
                <div className="flex justify-between font-bold text-gray-900">
                  <span>Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>

              <div className="mt-6 flex items-center gap-2 p-3 rounded-xl bg-green-50 border border-green-100">
                <Shield className="w-5 h-5 text-green-600 flex-shrink-0" />
                <p className="text-xs text-green-700">
                  <span className="font-semibold">ParkShare Guarantee:</span> Full refund if spot is unavailable.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
