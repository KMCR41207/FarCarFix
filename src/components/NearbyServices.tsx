import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';

type ServiceType = 'all' | 'mechanic' | 'fuel' | 'towing' | 'parts' | 'tyre' | 'battery';
type FilterType = 'all' | 'open' | 'rated' | 'nearest' | 'certified';

interface ServiceLocation {
  id: number;
  name: string;
  type: ServiceType;
  typeLabel: string;
  rating: number;
  reviews: number;
  distance: string;
  distanceNum: number;
  travelTime: string;
  address: string;
  phone: string;
  hours: string;
  isOpen: boolean;
  isCertified: boolean;
  lat: number;
  lng: number;
  emoji: string;
}

// Mock data – realistic Indian service locations
const MOCK_SERVICES: ServiceLocation[] = [
  { id: 1, name: 'Sharma Auto Works', type: 'mechanic', typeLabel: 'Mechanic', rating: 4.8, reviews: 312, distance: '0.8 km', distanceNum: 0.8, travelTime: '3 min', address: '12, MG Road, Near Bus Stand', phone: '+91 98765 43210', hours: '8 AM – 9 PM', isOpen: true, isCertified: true, lat: 28.6139, lng: 77.209, emoji: '🔧' },
  { id: 2, name: 'Indian Oil – Sector 18', type: 'fuel', typeLabel: 'Fuel Station', rating: 4.3, reviews: 890, distance: '1.1 km', distanceNum: 1.1, travelTime: '5 min', address: 'Sector 18, Noida', phone: '+91 11 4567 8901', hours: '24 Hours', isOpen: true, isCertified: false, lat: 28.615, lng: 77.211, emoji: '⛽' },
  { id: 3, name: 'FastTow Roadside', type: 'towing', typeLabel: 'Towing Service', rating: 4.6, reviews: 145, distance: '1.4 km', distanceNum: 1.4, travelTime: '6 min', address: '45, Ring Road, Delhi', phone: '+91 90012 34567', hours: '24 Hours', isOpen: true, isCertified: true, lat: 28.612, lng: 77.207, emoji: '🚛' },
  { id: 4, name: 'AutoZone Parts Hub', type: 'parts', typeLabel: 'Auto Parts', rating: 4.5, reviews: 223, distance: '1.8 km', distanceNum: 1.8, travelTime: '8 min', address: 'Shop 7, Kashmere Gate', phone: '+91 88990 11223', hours: '9 AM – 8 PM', isOpen: true, isCertified: false, lat: 28.617, lng: 77.213, emoji: '🔩' },
  { id: 5, name: 'SpeedFit Tyre Centre', type: 'tyre', typeLabel: 'Tyre Repair', rating: 4.7, reviews: 198, distance: '2.1 km', distanceNum: 2.1, travelTime: '9 min', address: '22, NH-48, Gurugram', phone: '+91 79876 54321', hours: '7 AM – 10 PM', isOpen: true, isCertified: false, lat: 28.609, lng: 77.203, emoji: '🔄' },
  { id: 6, name: 'RapidCharge Battery', type: 'battery', typeLabel: 'Battery Service', rating: 4.4, reviews: 87, distance: '2.5 km', distanceNum: 2.5, travelTime: '11 min', address: '5, Lajpat Nagar', phone: '+91 70011 22334', hours: '8 AM – 8 PM', isOpen: false, isCertified: false, lat: 28.606, lng: 77.2, emoji: '🔋' },
  { id: 7, name: 'PremiumCare Auto', type: 'mechanic', typeLabel: 'Mechanic', rating: 4.9, reviews: 421, distance: '3.0 km', distanceNum: 3.0, travelTime: '13 min', address: '88, Connaught Place', phone: '+91 98001 77665', hours: '9 AM – 7 PM', isOpen: true, isCertified: true, lat: 28.6315, lng: 77.2167, emoji: '🔧' },
  { id: 8, name: 'HP Petrol Pump', type: 'fuel', typeLabel: 'Fuel Station', rating: 4.1, reviews: 540, distance: '0.5 km', distanceNum: 0.5, travelTime: '2 min', address: 'Near Metro Gate 3', phone: '+91 11 9988 7766', hours: '24 Hours', isOpen: true, isCertified: false, lat: 28.6135, lng: 77.2088, emoji: '⛽' },
];

type SortedService = ServiceLocation;

function applyFilter(services: ServiceLocation[], type: ServiceType, filter: FilterType): SortedService[] {
  let result = type === 'all' ? services : services.filter(s => s.type === type);
  if (filter === 'open') result = result.filter(s => s.isOpen);
  if (filter === 'certified') result = result.filter(s => s.isCertified);
  if (filter === 'rated') return [...result].sort((a, b) => b.rating - a.rating);
  if (filter === 'nearest') return [...result].sort((a, b) => a.distanceNum - b.distanceNum);
  return result;
}

const TYPE_TABS: { key: ServiceType; label: string; emoji: string }[] = [
  { key: 'all', label: 'All', emoji: '📍' },
  { key: 'mechanic', label: 'Mechanic', emoji: '🔧' },
  { key: 'fuel', label: 'Fuel', emoji: '⛽' },
  { key: 'towing', label: 'Towing', emoji: '🚛' },
  { key: 'parts', label: 'Parts', emoji: '🔩' },
  { key: 'tyre', label: 'Tyre', emoji: '🔄' },
  { key: 'battery', label: 'Battery', emoji: '🔋' },
];

const FILTER_TABS: { key: FilterType; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'open', label: 'Open Now' },
  { key: 'rated', label: 'Highest Rated' },
  { key: 'nearest', label: 'Nearest' },
  { key: 'certified', label: 'Certified' },
];

function StarRating({ rating }: { rating: number }) {
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 3 }}>
      {[1, 2, 3, 4, 5].map(i => (
        <svg key={i} width="12" height="12" viewBox="0 0 20 20" fill={i <= Math.round(rating) ? '#f59e0b' : '#374151'}>
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
      <span style={{ color: '#fff', fontWeight: 600, fontSize: '0.8rem', marginLeft: 2 }}>{rating}</span>
    </span>
  );
}

export default function NearbyServices() {
  const [activeType, setActiveType] = useState<ServiceType>('all');
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');
  const [bookedId, setBookedId] = useState<number | null>(null);
  const [gpsStatus, setGpsStatus] = useState<'idle' | 'loading' | 'found' | 'denied'>('idle');
  const [userLocation, setUserLocation] = useState<string>('');
  const [selectedService, setSelectedService] = useState<ServiceLocation | null>(null);
  const mapRef = useRef<HTMLDivElement>(null);

  const displayed = applyFilter(MOCK_SERVICES, activeType, activeFilter);

  const handleLocateMe = () => {
    setGpsStatus('loading');
    if (!navigator.geolocation) {
      setGpsStatus('denied');
      setUserLocation('New Delhi, India');
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setGpsStatus('found');
        setUserLocation(`${pos.coords.latitude.toFixed(4)}, ${pos.coords.longitude.toFixed(4)}`);
      },
      () => {
        setGpsStatus('denied');
        setUserLocation('New Delhi, India (approximate)');
      },
      { timeout: 6000 }
    );
  };

  function openGoogleMaps(service: ServiceLocation) {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${service.lat},${service.lng}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  }

  function openGoogleMapsEmbed() {
    // Opens full Google Maps with all nearby services centered on Delhi
    const url = 'https://www.google.com/maps/search/mechanics+near+me/@28.6139,77.209,14z';
    window.open(url, '_blank', 'noopener,noreferrer');
  }

  return (
    <motion.div
      className="ns-card"
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay: 0.1 }}
    >
      {/* Header */}
      <div className="ns-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span className="rce-icon-box">📍</span>
          <div>
            <h3 style={{ margin: 0, color: '#fff', fontSize: '1.125rem' }}>Nearby Services</h3>
            <p style={{ margin: 0, color: '#94a3b8', fontSize: '0.8rem' }}>Fuel stations, mechanics & towing</p>
          </div>
        </div>
        <button
          type="button"
          className="ns-locate-btn"
          onClick={handleLocateMe}
          disabled={gpsStatus === 'loading'}
        >
          {gpsStatus === 'loading' ? (
            <span className="ns-spinner" />
          ) : (
            <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="3" /><path d="M12 2v2m0 16v2M2 12h2m16 0h2" /><path d="M12 8a4 4 0 100 8 4 4 0 000-8z" />
            </svg>
          )}
          {gpsStatus === 'found' ? 'Located' : gpsStatus === 'loading' ? 'Locating…' : 'Locate Me'}
        </button>
      </div>

      {/* GPS status */}
      {gpsStatus !== 'idle' && (
        <div className="ns-gps-status" style={{ color: gpsStatus === 'found' ? '#22c55e' : '#f59e0b' }}>
          {gpsStatus === 'found' ? '✓' : gpsStatus === 'loading' ? '⏳' : '⚠️'}
          &nbsp;
          {gpsStatus === 'found' ? `Location detected: ${userLocation}` :
            gpsStatus === 'loading' ? 'Detecting your location…' :
              `Using approximate location: ${userLocation}`}
        </div>
      )}

      {/* Map placeholder */}
      <div
        ref={mapRef}
        className="ns-map-placeholder"
        role="button"
        tabIndex={0}
        aria-label="Open Google Maps for nearby services"
        onClick={openGoogleMapsEmbed}
        onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') openGoogleMapsEmbed(); }}
      >
        {/* Stylised static map visual */}
        <div className="ns-map-grid" aria-hidden="true">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="ns-map-road-h" style={{ top: `${15 + i * 14}%` }} />
          ))}
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="ns-map-road-v" style={{ left: `${8 + i * 12}%` }} />
          ))}
        </div>
        {/* Animated pins */}
        {MOCK_SERVICES.slice(0, 6).map((s, i) => (
          <div
            key={s.id}
            className="ns-map-pin"
            style={{
              top: `${20 + (i % 3) * 25}%`,
              left: `${15 + (i % 4) * 22}%`,
              animationDelay: `${i * 0.3}s`,
            }}
            title={s.name}
          >
            <span style={{ fontSize: '1.2rem' }}>{s.emoji}</span>
          </div>
        ))}
        {/* Pulsing user location */}
        <div className="ns-user-dot">
          <div className="ns-user-pulse" />
          <div className="ns-user-core" />
        </div>
        <div className="ns-map-overlay">
          <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 16l4.553-2.276A1 1 0 0021 19.382V8.618a1 1 0 00-1.447-.894L15 10m0 13V10M9 7l6-3" />
          </svg>
          <span>Open in Google Maps →</span>
        </div>
      </div>

      {/* Type filter chips */}
      <div className="ns-type-scroll">
        {TYPE_TABS.map(t => (
          <button
            key={t.key}
            type="button"
            className={`ns-type-chip ${activeType === t.key ? 'active' : ''}`}
            onClick={() => setActiveType(t.key)}
          >
            {t.emoji} {t.label}
          </button>
        ))}
      </div>

      {/* Sort / filter pills */}
      <div className="ns-filter-row">
        {FILTER_TABS.map(f => (
          <button
            key={f.key}
            type="button"
            className={`ns-filter-pill ${activeFilter === f.key ? 'active' : ''}`}
            onClick={() => setActiveFilter(f.key)}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Service cards list */}
      <div className="ns-list">
        <AnimatePresence mode="popLayout">
          {displayed.length === 0 && (
            <motion.p
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              style={{ color: '#9ca3af', textAlign: 'center', padding: '2rem' }}
            >
              No services match the current filter.
            </motion.p>
          )}
          {displayed.map((s, i) => (
            <motion.div
              key={s.id}
              className="ns-service-card"
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 12 }}
              transition={{ delay: i * 0.04 }}
              onClick={() => setSelectedService(s)}
              role="button"
              tabIndex={0}
              onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setSelectedService(s); } }}
              aria-label={`View details for ${s.name}`}
            >
              <div className="ns-service-emoji">{s.emoji}</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
                  <span style={{ color: '#fff', fontWeight: 700, fontSize: '0.9rem' }}>{s.name}</span>
                  {s.isCertified && (
                    <span className="ns-certified-badge">✓ Certified</span>
                  )}
                  <span
                    className="ns-open-badge"
                    style={{ background: s.isOpen ? 'rgba(34,197,94,0.15)' : 'rgba(239,68,68,0.12)', color: s.isOpen ? '#22c55e' : '#f87171' }}
                  >
                    {s.isOpen ? '● Open' : '● Closed'}
                  </span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 3, flexWrap: 'wrap' }}>
                  <StarRating rating={s.rating} />
                  <span style={{ color: '#6b7280', fontSize: '0.75rem' }}>({s.reviews})</span>
                  <span style={{ color: '#6b7280', fontSize: '0.75rem' }}>•</span>
                  <span style={{ color: '#9ca3af', fontSize: '0.75rem' }}>{s.distance}</span>
                  <span style={{ color: '#6b7280', fontSize: '0.75rem' }}>•</span>
                  <span style={{ color: '#9ca3af', fontSize: '0.75rem' }}>{s.travelTime} away</span>
                </div>
                <p style={{ margin: '3px 0 0', color: '#6b7280', fontSize: '0.75rem', overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>
                  {s.address}
                </p>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6, alignItems: 'flex-end', flexShrink: 0 }}>
                <button
                  type="button"
                  className="ns-navigate-btn"
                  onClick={e => { e.stopPropagation(); openGoogleMaps(s); }}
                  aria-label={`Navigate to ${s.name}`}
                >
                  <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
                    <path d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 16l4.553-2.276A1 1 0 0021 19.382V8.618a1 1 0 00-1.447-.894L15 10m0 13V10M9 7l6-3" />
                  </svg>
                  Go
                </button>
                {s.type === 'mechanic' && s.isOpen && (
                  <button
                    type="button"
                    className={`ns-book-btn ${bookedId === s.id ? 'booked' : ''}`}
                    onClick={e => { e.stopPropagation(); setBookedId(s.id); }}
                    aria-label={`Book ${s.name}`}
                  >
                    {bookedId === s.id ? '✓ Booked' : 'Book'}
                  </button>
                )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Booking confirmation */}
      {bookedId !== null && (
        <motion.div
          className="ns-booking-confirm"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <span style={{ fontSize: '1.25rem' }}>✅</span>
          <p style={{ margin: 0, fontSize: '0.875rem', color: '#e5e7eb' }}>
            <strong style={{ color: '#22c55e' }}>Booking request sent</strong> for{' '}
            {MOCK_SERVICES.find(s => s.id === bookedId)?.name}. We'll confirm availability shortly.
          </p>
        </motion.div>
      )}

      {/* Service Detail Modal */}
      <AnimatePresence>
        {selectedService && (
          <motion.div
            className="ns-modal-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedService(null)}
            role="dialog"
            aria-modal="true"
            aria-label={`Details for ${selectedService.name}`}
          >
            <motion.div
              className="ns-modal"
              initial={{ scale: 0.94, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.94, y: 20 }}
              onClick={e => e.stopPropagation()}
            >
              <button
                type="button"
                className="ns-modal-close"
                onClick={() => setSelectedService(null)}
                aria-label="Close service detail"
              >
                ✕
              </button>

              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: '1.25rem' }}>
                <span style={{ fontSize: '2.5rem' }}>{selectedService.emoji}</span>
                <div>
                  <h3 style={{ margin: 0, color: '#fff', fontSize: '1.1rem' }}>{selectedService.name}</h3>
                  <p style={{ margin: '3px 0 0', color: '#9ca3af', fontSize: '0.8rem' }}>{selectedService.typeLabel}</p>
                </div>
              </div>

              <div className="ns-modal-detail-grid">
                {[
                  { icon: '⭐', label: 'Rating', value: `${selectedService.rating} (${selectedService.reviews} reviews)` },
                  { icon: '📏', label: 'Distance', value: `${selectedService.distance} • ${selectedService.travelTime} away` },
                  { icon: '📍', label: 'Address', value: selectedService.address },
                  { icon: '📞', label: 'Phone', value: selectedService.phone },
                  { icon: '🕐', label: 'Hours', value: selectedService.hours },
                  {
                    icon: '🟢', label: 'Status',
                    value: selectedService.isOpen ? 'Currently Open' : 'Currently Closed',
                    valueColor: selectedService.isOpen ? '#22c55e' : '#f87171',
                  },
                ].map((row, i) => (
                  <div key={i} className="ns-modal-row">
                    <span style={{ fontSize: '1rem' }}>{row.icon}</span>
                    <div>
                      <p style={{ margin: 0, color: '#9ca3af', fontSize: '0.7rem', fontWeight: 600, textTransform: 'uppercase' }}>{row.label}</p>
                      <p style={{ margin: '2px 0 0', color: (row as { valueColor?: string }).valueColor ?? '#e5e7eb', fontSize: '0.875rem', fontWeight: 500 }}>{row.value}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div style={{ display: 'flex', gap: 10, marginTop: '1.25rem', flexWrap: 'wrap' }}>
                <button
                  type="button"
                  className="ns-modal-nav-btn"
                  onClick={() => openGoogleMaps(selectedService)}
                >
                  🗺️ Get Directions
                </button>
                <a
                  href={`tel:${selectedService.phone}`}
                  className="ns-modal-call-btn"
                >
                  📞 Call Now
                </a>
                {selectedService.type === 'mechanic' && selectedService.isOpen && (
                  <button
                    type="button"
                    className={`ns-modal-book-btn ${bookedId === selectedService.id ? 'booked' : ''}`}
                    onClick={() => { setBookedId(selectedService.id); setSelectedService(null); }}
                  >
                    {bookedId === selectedService.id ? '✓ Booked' : '🗓️ Book Now'}
                  </button>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
