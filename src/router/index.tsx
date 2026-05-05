import { createBrowserRouter } from 'react-router-dom';
import MainLayout from '@/layouts/MainLayout';
import HomePage from '@/pages/HomePage';
import CollectionsPage from '@/pages/CollectionsPage';
import WatchDetailsPage from '@/pages/WatchDetailsPage';
import AboutUsPage from '@/pages/AboutUsPage';
import ContactUsPage from '@/pages/ContactUsPage';
import NewsEventsPage from '@/pages/NewsEventsPage';
import NewsEventDetailsPage from '@/pages/NewsEventDetailsPage';

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
                path: 'watch/:brand_slug/:ref',
                element: <WatchDetailsPage />,
            },
            {
                path: 'watch/:brand_slug/:collection_slug/:ref',
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
            {
                path: 'news-events',
                element: <NewsEventsPage />,
            },
            {
                path: 'news-events/:slug',
                element: <NewsEventDetailsPage />,
            },
        ],
    },
], {
    basename: import.meta.env.BASE_URL
});