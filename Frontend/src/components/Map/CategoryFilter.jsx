/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
// CategoryFilter.jsx

import { useEffect, useState } from 'react';
import { Form } from 'react-bootstrap';
import { getCategoryFromApi } from '../../services/getCategory';

const CategoryFilter = ({ selectedCategories, setSelectedCategories }) => {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const fetchedCategories = await getCategoryFromApi();
        setCategories(fetchedCategories);
        // Inicializar selectedCategories con todos los id de las categorías
        setSelectedCategories(fetchedCategories.map(category => category.id));
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    fetchCategories();
  }, []);

  const handleCheckboxChange = (id) => {
    setSelectedCategories((prevSelected) => {
      if (prevSelected.includes(id)) {
        return prevSelected.filter((categoryId) => categoryId !== id);
      } else {
        return [...prevSelected, id];
      }
    });
  };

  return (
    <Form className="row px-5">
      {categories.map((category) => (
        <div key={category.id} className="col mt-4 mb-2">
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
