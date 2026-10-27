// ============================================================
// GigCoop — Comprehensive Mock Data & Client-Side Engine
// Ensures 100% interactive demo functionality across all views
// ============================================================

const MOCK_DATA = {
  users: [
    {
      id: 'usr_priya',
      name: 'Priya Sharma',
      email: 'priya@gmail.com',
      phone: '+91 98201 12345',
      role: 'customer',
      societyName: 'Green Meadows Residency',
      address: { street: 'Flat 402, Tower B, Green Meadows', city: 'Mumbai', state: 'Maharashtra', zipCode: '400050' },
      referralCode: 'PRIYA88',
      walletBalance: 250,
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&q=80'
    },
    {
      id: 'usr_rajesh',
      name: 'Rajesh Kumar',
      email: 'rajesh@gigcoop.org',
      phone: '+91 98111 22334',
      role: 'provider',
      isVerified: true,
      skills: ['Electrical Repair', 'Wiring', 'Inverter Installation', 'AC Servicing'],
      bio: 'Certified electrical technician with 12+ years experience. Worker-owner member of GigCoop Mumbai chapter.',
      experience: 12,
      averageRating: 4.9,
      totalReviews: 84,
      equityPoints: 480,
      equityPercentage: 3.2,
      societyName: 'Powai Cooperative Guild',
      address: { street: 'Plot 12, Powai', city: 'Mumbai', state: 'Maharashtra', zipCode: '400076' },
      referralCode: 'RAJESH_ELEC',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&q=80',
      walletBalance: 4200
    },
    {
      id: 'usr_admin',
      name: 'Coop Board Admin',
      email: 'admin@gigcoop.org',
      phone: '+91 98765 00000',
      role: 'admin',
      isVerified: true,
      societyName: 'GigCoop Central HQ',
      referralCode: 'ADMIN01',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&q=80',
      walletBalance: 125000
    }
  ],

  services: [
    {
      _id: 'svc_1',
      title: 'Full Home Deep Cleaning & Sanitization',
      category: 'cleaning',
      basePrice: 1299,
      duration: 240,
      averageRating: 4.95,
      totalBookings: 142,
      images: ['https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=800&q=80'],
      location: { city: 'Mumbai', state: 'Maharashtra' },
      provider: {
        _id: 'usr_sunita',
        name: 'Sunita Devi',
        avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=120&q=80',
        averageRating: 4.95,
        totalReviews: 126,
        isVerified: true,
        equityPoints: 650
      },
      description: 'Comprehensive 4-hour deep cleaning using hospital-grade eco friendly materials. Covers bathrooms, kitchen degreasing, floor scrubbing, balcony, and glass windows.',
      features: ['Eco-friendly cleaning agents', 'Equipment included', 'Full sanitization', 'Verified worker-owner team']
    },
    {
      _id: 'svc_2',
      title: 'Complete Home Electrical Check & Appliance Fix',
      category: 'electrical',
      basePrice: 499,
      duration: 90,
      averageRating: 4.9,
      totalBookings: 98,
      images: ['https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=800&q=80'],
      location: { city: 'Mumbai', state: 'Maharashtra' },
      provider: {
        _id: 'usr_rajesh',
        name: 'Rajesh Kumar',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&q=80',
        averageRating: 4.9,
        totalReviews: 84,
        isVerified: true,
        equityPoints: 480
      },
      description: 'Certified electrical inspection, circuit troubleshooting, switchboard repairs, and heavy appliance wiring checks with high precision tools.',
      features: ['Digital multimeter testing', 'Safety gear compliant', '30-day service warranty', 'Emergency instant support']
    },
    {
      _id: 'svc_3',
      title: 'Emergency Plumbing & Water Tank Repair',
      category: 'plumbing',
      basePrice: 599,
      duration: 60,
      averageRating: 4.8,
      totalBookings: 76,
      images: ['https://images.unsplash.com/photo-1585704032915-c3400ca199e7?w=800&q=80'],
      location: { city: 'Bangalore', state: 'Karnataka' },
      provider: {
        _id: 'usr_amit',
        name: 'Amit Patel',
        avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=120&q=80',
        averageRating: 4.8,
        totalReviews: 62,
        isVerified: true,
        equityPoints: 340
      },
      description: 'Rapid resolution of water leaks, blocked drains, flush repairs, mixer tap installations, and pressure pump diagnostics.',
      features: ['Same-day slot availability', 'Leakage detection tools', 'Spare parts assistance', 'Clean post-work cleanup']
    },
    {
      _id: 'svc_4',
      title: '1-on-1 STEM & Mathematics Coaching (Class 6-12)',
      category: 'tutoring',
      basePrice: 799,
      duration: 60,
      averageRating: 5.0,
      totalBookings: 53,
      images: ['https://images.unsplash.com/photo-1580894732444-8ecded7900cd?w=800&q=80'],
      location: { city: 'Bangalore', state: 'Karnataka' },
      provider: {
        _id: 'usr_deepa',
        name: 'Deepa Nair',
        avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=120&q=80',
        averageRating: 5.0,
        totalReviews: 48,
        isVerified: true,
        equityPoints: 420
      },
      description: 'Personalized interactive tutoring sessions focusing on problem-solving, board exam preparations, and competitive foundation skills.',
      features: ['Customized worksheet bank', 'Weekly progress reporting', 'Doubt solving on chat', 'Flexible timings']
    },
    {
      _id: 'svc_5',
      title: 'AC Servicing, Deep Jet Wash & Gas Check',
      category: 'electrical',
      basePrice: 699,
      duration: 75,
      averageRating: 4.92,
      totalBookings: 110,
      images: ['https://images.unsplash.com/photo-1621905252507-b35492cc74b4?w=800&q=80'],
      location: { city: 'Mumbai', state: 'Maharashtra' },
      provider: {
        _id: 'usr_rajesh',
        name: 'Rajesh Kumar',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&q=80',
        averageRating: 4.9,
        totalReviews: 84,
        isVerified: true,
        equityPoints: 480
      },
      description: 'High-pressure jet pump cleaning of indoor cooling coils, outdoor condenser unit wash, airflow optimization, and gas pressure measurement.',
      features: ['Anti-bacterial coil wash', 'Drain pipe flushing', 'Power consumption audit', 'Mess-free sheet cover']
    },
    {
      _id: 'svc_6',
      title: 'Herbal Pest Control & Termite Defense',
      category: 'pest_control',
      basePrice: 899,
      duration: 90,
      averageRating: 4.85,
      totalBookings: 64,
      images: ['https://images.unsplash.com/photo-1584634731339-252c581abfc5?w=800&q=80'],
      location: { city: 'Delhi', state: 'Delhi NCR' },
      provider: {
        _id: 'usr_manoj',
        name: 'Manoj Singh',
        avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=120&q=80',
        averageRating: 4.85,
        totalReviews: 44,
        isVerified: true,
        equityPoints: 260
      },
      description: '100% odorless and pet-safe herbal gel treatment for cockroaches, ants, bedbugs, and silverfish with a 90-day re-service guarantee.',
      features: ['100% Odorless herbal gel', 'Safe for kids and pets', 'No need to empty kitchen', '90-Day guarantee']
    }
  ],

  groupBookings: [
    {
      _id: 'gb_1',
      shareableLink: 'gm-deepclean-deal-2024',
      societyName: 'Green Meadows Residency',
      societyCode: 'GREEN402',
      service: {
        _id: 'svc_1',
        title: 'Full Home Deep Cleaning & Sanitization',
        category: 'cleaning',
        basePrice: 1299
      },
      scheduledDate: '2026-09-08',
      scheduledTime: '09:00 AM',
      basePrice: 1299,
      discountedPrice: 1104,
      pricePerParticipant: 1104,
      currentCount: 4,
      maxParticipants: 15,
      status: 'open',
      initiator: { name: 'Priya Sharma' },
      participants: [
        { user: { name: 'Priya Sharma' }, apartment: 'Flat 402, B Wing' },
        { user: { name: 'Dr. Anand Saxena' }, apartment: 'Flat 501, A Wing' },
        { user: { name: 'Kavita Menon' }, apartment: 'Flat 304, B Wing' },
        { user: { name: 'Rohit Bansal' }, apartment: 'Flat 802, C Wing' }
      ]
    },
    {
      _id: 'gb_2',
      shareableLink: 'palm-ac-service-coop',
      societyName: 'Palm Springs Apartments',
      societyCode: 'PALM100',
      service: {
        _id: 'svc_5',
        title: 'AC Servicing, Deep Jet Wash & Gas Check',
        category: 'electrical',
        basePrice: 699
      },
      scheduledDate: '2026-09-10',
      scheduledTime: '11:00 AM',
      basePrice: 699,
      discountedPrice: 559,
      pricePerParticipant: 559,
      currentCount: 7,
      maxParticipants: 20,
      status: 'open',
      initiator: { name: 'Rahul Verma' },
      participants: [
        { user: { name: 'Rahul Verma' }, apartment: 'Flat 1104' },
        { user: { name: 'Sanjay Reddy' }, apartment: 'Flat 402' },
        { user: { name: 'Meera Iyer' }, apartment: 'Flat 901' }
      ]
    }
  ],

  votingProposals: [
    {
      _id: 'prop_1',
      title: 'Allocate 20% of Q3 Surplus into Worker Healthcare Emergency Fund',
      description: 'Proposal to establish an institutional medical safety net providing up to ₹50,000 cashless hospitalization support for all active coop providers and their immediate families.',
      category: 'welfare',
      status: 'active',
      author: { name: 'GigCoop Central Board', role: 'admin' },
      yesCount: 1420,
      noCount: 45,
      abstainCount: 12,
      totalVotes: 1477,
      endsAt: '2026-09-15',
      userVote: null
    },
    {
      _id: 'prop_2',
      title: 'Reduce Platform Commission to 8% for High-Rated Providers (>4.9★)',
      description: 'Incentivize excellence and worker loyalty by lowering platform retention fees from 10% to 8% for cooperative members maintaining a 4.9+ rating with over 50 completed bookings.',
      category: 'platform_fee',
      status: 'active',
      author: { name: 'Rajesh Kumar', role: 'provider' },
      yesCount: 2890,
      noCount: 310,
      abstainCount: 80,
      totalVotes: 3280,
      endsAt: '2026-09-12',
      userVote: 'yes'
    },
    {
      _id: 'prop_3',
      title: 'Introduce Tool & Equipment Subsidies for New Apprentices',
      description: 'Provide micro-grants of ₹3,500 to new certified workers joining the cooperative to purchase high-grade safety equipment and professional toolkits.',
      category: 'new_feature',
      status: 'active',
      author: { name: 'Sunita Devi', role: 'provider' },
      yesCount: 1980,
      noCount: 140,
      abstainCount: 25,
      totalVotes: 2145,
      endsAt: '2026-09-20',
      userVote: null
    }
  ],

  bookings: [
    {
      _id: 'bk_101',
      service: {
        _id: 'svc_1',
        title: 'Full Home Deep Cleaning & Sanitization',
        category: 'cleaning',
        basePrice: 1299
      },
      customer: { name: 'Priya Sharma', phone: '+91 98201 12345', address: { street: 'Flat 402, Green Meadows' } },
      provider: { name: 'Sunita Devi', phone: '+91 98222 33445', avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=120&q=80', averageRating: 4.95 },
      scheduledDate: '2026-09-04',
      scheduledTime: '10:00 AM',
      totalAmount: 1299,
      status: 'confirmed',
      notes: 'Please bring ladder for high ceilings.',
      createdAt: '2026-09-01'
    },
    {
      _id: 'bk_102',
      service: {
        _id: 'svc_2',
        title: 'Complete Home Electrical Check & Appliance Fix',
        category: 'electrical',
        basePrice: 499
      },
      customer: { name: 'Priya Sharma', phone: '+91 98201 12345' },
      provider: { name: 'Rajesh Kumar', phone: '+91 98111 22334', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&q=80', averageRating: 4.9 },
      scheduledDate: '2026-08-28',
      scheduledTime: '02:00 PM',
      totalAmount: 499,
      status: 'completed',
      paymentStatus: 'paid',
      createdAt: '2026-08-27'
    }
  ]
};

// Expose Mock Data Store
window.MOCK_DATA = MOCK_DATA;
