import mongoose from 'mongoose';

const SettingsSchema = new mongoose.Schema({
  isOpen: { type: Boolean, default: true },
  deliveryFee: { type: Number, default: 5.0 },
  categories: [
    {
      id: String,
      name: String,
      order: Number
    }
  ],
  items: [
    {
      id: String,
      name: String,
      description: String,
      price: Number,
      categoryId: String,
      isAvailable: Boolean,
      order: Number
    }
  ]
});

export default mongoose.models.Settings || mongoose.model('Settings', SettingsSchema, 'settings'); 