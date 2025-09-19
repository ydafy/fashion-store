import React from 'react';

import FlagMX from '../../assets/images/flags/mexicoFlag.svg';
import FlagUS from '../../assets/images/flags/usaLogo.svg';

// ✨ 2. DEFINIMOS LA "FORMA" DE UN OBJETO DE IDIOMA
export interface Language {
  code: 'es' | 'en'; // El código que usa i18next
  name: string; // El nombre que ve el usuario
  flag: React.FC<any>; // El componente SVG de la bandera
}

// ✨ 3. CREAMOS NUESTRA LISTA DE IDIOMAS SOPORTADOS
// Esta será la única fuente de verdad para el selector de idioma.
export const supportedLanguages: Language[] = [
  {
    code: 'es',
    name: 'Español',
    flag: FlagMX,
  },
  {
    code: 'en',
    name: 'English',
    flag: FlagUS,
  },
];
