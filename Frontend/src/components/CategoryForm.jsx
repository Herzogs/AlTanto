import { useForm } from 'react-hook-form';

function CategoryForm() {
   

    const { register, handleSubmit, formState: { errors } } = useForm(
        {
            defaultValues: {
                category: '',
            }
        });

    const sendCategory = (data) => {
        console.log(data);
        const response = fetch('http://localhost:3000/api/categories', {
            method: 'POST',
            body: JSON.stringify({name: data.name}),
            headers: {
                'Content-Type': 'application/json'
            }
        });
        response.then((res) => {
            if (res.status === 201) {
                alert('Categoria creada');
            } else {
                alert('Error al crear categoria');
            }
        });
    }

    return (
        <div className='form-container'>
            <form onSubmit={handleSubmit(sendCategory)}>
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
        </div>
    );
}

export default CategoryForm