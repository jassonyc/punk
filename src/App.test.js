import { render } from '@testing-library/react';
import App from './App';

test('renders gallery with centered image', () => {
  const { container } = render(<App />);
  const galleryContainer = container.querySelector('.gallery-container');
  const galleryImage = container.querySelector('.gallery-image');
  
  expect(galleryContainer).toBeInTheDocument();
  expect(galleryImage).toBeInTheDocument();
  expect(galleryImage).toHaveAttribute('draggable', 'false');
});
