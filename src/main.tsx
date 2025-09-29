
import { createRoot } from 'react-dom/client';
import App from './App.tsx';

console.log("main.tsx is loading - minimal setup");

// Create and render the root component
createRoot(document.getElementById("root")!).render(<App />);
