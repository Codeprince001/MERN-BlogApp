import { BrowserRouter, Routes, Route } from "react-router-dom";

import { Home, About, Dashboard, Project, Signin, Signup, CreatePost, UpdatePost, Post } from "./pages";
import { AdminPrivateRoute, DashUsers, Footer, Header, PrivateRoute } from "./components";
import ScrollToTop from "./components/ScrollToTop";

const App = () => {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/signin" element={<Signin />} />
        <Route element={<PrivateRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />
        </Route>
        <Route element={<AdminPrivateRoute />}>
          <Route path="/create-post" element={<CreatePost />} />
          <Route path="/users" element={<DashUsers />} />
          <Route path="/update-post/:postId" element={<UpdatePost />} />
        </Route>
        <Route path="/projects" element={<Project />} />
        <Route path="/post/:postSlug" element={<Post />} />

      </Routes>
      <Footer />
    </BrowserRouter>
  );
};

export default App;