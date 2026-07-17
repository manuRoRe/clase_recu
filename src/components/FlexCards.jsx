import { Card } from "./Card";

export function FlexCards({ users }) {
  return (
    <div>
      {users.map((user) => (
        <Card key={user.id} user={user} />
      ))}
    </div>
  );
}
