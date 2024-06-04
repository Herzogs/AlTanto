// Map/CategoryFilter.jsx

import {  useEffect} from 'react';
import { Form } from 'react-bootstrap';


import { getCategoryFromApi } from '../../services/getCategory';

const categories =  await getCategoryFromApi();

const CategoryFilter = ({ selectedCategories, setSelectedCategories }) => {
  const handleCheckboxChange = (id) => {
    setSelectedCategories((prevSelected) => {
      if (prevSelected.includes(id)) {
        return prevSelected.filter((categoryId) => categoryId !== id);
      } else {
        return [...prevSelected, id];
      }
    });
  };

  useEffect(() => {
    setSelectedCategories(categories.map(category => category.id));
  }, []);

  return (
    <Form className="row category-filter-container">
    {categories.map((category) => (
      <div key={category.id} className="col">
        <Form.Check
          type="checkbox"
          id={`category-${category.id}`}
          label={category.name}
          checked={selectedCategories.includes(category.id)}
          onChange={() => handleCheckboxChange(category.id)}
          className="category-checkbox"
        />
      </div>
    ))}
  </Form>
  );
};

export default CategoryFilter;
export { categories }; 

