export interface Country {
  id: string;
  code: string;
  name: string;
  isActive: boolean;
}

export interface CreateCountryDto {
  code: string;
  name: string;
}

export interface UpdateCountryDto extends CreateCountryDto {
  isActive: boolean;
}

export interface State {
  id: string;
  countryId: string;
  code: string;
  name: string;
  isActive: boolean;
}

export interface CreateStateDto {
  countryId: string;
  code: string;
  name: string;
}

export interface UpdateStateDto extends CreateStateDto {
  isActive: boolean;
}
