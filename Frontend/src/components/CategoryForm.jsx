import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { getCategoryFromApi } from '../services/getCategory';

function CategoryForm() {
    const [category, setCategory] = useState([])
    const [status, setStatus] = useState(false)

    const { register, handleSubmit, formState: { errors } } = useForm(
        {
            defaultValues: {
                category: '',
            }
        });

    useEffect(() => {
        const listCategories = getCategoryFromApi();
        listCategories.then((data) => {
            setCategory(data);
        });
    }, [status]);

    const sendReportToBackend = (data) => {
        console.log(data);
        const response = fetch('http://localhost:3000/api/category/create-category', {
            method: 'POST',
            body: JSON.stringify({name: data.name}),
            headers: {
                'Content-Type': 'application/json'
            }
        });
        response.then((res) => {
            if (res.status === 201) {
                setStatus(!status);
                alert('Categoria creada');
            } else {
                alert('Error al crear categoria');
            }
        });
    }

    return (
        <div className='form-container'>
            <form onSubmit={handleSubmit(sendReportToBackend)}>
                <h2>Crear Categoria</h2>
                <label htmlFor='name'>
                    Name:
                    <input type="text"
                        {...register("name", {
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
                    {errors.name && <span>{errors.name.message}</span>}
                </label>
                <input type="submit" value="Enviar" />
            </form>

            <section className='tableCategories'>
                <table>
                    <thead>
                        <tr>
                            <th>Nombre</th>
                        </tr>
                    </thead>
                    <tbody>
                        {category.map((cat) => (
                            <tr key={cat.id}>
                                <td>{cat.name}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </section>
        </div>
    );
}

export default CategoryForm