export interface Activity {
  name: string
  suburb: string
  fsq_id: string
  city: string
  imagesURL: ImageURL[]
  latitude: number
  longitude: number
  categories: Category[]
  dateCreated: Date
  dateRefreshed: Date
  link: string
  address: string
  tel: string
  details: Details
  distance: number
  website: string
  relatedPlaces: RelatedPlaces[]
  socialMedia: SocialMedia
}
export interface Category {
  id: string
  name: string
  shortname: string
}

export interface Details {
  address: string
  country: string
  cross_street: string
  formattedAddress: string
  locality: string
  region: string
}

export interface RelatedPlaces {
  fsq_place_id: string
  name: string
  categories: Category[]
}
export interface SocialMedia {
  facebookId: string
  instagram: string
  twitter: string
}

export interface ImageURL {
  originalHeight: number
  originalWidth: number
  thumbnail: string
  title: string
  source: string
  link: string
  position: number
  imgSource: string
}
export enum AppMode {
  Listing = 1,
  Planning = 2,
}
