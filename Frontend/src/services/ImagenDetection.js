import * as tf from '@tensorflow/tfjs';

const ImagenDetection = async (photo) => {
  const modelPath = '/lobeAi/model.json';
  const labelsPath = '/lobeAi/labels.txt';
  let title = "";
  let category = "none";

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
          const tensor = tf.browser.fromPixels(imageData).toFloat().expandDims(0).div(tf.scalar(255));
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
    console.log("Probabilidades:", resultArray);

    // Encontrar la categoría con la mayor probabilidad
    const maxProbability = Math.max(...resultArray);
    const maxProbabilityIndex = resultArray.indexOf(maxProbability);
    console.log("maxProbabilityIndex:", maxProbabilityIndex);
    console.log("maxProbability:", maxProbability);

    if (maxProbability < 0.7 || maxProbability > 1) {
      return { title: "none", category: "none" };
    }

    // extraigo la categoria dle modelo_
    const detectedLabel = categories[maxProbabilityIndex];
    const [detectedTitle, detectedCategory] = detectedLabel.split('_');
    title = detectedTitle;
    category = detectedCategory;
    console.log("Título:", title);
    console.log("Categoría:", category);


    const response = { title,  category };

    return response;
  } catch (error) {
    console.error('Error en la detección de la imagen:', error);
    return { title: "", category: "none" };
  }
};

export default ImagenDetection;
