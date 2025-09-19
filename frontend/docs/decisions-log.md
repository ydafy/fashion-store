# Registro de Decisiones de Arquitectura

Este documento registra las decisiones técnicas y de arquitectura clave tomadas durante el desarrollo. Sirve como memoria para el equipo (incluyendo asistentes de IA) para entender el "porqué" detrás de nuestras elecciones.

---

### 2025-05-19: Estrategia de "Memoria" para el Agente de IA

- **Decisión:** Adoptar un enfoque de "Memoria Selectiva" usando archivos Markdown en la carpeta `/docs`, en lugar de un historial de conversación cronológico.
- **Razón:** Es más eficiente en tokens, proporciona contexto de mayor calidad a la IA y es más escalable. Los archivos clave son `style-guide.md`, `decisions-log.md` y `common-patterns.md`.

### 2025-05-18: Estrategia de Traducción

- **Decisión:** El backend siempre enviará datos con objetos de traducción (`{es: '...', en: '...'}`). El frontend es responsable de la traducción en el momento de renderizar, usando `i18n.language` para seleccionar la clave.
- **Razón:** Permite el cambio de idioma en la app sin necesidad de recargar datos del servidor, mejorando la UX.

### 2025-05-17: Navegación desde Modales (`BottomSheetModal`)

- **Decisión:** Los componentes renderizados dentro de un `BottomSheetModal` no deben usar el hook `useNavigation` directamente. El componente del modal debe obtener la instancia de `navigation` y pasarla a sus hijos a través de props como `onPress`.
- **Razón:** Evita crashes de contexto de navegación causados por la técnica de "Portal" que usa la librería `@gorhom/bottom-sheet`.

### 2025-05-20: Adopción de Patrones de Rendimiento Avanzados

- **Decisión:** Para componentes complejos que renderizan listas o reciben `props` que podrían cambiar, se debe adoptar un patrón de optimización de rendimiento que incluye `React.memo` para el componente principal y los sub-componentes de la lista, y `useCallback` para todas las funciones `handler` pasadas como `props`.
- **Razón:** Previene re-renders innecesarios, mejorando la fluidez de la UI, especialmente en dispositivos de gama baja. El componente `EditorialSection.tsx` es el ejemplo canónico de esta implementación.

### 2025-11-15: Estandarización del Manejo de Errores

- **Decisión:** Se establece el uso obligatorio de la utilidad `processUnknownError` de `errorUtils.ts` para todos los bloques `try...catch` en la aplicación.
- **Razón:** Para garantizar un manejo de errores seguro para TypeScript (tipo `unknown`), centralizar la lógica de procesamiento de errores y mejorar la consistencia en los mensajes de error mostrados al usuario.
