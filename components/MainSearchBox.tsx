import React, { useState } from "react"
import { isMobile } from 'react-device-detect'

interface SearchBoxProps {
  onSearch: (query: string) => void
}

const MainSearchBox: React.FC<SearchBoxProps> = ({ onSearch }) => {
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
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          flexDirection: 'row'
        }}
      >
        <input
          className="input-main"
          type="text"
          placeholder="search for a .eth domain"
          value={query}
          name=".eth search"
          id="eth-search"
          onChange={handleInputChange}
          onInvalid={handleInputInvalid}
          onInput={handleInput}
          required
          pattern=".*\.eth$"
          title="❗ Input must end with '.eth'"
          style={{
            fontSize: isMobile ? '16px' : '20px' 
          }}
        />
        <button 
          className="button"
          style={{
            height: '50px',
            width: '80px',
            marginLeft: '20px'
          }}
          type="submit"
          data-tooltip='Search'
        >
          <span 
            className="material-icons"
            style={{
              fontSize: '30px',
              fontWeight: '700'
            }}
          >
            search
          </span>
        </button>
      </div>
    </form>
  );
};

export default MainSearchBox
