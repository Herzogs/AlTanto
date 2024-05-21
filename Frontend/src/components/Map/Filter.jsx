import React, { useState } from 'react';
import { Container } from 'react-bootstrap';

const Filter = ({ filters, onFilterChange }) => {
  const handleCheckboxChange = (id) => {
    const updatedFilters = filters.map(filter =>
      filter.id === id ? { ...filter, state: !filter.state } : filter
    );
    onFilterChange(updatedFilters); 
  };

  return (
    <Container>
      {filters.map((filter) => (
        <label key={filter.id} style={{ marginRight: '12px' }}>
          <input
            type="checkbox"
            checked={filter.state}
            onChange={() => handleCheckboxChange(filter.id)}
            style={{ marginRight: '12px' }}
          />
          {filter.description}
        </label>
      ))}
    </Container>
  );
};

export default Filter;
