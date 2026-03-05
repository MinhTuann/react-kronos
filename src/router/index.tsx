import { createBrowserRouter } from 'react-router-dom';
import MainLayout from '@/layouts/MainLayout';
import HomePage from '@/pages/HomePage';
import CollectionsPage from '@/pages/CollectionsPage';

export const router = createBrowserRouter([
    {
        path: '/',
        element: <MainLayout />,
        children: [
            {
                index: true,
                element: <HomePage />,
            },
            {
                path: 'collections',
                element: <CollectionsPage />,
            },
        ],
    },
], {
    basename: import.meta.env.BASE_URL
});