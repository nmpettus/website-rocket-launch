
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { logEnvironment } from './utils/environmentUtils';

// Log the current mode for debugging purposes
logEnvironment();

// Create and render the root component
createRoot(document.getElementById("root")!).render(<App />);
