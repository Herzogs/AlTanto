import React, { useEffect, useState } from "react";
import { Dropdown, Form } from "react-bootstrap";
import { getCategoryFromApi } from "@services/getCategory";
import iconRed from "@assets/iconRed.png";
import iconBlue from "@assets/iconBlue.png";
import iconGreen from "@assets/iconGreen.png";
import iconYellow from "@assets/iconYellow.png";
import iconOrange from "@assets/iconOrange.png";
import "./styles.css";
import FilterListIcon from "@mui/icons-material/FilterList";

const Filter = ({ selectedCategories, setSelectedCategories }) => {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const fetchedCategories = await getCategoryFromApi();
        const filteredCategories = fetchedCategories.filter(
          (category) => category.id !== 5
        );
        setCategories(filteredCategories);
        // Inicializar selectedCategories con todos los id de las categorías
        setSelectedCategories(
          filteredCategories.map((category) => category.id)
        );
      } catch (error) {
        console.error("Error fetching categories:", error);
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

  const getIcon = (categoryId) => {
    switch (categoryId) {
      case 1:
        return <img src={iconRed} />;
      case 2:
        return <img src={iconBlue} />;
      case 3:
        return <img src={iconGreen} />;
      case 4:
        return <img src={iconYellow} />;
      default:
        return <img src={iconOrange} />;
    }
  };

  return (
    <Form className="form-filter">
      <section className="form-filter-mobile">
        <Dropdown>
          <Dropdown.Toggle className="form-filter_button" id="dropdown-basic">
            <FilterListIcon />
          </Dropdown.Toggle>

          <Dropdown.Menu>
            {categories.map((category) => (
              <div key={category.id} className="d-flex mb-2">
                <Form.Check
                  type="checkbox"
                  id={`category-${category.id}`}
                  label={category.name}
                  checked={selectedCategories.includes(category.id)}
                  onChange={() => handleCheckboxChange(category.id)}
                />
                {getIcon(category.id)}
              </div>
            ))}
          </Dropdown.Menu>
        </Dropdown>
      </section>

      <section className="form-filter-desktop">
        {categories.map((category) => (
          <div key={category.id} className="form-filter_pild">
            <Form.Check
              type="checkbox"
              id={`category-${category.id}`}
              label={category.name}
              checked={selectedCategories.includes(category.id)}
              onChange={() => handleCheckboxChange(category.id)}
            />
            {getIcon(category.id)}
          </div>
        ))}
      </section>
    </Form>
  );
};

export default Filter;
