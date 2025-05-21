import mongoose, { Document, Schema } from 'mongoose';

export interface IServiceTier {
  name: string;
  description: string;
  basePrice: number;
  deliveryTime: number;
  revisions: number;
  features: string[];
}

export interface IService extends Document {
  name: string;
  category: string;
  description: string;
  userId: mongoose.Types.ObjectId;
  tiers: IServiceTier[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const ServiceTierSchema: Schema = new Schema({
  name: {
    type: String,
    required: [true, 'Please provide a tier name'],
    trim: true,
    enum: ['Basic', 'Standard', 'Premium'],
  },
  description: {
    type: String,
    required: [true, 'Please provide a tier description'],
    trim: true,
  },
  basePrice: {
    type: Number,
    required: [true, 'Please provide a base price'],
    min: [0, 'Base price cannot be negative'],
  },
  deliveryTime: {
    type: Number,
    required: [true, 'Please provide a delivery time in days'],
    min: [1, 'Delivery time must be at least 1 day'],
  },
  revisions: {
    type: Number,
    required: [true, 'Please provide the number of revisions'],
    min: [0, 'Revisions cannot be negative'],
  },
  features: {
    type: [String],
    required: [true, 'Please provide features'],
  },
});

const ServiceSchema: Schema = new Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide a service name'],
      trim: true,
      maxlength: [100, 'Service name cannot be more than 100 characters'],
    },
    category: {
      type: String,
      required: [true, 'Please provide a category'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Please provide a description'],
      trim: true,
      maxlength: [1000, 'Description cannot be more than 1000 characters'],
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Please provide a user ID'],
    },
    tiers: {
      type: [ServiceTierSchema],
      required: [true, 'Please provide at least one tier'],
      validate: {
        validator: function (tiers: IServiceTier[]) {
          return tiers.length > 0;
        },
        message: 'Please provide at least one tier',
      },
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model<IService>('Service', ServiceSchema);