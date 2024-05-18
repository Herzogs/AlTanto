import React, { useState } from 'react';

const Filter = ({ filters, onFilterChange }) => {
  const handleCheckboxChange = (id) => {
    const updatedFilters = filters.map(filter =>
      filter.id === id ? { ...filter, state: !filter.state } : filter
    );
    onFilterChange(updatedFilters); 
  };

  return (
    <div>
      {filters.map((filter) => (
        <label key={filter.id} style={{ marginRight: '10px' }}>
          <input
            type="checkbox"
            checked={filter.state}
            onChange={() => handleCheckboxChange(filter.id)}
          />
          {filter.description}
        </label>
      ))}
    </div>
  );
};

export default Filter;
