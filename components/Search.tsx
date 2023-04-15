import React, { useState } from "react";

interface SearchBoxProps {
  onSearch: (query: string) => void;
}

const SearchBox: React.FC<SearchBoxProps> = ({ onSearch }) => {
  const [query, setQuery] = useState("");

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
  };

  const handleFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSearch(query);
  };

  return (
    <form 
      style={{
        display: 'flex',
        alignItems: 'center',
        flexDirection: 'column'
      }}
      onSubmit={handleFormSubmit}
    >
      <div>
        <input
          className="input-box"
          type="text"
          placeholder="search .eth"
          value={query}
          onChange={handleInputChange}
        />
        <button 
          className="button"
          style={{
            height: '30px',
            width: '50px',
            marginLeft: '20px'
          }}
          type="submit"
        >
          Go
        </button>
      </div>
    </form>
  );
};

export default SearchBox;
