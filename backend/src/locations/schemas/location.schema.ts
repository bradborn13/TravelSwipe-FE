import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

// 1. Define sub-schema for Categories
@Schema({ _id: false })
class Category {
  @Prop()
  id!: number;

  @Prop()
  name!: string;
  @Prop()
  shortname!: string;
}

// 2. Define sub-schema for Location Details
@Schema({ _id: false })
class LocationDetails {
  @Prop()
  address!: string;

  @Prop()
  country!: string;

  @Prop()
  cross_street!: string;

  @Prop()
  formattedAddress!: string;

  @Prop()
  locality!: string;

  @Prop()
  postcode!: string;

  @Prop()
  region!: string;
}
@Schema({ _id: false })
class RelatedPlaces {
  @Prop()
  fsq_place_id!: string;

    @Prop()
  name!: string;

  @Prop({ type: [Category] })
  categories!: Category[];
}

@Schema({ timestamps: true })
export class Location extends Document {
  @Prop({ required: true })
  name!: string;

  @Prop({ unique: true })
  fsq_id!: string;

  @Prop()
  city!: string;

  @Prop()
  latitude!: number;

  @Prop()
  longitude!: number;

  @Prop({ type: [Category] })
  categories!: Category[];

  @Prop({ type: LocationDetails })
  details!: LocationDetails;

  @Prop()
  distance!: number;

  @Prop()
  website!: string;

  @Prop({ type: [RelatedPlaces] })
  relatedPlaces?: RelatedPlaces[];
}

export const LocationSchema = SchemaFactory.createForClass(Location);
