import { Link } from "react-router";
import { Car, Calendar, TrendingUp, Clock, Plus, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { trpc } from "@/providers/trpc";
import { useAuth } from "@/hooks/useAuth";

export function DashboardPage() {
  const { user } = useAuth();
  const { data: myBookings } = trpc.booking.myBookings.useQuery();
  const { data: myListings } = trpc.listing.myListings.useQuery();
  const { data: myReservations } = trpc.booking.myReservations.useQuery();

  const stats = [
    { label: "Total Bookings", value: myBookings?.length || 0, icon: <Calendar className="w-5 h-5" />, color: "bg-[#2F8E92]/10 text-[#2F8E92]" },
    { label: "Active Listings", value: myListings?.length || 0, icon: <Car className="w-5 h-5" />, color: "bg-[#27C078]/10 text-[#27C078]" },
    { label: "Reservations", value: myReservations?.length || 0, icon: <TrendingUp className="w-5 h-5" />, color: "bg-[#F2B33D]/10 text-[#F2B33D]" },
  ];

  return (
    <div className="min-h-screen bg-[#F6F8FC] pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="font-bold text-3xl text-[#0E1A1A]">Dashboard</h1>
            <p className="text-gray-500">Welcome back{user?.name ? `, ${user.name}` : ""}! Here&apos;s what&apos;s happening.</p>
          </div>
          <div className="flex gap-3">
            <Link to="/list-spot"><Button className="bg-[#2F8E92] hover:bg-[#257578] text-white rounded-full"><Plus className="w-4 h-4 mr-2" /> List a spot</Button></Link>
            <Link to="/search"><Button variant="outline" className="rounded-full"><Car className="w-4 h-4 mr-2" /> Find parking</Button></Link>
          </div>
        </div>

        {/* Stats */}
        <div className="grid sm:grid-cols-3 gap-4 mb-8">
          {stats.map((stat, index) => (
            <div key={index} className="bg-white rounded-[28px] p-5 shadow-lg">
              <div className="flex items-center justify-between mb-2">
                <div className={`w-10 h-10 rounded-xl ${stat.color} flex items-center justify-center`}>{stat.icon}</div>
                <TrendingUp className="w-4 h-4 text-[#27C078]" />
              </div>
              <div className="font-bold text-2xl text-[#0E1A1A]">{stat.value}</div>
              <div className="text-sm text-gray-500">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <Tabs defaultValue="bookings" className="space-y-6">
          <TabsList className="bg-white rounded-xl p-1">
            <TabsTrigger value="bookings" className="rounded-lg">My Bookings</TabsTrigger>
            <TabsTrigger value="listings" className="rounded-lg">My Listings</TabsTrigger>
            <TabsTrigger value="reservations" className="rounded-lg">Reservations</TabsTrigger>
          </TabsList>

          <TabsContent value="bookings" className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-bold text-xl text-[#0E1A1A]">My Bookings</h2>
            </div>
            {myBookings?.length === 0 ? (
              <div className="bg-white rounded-[28px] p-8 shadow-lg text-center">
                <Car className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 mb-4">No bookings yet</p>
                <Link to="/search"><Button className="bg-[#2F8E92] hover:bg-[#257578] text-white">Find parking</Button></Link>
              </div>
            ) : (
              <div className="space-y-4">
                {myBookings?.map((item) => (
                  <div key={item.booking.id} className="bg-white rounded-[28px] p-5 shadow-lg">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-[#2F8E92]/10 flex items-center justify-center text-[#2F8E92]"><Car className="w-6 h-6" /></div>
                        <div>
                          <h3 className="font-bold text-lg text-[#0E1A1A]">{item.listingTitle || "Parking Spot"}</h3>
                          <div className="flex items-center gap-3 text-sm text-gray-500">
                            <span className="flex items-center gap-1"><Calendar className="w-4 h-4" />{new Date(item.booking.startTime).toLocaleDateString()}</span>
                            <span className="flex items-center gap-1"><Clock className="w-4 h-4" />{new Date(item.booking.startTime).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-xl text-[#2F8E92]">${item.booking.totalPrice}</div>
                        <Badge className={item.booking.status === "active" ? "bg-[#27C078]/10 text-[#27C078]" : "bg-[#2F8E92]/10 text-[#2F8E92]"}>{item.booking.status}</Badge>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="listings" className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-bold text-xl text-[#0E1A1A]">My Listings</h2>
              <Link to="/list-spot"><Button size="sm" className="bg-[#2F8E92] hover:bg-[#257578] text-white rounded-lg"><Plus className="w-4 h-4 mr-2" /> Add new</Button></Link>
            </div>
            {myListings?.length === 0 ? (
              <div className="bg-white rounded-[28px] p-8 shadow-lg text-center">
                <MapPin className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 mb-4">No listings yet</p>
                <Link to="/list-spot"><Button className="bg-[#2F8E92] hover:bg-[#257578] text-white">List your spot</Button></Link>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 gap-4">
                {myListings?.map((listing) => (
                  <div key={listing.id} className="bg-white rounded-[28px] overflow-hidden shadow-lg">
                    <img src={listing.photos?.[0] ? String(listing.photos[0]) : "/images/host-driveway.jpg"} alt="" className="w-full h-40 object-cover" />
                    <div className="p-5">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="font-bold text-lg text-[#0E1A1A]">{listing.title || listing.address}</h3>
                          <p className="text-[#2F8E92] font-bold">${listing.pricePerDay}/day</p>
                        </div>
                        <Badge className="bg-[#27C078]/10 text-[#27C078]">{listing.status}</Badge>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="reservations" className="space-y-4">
            <h2 className="font-bold text-xl text-[#0E1A1A]">Reservations</h2>
            {myReservations?.length === 0 ? (
              <div className="bg-white rounded-[28px] p-8 shadow-lg text-center">
                <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">No reservations yet</p>
              </div>
            ) : (
              <div className="space-y-4">
                {myReservations?.map((item) => (
                  <div key={item.booking.id} className="bg-white rounded-[28px] p-5 shadow-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-bold text-lg text-[#0E1A1A]">{item.listingTitle || "Parking Spot"}</h3>
                        <p className="text-sm text-gray-500">{item.renterName || "Guest"}</p>
                      </div>
                      <Badge className="bg-[#2F8E92]/10 text-[#2F8E92]">${item.booking.totalPrice}</Badge>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
