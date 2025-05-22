export interface User {
  user_id: string;
  user_name: string;
  yelping_since: string;
}

export interface QueryObject {
  count: number;
  result: User[];
}

export interface LikeFilter {
  columnName: string;
  valueName: string;
}
