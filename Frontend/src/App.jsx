import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { getCategoryFromApi } from './services/getCategory';
import { getLocation } from './services/getLocation';
import  sendReportToBackend from './services/sendReportToBackend';
import './components/Formulario.css'

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

  return (
    <div className='form-container'>
      <form onSubmit={handleSubmit(sendReportToBackend)}>
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
        <label htmlFor='image'>
            Imagen:
            <input type="file"
                {...register('image', {
                required: {
                    value: true,
                    message: 'Campo requerido'
                }
                })}
            />
            {errors.image && <span>{errors.image.message}</span>}
        </label>

        
        <input type="submit" value="Enviar" />
      </form>
      
    </div>
  );
}

export default App
