import * as tf from '@tensorflow/tfjs';


const ImagenDetection = async (photo) => {
  const modelPath = '/lobeAi/model.json';
  const labelsPath = '/lobeAi/labels.txt';

  try {
    // Cargar el modelo
    const model = await tf.loadLayersModel(modelPath);

    // Cargar las categorías
    const labelsResponse = await fetch(labelsPath);
    const labelsText = await labelsResponse.text();
    const categories = labelsText.split('\n').map(category => category.trim()).filter(category => category !== '');

    // Preprocesar la imagen
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
        img.onerror = (error) => {
          console.error('Error al cargar la imagen:', error);
          reject(error);
        };
        img.src = imageDataUrl;
      });
    };

    // Preprocesar y analizar la imagen
    const tensor = await preprocessImage(photo);
    const predictions = await model.predict(tensor).array();
    const resultArray = predictions[0];
    // Encontrar la categoría con la mayor probabilidad
    const maxProbabilityIndex = resultArray.indexOf(Math.max(...resultArray));

    let title = categories[maxProbabilityIndex]; // la categoria detectada se convierte en titulo para machear con los filtos de la bd
    console.log("titulo resultado =====> " + title);
    // tomo arbol bien como que esta mal, no tiene que reconocerlo
    // daria un reintente
    // falta toda la logica de machear con la bd
    
    const response = title === 'arbol bien' ? { title: '', category: '', idCategory: 0 } : { title, category: 'seguridad', idCategory: 1 };

    return response;
  } catch (error) {
    console.error('Error al realizar la inferencia:', error);
    throw error;
  }
};

export default ImagenDetection;
