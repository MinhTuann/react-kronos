import { createBrowserRouter } from 'react-router-dom';
import MainLayout from '@/layouts/MainLayout';
import HomePage from '@/pages/HomePage';
import CollectionsPage from '@/pages/CollectionsPage';
import WatchDetailsPage from '@/pages/WatchDetailsPage';
import AboutUsPage from '@/pages/AboutUsPage';
import ContactUsPage from '@/pages/ContactUsPage';

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
            {
                path: 'watch/:id',
                element: <WatchDetailsPage />,
            },
            {
                path: 'about-us',
                element: <AboutUsPage />,
            },
            {
                path: 'contact-us',
                element: <ContactUsPage />,
            },
        ],
    },
], {
    basename: import.meta.env.BASE_URL
});