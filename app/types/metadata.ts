export type Attribute = {
  trait_type: string;
  value: string | number;
  display_type?: string;
};

export type Metadata = {
  name: string;
  description: string;
  image: string;
  external_url?: string;
  attributes?: Attribute[];
};
