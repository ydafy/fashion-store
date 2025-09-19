import React from 'react';
import { render } from '@testing-library/react-native';
import EmptyState from '../EmptyState'; // Ajusta la ruta si es necesario
import { Text } from 'react-native'; // Un icono simple para la prueba

// 'describe' agrupa los tests para el componente <EmptyState />
describe('<EmptyState />', () => {
  // 'it' define un test individual. Este es el que faltaba.
  it('should render the message provided', () => {
    // 1. Renderiza el componente con las props mínimas
    const { getByText } = render(
      <EmptyState message="No hay nada aquí" icon={<Text>Icono</Text>} />,
    );

    // 2. Busca el texto en la pantalla, como lo haría un usuario
    const messageElement = getByText('No hay nada aquí');

    // 3. Verifica que el elemento es visible
    expect(messageElement).toBeOnTheScreen();
  });
});
