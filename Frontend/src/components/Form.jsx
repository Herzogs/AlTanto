import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { getCategoryFromApi } from "../services/getCategory";
//import { getLocation } from "../services/getLocation";
import sendReportToBackend from "../services/sendReportToBackend";
import "./Form.css";

const buscarGeo = async () => {
  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const loc = {
          lat: position.coords.latitude,
          lon: position.coords.longitude,
        };
        console.log(loc);
        resolve(loc);
      },
      (error) => {
        console.error("Error getting geolocation:", error);
        reject(error);
      }
    );
  });
};

function Form() {
  const [category, setCategory] = useState([]);
  const [location, setLocation] = useState({});

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      description: "",
      latitude: "",
      longitude: ""
    },
  });

  useEffect(() => {
    const fetchGeoLocation = async () => {
      try {
        const miGeo = await buscarGeo();
        setLocation(miGeo);
        reset({
          content: "",
          latitude: miGeo.lat,
          longitude: miGeo.lon
        });
      } catch (error) {
        console.error("Error setting location:", error);
      }
    };

    const listCategories = getCategoryFromApi();
    listCategories.then((data) => {
      setCategory(data);
    });

    fetchGeoLocation();
  }, [reset]);

  return (
    <div className="form-container">
      <form onSubmit={handleSubmit(sendReportToBackend)}>
        <h2>Crear Reporte</h2>
        <label htmlFor="title">
          Título:
          <input
            type="text"
            {...register("title", {
              required: {
                value: true,
                message: "Campo requerido",
              },
              maxLength: {
                value: 50,
                message: "Máximo 50 caracteres",
              },
            })}
          />
          {errors.title && <span>{errors.title.message}</span>}
        </label>
        <label htmlFor="content">
          Descripción:
          <input
            type="text"
            id="content"
            {...register("content", {
              required: {
                value: true,
                message: "Campo requerido",
              },
              maxLength: {
                value: 50,
                message: "Máximo 50 caracteres",
              },
            })}
          />
          {errors.content && <span>{errors.content.message}</span>}
        </label>
        <label htmlFor="category">
          Categoría:
          <select
            name="category"
            {...register("category", {
              required: {
                value: true,
                message: "Campo requerido",
              },
            })}
          >
            {category.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </label>
        <label htmlFor="latitude">
          Latitud:
          <input
            type="text"
            id="latitude"
            {...register("latitude", {
              required: {
                value: true,
                message: "Campo requerido",
              },
            })}
          />
          {errors.latitude && <span>{errors.latitude.message}</span>}
        </label>
        <label htmlFor="longitude">
          Longitud:
          <input
            type="text"
            id="longitude"
            {...register("longitude", {
              required: {
                value: true,
                message: "Campo requerido",
              },
            })}
          />
          {errors.longitude && <span>{errors.longitude.message}</span>}
        </label>
        <label htmlFor="image">
          Imagen:
          <input type="file" {...register("image", {})} />
          {errors.image && <span>{errors.image.message}</span>}
        </label>

        <input type="submit" value="Enviar" />
      </form>
    </div>
  );
}

export default Form;
