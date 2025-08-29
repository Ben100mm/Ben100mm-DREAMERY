// Marketplace filter and property data
export const PROPERTY_FEATURES = [
  'Pool',
  'Garage',
  'Fireplace',
  'Hardwood Floors',
  'Updated Kitchen',
  'Updated Bathroom',
  'Central Air',
  'Dishwasher',
  'Washer/Dryer',
  'Fenced Yard',
  'Patio/Deck',
  'Walk-in Closet',
  'Granite Countertops',
  'Stainless Steel Appliances'
] as const;

export const PROPERTY_CONDITIONS = [
  'Excellent',
  'Very Good',
  'Good',
  'Fair',
  'Needs Work',
  'Fixer Upper'
] as const;

export const SCHOOL_RATINGS = [
  { rating: 10, label: '10/10 (Excellent)' },
  { rating: 9, label: '9/10 (Very Good)' },
  { rating: 8, label: '8/10 (Good)' },
  { rating: 7, label: '7/10 (Above Average)' },
  { rating: 6, label: '6/10 (Average)' },
  { rating: 5, label: '5/10 (Below Average)' }
] as const;

export const NEIGHBORHOOD_AMENITIES = [
  'Shopping Centers',
  'Restaurants',
  'Parks',
  'Schools',
  'Public Transportation',
  'Highways',
  'Hospitals',
  'Libraries',
  'Gyms',
  'Movie Theaters'
] as const;

export const PROPERTY_STATUSES = [
  'Active',
  'Pending',
  'Sold',
  'Rented',
  'Coming Soon',
  'Price Reduced',
  'New Construction'
] as const;
