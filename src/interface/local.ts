export interface Local {
  id: number;
  name: string;
  name_url: string;
  image: string;
  location: string;
  phone: number;
  aliascbu: string;
  description: null;
  theme: number;
  instagram: string;
  website: string;
  maps: string;
  schedules: string;
  options_group: string;
  links: string;
  shipping:any,
  pay_methods:any
}

export interface Schedules {
  days: Days[];
}

export interface Days {
  name: string;
  open: boolean;
  shifts: { start: string; end: string }[];
}

export interface OptionProduct {
  id: number;
  nameVariation: string;
  multiple?: boolean;
  typePrice: number;
  nameOption?: string;
  options: Array<DetailsOptions>;
  required?: boolean;
  multipleOptions?: Array<any>;
  min: number;
  max: number;
  simple?: boolean;
}

export interface DetailsOptions {
  nameOption: string;
  price: number;
  active?: boolean;
}
