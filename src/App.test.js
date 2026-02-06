import { render } from '@testing-library/react';
import App from './App';

test('renders gallery with image', () => {
  const { container } = render(<App />);
  const imageElement = container.querySelector('.gallery-image');
  expect(imageElement).toBeInTheDocument();
  expect(imageElement.tagName).toBe('IMG');
});
