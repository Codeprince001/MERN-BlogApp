import { BrowserRouter, Routes, Route } from "react-router-dom";

import { Home, About, Dashboard, Project, Signin, Signup } from "./pages";
import { Footer, Header, PrivateRoute } from "./components";

const App = () => {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/signin" element={<Signin />} />
        <Route element={<PrivateRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />
        </Route>
        <Route path="/projects" element={<Project />} />
      </Routes>
      <Footer />
    </BrowserRouter>
  );
};

export default App;