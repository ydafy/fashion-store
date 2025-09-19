// Este archivo le enseña a TypeScript a entender las importaciones de archivos .svg

// Le decimos a TypeScript que declare un nuevo tipo de módulo
declare module '*.svg' {
  import React from 'react';
  import { SvgProps } from 'react-native-svg';
  // El contenido del módulo es un componente de React que acepta props de SVG
  const content: React.FC<SvgProps>;
  export default content;
}
