import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AppLayout } from "./components/AppLayout";
import LoginPage from "./features/auth/LoginPage";
import RegisterPage from "./features/auth/RegisterPage";
import ProtectedRoute from "./routes/ProtectedRoute";
import { FeedPage } from "./features/posts/FeedPage";
import { CreatePostForm } from "./features/posts/CreatePostForm";
import { FilterPreviewPage } from "./features/posts/FilterPreviewPage";
import { ProfilePage } from "./features/users/ProfilePage";
import { EditProfilePage } from "./features/users/EditProfilePage";
import { FavoritesPage } from "./features/posts/FavoritesPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route element={<ProtectedRoute />}>
          <Route element={<AppLayout />}>
            <Route path="/" element={<FeedPage />} />
            <Route path="/create" element={<CreatePostForm />} />
            <Route path="/create/filters" element={<FilterPreviewPage />} />
            <Route path="/profile/edit" element={<EditProfilePage />} />
            <Route path="/profile/:id" element={<ProfilePage />} />
            <Route path="/favorites" element={<FavoritesPage />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;