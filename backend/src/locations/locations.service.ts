import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import axios from 'axios';
import { Model } from 'mongoose';
import { Location } from './schemas/location.schema';
import { FoursquarePlace } from './dto/interfaces';

@Injectable() // This makes it "Injectable" just like C# DI
export class LocationsService {
  constructor(
    @InjectModel(Location.name) private locationModel: Model<Location>,
  ) {}

  async getLocations(city: string) {
    const locationsByCity = await this.locationModel.find({ city }).exec();
    if (locationsByCity.length > 0) {
      return locationsByCity;
    } else {
      return await this.SearchAndSaveLocations(city);
    }
  }

  async FetchFourSquareLocations(city: string): Promise<FoursquarePlace[]> {
    try {
      const response = await axios({
        method: 'GET',
        url: 'https://places-api.foursquare.com/places/search',
        params: {
          near: city,
          limit: 15,
        },
        headers: {
          // Use EXACT casing as suggested by their docs
          'X-Places-Api-Version': '2025-06-17',
          Authorization: `Bearer ${process.env.Foursquare_API}`,
          Accept: 'application/json',
        },
      });
      return response.data;
    } catch (err) {
      if (axios.isAxiosError(err)) {
        console.error('FSQ error detail:', err.response?.data);
      }
      return [];
    }
  }
  async SearchAndSaveLocations(city: string) {
    const rawResults: any = (await this.FetchFourSquareLocations(city)) || [];
    const mappedLocations: Location[] = rawResults.results.map((item: any) => {
      return {
        fsq_id: item.fsq_place_id, // Handles both naming conventions
        city: city,
        name: item.name,
        latitude: item.latitude,
        longitude: item.longitude,
        categories:
          item.categories?.map((cat: any) => ({
            fsq_category_id: cat.fsq_category_id,
            name: cat.name,
            shortname: cat.short_name,
          })) || [],
        dateCreated: item.date_created,
        dateRefreshed: item.date_refreshed,
        distance: item.distance,
        link: item.link,
        address: item.location?.formatted_address,
        details: {
          address: item.location?.address,
          locality: item.location?.locality,
          region: item.location?.region,
          postcode: item.location?.postcode,
          country: item.location?.country,
          formatted_address: item.location?.formatted_address,
        },
        relatedPlaces: item.related_places?.children?.map((child: any) => ({
          fsq_place_id: child.fsq_place_id,
          name: child.name,
          categories: child.categories.map((category: any) => ({
            fsq_category_id: category.fsq_category_id,
            name: category.name,
            shortname: category.short_name,
          })),
        })),
        tel: item.tel,
        website: item.website,
        socialMedia: {
          faceboookId: item.social_media?.facebook_id,
          instagram: item.social_media?.instagram,
          twitter: item.social_media?.twitter,
        },
      };
    });
    for (const loc of mappedLocations) {
      await this.locationModel.updateOne(
        { fsq_id: loc.fsq_id },
        { $set: loc },
        { upsert: true },
      );
    }
    return mappedLocations;
  }
}
