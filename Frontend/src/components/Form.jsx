import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { getCategoryFromApi } from '../services/getCategory';
import { getLocation } from '../services/getLocation';
import sendReportToBackend from '../services/sendReportToBackend';
import './Form.css'

function Form() {
    const [category, setCategory] = useState([]);
    const [location, setLocation] = useState([]);
    const { register, handleSubmit, formState: { errors } } = useForm(
        {
            defaultValues: {
                description: '',
                latitude: location[0],
                longitude: location[1],
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

    return (
        <div className='form-container'>
            <form onSubmit={handleSubmit(sendReportToBackend)}>
                <h2>Crear Reporte</h2>
                <label htmlFor='title'>
                    Titulo:
                    <input type="text"
                        {...register("title", {
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
                    {errors.title && <span>{errors.title.message}</span>}
                </label>
                <label htmlFor='content'>
                    Descripcion:
                    <input type="text"
                        {...register("content", {
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
                    {errors.content && <span>{errors.content.message}</span>}
                </label>
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
                    {errors.latitude && <span>{errors.latitude.message}</span>}
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

export default Form