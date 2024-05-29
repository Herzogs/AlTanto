import * as tf from '@tensorflow/tfjs';

const ImagenDetection = async (photo) => {
  const modelPath = '/lobeAi/model.json';
  const labelsPath = '/lobeAi/labels.txt';
  let idCategory = "";

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
    const maxProbabilityIndex = resultArray.indexOf(Math.max(...resultArray));
    console.log("maxProbabilityIndex:", maxProbabilityIndex);

    let title = categories[maxProbabilityIndex]; // La categoría detectada se convierte en título para machear con los filtros de la BD
    console.log("Título:", title);
    let category = "";
    if (title == "Choque Automovilistico") {
      idCategory = 1;
    }
    if (title == "none2") {
      idCategory = 0;
    }

    const response = { title, idCategory };

    return response;
  } catch (error) {
    console.error('Error al realizar la inferencia:', error);
    throw error;
  }
};

export default ImagenDetection;
