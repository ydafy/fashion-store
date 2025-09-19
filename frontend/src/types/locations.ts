export interface State {
  state: string;
  cities: string[];
}

export interface Country {
  country: string;
  states: State[];
}
