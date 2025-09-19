# Guía de Estilo y Arquitectura del Proyecto E-commerce

Este documento es la fuente de verdad para el desarrollo de nuestra aplicación de e-commerce full-stack. Actúa como el "Model Context Protocol" (MCP) para cualquier asistente de IA o desarrollador que trabaje en el proyecto.

---

## 1. Filosofía y Principios Fundamentales

- **Calidad y Simplicidad como Prioridad:** Siempre optamos por soluciones limpias, legibles y bien estructuradas sobre atajos complejos. El código debe ser fácil de entender y mantener. Si tienes una propuesta ya sea una liberia o una forma mas profesional de hacer las cosas, puedes recomendar el uso de librerias, no te cierres a no agregar cosas nuevas al proyecto que puedan tener un gran impacto a la app.
- **Experiencia de Usuario (UX) Premium:** Cada decisión de diseño debe priorizar una experiencia de usuario fluida, intuitiva y estéticamente agradable, la idea es una UI minimalista, moderna y elegante.
- **Arquitectura Limpia:** Mantenemos una estricta separación de responsabilidades entre componentes, hooks, servicios y el estado global.

---

### 1.5. Estructura de Carpetas (`src/`)

La organización de los archivos es fundamental. Sigue esta estructura para la creación de nuevos archivos:

- **/components:** Componentes de UI reutilizables. Se organizan en subcarpetas por dominio (ej. `shop`, `common`, `product`).
- **/constants:** Valores constantes de la aplicación (ej. `colors.ts`, `appConfig.ts`).
- **/contexts:** React Contexts para la gestión de estado global del lado del cliente (ej. `AuthContext.tsx`, `FavoritesContext.tsx`).
- **/hooks:** Custom hooks de React, principalmente para la lógica de fetching de datos con TanStack Query (ej. `useProducts.ts`).
- **/locales:** Archivos de traducción JSON para i18next.
- **/navigation:** Componentes de navegación (Navigators, Stacks, Tabs).
- **/screens:** Componentes que representan una pantalla completa de la aplicación. Se organizan en subcarpetas por flujo de usuario (ej. `Home`, `Buy`, `Profile`).
- **/services:** La capa de comunicación con la API. Contiene las funciones `fetch` que llaman a los endpoints del backend.
- **/types:** Definiciones de tipos y interfaces de TypeScript.

---

### 1.5.2. Estructura de Carpetas del Backend (`backend/src/`)

El backend sigue una arquitectura MVC (Model-View-Controller) modificada, separando claramente las responsabilidades.

- **/controllers:** Contienen la lógica que maneja las peticiones (Request) y respuestas (Response) de Express. Actúan como intermediarios entre las rutas y los servicios.
- **/data:** Contiene nuestros "datos crudos" en archivos JSON. Actúa como nuestra base de datos simulada.
- **/routes:** Definen los endpoints de la API (ej. `/api/products`). Cada archivo de ruta agrupa endpoints relacionados y los asocia con una función del controlador.
- **/services:** Aquí reside la lógica de negocio principal. Las funciones de servicio son llamadas por los controladores para leer, procesar o transformar datos.
- **/types:** Definiciones de tipos de TypeScript que son compartidas a través del backend.
- **/utils:** Funciones de ayuda genéricas que pueden ser usadas en cualquier parte del backend.

---

### 1.6. Estándares de Nombrado de Archivos

Para mantener la consistencia en todo el proyecto, utiliza las siguientes convenciones de nombrado:

- **Componentes y Pantallas:** `PascalCase` (ej. `ProductCard.tsx`, `HomeScreen.tsx`).
- **Hooks:** `camelCase` con el prefijo `use` (ej. `useProductSearch.ts`).
- **Contextos:** `PascalCase` con el sufijo `Context` (ej. `AuthContext.tsx`).
- **Servicios y Utils:** `camelCase` (ej. `scaling.ts`, `formatters.ts`).
- **Tipos:** `camelCase` (ej. `product.ts`, `navigation.ts`).

---

## 2. Patrones de Arquitectura Clave

**Siempre debes seguir estos patrones:**

1.  **Backend como Cerebro de Negocio:**
    - La lógica de negocio compleja (ej. qué "badge" mostrar en un producto, qué contenido destacar) se maneja en el backend.
    - El frontend se mantiene "tonto": su trabajo es renderizar los datos que el backend le proporciona, no tomar decisiones de negocio.

2.  **Componentes de Sección Inteligentes (para `HomeScreen` y `ComprarScreen`):**
    - Las pantallas principales actúan como "directores de orquesta". Su responsabilidad es mínima: obtener datos a través de hooks y pasarlos a componentes de sección.
    - Cada componente de sección (ej. `CommunitySection`, `PromotionalHubCarousel`) es autocontenido y gestiona su propia UI.

3.  **Hooks de Datos Dedicados:**
    - **NUNCA** usar `useState` y `useEffect` para hacer fetching de datos.
    - **SIEMPRE** usar `TanStack Query (React Query)`. Cada endpoint de la API debe tener su propio hook personalizado (ej. `useProducts`, `useCategories`).

4.  **Arquitectura de IA Segura:**
    - El frontend **NUNCA** debe comunicarse directamente con APIs de IA de terceros (como Gemini).
    - El flujo es siempre: `Frontend -> Nuestro Backend -> API de IA`. Nuestro backend gestiona las claves de API y enriquece los prompts.

5.  **Tipos Sincronizados (Fuente de Verdad de Datos):**
    - La estructura de los datos que viajan entre el frontend y el backend está definida en archivos de tipos (`.ts`).
    - Cualquier tipo que represente un objeto de la API (ej. `Product`, `Category`) **DEBE** existir tanto en `frontend/src/types` como en `backend/src/types`.
    - Al crear o modificar una característica, **SIEMPRE** se debe empezar por definir o actualizar su tipo. Esto garantiza que el frontend y el backend "hablen" el mismo idioma.

---

## 3. Sistema de Diseño y Componentes Reutilizables

**Antes de crear un nuevo componente, SIEMPRE revisa si uno existente puede ser reutilizado.**

- **Colores:** Todos los colores deben importarse **exclusivamente** desde `src/constants/colors.ts`. No usar valores hexadecimales directamente en los estilos.
- **Iconos:** Usar siempre el componente `IconFactory` de `src/components/icons/IconFactory.tsx` para renderizar iconos de la librería `phosphor-react-native`.
- **Componentes Comunes Clave:**
  - `GlobalHeader`: El header estándar para todas las pantallas.
  - `SectionHeader`: El título estándar para todas las secciones de contenido.
  - `BrandIcon`: El logo oficial de la app.
  - `InfoModal`: El modal estándar para mostrar información simple.
  - `ProductCard`: La tarjeta de producto estándar para cuadrículas.
  - `AccordionItem`: Para listas desplegables de categorías.
  - `ErrorDisplay`: El componente estándar para mostrar un mensaje de error y un botón de "Reintentar". **DEBE** usarse siempre que una llamada a la API falle.
  - `EmptyState`: El componente estándar para mostrar cuando una lista o cuadrícula no tiene datos. **DEBE** usarse para evitar pantallas vacías.

---

## 4. Requerimientos No Funcionales (Obligatorios)

**Todo nuevo componente DEBE cumplir con los siguientes puntos:**

1.  **Estados de Carga (Skeletons):**
    - Cualquier componente que obtenga datos de la API y cuya carga pueda ser percibida por el usuario **DEBE** tener un estado de carga visual.
    - **SIEMPRE** usar un componente `Skeleton` dedicado (ubicado en `src/components/skeletons/`). Se prefiere un skeleton que imite la forma del contenido final sobre un spinner genérico.

2.  **Accesibilidad (a11y):**
    - Todos los elementos interactivos (`TouchableOpacity`, `Button`, etc.) **DEBEN** tener las props de accesibilidad `accessibilityRole` y `accessibilityLabel`.
    - El `accessibilityLabel` debe ser un texto descriptivo, preferiblemente obtenido de nuestros archivos de traducción para soportar múltiples idiomas.

3.  **Traducción (i18n):**
    - Todo el texto visible para el usuario **DEBE** ser manejado a través del hook `useTranslation` (`t`).
    - Para contenido dinámico que viene del backend (ej. nombres de productos), la traducción se maneja en el frontend seleccionando la clave de idioma correcta del objeto recibido (ej. `product.name[lang]`).

4.  **Layout y Estilos:**
    - Para el espaciado y tamaño de los componentes, **SIEMPRE** usar las funciones de `src/utils/scaling.ts` (`moderateScale`, `verticalScale`, `scale`).
    - Evitar el uso de `height: '100%'` en componentes hijos directos de `FlatList` o `ScrollView` para prevenir bugs de renderizado.

5.  **Optimización de Rendimiento:**
    - Las funciones pasadas como `props` a componentes hijos (especialmente en listas) **DEBEN** estar envueltas en `useCallback`.
    - Los componentes que renderizan items en una lista o que son propensos a re-renderizarse innecesariamente **DEBERÍAN** ser envueltos en `React.memo`.

6.  **Feedback de Interacción:**
    - Los elementos `TouchableOpacity` importantes (como tarjetas en un carrusel) **DEBERÍAN** proporcionar un feedback táctil claro al ser presionados, preferiblemente usando la función de estilo (`style={({ pressed }) => ...}`) para aplicar una transformación sutil (ej. `scale`).

7.  **Manejo de Errores (`catch`):**
    - Para manejar errores capturados en un bloque `try...catch`, **SIEMPRE** se debe usar la utilidad `processUnknownError` de `src/utils/errorUtils.ts`.
    - Esto garantiza un manejo de errores seguro para TypeScript y consistente en toda la aplicación.
    - **NUNCA** se debe acceder directamente a `error.message` sin una comprobación de tipo.
