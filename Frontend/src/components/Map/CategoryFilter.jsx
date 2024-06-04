import React, { useState } from 'react';

const categoriesData = [
  { id: 1, name: 'Category 1' },
  { id: 2, name: 'Category 2' },
  { id: 3, name: 'Category 3' },
  { id: 4, name: 'Category 4' },
];

const CategoryFilter = ({ setSelectedCategories }) => {
  const [categories, setCategories] = useState(categoriesData.map(category => ({ ...category, selected: false })));

  const handleCheckboxChange = (id) => {
    const updatedCategories = categories.map(category => {
      if (category.id === id) {
        return { ...category, selected: !category.selected };
      }
      return category;
    });

    setCategories(updatedCategories);

    const selectedIds = updatedCategories.filter(category => category.selected).map(category => category.id);
    setSelectedCategories(selectedIds);
  };

  return (
    <div className="category-filter">
      {categories.map(category => (
        <label key={category.id}>
          <input
            type="checkbox"
            checked={category.selected}
            onChange={() => handleCheckboxChange(category.id)}
          />
          {category.name}
        </label>
      ))}
    </div>
  );
};

export default CategoryFilter;
