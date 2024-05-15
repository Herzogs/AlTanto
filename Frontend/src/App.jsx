import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import './components/Formulario.css'
import { getCategoryFromApi } from './services/getCategory';
import { getLocation } from './services/getLocation';
import { sendData } from './services/senData';

/*
Proceso producto modelo de ciclo de vida
las 4 P
Planificación
riesgos
*/
function App() {
  const [category, setCategory] = useState([]);
  const [location, setLocation] = useState([]);
  const [image, setImage] = useState(null);
  const { register, handleSubmit, formState: { errors } } = useForm(
    {
      defaultValues: {
        description: 'Ingrese descripcion',
        latitude: location[0],
        longitude: location[1]
      }
    });

  useEffect(() => {
    const loc = getLocation();
    setLocation([loc[0], loc[1]]);
    const listCategories = getCategoryFromApi();
    listCategories.then((data) => {
      setCategory(data);
    });
  }, []);

  const onSubmit = handleSubmit(async (data) => {
    console.log(data);
    setImage(data.imagen[0]);
    console.log(image);
    const formData = new FormData();
    formData.append('category', data.category);
    formData.append('description', data.description);
    formData.append('latitude', data.latitude);
    formData.append('longitude', data.longitude);
    formData.append('imagen', image);
    formData.append('userid', data.userid);
    console.log(formData);
    const retorno = await sendData(formData);
    if (retorno) {
      alert('Reporte enviado correctamente');
    }else{
      alert('Error al enviar reporte');
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
        <label htmlFor='imagen'>
          Imagen:
          <input type="file"
            {...register('imagen')} />
        </label>
        <br />
        <label htmlFor='userid'>
          Usuario:
          <input type="text"
            {...register('userid', {
              required: {
                value: true,
                message: 'Campo requerido'
              }
            })}
          />
        </label>
        <input type="submit" value="Enviar" />
      </form>
      {image && <img src={URL.createObjectURL(image)} alt="imagen" />}
    </div>
  );
}

export default App
