import React, { useState } from "react"

interface SearchBoxProps {
  onSearch: (query: string) => void
}

const SearchBox: React.FC<SearchBoxProps> = ({ onSearch }) => {
  const [query, setQuery] = useState("")

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value.toLowerCase())
  }

  const handleInputInvalid = (event: React.ChangeEvent<HTMLInputElement>) => {
    event.target.setCustomValidity("Please enter a valid .eth name")
  }

  const handleInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    event.target.setCustomValidity("")
  }

  const handleFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    onSearch(query)
  }

  return (
    <form 
      className="flex-column-sans-justify"
      onSubmit={handleFormSubmit}
    >
      <div
        className="flex-row-sans-justify"
      >
        <input
          type="text"
          placeholder={"search .eth name".toLowerCase()}
          value={query.toLowerCase()}
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
            height: '38px',
            width: '50px',
            marginLeft: '15px'
          }}
          type="submit"
          data-tooltip='Search'
        >
          <span 
            className="material-icons"
            style={{
              fontSize: '22px',
              fontWeight: '700'
            }}
          >
            search
          </span>
        </button>
      </div>
    </form>
  )
}

export default SearchBox
