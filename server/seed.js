require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
const Service = require('./models/Service');
const Booking = require('./models/Booking');
const GroupBooking = require('./models/GroupBooking');
const VotingProposal = require('./models/VotingProposal');
const EquityLedger = require('./models/EquityLedger');
const Review = require('./models/Review');
const Subscription = require('./models/Subscription');

const seedData = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/gig-services';
    await mongoose.connect(mongoUri);
    console.log('🌱 Connected to MongoDB for seeding...');

    // Clear existing data
    await Promise.all([
      User.deleteMany({}),
      Service.deleteMany({}),
      Booking.deleteMany({}),
      GroupBooking.deleteMany({}),
      VotingProposal.deleteMany({}),
      EquityLedger.deleteMany({}),
      Review.deleteMany({}),
      Subscription.deleteMany({})
    ]);
    console.log('🧹 Cleaned existing database collections.');

    // 1. Create Users
    const admin = await User.create({
      name: 'Coop Admin Board',
      email: 'admin@gigcoop.org',
      password: 'password123',
      phone: '+91 98765 00000',
      role: 'admin',
      isVerified: true,
      referralCode: 'ADMIN01',
      societyName: 'GigCoop Central HQ'
    });

    const customer1 = await User.create({
      name: 'Priya Sharma',
      email: 'priya@gmail.com',
      password: 'password123',
      phone: '+91 98201 12345',
      role: 'customer',
      societyName: 'Green Meadows Residency',
      address: { street: 'Flat 402, Tower B, Green Meadows', city: 'Mumbai', state: 'Maharashtra', zipCode: '400050' },
      referralCode: 'PRIYA88',
      walletBalance: 250
    });

    const customer2 = await User.create({
      name: 'Rahul Verma',
      email: 'rahul@gmail.com',
      password: 'password123',
      phone: '+91 98450 67890',
      role: 'customer',
      societyName: 'Palm Springs Apartments',
      address: { street: 'Flat 1104, Palm Springs', city: 'Bangalore', state: 'Karnataka', zipCode: '560100' },
      referralCode: 'RAHUL99',
      walletBalance: 100
    });

    const provider1 = await User.create({
      name: 'Rajesh Kumar',
      email: 'rajesh@gigcoop.org',
      password: 'password123',
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
      referralCode: 'RAJESH_ELEC'
    });

    const provider2 = await User.create({
      name: 'Sunita Devi',
      email: 'sunita@gigcoop.org',
      password: 'password123',
      phone: '+91 98222 33445',
      role: 'provider',
      isVerified: true,
      skills: ['Deep Cleaning', 'Sanitization', 'Kitchen Cleaning', 'Post-Construction Cleaning'],
      bio: 'Cooperative Hygiene Team Lead. Trained in eco-friendly hospital-grade sanitization.',
      experience: 8,
      averageRating: 4.95,
      totalReviews: 126,
      equityPoints: 650,
      equityPercentage: 4.3,
      societyName: 'Bandra Guild',
      address: { street: 'Lane 4, Bandra West', city: 'Mumbai', state: 'Maharashtra', zipCode: '400050' },
      referralCode: 'SUNITA_CLEAN'
    });

    const provider3 = await User.create({
      name: 'Amit Patel',
      email: 'amit@gigcoop.org',
      password: 'password123',
      phone: '+91 98333 44556',
      role: 'provider',
      isVerified: true,
      skills: ['Plumbing', 'Pipe Fitting', 'Geyser Installation', 'Water Tank Cleaning'],
      bio: 'Master plumber with expertise in modern CPVC and pressure pump setups.',
      experience: 10,
      averageRating: 4.8,
      totalReviews: 62,
      equityPoints: 340,
      equityPercentage: 2.3,
      address: { street: 'Koramangala 4th Block', city: 'Bangalore', state: 'Karnataka', zipCode: '560034' },
      referralCode: 'AMIT_PLUMB'
    });

    const provider4 = await User.create({
      name: 'Deepa Nair',
      email: 'deepa@gigcoop.org',
      password: 'password123',
      phone: '+91 98444 55667',
      role: 'provider',
      isVerified: true,
      skills: ['Maths Tutoring', 'Physics', 'CBSE/ICSE Coaching', 'Coding for Kids'],
      bio: 'M.Sc in Applied Mathematics with 7 years tutoring experience. Focused on conceptual clarity.',
      experience: 7,
      averageRating: 5.0,
      totalReviews: 48,
      equityPoints: 420,
      equityPercentage: 2.8,
      address: { street: 'Indiranagar 100ft Road', city: 'Bangalore', state: 'Karnataka', zipCode: '560038' },
      referralCode: 'DEEPA_TUTOR'
    });

    console.log('✅ Users seeded successfully.');

    // 2. Create Services
    const services = await Service.create([
      {
        provider: provider2._id,
        title: 'Full Home Deep Cleaning & Sanitization',
        description: 'Comprehensive 4-hour deep cleaning using hospital-grade eco friendly materials. Covers bathrooms, kitchen degreasing, floor scrubbing, balcony, and glass windows.',
        category: 'cleaning',
        basePrice: 1299,
        duration: 240,
        images: ['https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=800&q=80'],
        location: { city: 'Mumbai', state: 'Maharashtra', zipCode: '400050' },
        tags: ['deep cleaning', 'sanitization', 'kitchen', 'bathroom', 'eco-friendly'],
        averageRating: 4.95,
        totalBookings: 142,
        features: ['Eco-friendly cleaning agents', 'Equipment included', 'Full sanitization', 'Verified worker-owner team']
      },
      {
        provider: provider1._id,
        title: 'Complete Home Electrical Check & Appliance Fix',
        description: 'Certified electrical inspection, circuit troubleshooting, switchboard repairs, and heavy appliance wiring checks with high precision tools.',
        category: 'electrical',
        basePrice: 499,
        duration: 90,
        images: ['https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=800&q=80'],
        location: { city: 'Mumbai', state: 'Maharashtra', zipCode: '400076' },
        tags: ['electrical', 'wiring', 'switches', 'inverter', 'appliance'],
        averageRating: 4.9,
        totalBookings: 98,
        features: ['Digital multimeter testing', 'Safety gear compliant', '30-day service warranty', 'Emergency instant support']
      },
      {
        provider: provider3._id,
        title: 'Emergency Plumbing, Tap Repair & Pipe Leakage Fix',
        description: 'Rapid resolution of water leaks, blocked drains, flush repairs, mixer tap installations, and pressure pump diagnostics.',
        category: 'plumbing',
        basePrice: 599,
        duration: 60,
        images: ['https://images.unsplash.com/photo-1585704032915-c3400ca199e7?w=800&q=80'],
        location: { city: 'Bangalore', state: 'Karnataka', zipCode: '560034' },
        tags: ['plumbing', 'drainage', 'leaks', 'tap repair', 'bathroom fix'],
        averageRating: 4.8,
        totalBookings: 76,
        features: ['Same-day slot availability', 'Leakage detection tools', 'Spare parts assistance', 'Clean post-work cleanup']
      },
      {
        provider: provider4._id,
        title: '1-on-1 STEM & Mathematics Coaching (Class 6-12)',
        description: 'Personalized interactive tutoring sessions focusing on problem-solving, board exam preparations, and competitive foundation skills.',
        category: 'tutoring',
        basePrice: 799,
        duration: 60,
        images: ['https://images.unsplash.com/photo-1580894732444-8ecded7900cd?w=800&q=80'],
        location: { city: 'Bangalore', state: 'Karnataka', zipCode: '560038' },
        tags: ['maths', 'science', 'stem', 'coaching', 'cbse', 'icse'],
        averageRating: 5.0,
        totalBookings: 53,
        features: ['Customized worksheet bank', 'Weekly progress reporting', 'Doubt solving on chat', 'Flexible timings']
      },
      {
        provider: provider1._id,
        title: 'AC Servicing, Deep Jet Wash & Gas Check',
        description: 'High-pressure jet pump cleaning of indoor cooling coils, outdoor condenser unit wash, airflow optimization, and gas pressure measurement.',
        category: 'electrical',
        basePrice: 699,
        duration: 75,
        images: ['https://images.unsplash.com/photo-1621905252507-b35492cc74b4?w=800&q=80'],
        location: { city: 'Mumbai', state: 'Maharashtra', zipCode: '400076' },
        tags: ['ac service', 'jet wash', 'cooling', 'air conditioner'],
        averageRating: 4.92,
        totalBookings: 110,
        features: ['Anti-bacterial coil wash', 'Drain pipe flushing', 'Power consumption audit', 'Mess-free sheet cover']
      },
      {
        provider: provider2._id,
        title: 'Kitchen Chimney & Modular Kitchen Degreasing',
        description: 'Specialized chemical degreasing of chimney filters, stainless steel grills, stove burners, and cabinet exterior wipes.',
        category: 'cleaning',
        basePrice: 899,
        duration: 120,
        images: ['https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=800&q=80'],
        location: { city: 'Mumbai', state: 'Maharashtra', zipCode: '400050' },
        tags: ['chimney', 'kitchen cleaning', 'degreasing', 'modular kitchen'],
        averageRating: 4.88,
        totalBookings: 65,
        features: ['Non-toxic degreasers', 'Filter deep sonic wash', 'Tile grout restoration', 'No harsh odor']
      }
    ]);
    console.log('✅ Services seeded successfully.');

    // 3. Create Bookings
    const booking1 = await Booking.create({
      customer: customer1._id,
      provider: provider2._id,
      service: services[0]._id,
      scheduledDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
      scheduledTime: '10:00 AM',
      address: { street: 'Flat 402, Green Meadows', city: 'Mumbai', state: 'Maharashtra', zipCode: '400050' },
      status: 'confirmed',
      totalAmount: 1299,
      platformFee: 130,
      providerEarnings: 1169,
      equityPointsAwarded: 65,
      notes: 'Please bring ladder for ceiling fan cleaning.'
    });

    const booking2 = await Booking.create({
      customer: customer2._id,
      provider: provider3._id,
      service: services[2]._id,
      scheduledDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      scheduledTime: '03:00 PM',
      address: { street: 'Flat 1104, Palm Springs', city: 'Bangalore', state: 'Karnataka', zipCode: '560100' },
      status: 'completed',
      paymentStatus: 'paid',
      totalAmount: 599,
      platformFee: 60,
      providerEarnings: 539,
      equityPointsAwarded: 30,
      completedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000)
    });

    // 4. Create Reviews
    await Review.create({
      booking: booking2._id,
      reviewer: customer2._id,
      reviewee: provider3._id,
      service: services[2]._id,
      rating: 5,
      comment: 'Amit arrived right on time and fixed the stubborn water tank leak in under 40 minutes! Very respectful and honest pricing.'
    });

    // 5. Create Group Booking
    await GroupBooking.create({
      initiator: customer1._id,
      service: services[0]._id,
      societyName: 'Green Meadows Residency',
      societyCode: 'GREEN402',
      shareableLink: 'gm-deepclean-deal-2024',
      scheduledDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
      scheduledTime: '09:00 AM',
      basePrice: 1299,
      maxParticipants: 15,
      currentCount: 4,
      discountedPrice: 1195,
      pricePerParticipant: 1195,
      status: 'open',
      expiresAt: new Date(Date.now() + 48 * 60 * 60 * 1000),
      participants: [
        { user: customer1._id, apartment: 'Flat 402, B Wing', joinedAt: new Date() },
        { user: customer2._id, apartment: 'Flat 501, A Wing', joinedAt: new Date() }
      ]
    });

    // 6. Create Voting Proposals
    await VotingProposal.create([
      {
        author: admin._id,
        title: 'Allocate 20% of Q3 Surplus into Worker Healthcare Emergency Fund',
        description: 'Proposal to establish an institutional medical safety net providing up to ₹50,000 cashless hospitalization support for all active coop providers and their immediate families.',
        category: 'welfare',
        status: 'active',
        yesCount: 1420,
        noCount: 45,
        abstainCount: 12,
        totalVotes: 1477,
        endsAt: new Date(Date.now() + 6 * 24 * 60 * 60 * 1000)
      },
      {
        author: provider1._id,
        title: 'Reduce Platform Commission to 8% for High-Rated Providers (>4.9★)',
        description: 'Incentivize excellence and worker loyalty by lowering platform retention fees from 10% to 8% for cooperative members maintaining a 4.9+ rating with over 50 completed bookings.',
        category: 'platform_fee',
        status: 'active',
        yesCount: 2890,
        noCount: 310,
        abstainCount: 80,
        totalVotes: 3280,
        endsAt: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000)
      },
      {
        author: provider2._id,
        title: 'Introduce Tool & Equipment Subsidies for New Apprentices',
        description: 'Provide micro-grants of ₹3,500 to new certified workers joining the cooperative to purchase high-grade safety equipment and professional toolkits.',
        category: 'new_feature',
        status: 'active',
        yesCount: 1980,
        noCount: 140,
        abstainCount: 25,
        totalVotes: 2145,
        endsAt: new Date(Date.now() + 8 * 24 * 60 * 60 * 1000)
      }
    ]);

    // 7. Create Equity Ledgers
    await EquityLedger.create([
      {
        provider: provider1._id,
        booking: booking2._id,
        points: 50,
        type: 'earned',
        description: 'Cooperative service completion bonus',
        totalPointsAfter: 480
      },
      {
        provider: provider2._id,
        points: 100,
        type: 'earned',
        description: 'Monthly top service excellence equity bonus',
        totalPointsAfter: 650
      }
    ]);

    // 8. Create Subscriptions
    await Subscription.create({
      customer: customer1._id,
      plan: {
        name: 'standard',
        price: 3999,
        billingCycle: 'monthly',
        services: [
          { category: 'cleaning', frequency: 4, description: '4x Complete House Cleaning sessions (Weekly)' },
          { category: 'plumbing', frequency: 1, description: '1x Full plumbing inspection & tap/pipe fix' }
        ]
      },
      status: 'active',
      startDate: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
      nextBillingDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
      nextServiceDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000)
    });

    console.log('🎉 Database seeding completed successfully with rich cooperative data!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding Error:', error);
    process.exit(1);
  }
};

seedData();
