import React, { useState } from "react";
import { isMobile } from "react-device-detect";

interface SearchBoxProps {
  onSearch: (query: string) => void;
}

export const SearchBox: React.FC<SearchBoxProps> = ({ onSearch }) => {
  const [query, setQuery] = useState("");

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value.toLowerCase());
  };

  const handleInputInvalid = (event: React.ChangeEvent<HTMLInputElement>) => {
    event.target.setCustomValidity("Please enter a valid .eth name");
  };

  const handleInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    event.target.setCustomValidity("");
  };

  const handleFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSearch(query);
  };

  return (
    <form className="flex-column-sans-justify" onSubmit={handleFormSubmit}>
      <div className="flex-row-sans-justify">
        <input
          type="text"
          placeholder={"search".toLowerCase()}
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
            height: "38px",
            width: "50px",
            marginLeft: "15px",
          }}
          type="submit"
          data-tooltip="Search"
          disabled={!query.length}
        >
          <span
            className="material-icons"
            style={{
              fontSize: "22px",
              fontWeight: "700",
            }}
          >
            search
          </span>
        </button>
      </div>
    </form>
  );
};

export const BigSearch: React.FC<SearchBoxProps> = ({ onSearch }) => {
  const [query, setQuery] = useState("");

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value.toLowerCase());
  };

  const handleInputInvalid = (event: React.ChangeEvent<HTMLInputElement>) => {
    event.target.setCustomValidity("Please enter a valid .eth name");
  };

  const handleInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    event.target.setCustomValidity("");
  };

  const handleFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSearch(query);
  };

  return (
    <form
      style={{
        display: "flex",
        alignItems: "center",
        flexDirection: "column",
      }}
      onSubmit={handleFormSubmit}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          flexDirection: "row",
        }}
      >
        <input
          className="input-main"
          type="text"
          placeholder={isMobile ? "search" : "search domain"}
          value={query.toLowerCase()}
          name=".eth search"
          id="eth-search"
          onChange={handleInputChange}
          onInvalid={handleInputInvalid}
          onInput={handleInput}
          required
          pattern=".*\.eth$"
          title="❗ Input must end with '.eth'"
          style={{
            fontFamily: query ? "SF Mono" : "Spotnik",
            fontWeight: "600",
            fontSize: query ? "22px" : "17px",
            paddingTop: query ? "8px" : "17px",
            paddingBottom: query ? "8px" : "15px",
          }}
        />
        <button
          className="button"
          style={{
            height: "46px",
            width: "80px",
            marginLeft: "20px",
          }}
          type="submit"
          data-tooltip="Search"
          disabled={!query.length}
        >
          <span
            className="material-icons"
            style={{
              fontSize: "28px",
              fontWeight: "700",
            }}
          >
            search
          </span>
        </button>
      </div>
    </form>
  );
};
