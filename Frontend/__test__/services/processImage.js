import ImagenDetection from '@services/ImagenDetection';

/**
 * Process an image using the ImagenDetection service.
 * 
 * @param {string} imageSrc - The source of the image in base64 format.
 * @returns {Promise<Object>} The result of the image processing.
 * @throws Will throw an error if the image processing fails.
 */
const processImage = async (imageSrc) => {
  if (!imageSrc) {
    throw new Error('Image source is required');
  }

  try {
    const detectionResult = await ImagenDetection(imageSrc);
    return detectionResult;
  } catch (error) {
    console.error('Error while detecting the image:', error);
    throw new Error('Error al detectar la imagen');
  }
};

export default processImage;
