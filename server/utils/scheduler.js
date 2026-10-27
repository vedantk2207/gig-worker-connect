const cron = require('node-cron');
const Subscription = require('../models/Subscription');
const Booking = require('../models/Booking');
const Service = require('../models/Service');

const startScheduler = () => {
  // Run every day at 8 AM - process subscription auto-bookings
  cron.schedule('0 8 * * *', async () => {
    console.log('⏰ Running subscription scheduler...');
    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const dueSubscriptions = await Subscription.find({
        status: 'active',
        nextServiceDate: { $lte: new Date(today.getTime() + 24 * 60 * 60 * 1000) }
      });

      for (const sub of dueSubscriptions) {
        // Find a suitable provider for the next service
        const nextService = sub.plan.services[0]; // Simplified: use first service
        const service = await Service.findOne({
          category: nextService.category, isActive: true
        }).sort({ averageRating: -1 });

        if (service) {
          const scheduledDate = new Date(sub.nextServiceDate);
          await Booking.create({
            customer: sub.customer,
            provider: service.provider,
            service: service._id,
            subscription: sub._id,
            scheduledDate,
            scheduledTime: '10:00',
            totalAmount: service.basePrice,
            platformFee: service.basePrice * 0.1,
            providerEarnings: service.basePrice * 0.9,
            status: 'pending',
            notes: 'Auto-generated from subscription'
          });

          // Update next service date (monthly)
          const nextDate = new Date(sub.nextServiceDate);
          nextDate.setMonth(nextDate.getMonth() + 1);
          sub.nextServiceDate = nextDate;
          await sub.save();

          console.log(`✅ Auto-booking created for subscription ${sub._id}`);
        }
      }
    } catch (err) {
      console.error('Scheduler error:', err.message);
    }
  });

  console.log('📅 Subscription scheduler started');
};

module.exports = { startScheduler };
