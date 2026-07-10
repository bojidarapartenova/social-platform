import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginPage from "./features/auth/LoginPage";
import RegisterPage from "./features/auth/RegisterPage";
import ProtectedRoute from "./routes/ProtectedRoute";
import { FeedPage } from "./features/posts/FeedPage";
import { CreatePostForm } from "./features/posts/CreatePostForm";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<FeedPage />} />
        </Route>
        <Route path="/create" element={<CreatePostForm />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;