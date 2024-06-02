import { Container } from 'react-bootstrap';

const Filter = ({ filters, onFilterChange }) => {
  const handleCheckboxChange = (id) => {
    const updatedFilters = filters.map(filter =>
      filter.id === id ? { ...filter, state: !filter.state } : filter
    );
    onFilterChange(updatedFilters); 
  };

  return (
    <Container className='container-filters'>
    {filters.map((filter) => (
      <label key={filter.id} className="custom-checkbox-wrapper" style={{ marginRight: '12px' }}>
        <input
          type="checkbox"
          checked={filter.state}
          onChange={() => handleCheckboxChange(filter.id)}
          className="custom-checkbox"
        />
        {filter.name}
      </label>
    ))}
  </Container>
  );
};

export default Filter;