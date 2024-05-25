import React, { useState, useEffect } from 'react';
import * as tf from '@tensorflow/tfjs';

function App() {
  const [image, setImage] = useState(null);
  const [title, setTitle] = useState('');
  const [result, setResult] = useState('');
  const [model, setModel] = useState(null);
  const [categories, setCategories] = useState(null);


  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const labelsResponse = await fetch('/lobeAi/labels.txt');
        const labelsText = await labelsResponse.text();
        const categories = labelsText.split('\n').map(category => category.trim()).filter(category => category !== '');    
        setCategories(categories);
      } catch (error) {
        console.error('Error al buscar las categorías:', error);
      }
    };
  
    fetchCategories();
  }, []);
  
  useEffect(() => {
    const loadModel = async () => {    
      const modelPath = '/lobeAi/model.json';
      try {       

        const loadedModel = await tf.loadLayersModel(modelPath);
         setModel(loadedModel);
      } catch (error) {
        console.error('Error al cargar el modelo:', error);
      }
    };

    loadModel();
  }, []);

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onload = () => {
      setImage(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const preprocessImage = (imageDataUrl) => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = 224; // Ajusta el tamaño según las especificaciones de tu modelo
        canvas.height = 224;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, 224, 224);
        const imageData = ctx.getImageData(0, 0, 224, 224);
        const tensor = tf.browser.fromPixels(imageData).toFloat().expandDims();
        resolve(tensor);
      };
      img.onerror = reject;
      img.src = imageDataUrl;
    });
  };

  const analyzeImage = async () => {
    try {
      if (!model) {
        console.error('El modelo no ha sido cargado.');
        return;
      }

      if (!image) {
        console.error('Por favor, carga una imagen.');
        return;
      }

      const tensor = await preprocessImage(image);

      const predictions = await model.predict(tensor).array();

      const resultArray = predictions[0]; 
      console.log(resultArray); 


      const maxProbabilityIndex = resultArray.indexOf(Math.max(...resultArray));      
    
      const predictedCategory = categories[maxProbabilityIndex];
      console.log('Categoría predicha:', predictedCategory);

      setResult(predictedCategory);
    } catch (error) {
      console.error('Error al realizar la inferencia:', error);
    }
  };

  return (
<div>
      <h1>Cargar Imagen y Obtener Resultado</h1>
      <input type="file" onChange={handleImageUpload} accept="image/*" />
      <br />
      <input
        type="text"
        placeholder="Título de la Imagen"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <br />
      <button onClick={analyzeImage}>Analizar Imagen</button>
      <br />
      {image && (
        <div>
          <h2>Imagen Cargada:</h2>
          <img src={image} alt="Cargado" />
          <h3>Título: {title}</h3>
        </div>
      )}
      {result && (
        <div>
          <h2>Resultado de la Inferencia:</h2>
          <pre>{JSON.stringify(result, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}

export default App;
