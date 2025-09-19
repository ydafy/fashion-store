# Patrones de Código Comunes

Este archivo contiene ejemplos de código de nuestro proyecto que representan nuestros patrones de desarrollo estándar. Úsalos como base para crear nuevas funcionalidades.

---

### Hook de TanStack Query Estándar

Este es el patrón para cualquier hook que obtiene datos de la API. Está basado en `useCategories.ts`.

**Ubicación:** `src/hooks/`
**Ejemplo:**
\`\`\`typescript
import { useQuery } from '@tanstack/react-query';
import { getCategories } from '../services/category';
import i18n from '../config/i18n';

export const useCategories = () => {
const lang = i18n.language;
return useQuery({
queryKey: ['categories', lang], // La clave SIEMPRE debe incluir el recurso y el idioma.
queryFn: getCategories,
staleTime: 1000 _ 60 _ 5, // 5 minutos de cache por defecto.
});
};
\`\`\`

---

### Componente de Sección Complejo (Patrón Avanzado)

Este es el patrón para crear y consumir componentes de sección que obtienen y renderizan una lista de datos. Está basado en `EditorialSection.tsx` y es nuestro **estándar de oro**.

---

#### Parte 1: Definir Constantes de UI

Para componentes complejos, agrupa todos los valores "mágicos" (tamaños, opacidades, etc.) en un objeto de constantes para máxima mantenibilidad.

**Ubicación:** `src/constants/ui.ts` (o similar)
**Ejemplo:**
\`\`\`typescript
export const EDITORIAL = {
SKELETON_COUNT: 3,
CARD_WIDTH: 250,
CARD_HEIGHT: 370,
TOUCH_CONFIG: {
ACTIVE_OPACITY: 0.7,
},
ANIMATION: {
SCALE_PRESSED: 0.97,
},
} as const;
\`\`\`

---

#### Parte 2: Creación del Componente de Sección (ej. `MySection.tsx`)

**Características Clave:**

- Componente principal y sub-componentes de lista envueltos en `React.memo`.
- Todas las funciones `handler` y de renderizado envueltas en `useCallback`.
- Uso de `style={({ pressed }) => ...}` para feedback táctil.

**Ejemplo de Estructura:**
\`\`\`typescript
import React, { useCallback, memo } from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
// ...

// Sub-componente memoizado para el item de la lista
const MyCard = memo(({ item, onPress }) => {
return (
<TouchableOpacity
onPress={() => onPress(item)}
style={({ pressed }) => [
styles.cardContainer,
pressed && styles.cardPressed, // Estilo condicional al presionar
]} >
{/_ ... JSX de la tarjeta ... _/}
</TouchableOpacity>
);
});

// Componente principal
const MySection: React.FC = () => {
const { data, status, refetch } = useMyData();

const handlePress = useCallback((item) => { /_ ... _/ }, []);

const renderCards = useCallback(() => {
return data.map(item => (
<MyCard key={item.id} item={item} onPress={handlePress} />
));
}, [data, handlePress]);

// ... switch (status) que llama a renderCards() ...
};

const styles = StyleSheet.create({
// ...
cardPressed: {
transform: [{ scale: 0.97 }],
opacity: 0.9,
},
});

export default memo(MySection);
\`\`\`

---

#### Parte 3: Consumo del Componente en una Pantalla (ej. `ComprarScreen.tsx`)

La pantalla contenedora simplemente importa y renderiza el componente. La lógica de datos ya está encapsulada.

**Ejemplo de Integración:**
\`\`\`typescript
import MySection from '../components/shop/MySection';
// ...

const ComprarScreen: React.FC = () => {
// ... otros hooks y lógica de la pantalla

return (
<ScrollView>
<PromotionalHubCarousel />
<QuickFiltersGrid />

      {/* La integración es una sola línea, limpia y declarativa */}
      <MySection />

      {renderCategories()}
    </ScrollView>

);
};
\`\`\`

---

### Estructura de un Servicio de API

Este es el patrón para una función que llama a un endpoint del backend. Está basado en `category/index.ts`.

**Ubicación:** `src/services/`
**Ejemplo:**
\`\`\`typescript
import { API_BASE_URL } from '../../config/api';
import i18n from '../../config/i18n';
import { Category } from '../../types/category';

export const getCategories = async (): Promise<Category[]> => {
const lang = i18n.language;
const headers = { 'Accept-Language': lang };
const url = `${API_BASE_URL}/api/categories`;

const response = await fetch(url, { headers });

if (!response.ok) {
throw new Error('Failed to fetch categories');
}

return response.json();
};
\`\`\`

### Patrón para un Handler Asíncrono con `catch`

Este es el patrón para funciones que realizan operaciones asíncronas (como añadir al carrito) y necesitan manejar posibles errores.

**Ejemplo:**
\`\`\`typescript
import { processUnknownError } from '../../utils/errorUtils';
import Toast from 'react-native-toast-message';
// ...

const handleSomeAction = async () => {
try {
// ... código que podría fallar
await someApiService();

    Toast.show({ type: 'success', text1: 'Éxito' });

} catch (error) {
// ✨ USAMOS NUESTRA UTILIDAD ESTÁNDAR
const processedError = processUnknownError(error);

    Toast.show({
      type: 'error',
      text1: t('common:error'),
      text2: t(processedError.messageKey, processedError.fallbackMessage),
    });

}
};
\`\`\`
