import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import './components/Formulario.css'
import { getCategoryFromApi } from './services/getCategory';
import { getLocation } from './services/getLocation';


function App() {
  const [category, setCategory] = useState([]);
  const [location, setLocation] = useState([]);
  const { register, handleSubmit, formState: { errors } } = useForm(
    {
      defaultValues: {
        description: '',
        latitude:  location[0],
        longitude: location[1],
      }
    });

  useEffect(() => {
    const loc = getLocation();
    console.log(loc);
    setLocation([loc[0], loc[1]]);
    const listCategories = getCategoryFromApi();
    listCategories.then((data) => {
      setCategory(data);
    });
  }, []);

  const onSubmit = handleSubmit(async (data) => {
    console.log(data);
    const response = await fetch('http://localhost:3000/api/report/create-report', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        description: data.description,
        categoryId: +data.category,
        latitude: data.latitude,
        longitude: data.longitude
      })
    });

    if(response.ok){
      alert('Reporte creado correctamente');
    }
  });

  return (
    <div className='form-container'>
      <form onSubmit={onSubmit}>
        <h2>Crear Reporte</h2>
        <label htmlFor='category'>
          Categoria:
          <select name="category"
            {...register('category',
              {
                required: {
                  value: true,
                  message: 'Campo requerido'
                }
              }
            )}>
            {category.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </label>
        <label htmlFor='description'>
          Descripcion:
          <input type="text"
            {...register("description", {
              required: {
                value: true,
                message: 'Campo requerido'
              },
              maxLength: {
                value: 50,
                message: 'Maximo 50 caracteres'
              }
            })}
          />
          {errors.description && <span>{errors.description.message}</span>}
        </label>
        <br />
        <label htmlFor='latitude'>
          Latitud:
          <input type="text"
          value={location[0]}
            {...register('latitude', {
              required: {
                value: true,
                message: 'Campo requerido'
              }
            })}
          />
          {errors.latitude && <span>{errors.latitude.message}</span>}
        </label>
        <label htmlFor='longitude'>
          Longitud:
          <input type="text"
          value={location[1]}
            {...register('longitude', {
              required: {
                value: true,
                message: 'Campo requerido'
              }
            })}
        
        />
        </label>

        
        <input type="submit" value="Enviar" />
      </form>
      
    </div>
  );
}

export default App
