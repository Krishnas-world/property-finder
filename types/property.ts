export interface Property {
  id: string;
  lat: number;
  lng: number;
  price: number;
  photo: string;
  type: 'apartment' | 'house' | 'condo' | 'villa' | 'studio';
  city: string;
  neighborhood?: string;
  title?: string;
  description?: string;
  bedrooms?: number;
  bathrooms?: number;
  area?: number;
}

