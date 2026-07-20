import React, { useState } from 'react';
import { motion } from 'motion/react';
import { CalendarCheck, MapPin, Search, Star } from 'lucide-react';

const mechanics = [
  { name: 'Alex Rodriguez', specialty: 'Engine & Transmission', experience: '12 years', rating: 4.9, reviews: 312, location: '0.8 mi away', available: true, image: '/images/slide1.jpg' },
  { name: 'Sarah Chen', specialty: 'Electrical Systems', experience: '9 years', rating: 4.8, reviews: 245, location: '1.2 mi away', available: true, image: '/images/slide2.jpg' },
  { name: 'Marcus Johnson', specialty: 'Brakes & Suspension', experience: '15 years', rating: 4.7, reviews: 189, location: '2.1 mi away', available: false, image: '/images/slide4.jpg' },
  { name: 'Emily Davis', specialty: 'General Repairs', experience: '11 years', rating: 4.9, reviews: 421, location: '1.5 mi away', available: true, image: '/images/slide3.jpg' },
];

export default function MechanicFinder({ onBooking }: { onBooking: () => void }) {
  const [location, setLocation] = useState('');
  const [searched, setSearched] = useState(false);
  const [booking, setBooking] = useState('');
  const [selectedMechanic, setSelectedMechanic] = useState<(typeof mechanics)[number] | null>(null);

  return (
    <section id="mechanic" className="mechanic-section">
      <div className="section-container">
        <motion.div
          className="section-header"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <span className="section-label">Mechanics</span>
          <h2>Trusted help near you</h2>
          <p>Search your area and compare specialists by experience, rating, availability, and distance.</p>
        </motion.div>

        <div className="mechanic-search">
          <Search size={20} />
          <input
            type="text"
            placeholder="Enter your location or zip code"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            aria-label="Location or zip code"
          />
          <button type="button" onClick={() => setSearched(true)}>Search</button>
        </div>

        {searched && (
          <p className="search-status">
            Showing trusted mechanics {location ? `near ${location}` : 'near your area'}.
          </p>
        )}

        <div className="mechanic-grid">
          {mechanics.map((mechanic, i) => (
            <motion.article
              key={mechanic.name}
              className="mechanic-card"
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08, duration: 0.45 }}
              whileHover={{ y: -5 }}
              onClick={() => setSelectedMechanic(mechanic)}
              role="button"
              tabIndex={0}
              onKeyDown={(event) => {
                if (event.key === 'Enter' || event.key === ' ') {
                  event.preventDefault();
                  setSelectedMechanic(mechanic);
                }
              }}
            >
              <img src={mechanic.image} alt={`${mechanic.name} mechanic profile`} />
              <div className="mechanic-card-body">
                <div className="mechanic-title-row">
                  <div>
                    <h3>{mechanic.name}</h3>
                    <p>{mechanic.specialty}</p>
                  </div>
                  <span className={mechanic.available ? 'available' : 'busy'}>
                    {mechanic.available ? 'Available' : 'Busy'}
                  </span>
                </div>

                <div className="mechanic-meta">
                  <span><CalendarCheck size={16} /> {mechanic.experience}</span>
                  <span><MapPin size={16} /> {mechanic.location}</span>
                </div>

                <div className="mechanic-rating">
                  <Star size={17} fill="var(--primary)" color="var(--primary)" />
                  <strong>{mechanic.rating}</strong>
                  <span>({mechanic.reviews} reviews)</span>
                </div>

                <button
                  type="button"
                  disabled={!mechanic.available}
                  onClick={(event) => {
                    event.stopPropagation();
                    onBooking();
                  }}
                >
                  {mechanic.available ? 'Book Mechanic' : 'Unavailable'}
                </button>
              </div>
            </motion.article>
          ))}
        </div>

        {booking && <p className="booking-status" role="status">{booking}</p>}

        {selectedMechanic && (
          <div className="mechanic-detail-panel" role="dialog" aria-modal="true" aria-labelledby="mechanic-detail-title">
            <div>
              <button type="button" className="mechanic-detail-close" onClick={() => setSelectedMechanic(null)} aria-label="Close mechanic details">
                Close
              </button>
              <img src={selectedMechanic.image} alt={`${selectedMechanic.name} mechanic profile`} />
              <div className="mechanic-detail-content">
                <h3 id="mechanic-detail-title">{selectedMechanic.name}</h3>
                <p>{selectedMechanic.specialty}</p>
                <ul>
                  <li>{selectedMechanic.experience} experience</li>
                  <li>{selectedMechanic.rating} rating from {selectedMechanic.reviews} reviews</li>
                  <li>{selectedMechanic.location}</li>
                  <li>{selectedMechanic.available ? 'Available for new bookings' : 'Currently busy'}</li>
                </ul>
                <div className="mechanic-detail-actions">
                  <button
                    type="button"
                    disabled={!selectedMechanic.available}
                    onClick={() => onBooking()}
                  >
                    Book Mechanic
                  </button>
                  <a href={`mailto:help@farcarfix.com?subject=Mechanic%20request%20for%20${encodeURIComponent(selectedMechanic.name)}`}>
                    Contact
                  </a>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
