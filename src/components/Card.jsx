export const Card = ({ user }) => {
  return (
    <div className="flex flex-col items-center  bg-card">
      <h2 className="text-3xl">{user.name}</h2>
      <p>{user.role}</p>
    </div>
  );
};
