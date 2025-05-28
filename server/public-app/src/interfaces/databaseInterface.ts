import { ComponentType } from "react";

export interface Displayable {
  id: string;
}

export interface User extends Displayable {
  user_id: string;
  user_name: string;
  yelping_since: string;
}

export interface Business extends Displayable {
  business_id: string;
  business_name: string;
  business_address: string;
  city: string;
  business_state: string;
  zip: string;
}

export interface QueryObject {
  count: number;
  result: Displayable[];
  display_attributes: string[];
  view: ComponentType<any>;
}

export interface LikeFilter {
  columnName: string;
  valueName: string;
}
