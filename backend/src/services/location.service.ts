import pickupLocationsData from '../data/pickup_locations.json';
import { PickupLocation } from '../types/pickup_location';
import hierarchicalLocationsData from '../data/locations.json';
import { Country } from '../types/locations';

/**
 * @description Obtiene las ubicaciones de recogida, opcionalmente filtradas por ciudad y país.
 * @param {string} [city] - La ciudad por la que filtrar.
 * @param {string} [country] - El país por el que filtrar.
 * @returns {PickupLocation[]} Un array de ubicaciones de recogida que coinciden.
 */
const normalize = (str: string) =>
  str
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');

export const getPickupLocations = (
  city?: string,
  country?: string
): PickupLocation[] => {
  if (!city || !country) {
    return pickupLocationsData;
  }

  // ✨ LA LÓGICA DE FILTRADO AHORA ES MÁS SIMPLE ✨
  // 'city' y 'country' que llegan como parámetros ya están normalizados desde el frontend.
  return pickupLocationsData.filter(
    (location) =>
      normalize(location.city) === city &&
      normalize(location.country) === country
  );
};

export const getHierarchicalLocations = (): Country[] => {
  return hierarchicalLocationsData;
};
