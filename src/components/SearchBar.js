import React, { useState } from "react";
import "../styles/SearchBar.css";

function SearchBar({ searchTerm, setSearchTerm, handleSort, handleFilter }) {
  const [filterValues, setFilterValues] = useState({
    category: "",
    minPrice: "",
    maxPrice: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFilterValues({ ...filterValues, [name]: value });
    handleFilter({ ...filterValues, [name]: value }); // Update the parent component
  };

  return (
    <div className="search-bar-container">
      <input
        type="text"
        placeholder="Search by name"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="search-input"
      />

      <select onChange={(e) => handleSort(e.target.value)} className="sort-dropdown">
        <option value="">Sort By</option>
        <option value="name-asc">Name (A-Z)</option>
        <option value="name-desc">Name (Z-A)</option>
        <option value="price-asc">Price (Low-High)</option>
        <option value="price-desc">Price (High-Low)</option>
      </select>

      <select
        name="category"
        value={filterValues.category}
        onChange={handleInputChange}
        className="filter-dropdown"
      >
        <option value="">All Categories</option>
        <option value="mobiles">Mobiles</option>
        <option value="electronics">Electronics</option>
        <option value="fashion">Fashion</option>
      </select>

      <input
        type="number"
        name="minPrice"
        placeholder="Min Price"
        value={filterValues.minPrice}
        onChange={handleInputChange}
        className="filter-input"
      />

      <input
        type="number"
        name="maxPrice"
        placeholder="Max Price"
        value={filterValues.maxPrice}
        onChange={handleInputChange}
        className="filter-input"
      />
    </div>
  );
}

export default SearchBar;
