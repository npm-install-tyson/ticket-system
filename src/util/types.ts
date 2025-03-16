import { ChangeEvent } from "react";

export interface SHOWTIME {
  id: string;
  showTime: any;
}

export interface USER {
  email: string;
  mobileNo: string;
  name: string;
  password: string;
  role: string;
  userId: string;
}

export interface ADDNEWSHOWTIME {
  date: string;
  time: string;
}

export interface FEATURES {
  id: number;
  rating: number;
  content: string;
  date: string;
  datetime: string;
  author: string;
  avatarSrc: string;
}

export interface REVIEWS {
  average: number;
  featured: FEATURES[];
}

export interface EVENTDETAILS {
  eventId?: string;
  name: string;
  genre: string;
  description: string;
  startDate: string;
  endDate: string;
  runTimeHour?: any;
  runTimeMin?: any;
  duration?: string;
  producer: string;
  director: string;
  venue?: string;
  imageUrl?: string;
}

export interface GENRE {
  id: number;
  name: string;
}

export interface BAND {
  bandId: string;
  seatsPerBand: number;
  price: number;
}

export interface DISCOUNT {
  id?: number;
  discountType: string;
  discountPercentage: number;
}

export interface FORMFIELDPROPS {
  label: string;
  name: string;
  type: "text" | "select";
  placeholder?: string;
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  options?: Array<{ value: string; label: string }>;
}

export interface CARDVALIDATIONSTATE {
  cardNumber: boolean;
  cardExpiry: boolean;
}

export interface PAYMENTCARDDETAILS {
  cardNumber: string;
  cardHolderName: string;
  cardExpiry: string;
  cardCVC: string;
}

export interface DELIVERYMETHOD {
  id: number;
  title: string;
  turnaround: string;
  price: number;
}

export interface CONTACTINFORMATION {
  firstName: string;
  lastName: string;
  address: string;
  apartment: string;
  city: string;
  country: string;
  state: string;
  zipCode: string;
  phoneNumber: string;
}

export interface REGISTERDATA {
  firstName: string;
  lastName: string;
  mobileNo: string;
  email: string;
  password: string;
  confirmPassword: string;
  isAdmin?: boolean;
}
