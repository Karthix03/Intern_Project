import React, { createContext, useContext, useState, useMemo } from 'react';
import type { Product } from '../types';

interface ProductContextType {
  products: Product[];
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
  priceRange: [number, number];
  setPriceRange: (range: [number, number]) => void;
  sortBy: string;
  setSortBy: (sort: string) => void;
  filteredProducts: Product[];
}

const mockProducts: Product[] = [
  {
    id: 'aether-headphones-walnut',
    name: 'Aether Walnut Open-Back',
    tagline: 'Hand-assembled reference headphones with warm acoustic resonance.',
    description: 'The Aether Walnut Reference represents the pinnacle of open-back headphone design. Handcrafted with sustainably sourced North American Walnut wood earcups and dynamic 50mm neodymium magnet drivers, it delivers an expansive soundstage with breathtaking organic warmth and absolute low-frequency authority.',
    price: 799,
    image: '/images/headphones.png',
    category: 'headphones',
    rating: 4.9,
    reviewsCount: 42,
    stock: 8,
    featured: true,
    features: [
      'Genuine North American Walnut wood earcups',
      'Custom-developed 50mm dynamic drivers',
      'Ultra-soft sheepskin leather headband and pads',
      'Detachable silver-plated copper balance cables',
      'Individually measured and matched drivers'
    ],
    variants: [
      { name: 'Wood Finish', values: ['Walnut', 'Cherrywood', 'Obsidian Ebony'] },
      { name: 'Cable Connector', values: ['4.4mm Balanced', '6.35mm Unbalanced', 'XLR Balanced'] }
    ],
    specs: {
      'Transducer Type': 'Dynamic, Open-back',
      'Driver Size': '50 mm',
      'Frequency Response': '5 Hz - 45 kHz',
      'Impedance': '32 Ohms',
      'Sensitivity': '101 dB / 1mW',
      'Weight': '380g'
    },
    reviews: [
      { id: '1', author: 'Markus K.', rating: 5, date: '2026-05-12', comment: 'Absolutely mesmerizing soundstage. The separation of acoustic instruments is the best I have ever heard under $2,000.' },
      { id: '2', author: 'Clara S.', rating: 5, date: '2026-06-01', comment: 'Stunning design and build quality. The wood grains are absolutely gorgeous. They are also incredibly comfortable for long listening sessions.' }
    ]
  },
  {
    id: 'aether-amplifier-tubes',
    name: 'Aurora Vacuum-Tube Amp',
    tagline: 'Pure Class-A amplification with glowing copper warmth.',
    description: 'The Aurora Vacuum-Tube Amplifier brings the legendary vintage valve sound to modern digital setups. Housed in a custom brushed aluminum chassis with beautiful oil-finished walnut side panels, this Class-A amplifier runs matched EL34 tubes to add luxurious warmth, high-frequency air, and deep natural spatial representation to your audio output.',
    price: 1249,
    image: '/images/amplifier.png',
    category: 'amplifiers',
    rating: 4.8,
    reviewsCount: 29,
    stock: 5,
    featured: true,
    features: [
      'Class-A single-ended triode circuit design',
      'Four matched vintage-reissue EL34 tubes',
      'Solid-core toroidal transformer power supply',
      'Analog glowing VU meters with warm amber light',
      'Hand-wired point-to-point construction'
    ],
    variants: [
      { name: 'Chassis Accents', values: ['Polished Copper', 'Brushed Aluminum', 'Deep Gold'] },
      { name: 'Tube Config', values: ['Stock EL34 Reissue', 'Premium Mullard NOS (+ $200)'] }
    ],
    specs: {
      'Amplifier Class': 'Class-A Triode',
      'Power Output': '12W + 12W (8 Ohms)',
      'THD + N': '< 0.1% at 1W',
      'Signal-to-Noise Ratio': '92 dB',
      'Inputs': '2x RCA, 1x XLR Balanced',
      'Outputs': '4 Ohm / 8 Ohm speaker terminals, 6.35mm headphone out'
    },
    reviews: [
      { id: '3', author: 'Arthur L.', rating: 5, date: '2026-04-18', comment: 'This amp makes digital files sound alive. It warms up clinical headphones beautifully. Watching the tubes glow in the dark is therapeutic.' }
    ]
  },
  {
    id: 'aether-keyboard-obsidian',
    name: 'Obsidian Custom Keyboard',
    tagline: 'Tactile perfection housed in pure walnut and brass.',
    description: 'The Obsidian Mechanical Keyboard is a bespoke tool built for those who value feel and acoustics above all. Engineered with an isolated gasket mounting structure, solid brass plate, and hand-finished walnut hardwood body, every keypress produces a deep, clean, and satisfying acoustic signature ("thock") that is completely hollow-free.',
    price: 449,
    image: '/images/keyboard.png',
    category: 'keyboards',
    rating: 4.9,
    reviewsCount: 56,
    stock: 12,
    featured: true,
    features: [
      'Solid walnut wood double-gasket housing',
      'CNC milled solid brass internal plate',
      'Lubed Durock V2 screw-in stabilizers',
      'Hot-swappable PCB supporting 3-pin and 5-pin switches',
      'Acoustic silicone dampeners and poron plate foam'
    ],
    variants: [
      { name: 'Switch Type', values: ['Linear (Gateron Black Ink V2)', 'Tactile (Aether Copper Custom)', 'Clicky (Kailh Box Jade)'] },
      { name: 'Keycap Legend', values: ['Sublimated Dark Gray', 'Brass Engraved (+ $100)', 'Minimalist Blank'] }
    ],
    specs: {
      'Form Factor': '75% Layout',
      'Mounting Style': 'Gasket Mount',
      'Plate Material': 'Solid Brass',
      'Connection': 'USB Type-C (Detachable braided aviator cable)',
      'Dimensions': '320mm x 135mm x 32mm',
      'Weight': '1.85 kg'
    },
    reviews: [
      { id: '4', author: 'Elena R.', rating: 5, date: '2026-05-24', comment: 'The acoustics are unbelievable. It feels like writing on an ancient, luxury instrument. A gorgeous centerpiece for any desk.' }
    ]
  },
  {
    id: 'aether-turntable-orbit',
    name: 'Orbit Precision Turntable',
    tagline: 'Belt-driven analog fidelity with a solid walnut foundation.',
    description: 'The Orbit Precision Turntable combines audiophile mechanics with mid-century organic design. Engineered with a heavy, low-resonance acrylic platter, belt-drive motor, carbon fiber tonearm, and built-in switchable phono preamp, it extracts every ounce of musical detail from your vinyl grooves while eliminating motor rumble and micro-vibrations.',
    price: 899,
    image: '/images/turntable.png',
    category: 'turntables',
    rating: 4.7,
    reviewsCount: 18,
    stock: 4,
    featured: true,
    features: [
      'Heavy 20mm frosted acrylic platter',
      'Low-noise decoupled DC motor belt drive',
      'Custom 9-inch high-stiffness carbon fiber tonearm',
      'Pre-installed Ortofon 2M Blue cartridge',
      'Real Walnut wood veneered MDF plinth'
    ],
    variants: [
      { name: 'Phono Preamp', values: ['Built-in Preamp', 'True Bypass (Requires Ext. Preamp)'] },
      { name: 'Cartridge Upgrade', values: ['Ortofon 2M Blue (Standard)', 'Audio-Technica VM540ML (+ $120)'] }
    ],
    specs: {
      'Drive Method': 'Belt Drive',
      'Motor': 'DC Motor, Electronic Speed Control',
      'Speeds': '33-1/3 RPM, 45 RPM',
      'Wow and Flutter': '0.08%',
      'Signal-to-Noise Ratio': '70 dB',
      'Phono Stage Gain': '40 dB'
    },
    reviews: [
      { id: '5', author: 'David H.', rating: 4, date: '2026-06-11', comment: 'Extremely silent background noise. The cartridge tracking is flawless. Looks gorgeous spinning in the light.' }
    ]
  },
  {
    id: 'aether-headphones-classic',
    name: 'Aether Lite Ashwood',
    tagline: 'Lightweight open-back experience with crisp transient response.',
    description: 'The Aether Lite Ashwood offers the same exceptional acoustic tuning of the reference line in a lighter, highly-breathable ashwood chassis. Perfect for direct listening from phones, laptops, or portable DACs without needing a separate high-output desktop amplifier.',
    price: 499,
    image: '/images/headphones.png',
    category: 'headphones',
    rating: 4.6,
    reviewsCount: 31,
    stock: 15,
    features: [
      'Premium ashwood resonance chamber',
      'High-sensitivity 40mm dynamic drivers',
      'Comfortable fabric ear cushions',
      'Single-sided low-microphonic cable'
    ],
    variants: [
      { name: 'Finish', values: ['Natural Ash', 'Carbon-stained Black'] },
      { name: 'Cable Type', values: ['3.5mm Jack', 'USB-C Integrated DAC'] }
    ],
    specs: {
      'Transducer Type': 'Dynamic, Open-back',
      'Driver Size': '40 mm',
      'Frequency Response': '12 Hz - 38 kHz',
      'Impedance': '24 Ohms',
      'Weight': '290g'
    },
    reviews: []
  },
  {
    id: 'aether-amplifier-hybrid',
    name: 'Vesper Hybrid Amplifier',
    tagline: 'Vacuum-tube preamplifier stage meets muscular solid-state power.',
    description: 'The Vesper Hybrid Amplifier delivers the magical musical qualities of vacuum tubes alongside the tight grip, deep bass extension, and high power output of solid-state electronics. Uses 12AX7 tubes for the preamp stage and a clean Class-D block for amplification.',
    price: 649,
    image: '/images/amplifier.png',
    category: 'amplifiers',
    rating: 4.7,
    reviewsCount: 14,
    stock: 7,
    features: [
      'Dual 12AX7 vacuum tubes in preamp stage',
      '100W per channel Class-D power amplifier',
      'Bluetooth 5.0 input with aptX HD support',
      'Dedicated subwoofer line output'
    ],
    variants: [
      { name: 'Chassis Finish', values: ['Anodized Gray', 'Matte Black'] }
    ],
    specs: {
      'Amplifier Class': 'Hybrid (Tube Preamp + Class-D Power)',
      'Power Output': '100W + 100W (4 Ohms)',
      'Bluetooth Version': '5.0 with aptX HD',
      'Digital Inputs': 'Optical, Coaxial, USB-DAC'
    },
    reviews: []
  }
];

const ProductContext = createContext<ProductContextType | undefined>(undefined);

export const ProductProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1500]);
  const [sortBy, setSortBy] = useState('featured');

  const filteredProducts = useMemo(() => {
    return mockProducts
      .filter((product) => {
        const matchesSearch =
          product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          product.tagline.toLowerCase().includes(searchQuery.toLowerCase()) ||
          product.category.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
        const matchesPrice = product.price >= priceRange[0] && product.price <= priceRange[1];
        return matchesSearch && matchesCategory && matchesPrice;
      })
      .sort((a, b) => {
        if (sortBy === 'price-low') return a.price - b.price;
        if (sortBy === 'price-high') return b.price - a.price;
        if (sortBy === 'rating') return b.rating - a.rating;
        // Default to featured/popularity
        return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
      });
  }, [searchQuery, selectedCategory, priceRange, sortBy]);

  return (
    <ProductContext.Provider
      value={{
        products: mockProducts,
        searchQuery,
        setSearchQuery,
        selectedCategory,
        setSelectedCategory,
        priceRange,
        setPriceRange,
        sortBy,
        setSortBy,
        filteredProducts,
      }}
    >
      {children}
    </ProductContext.Provider>
  );
};

export const useProducts = () => {
  const context = useContext(ProductContext);
  if (!context) {
    throw new Error('useProducts must be used within a ProductProvider');
  }
  return context;
};
