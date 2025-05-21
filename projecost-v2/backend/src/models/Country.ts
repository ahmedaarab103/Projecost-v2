import mongoose, { Document, Schema } from 'mongoose';

export interface ICountry extends Document {
  name: string;
  code: string;
  region: string;
  currency: string;
  currencyCode: string;
  multiplier: number;
}

const CountrySchema: Schema = new Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide a country name'],
      unique: true,
      trim: true,
    },
    code: {
      type: String,
      required: [true, 'Please provide a country code'],
      unique: true,
      trim: true,
      uppercase: true,
      minlength: [2, 'Country code must be 2 characters'],
      maxlength: [2, 'Country code must be 2 characters'],
    },
    region: {
      type: String,
      required: [true, 'Please provide a region'],
      trim: true,
    },
    currency: {
      type: String,
      required: [true, 'Please provide a currency'],
      trim: true,
    },
    currencyCode: {
      type: String,
      required: [true, 'Please provide a currency code'],
      trim: true,
      uppercase: true,
      minlength: [3, 'Currency code must be 3 characters'],
      maxlength: [3, 'Currency code must be 3 characters'],
    },
    multiplier: {
      type: Number,
      required: [true, 'Please provide a multiplier'],
      default: 1.0,
    },
  },
  { timestamps: true }
);

export default mongoose.model<ICountry>('Country', CountrySchema);