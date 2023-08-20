export interface Product {
    id:             number;
    local_id:       number;
    category_id:    number;
    name:           string;
    price:          number;
    image:          string;
    category_name:  string;
    category_image: string;
    description:     string;
    ingredients:    string;
    variations:     Variation[];
}

export interface Variation {
    id:number
    nameVariation: string;
    options:       Option[];
    typePrice:     number;
    multiple:      boolean;
    required:      boolean;
    min?:          number | null;
    max?:          number;
}

export interface Option {
    nameOption: string;
    price:      number;
}
