import mongoose, { Document, Schema } from 'mongoose';

export interface IQuote extends Document {
  clientId?: mongoose.Types.ObjectId;
  providerId?: mongoose.Types.ObjectId;
  serviceId: mongoose.Types.ObjectId;
  clientName: string;
  clientEmail: string;
  clientCountry: string;
  serviceName: string;
  serviceCategory: string;
  selectedTier: string;
  complexity: 'Basic' | 'Standard' | 'Advanced';
  basePrice: number;
  adjustedPrice: number;
  countryMultiplier: number;
  deliveryTime: number;
  description: string;
  status: 'pending' | 'accepted' | 'rejected' | 'completed';
  createdAt: Date;
  updatedAt: Date;
  expiresAt: Date;
}

const QuoteSchema: Schema = new Schema(
  {
    clientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    providerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    serviceId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Service',
      required: [true, 'Please provide a service ID'],
    },
    clientName: {
      type: String,
      required: [true, 'Please provide a client name'],
      trim: true,
    },
    clientEmail: {
      type: String,
      required: [true, 'Please provide a client email'],
      trim: true,
      lowercase: true,
    },
    clientCountry: {
      type: String,
      required: [true, 'Please provide a client country'],
      trim: true,
    },
    serviceName: {
      type: String,
      required: [true, 'Please provide a service name'],
      trim: true,
    },
    serviceCategory: {
      type: String,
      required: [true, 'Please provide a service category'],
      trim: true,
    },
    selectedTier: {
      type: String,
      required: [true, 'Please provide a selected tier'],
      enum: ['Basic', 'Standard', 'Premium'],
    },
    complexity: {
      type: String,
      required: [true, 'Please provide a complexity level'],
      enum: ['Basic', 'Standard', 'Advanced'],
    },
    basePrice: {
      type: Number,
      required: [true, 'Please provide a base price'],
      min: [0, 'Base price cannot be negative'],
    },
    adjustedPrice: {
      type: Number,
      required: [true, 'Please provide an adjusted price'],
      min: [0, 'Adjusted price cannot be negative'],
    },
    countryMultiplier: {
      type: Number,
      required: [true, 'Please provide a country multiplier'],
      min: [0, 'Country multiplier cannot be negative'],
    },
    deliveryTime: {
      type: Number,
      required: [true, 'Please provide a delivery time in days'],
      min: [1, 'Delivery time must be at least 1 day'],
    },
    description: {
      type: String,
      required: [true, 'Please provide a description'],
      trim: true,
    },
    status: {
      type: String,
      enum: ['pending', 'accepted', 'rejected', 'completed'],
      default: 'pending',
    },
    expiresAt: {
      type: Date,
      required: [true, 'Please provide an expiration date'],
      default: function() {
        const now = new Date();
        return new Date(now.setDate(now.getDate() + 30)); // Default 30 days validity
      },
    },
  },
  { timestamps: true }
);

export default mongoose.model<IQuote>('Quote', QuoteSchema);