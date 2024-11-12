import "./App.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom"
import Layout from "./Components/Layout";

import Employee from "./Components/Employee"

const appRouter = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        path: "/",
        element:<Employee/>
      },
     
    ]
  }
])
function App() {
  return (
    <>
      <div>
        <RouterProvider router={appRouter}/>
      </div>
    </>
  );
}

export default App;
