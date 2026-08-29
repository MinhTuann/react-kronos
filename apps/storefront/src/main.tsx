import ReactDOM from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import { router } from './router';
import './index.css';
import './lib/i18n';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <RouterProvider router={router} />,
);
