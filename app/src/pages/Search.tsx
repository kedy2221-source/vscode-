import { motion, type Transition } from 'framer-motion';
import { useState } from 'react';
import { MapPin, Filter, Star, Navigation, Heart, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { Link } from 'react-router';

const smoothEase: Transition['ease'] = [0.22, 0.61, 0.36, 1];

const fadeInUp = {
  hidden: { opacity: 0, y: 22 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: smoothEase } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08 } }
};

const SearchPage = () => {
  const [showFilters, setShowFilters] = useState(false);
  const [priceRange, setPriceRange] = useState([20]);
  const [selectedSpot, setSelectedSpot] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const spots = [
    {
      id: 1,
      address: '123 Main Street',
      city: 'Downtown',
      price: 12,
      rating: 4.9,
      reviews: 24,
      distance: '0.3 km',
      image: '/images/host-driveway.jpg',
      status: 'available',
      features: ['Covered', 'Security camera', '24/7 access'],
      host: { name: 'Sarah M.', image: '/images/avatar-sarah.jpg', verified: true },
      lat: 43.6532,
      lng: -79.3832
    },
    {
      id: 2,
      address: '456 Oak Avenue',
      city: 'Midtown',
      price: 15,
      rating: 4.7,
      reviews: 18,
      distance: '0.8 km',
      image: '/images/trust-lot.jpg',
      status: 'available',
      features: ['Driveway', 'Well-lit'],
      host: { name: 'David K.', image: '/images/avatar-david.jpg', verified: true },
      lat: 43.6500,
      lng: -79.3800
    },
    {
      id: 3,
      address: '789 Pine Road',
      city: 'Westside',
      price: 10,
      rating: 4.8,
      reviews: 32,
      distance: '1.2 km',
      image: '/images/host-driveway.jpg',
      status: 'limited',
      features: ['Garage', 'EV charging'],
      host: { name: 'Amanda R.', image: '/images/avatar-amanda.jpg', verified: false },
      lat: 43.6480,
      lng: -79.3900
    },
    {
      id: 4,
      address: '321 Elm Street',
      city: 'Eastside',
      price: 8,
      rating: 4.5,
      reviews: 12,
      distance: '1.5 km',
      image: '/images/trust-lot.jpg',
      status: 'booked',
      features: ['Driveway'],
      host: { name: 'James L.', image: '/images/avatar-james.jpg', verified: true },
      lat: 43.6550,
      lng: -79.3780
    },
    {
      id: 5,
      address: '654 Maple Drive',
      city: 'Uptown',
      price: 18,
      rating: 5.0,
      reviews: 45,
      distance: '2.1 km',
      image: '/images/host-driveway.jpg',
      status: 'available',
      features: ['Private lot', 'Security guard', 'Covered'],
      host: { name: 'Lisa T.', image: '/images/avatar-lisa.jpg', verified: true },
      lat: 43.6600,
      lng: -79.3850
    },
    {
      id: 6,
      address: '987 Cedar Lane',
      city: 'Downtown',
      price: 14,
      rating: 4.6,
      reviews: 21,
      distance: '2.4 km',
      image: '/images/trust-lot.jpg',
      status: 'available',
      features: ['Driveway', 'Well-lit'],
      host: { name: 'Michael B.', image: '/images/avatar-michael.jpg', verified: true },
      lat: 43.6520,
      lng: -79.3750
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available': return 'bg-parkshare-status-success';
      case 'limited': return 'bg-parkshare-status-warning';
      case 'booked': return 'bg-parkshare-status-danger';
      default: return 'bg-parkshare-text-secondary';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'available': return 'Available now';
      case 'limited': return 'Limited spots';
      case 'booked': return 'Fully booked';
      default: return 'Unknown';
    }
  };

  const mapUrl = searchQuery 
    ? `https://www.google.com/maps/search/parking+near+${encodeURIComponent(searchQuery)}`
    : `https://www.google.com/maps/search/parking+spots+near+me`;

  return (
    <div className="min-h-screen bg-parkshare-bg-primary pt-16">
      {/* Search Header */}
      <div className="sticky top-16 z-40 bg-parkshare-surface border-b border-parkshare-text-primary/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-7 lg:px-10 py-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-parkshare-text-secondary" />
              <Input 
                placeholder="Search location..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 h-12 rounded-xl"
              />
            </div>
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                onClick={() => setShowFilters(!showFilters)}
                className={`h-12 px-4 rounded-xl ${showFilters ? 'bg-accent/10 border-accent' : ''}`}
              >
                <Filter className="w-4 h-4 mr-2" />
                Filters
              </Button>
              <a 
                href={mapUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 h-12 px-4 bg-accent hover:bg-accent-dark text-white rounded-xl font-medium transition-colors"
              >
                <Navigation className="w-4 h-4" />
                Open in Google Maps
              </a>
            </div>
          </div>

          {showFilters && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-4 pt-4 border-t border-parkshare-text-primary/5"
            >
              <div className="grid sm:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-parkshare-text-secondary mb-2">Max price: ${priceRange[0]}/day</label>
                  <Slider value={priceRange} onValueChange={setPriceRange} max={50} step={1} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-parkshare-text-secondary mb-2">Spot type</label>
                  <div className="flex flex-wrap gap-2">
                    {['Driveway', 'Garage', 'Lot'].map((type) => (
                      <Badge key={type} variant="outline" className="cursor-pointer hover:bg-accent/10">{type}</Badge>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-parkshare-text-secondary mb-2">Features</label>
                  <div className="flex flex-wrap gap-2">
                    {['Covered', 'Security', 'EV charging'].map((feature) => (
                      <Badge key={feature} variant="outline" className="cursor-pointer hover:bg-accent/10">{feature}</Badge>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>

      {/* Results */}
      <div className="max-w-7xl mx-auto px-4 sm:px-7 lg:px-10 py-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="font-display font-bold text-2xl text-parkshare-text-primary">
            {spots.length} spots near you
          </h1>
          <div className="flex items-center gap-2 text-sm text-parkshare-text-secondary">
            <span>Sort by:</span>
            <select className="bg-transparent font-medium text-parkshare-text-primary">
              <option>Recommended</option>
              <option>Price: Low to High</option>
              <option>Price: High to Low</option>
              <option>Distance</option>
              <option>Rating</option>
            </select>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Spots List */}
          <div className="lg:col-span-2 space-y-4">
            <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="space-y-4">
              {spots.map((spot) => (
                <motion.div 
                  key={spot.id} 
                  variants={fadeInUp}
                  onClick={() => setSelectedSpot(spot.id)}
                  className={`bg-parkshare-surface rounded-card p-4 shadow-card cursor-pointer transition-all hover:shadow-lg ${selectedSpot === spot.id ? 'ring-2 ring-accent' : ''}`}
                >
                  <div className="flex gap-4">
                    <div className="relative w-32 h-32 flex-shrink-0">
                      <img src={spot.image} alt="" className="w-full h-full object-cover rounded-xl" />
                      <button className="absolute top-2 right-2 w-8 h-8 bg-white/90 rounded-full flex items-center justify-center hover:bg-white">
                        <Heart className="w-4 h-4 text-parkshare-text-secondary" />
                      </button>
                      <div className={`absolute bottom-2 left-2 px-2 py-1 rounded-full text-xs text-white font-medium ${getStatusColor(spot.status)}`}>
                        {getStatusText(spot.status)}
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-display font-bold text-lg text-parkshare-text-primary">{spot.address}</h3>
                          <p className="text-sm text-parkshare-text-secondary">{spot.city}</p>
                        </div>
                        <div className="text-right">
                          <div className="font-display font-bold text-xl text-accent">${spot.price}<span className="text-sm font-normal text-parkshare-text-secondary">/day</span></div>
                        </div>
                      </div>
                      <div className="flex items-center gap-4 mt-2 text-sm">
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                          <span className="font-medium">{spot.rating}</span>
                          <span className="text-parkshare-text-secondary">({spot.reviews})</span>
                        </div>
                        <div className="flex items-center gap-1 text-parkshare-text-secondary">
                          <Navigation className="w-4 h-4" />
                          {spot.distance}
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-2 mt-3">
                        {spot.features.map((feature, i) => (
                          <Badge key={i} variant="secondary" className="text-xs">{feature}</Badge>
                        ))}
                      </div>
                      <div className="flex items-center justify-between mt-4">
                        <div className="flex items-center gap-2">
                          <img 
                            src={spot.host.image} 
                            alt={spot.host.name}
                            className="w-8 h-8 rounded-full object-cover"
                          />
                          <div className="text-sm">
                            <span className="text-parkshare-text-primary">{spot.host.name}</span>
                            {spot.host.verified && (
                              <Badge className="ml-2 bg-parkshare-status-success/10 text-parkshare-status-success text-xs">Verified</Badge>
                            )}
                          </div>
                        </div>
                        <Link to={`/book/${spot.id}`}>
                          <Button 
                            size="sm" 
                            className="bg-accent hover:bg-accent-dark text-white rounded-lg"
                            disabled={spot.status === 'booked'}
                          >
                            {spot.status === 'booked' ? 'Booked' : 'Book now'}
                            <ChevronRight className="w-4 h-4 ml-1" />
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>

          {/* Google Maps Embed */}
          <div className="hidden lg:block">
            <div className="sticky top-40">
              <div className="bg-parkshare-surface rounded-card shadow-card overflow-hidden h-[500px] relative">
                <iframe
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  loading="lazy"
                  allowFullScreen
                  referrerPolicy="no-referrer-when-downgrade"
                  src={`https://www.google.com/maps/embed?pb=!1m16!1m12!1m3!1d184552.19592613167!2d-79.542864!3d43.718155!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!2m1!1sparking!5e0!3m2!1sen!2sca!4v1700000000000!5m2!1sen!2sca&q=parking+spots`}
                />
                <a 
                  href={mapUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="absolute bottom-4 left-4 right-4 bg-accent hover:bg-accent-dark text-white text-center py-3 rounded-xl font-medium transition-colors shadow-lg"
                >
                  <Navigation className="w-4 h-4 inline mr-2" />
                  View on Google Maps
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchPage;
