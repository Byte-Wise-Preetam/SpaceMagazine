import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import './index-responsive.css'
import App from './App';
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import DashboardHome from './components/Pages/DashboardHome';
import BlogPost from './components/Blogs/BlogPost';
import BlogLayout from './components/Pages/BlogLayout';
import CategoryPage from './components/Blogs/CategoryPage';
import HeroCategorySection from './components/Blogs/HeroCategorySection';
import NotFound from './components/Pages/NotFound';

const root = ReactDOM.createRoot(document.getElementById('root'));

const router = createBrowserRouter([
  {
    path : "/",
    element : <App />,
    children : [
      {
        path: "",
        element : <BlogLayout />,
        children: [
          {
            index : true,
            element: <HeroCategorySection/>
          },
          {
            path : ":categorySlug",
            element: <CategoryPage/>
          },
          {
            path : ":categorySlug/:titleSlug",
            element: <BlogPost/>
          },
        ],
        errorElement : <NotFound/>
      },
      {
        path : "dashboard/:value",
        element : <DashboardHome/>,
      },
    ],
    errorElement : <NotFound/>
  }

])

root.render(
  <React.StrictMode>
    <RouterProvider router={router} />
    {/* <App/> */}
  </React.StrictMode>
);

