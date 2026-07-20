export const carBrands = [
  'Toyota', 'Honda', 'Ford', 'Chevrolet', 'BMW', 'Mercedes-Benz',
  'Volkswagen', 'Audi', 'Nissan', 'Hyundai', 'Kia', 'Mazda',
  'Subaru', 'Lexus', 'Tesla', 'Jeep', 'Ram', 'GMC', 'Dodge',
];

export const carModels: Record<string, string[]> = {
  Toyota: ['Camry', 'Corolla', 'RAV4', 'Highlander', 'Prius', 'Tacoma', 'Sienna', '4Runner'],
  Honda: ['Civic', 'Accord', 'CR-V', 'Pilot', 'Odyssey', 'Ridgeline'],
  Ford: ['F-150', 'Mustang', 'Escape', 'Explorer', 'Fusion', 'Ranger'],
  Chevrolet: ['Silverado', 'Cruze', 'Equinox', 'Traverse', 'Malibu', 'Impala'],
  BMW: ['3 Series', '5 Series', '7 Series', 'X3', 'X5', 'X7', 'M440i'],
  'Mercedes-Benz': ['C-Class', 'E-Class', 'S-Class', 'GLC', 'GLE', 'GLS'],
};

export const years = Array.from({ length: 30 }, (_, i) => String(2024 - i));

export const issues = [
  'Engine noise', 'Brake issues', 'Check engine light', 'Vibration',
  'Overheating', 'Not starting', 'Battery dead', 'Transmission problem',
  'Air conditioning not working', 'Suspension noise', 'Tire issues',
  'Electrical problem', 'Oil leak', 'Coolant leak', 'Strange smell',
];

export const heroSlides = [
  '/images/slide1.jpg',
  '/images/slide2.jpg',
  '/images/slide3.jpg',
  '/images/slide4.jpg',
];
