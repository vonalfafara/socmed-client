import Layout from "./layout";
import { Routes, Route } from "react-router-dom";
import authRoutes from "./routes";

const App = () => {
  return (
    <>
      <Routes>
        {authRoutes.map((route, index) => {
          return (
            <Route key={index} path={route.path} element={route.element} exact>
              {route.children?.length
                ? route.children.map((childRoute, childIndex) => {
                    return (
                      <Route
                        key={childIndex}
                        path={childRoute.path}
                        element={childRoute.element}
                        exact
                      />
                    );
                  })
                : null}
            </Route>
          );
        })}
      </Routes>
    </>
  );
};

export default App;
