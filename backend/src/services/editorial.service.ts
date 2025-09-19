import editorialsData from '../data/editorials.json';
import { EditorialCard } from '../types/editorial';

/**
 * Obtiene los datos crudos de las tarjetas editoriales.
 * La traducción se manejará en el frontend.
 */
export const getEditorials = (): EditorialCard[] => {
  // Simplemente devolvemos los datos del JSON.
  return editorialsData as EditorialCard[];
};
