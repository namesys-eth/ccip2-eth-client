import React, { useState } from "react"

interface SearchBoxProps {
  onSearch: (query: string) => void
}

const SearchBox: React.FC<SearchBoxProps> = ({ onSearch }) => {
  const [query, setQuery] = useState("")

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value)
  };

  const handleInputInvalid = (event: React.ChangeEvent<HTMLInputElement>) => {
    event.target.setCustomValidity("Please enter a valid .eth name")
  };

  const handleInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    event.target.setCustomValidity("")
  };

  const handleFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    onSearch(query)
  }

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
          type="text"
          placeholder="search .eth"
          value={query}
          name=".eth search"
          id="eth-search"
          onChange={handleInputChange}
          onInvalid={handleInputInvalid}
          onInput={handleInput}
          required
          pattern=".*\.eth$"
          title="❗ Input must end with '.eth'"
        />
        <button 
          className="button"
          style={{
            height: '30px',
            width: '50px',
            marginLeft: '20px'
          }}
          type="submit"
          data-tooltip='Search'
        >
          Go
        </button>
      </div>
    </form>
  );
};

export default SearchBox
