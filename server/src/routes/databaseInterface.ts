export type User = {
  user_id: string;
  user_name: string;
  yelping_since: string;
};

export type QueryObject = {
  count: number;
  result: User[];
};

export type LikeFilter = {
  columnName: string;
  valueName: string;
};
