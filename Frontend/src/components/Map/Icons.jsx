// src/components/Map/Icons.js
import L from 'leaflet';
import iconOrange from '@assets/iconOrange.png';
import iconRed from '@assets/iconRed.png';
import iconBlue from '@assets/iconBlue.png';
import iconGreen from '@assets/iconGreen.png';
import iconYellow from '@assets/iconYellow.png';


const iconSize = [32, 32];
const iconAnchor = [0, 32];
const popupAnchor = [0, -32];

export const icons = {
  default: L.icon({
    iconUrl: iconOrange, 
    iconSize: iconSize,
    iconAnchor: iconAnchor,
    popupAnchor: popupAnchor
  }),
  category1: L.icon({
    iconUrl: iconRed, 
    iconSize: iconSize,
    iconAnchor: iconAnchor,
    popupAnchor: popupAnchor
  }),
  category2: L.icon({
    iconUrl: iconBlue, 
    iconSize: iconSize,
    iconAnchor: iconAnchor,
    popupAnchor: popupAnchor
  }),
  category3: L.icon({
    iconUrl: iconGreen, 
    iconSize: iconSize,
    iconAnchor: iconAnchor,
    popupAnchor: popupAnchor
  }),
  category4: L.icon({
    iconUrl: iconYellow, 
    iconSize: iconSize,
    iconAnchor: iconAnchor,
    popupAnchor: popupAnchor
  })
};

export const getIconByCategoryId = (categoryId) => {
  switch (categoryId) {
    case 1:
      return icons.category1;
    case 2:
      return icons.category2;
    case 3:
      return icons.category3;
    case 4:
      return icons.category4;
    default:
      return icons.default;
  }
};
