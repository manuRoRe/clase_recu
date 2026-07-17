import { useState } from "react";
import { FlexCards } from "./components/FlexCards";
import { Footer } from "./components/Footer";
import { Formulario } from "./components/Formulario";
import { Header } from "./components/Header";
import { SearchBar } from "./components/SearchBar";
import { users } from "./data/userData";

function App() {
  const [search, setSearch] = useState("");

  const listFiltered = users.filter((user) => {
    const lowerSearch = search.toLowerCase();
    return (
      user.name.toLowerCase().includes(lowerSearch) ||
      user.role.toLowerCase().includes(lowerSearch)
    );
  });

  return (
    <>
      <Header />
      <Formulario />
      <SearchBar search={search} setSearch={setSearch} />
      <FlexCards users={listFiltered} />
      <Footer />
    </>
  );
}

export default App;
