import React, { useEffect, useState } from "react";
import "./styles.css";
import { SearchBar } from "./Component/Searchbar/SearchBar";
import countries from "./utils/countries";

export default function App() {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState([]);

  useEffect(() => {
    if (query === "") {
      setSuggestions([]);
    } else {
      let out = countries
        .filter((item) =>
          item.country.toLowerCase().indexOf(query) !== -1 ? true : false
        )
        .map((item) => item.country);
      setSuggestions(out);
    }
    setLoading(false);
  }, [query]);

  return (
    <div className="App">
      <h1>Search bar</h1>
      <div> {query} </div>
      <SearchBar
        loading={loading}
        setLoading={setLoading}
        value={query}
        onChange={(val) => setQuery(val)}
        suggestions={suggestions}
      />
    </div>
  );
}
