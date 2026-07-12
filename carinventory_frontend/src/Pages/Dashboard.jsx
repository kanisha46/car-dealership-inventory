import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { vehicleService } from '../services/vehicleService';
import SearchBar from '../components/SearchBar';
import VehicalCard from '../components/VehicalCard';
import LoadingSpinner from '../components/LoadingSpinner';
import ConfirmDialog from '../components/ConfirmDialog';
import CarDetailModal from '../components/CarDetailModal';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { SearchX, PackageOpen, Car, TrendingUp, Tag, Layers, PlusCircle } from 'lucide-react';

// ─── Car image map (brand → real car photo URL) ───────────────────────────
const CAR_IMAGE_MAP = {
  // Premium / Supercar brands
  'Porsche':        'https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?w=900&q=80',
  'BMW':            'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=900&q=80',
  'Mercedes-Benz':  'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=900&q=80',
  'Audi':           'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=900&q=80',
  'Ferrari':        'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=900&q=80',
  'Lamborghini':    'https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=900&q=80',
  'Tesla':          'https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=900&q=80',
  'Range Rover':    'https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?w=900&q=80',
  'Rolls-Royce':    'https://images.unsplash.com/photo-1566024349786-f5cbf63d6571?w=900&q=80',
  'Bentley':        'https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=900&q=80',
  'McLaren':        'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=900&q=80',
  'Bugatti':        'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=900&q=80',
  'Maserati':       'https://images.unsplash.com/photo-1536098561742-ca998e48cbcc?w=900&q=80',
  'Alfa Romeo':     'https://images.unsplash.com/photo-1553440569-bcc63803a83d?w=900&q=80',

  // Japanese brands
  'Toyota':         'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=900&q=80',
  'Honda':          'https://images.unsplash.com/photo-1590362891991-f776e747a588?w=900&q=80',
  'Nissan':         'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=900&q=80',
  'Mazda':          'https://images.unsplash.com/photo-1541443131876-96855bd3a827?w=900&q=80',
  'Subaru':         'https://images.unsplash.com/photo-1609521263047-f8f205293f24?w=900&q=80',
  'Mitsubishi':     'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=900&q=80',
  'Lexus':          'https://images.unsplash.com/photo-1550355291-bbee04a92027?w=900&q=80',
  'Infiniti':       'https://images.unsplash.com/photo-1582655008695-8cab1c7b98c8?w=900&q=80',
  'Acura':          'https://images.unsplash.com/photo-1601362840469-51e4d8d58785?w=900&q=80',

  // Korean brands
  'Hyundai':        'https://images.unsplash.com/photo-1612825173281-9a193378527e?w=900&q=80',
  'Kia':            'https://images.unsplash.com/photo-1609521263047-f8f205293f24?w=900&q=80',
  'Genesis':        'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=900&q=80',

  // American brands
  'Ford':           'https://images.unsplash.com/photo-1612825173281-9a193378527e?w=900&q=80',
  'Chevrolet':      'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=900&q=80',
  'Dodge':          'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=900&q=80',
  'Cadillac':       'https://images.unsplash.com/photo-1550355291-bbee04a92027?w=900&q=80',
  'Lincoln':        'https://images.unsplash.com/photo-1536098561742-ca998e48cbcc?w=900&q=80',
  'Jeep':           'https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?w=900&q=80',

  // European (non-German)
  'Volkswagen':     'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?w=900&q=80',
  'Volvo':          'https://images.unsplash.com/photo-1529408632839-a54952c491e5?w=900&q=80',
  'Jaguar':         'https://images.unsplash.com/photo-1526726538690-5cbf956ae2fd?w=900&q=80',
  'Land Rover':     'https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?w=900&q=80',
  'Peugeot':        'https://images.unsplash.com/photo-1541443131876-96855bd3a827?w=900&q=80',
  'Renault':        'https://images.unsplash.com/photo-1553440569-bcc63803a83d?w=900&q=80',
};

// Gradient class map for CSS fallbacks
const BRAND_GRADIENT = {
  'Porsche':       'car-img-porsche',
  'BMW':           'car-img-bmw',
  'Mercedes-Benz': 'car-img-mercedes',
  'Audi':          'car-img-audi',
  'Ferrari':       'car-img-ferrari',
  'Lamborghini':   'car-img-lamborghini',
  'Tesla':         'car-img-tesla',
  'Range Rover':   'car-img-rangerover',
  'Rolls-Royce':   'car-img-rollsroyce',
  'Toyota':        'car-img-toyota',
  'Honda':         'car-img-bmw',
  'Nissan':        'car-img-audi',
  'Mazda':         'car-img-porsche',
  'Subaru':        'car-img-rangerover',
  'Lexus':         'car-img-mercedes',
  'Hyundai':       'car-img-tesla',
  'Kia':           'car-img-bmw',
  'Ford':          'car-img-rangerover',
  'Chevrolet':     'car-img-audi',
  'Dodge':         'car-img-ferrari',
  'Cadillac':      'car-img-mercedes',
  'Volkswagen':    'car-img-audi',
  'Volvo':         'car-img-bmw',
  'Jaguar':        'car-img-porsche',
  'Land Rover':    'car-img-rangerover',
  'Bentley':       'car-img-rollsroyce',
  'McLaren':       'car-img-ferrari',
  'Bugatti':       'car-img-ferrari',
  'Maserati':      'car-img-porsche',
};

// ─── 10 Static Showcase Cars ───────────────────────────────────────────────
const STATIC_CARS = [
  {
    id: 's1', brand: 'Porsche', model: '911 Carrera S', year: 2024,
    price: 129900, quantity: 3, category: 'Sports',
    engine: '3.0L Twin-Turbo Flat-6', horsepower: '443 HP', transmission: '8-Speed PDK',
    color: 'Carmine Red',
    description: 'The iconic 911 Carrera S delivers a visceral driving experience blended with everyday usability. Its rear-engine layout and precision tuning make it the benchmark of sports car excellence.',
    features: ['PASM Sport Suspension', 'Bose Surround Sound', 'Sport Chrono Package', 'Heated Sports Seats', 'Apple CarPlay', 'Porsche Active Aerodynamics'],
    specs: { engine: '3.0L Twin-Turbo', horsepower: '443 HP', transmission: '8-Speed PDK', color: 'Carmine Red', warranty: '4 Years' },
  },
  {
    id: 's2', brand: 'BMW', model: 'M4 Competition', year: 2024,
    price: 84900, quantity: 5, category: 'Sport Sedan',
    engine: '3.0L TwinPower Turbo', horsepower: '503 HP', transmission: '8-Speed M Steptronic',
    color: 'Isle of Man Green',
    description: 'The BMW M4 Competition is an adrenaline-fueled machine that combines track-ready performance with daily comfort. Its aggressive styling and M-tuned chassis set it apart from the crowd.',
    features: ['M Carbon Fiber Roof', 'Harman Kardon Sound', 'M Drive Professional', 'Adaptive LED Headlights', 'Wireless Charging', 'Merino Leather Interior'],
    specs: { engine: '3.0L TwinPower', horsepower: '503 HP', transmission: '8-Spd M Steptronic', color: 'Isle of Man Green', warranty: '4 Years' },
  },
  {
    id: 's3', brand: 'Mercedes-Benz', model: 'AMG GT 63 S', year: 2024,
    price: 162000, quantity: 2, category: 'Grand Tourer',
    engine: '4.0L V8 Biturbo', horsepower: '630 HP', transmission: '9-Speed MCT',
    color: 'Obsidian Black',
    description: 'A masterpiece of performance and luxury, the AMG GT 63 S merges a handcrafted 4.0L V8 engine with a refined four-door body, making it the ultimate four-seat sports car.',
    features: ['AMG Active Suspension', 'Burmester Surround Sound', 'AMG Track Pace', '4MATIC+ AWD', 'Head-Up Display', 'Night Package'],
    specs: { engine: '4.0L V8 Biturbo', horsepower: '630 HP', transmission: '9-Speed MCT', color: 'Obsidian Black', warranty: '4 Years' },
  },
  {
    id: 's4', brand: 'Audi', model: 'RS7 Sportback', year: 2024,
    price: 118500, quantity: 4, category: 'Performance',
    engine: '4.0L TFSI V8', horsepower: '591 HP', transmission: '8-Speed Tiptronic',
    color: 'Nardo Gray',
    description: 'The RS7 Sportback is Audis most powerful and sophisticated fastback. With quattro AWD and a mild hybrid system, it achieves blistering performance without sacrificing fuel economy.',
    features: ['quattro AWD', 'Bang & Olufsen 3D Sound', 'RS Sport Suspension', 'Night Vision Assist', 'Matrix LED Headlights', 'Alcantara Sport Seats'],
    specs: { engine: '4.0L TFSI V8', horsepower: '591 HP', transmission: '8-Spd Tiptronic', color: 'Nardo Gray', warranty: '4 Years' },
  },
  {
    id: 's5', brand: 'Ferrari', model: 'Roma Spider', year: 2024,
    price: 278000, quantity: 1, category: 'Supercar',
    engine: '3.9L Twin-Turbo V8', horsepower: '612 HP', transmission: '8-Speed DCT',
    color: 'Rosso Portofino',
    description: 'The Ferrari Roma Spider captures the spirit of la dolce vita in open-top form. Its elegant lines, sculpted body, and retractable hardtop make it the most beautiful Ferrari in recent memory.',
    features: ['Retractable Hardtop', 'Ferrari Dynamic Enhancer', 'Carbon Fiber Elements', 'Daytona-Style Seats', 'Ferrari Multimedia System', 'Manettino Dial'],
    specs: { engine: '3.9L Twin-Turbo V8', horsepower: '612 HP', transmission: '8-Speed DCT', color: 'Rosso Portofino', warranty: '3 Years' },
  },
  {
    id: 's6', brand: 'Lamborghini', model: 'Urus S', year: 2024,
    price: 239000, quantity: 2, category: 'Super SUV',
    engine: '4.0L Twin-Turbo V8', horsepower: '657 HP', transmission: '8-Speed Automatic',
    color: 'Giallo Auge',
    description: 'The Urus S redefines what an SUV can be. Combining Lamborghini DNA with genuine daily usability, it offers supercar performance in an elegant, versatile package for any terrain.',
    features: ['Torque Vectoring AWD', 'Lamborghini Dinamica Veicolo', 'Alcantara & Leather Interior', 'Carbon Ceramic Brakes', 'Panoramic Roof', 'Air Suspension'],
    specs: { engine: '4.0L Twin-Turbo V8', horsepower: '657 HP', transmission: '8-Spd Automatic', color: 'Giallo Auge', warranty: '3 Years' },
  },
  {
    id: 's7', brand: 'Tesla', model: 'Model S Plaid', year: 2024,
    price: 98990, quantity: 6, category: 'Electric',
    engine: 'Tri-Motor Electric', horsepower: '1,020 HP', transmission: 'Single-Speed Direct',
    color: 'Midnight Silver',
    description: 'The Tesla Model S Plaid is the fastest production car ever built, with a 0-60 mph time under 2 seconds. A revolutionary tri-motor system delivers unmatched electric performance.',
    features: ['Autopilot Full Self-Driving', '17" Cinematic Display', 'Yoke Steering Wheel', '400-Mile Range', 'Over-the-Air Updates', 'Premium Sound System'],
    specs: { engine: 'Tri-Motor Electric', horsepower: '1,020 HP', transmission: 'Single-Speed Direct', color: 'Midnight Silver', warranty: '4 Years' },
  },
  {
    id: 's8', brand: 'Range Rover', model: 'Sport SVR', year: 2024,
    price: 142000, quantity: 3, category: 'Luxury SUV',
    engine: '5.0L Supercharged V8', horsepower: '575 HP', transmission: '8-Speed ZF',
    color: 'Santorini Black',
    description: 'The Range Rover Sport SVR combines world-class luxury with extreme off-road capability and performance. Its supercharged V8 delivers excitement in any environment.',
    features: ['Adaptive Dynamics', 'Meridian Signature Sound', 'SVR Carbon Pack', 'Panoramic Roof', 'Terrain Response 2', 'Head-Up Display'],
    specs: { engine: '5.0L SC V8', horsepower: '575 HP', transmission: '8-Speed ZF', color: 'Santorini Black', warranty: '5 Years' },
  },
  {
    id: 's9', brand: 'Rolls-Royce', model: 'Ghost Black Badge', year: 2024,
    price: 395000, quantity: 1, category: 'Ultra Luxury',
    engine: '6.75L Twin-Turbo V12', horsepower: '592 HP', transmission: '8-Speed Auto',
    color: 'Black Diamond',
    description: 'The Ghost Black Badge is Rolls-Royces alter ego — a more assertive, performance-oriented Ghost for those who prefer to command attention silently. Absolute opulence meets dark mystique.',
    features: ['Starlight Headliner (1,340 Stars)', 'Bespoke Audio System', 'Gallery Dashboard', 'Rear Theatre Configuration', 'Massage Seats', 'Champagne Cooler'],
    specs: { engine: '6.75L V12 Biturbo', horsepower: '592 HP', transmission: '8-Speed Auto', color: 'Black Diamond', warranty: '4 Years' },
  },
  {
    id: 's10', brand: 'Toyota', model: 'GR Supra A91', year: 2024,
    price: 62400, quantity: 8, category: 'Sports',
    engine: '3.0L Inline-6 Turbo', horsepower: '382 HP', transmission: '8-Speed Automatic',
    color: 'Nitro Yellow',
    description: 'The GR Supra A91 is a legendary nameplate reborn. Jointly developed with BMW, it brings Japanese passion for driving dynamics together with European engineering precision.',
    features: ['Adaptive Variable Suspension', 'JBL Premium Audio', 'Launch Control', 'Carbon Fiber Roof', 'Alcantara Interior', 'GR Four-Point Seatbelts'],
    specs: { engine: '3.0L I6 Turbo', horsepower: '382 HP', transmission: '8-Speed Auto', color: 'Nitro Yellow', warranty: '3 Years' },
  },
];

// Attach image URLs and gradient classes
const ENRICHED_STATIC_CARS = STATIC_CARS.map(car => ({
  ...car,
  imageUrl: CAR_IMAGE_MAP[car.brand] || 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=900&q=80',
  gradientClass: BRAND_GRADIENT[car.brand] || 'car-img-porsche',
}));

export default function Dashboard() {
  const { isAdmin } = useAuth();
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [useStaticFallback, setUseStaticFallback] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const [selectedCar, setSelectedCar] = useState(null);

  const [dialog, setDialog] = useState({
    isOpen: false, title: '', message: '',
    confirmText: 'Confirm', isDestructive: false, isProcessing: false, action: null,
  });

  const fetchVehicles = async (searchParams = {}) => {
    setLoading(true);
    try {
      let data;
      if (Object.keys(searchParams).length > 0) {
        data = await vehicleService.searchVehicles(searchParams);
      } else {
        data = await vehicleService.getAllVehicles();
      }
      const enriched = data.map((v) => ({
        ...v,
        imageUrl: CAR_IMAGE_MAP[v.brand] || 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=900&q=80',
        gradientClass: BRAND_GRADIENT[v.brand] || 'car-img-porsche',
      }));
      setVehicles(enriched);
      setUseStaticFallback(false);
      setCurrentPage(1);
    } catch {
      if (Object.keys(searchParams).length > 0) {
        const { brand, model, year, minPrice, maxPrice } = searchParams;
        const filtered = ENRICHED_STATIC_CARS.filter(v =>
          (!brand || v.brand.toLowerCase().includes(brand.toLowerCase())) &&
          (!model || v.model.toLowerCase().includes(model.toLowerCase())) &&
          (!year || v.year === parseInt(year)) &&
          (!minPrice || v.price >= minPrice) &&
          (!maxPrice || v.price <= maxPrice)
        );
        setVehicles(filtered);
      } else {
        setVehicles(ENRICHED_STATIC_CARS);
      }
      setUseStaticFallback(true);
      setCurrentPage(1);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchVehicles(); }, []);

  const handleViewDetail = (vehicle) => setSelectedCar(vehicle);
  const handleCloseDetail = () => setSelectedCar(null);

  const handlePurchaseClick = (vehicle) => {
    setDialog({
      isOpen: true,
      title: 'Confirm Purchase',
      message: `Complete your purchase of the ${vehicle.brand} ${vehicle.model} (${vehicle.year}) for $${vehicle.price?.toLocaleString()}? Our team will contact you within 24 hours to finalize delivery.`,
      confirmText: 'Yes, Purchase!',
      isDestructive: false,
      isProcessing: false,
      action: async () => {
        setDialog(prev => ({ ...prev, isProcessing: true }));
        try {
          if (!useStaticFallback) {
            const updated = await vehicleService.purchaseVehicle(vehicle.id);
            setVehicles(prev => prev.map(v => v.id === vehicle.id ? { ...updated, imageUrl: vehicle.imageUrl, gradientClass: vehicle.gradientClass } : v));
          } else {
            setVehicles(prev => prev.map(v => v.id === vehicle.id ? { ...v, quantity: Math.max(0, v.quantity - 1) } : v));
          }
          toast.success(`🎉 Successfully purchased the ${vehicle.brand} ${vehicle.model}!`);
        } catch (err) {
          toast.error(err.response?.data?.message || 'Failed to complete purchase.');
        } finally {
          setDialog(prev => ({ ...prev, isOpen: false, isProcessing: false }));
        }
      },
    });
  };

  const handleRestock = async (id, quantity) => {
    try {
      if (!useStaticFallback) {
        const v = vehicles.find(v => v.id === id);
        const updated = await vehicleService.restockVehicle(id, quantity);
        setVehicles(prev => prev.map(v => v.id === id ? { ...updated, imageUrl: v.imageUrl, gradientClass: v.gradientClass } : v));
      } else {
        setVehicles(prev => prev.map(v => v.id === id ? { ...v, quantity: v.quantity + quantity } : v));
      }
      toast.success('Vehicle restocked successfully!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to restock vehicle.');
    }
  };

  const handleDeleteClick = (vehicle) => {
    setDialog({
      isOpen: true,
      title: 'Delete Vehicle',
      message: `Are you sure you want to permanently delete the ${vehicle.brand} ${vehicle.model}? This action cannot be undone.`,
      confirmText: 'Delete',
      isDestructive: true,
      isProcessing: false,
      action: async () => {
        setDialog(prev => ({ ...prev, isProcessing: true }));
        try {
          if (!useStaticFallback) await vehicleService.deleteVehicle(vehicle.id);
          setVehicles(prev => prev.filter(v => v.id !== vehicle.id));
          toast.success('Vehicle deleted successfully.');
        } catch (err) {
          toast.error(err.response?.data?.message || 'Failed to delete vehicle.');
        } finally {
          setDialog(prev => ({ ...prev, isOpen: false, isProcessing: false }));
        }
      },
    });
  };

  const totalVehiclesCount = vehicles.reduce((sum, v) => sum + (v.quantity || 0), 0);
  const totalValue = vehicles.reduce((sum, v) => sum + ((v.price || 0) * (v.quantity || 0)), 0);
  const uniqueCategories = new Set(vehicles.map(v => v.category)).size;

  const totalPages = Math.ceil(vehicles.length / itemsPerPage);
  const paginatedVehicles = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return vehicles.slice(start, start + itemsPerPage);
  }, [vehicles, currentPage]);

  return (
    <div style={{ paddingBottom: '5rem' }}>

      {/* ── Hero Banner ── */}
      <div className="hero-banner fade-up" style={{ padding: '2.5rem 2.5rem 2rem', marginBottom: '2.5rem' }}>
        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.75rem' }}>
            <div style={{
              width: '52px', height: '52px', borderRadius: '14px',
              background: 'linear-gradient(135deg, #c8602a, #a04820)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 6px 20px rgba(200,96,42,0.4)',
            }}>
              <Car color="white" size={26} />
            </div>
            <div>
              <h1 style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: '2.6rem', fontWeight: 800, color: '#1a1612', lineHeight: 1,
                letterSpacing: '-0.02em',
              }}>
                Showroom Fleet
              </h1>
              <p style={{ color: '#8c7e6e', fontSize: '0.92rem', marginTop: '0.2rem' }}>
                {useStaticFallback
                  ? '✦ Browsing our curated showcase of 10 premium vehicles'
                  : '✦ Live inventory management system for premium vehicles'}
              </p>
            </div>
          </div>

          {/* Decorative car silhouette */}
          <div style={{ position: 'absolute', right: '2rem', top: '50%', transform: 'translateY(-50%)', opacity: 0.07 }}>
            <svg width="220" height="100" viewBox="0 0 200 80" fill="#c8602a">
              <path d="M10 55 L30 30 Q50 10 80 10 L120 10 Q150 10 165 30 L185 55 L190 60 L190 70 L10 70 Z"/>
              <circle cx="45" cy="70" r="14" fill="#c8602a"/>
              <circle cx="155" cy="70" r="14" fill="#c8602a"/>
            </svg>
          </div>

          {/* Admin CTA */}
          {isAdmin && (
            <div style={{ marginTop: '1.25rem', display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
              <Link
                to="/vehicles/add"
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: '7px',
                  background: 'linear-gradient(135deg, #c8602a, #a04820)',
                  color: '#fff', fontWeight: 700, fontSize: '0.88rem',
                  padding: '0.6rem 1.4rem', borderRadius: '10px',
                  textDecoration: 'none',
                  boxShadow: '0 4px 16px rgba(200,96,42,0.4)',
                  transition: 'all 0.2s',
                }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(200,96,42,0.5)'; }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 16px rgba(200,96,42,0.4)'; }}
              >
                <PlusCircle size={16} />
                Add New Vehicle
              </Link>
              <div style={{
                display: 'inline-flex', alignItems: 'center', gap: '6px',
                background: 'rgba(200,96,42,0.1)', color: '#8a3a10',
                border: '1px solid rgba(200,96,42,0.25)',
                fontSize: '0.82rem', fontWeight: 600,
                padding: '0.6rem 1.1rem', borderRadius: '10px',
              }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#22c55e', display: 'inline-block' }} />
                Admin Mode Active
              </div>
            </div>
          )}
        </div>
      </div>


      {/* ── Stats ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.25rem', marginBottom: '2.5rem' }}>
        {[
          { label: 'Total Units', value: loading ? '—' : totalVehiclesCount.toLocaleString(), color: '#c8602a', icon: <Car size={18} /> },
          { label: 'Fleet Value', value: loading ? '—' : `$${totalValue.toLocaleString(undefined, { maximumFractionDigits: 0 })}`, color: '#166534', icon: <TrendingUp size={18} /> },
          { label: 'Categories', value: loading ? '—' : uniqueCategories, color: '#92400e', icon: <Layers size={18} /> },
        ].map(({ label, value, color, icon }, i) => (
          <div key={label} className={`stat-card fade-up-${i + 1}`}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', marginBottom: '0.6rem' }}>
              <span style={{ color }}>{icon}</span>
              <div className="stat-label">{label}</div>
            </div>
            <div className="stat-value" style={{ color }}>{value}</div>
          </div>
        ))}
      </div>

      <div className="section-line" />

      <SearchBar onSearch={fetchVehicles} />

      {loading ? (
        <LoadingSpinner />
      ) : vehicles.length === 0 ? (
        <div className="glass-panel fade-up" style={{ borderRadius: '20px', padding: '5rem 2rem', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
          <div style={{
            width: '80px', height: '80px', borderRadius: '50%',
            background: 'rgba(200,96,42,0.08)', border: '1px solid rgba(200,96,42,0.2)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem',
          }}>
            <PackageOpen size={36} color="#c8602a" />
          </div>
          <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.6rem', fontWeight: 700, color: '#1a1612', marginBottom: '0.6rem' }}>No Vehicles Found</h3>
          <p style={{ color: '#8c7e6e', maxWidth: '340px' }}>Try adjusting your search filters or add a new vehicle to the inventory.</p>
        </div>
      ) : (
        <>
          {/* Grid label */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1.5rem' }}>
            <Tag size={14} color="#c8602a" />
            <span style={{ fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#8c7e6e' }}>
              {vehicles.length} vehicle{vehicles.length !== 1 ? 's' : ''} available
            </span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '2rem' }}>
            {paginatedVehicles.map((vehicle, i) => (
              <div
                key={vehicle.id}
                style={{ animation: `fadeUp 0.45s ${i * 0.07}s ease both` }}
              >
                <VehicalCard
                  vehicle={vehicle}
                  onPurchase={() => handlePurchaseClick(vehicle)}
                  onDelete={() => handleDeleteClick(vehicle)}
                  onRestock={handleRestock}
                  onViewDetail={handleViewDetail}
                />
              </div>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '1rem', marginTop: '3.5rem' }}>
              <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1} className="btn-secondary" style={{ padding: '0.6rem 1.5rem' }}>← Previous</button>
              <div style={{ display: 'flex', gap: '0.4rem' }}>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                  <button
                    key={p}
                    onClick={() => setCurrentPage(p)}
                    style={{
                      width: '36px', height: '36px', borderRadius: '8px', border: 'none',
                      cursor: 'pointer', fontWeight: 700, fontSize: '0.85rem', transition: 'all 0.2s',
                      background: p === currentPage ? 'linear-gradient(135deg, #c8602a, #a04820)' : 'rgba(255,253,248,0.9)',
                      color: p === currentPage ? '#fff' : '#5a4f42',
                      boxShadow: p === currentPage ? '0 4px 14px rgba(200,96,42,0.35)' : '0 1px 4px rgba(0,0,0,0.06)',
                      border: p === currentPage ? 'none' : '1.5px solid rgba(139,120,96,0.2)',
                    }}
                  >{p}</button>
                ))}
              </div>
              <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} className="btn-secondary" style={{ padding: '0.6rem 1.5rem' }}>Next →</button>
            </div>
          )}
        </>
      )}

      {/* Car Detail Modal */}
      {selectedCar && (
        <CarDetailModal
          vehicle={selectedCar}
          onClose={handleCloseDetail}
          onPurchase={() => handlePurchaseClick(selectedCar)}
        />
      )}

      {/* Confirm Dialog */}
      <ConfirmDialog
        isOpen={dialog.isOpen}
        title={dialog.title}
        message={dialog.message}
        confirmText={dialog.confirmText}
        isDestructive={dialog.isDestructive}
        isProcessing={dialog.isProcessing}
        onConfirm={dialog.action}
        onCancel={() => setDialog(prev => ({ ...prev, isOpen: false }))}
      />
    </div>
  );
}