import type { User } from "../interfaces/databaseInterface";

type ProfileViewProps = { user: User | null };
export const ProfileView = ({ user }: ProfileViewProps) => {
  if (!user)
    return (
      <div className="flex flex-col items-center">
        <h1>USER NOT FOUND</h1>
      </div>
    );
  else
    return (
      <div className="flex flex-col items-center">
        <h1>{user.user_name} </h1>
        <h3>Created: {user.yelping_since}</h3>
      </div>
    );
};
