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
import { MessagesLayout } from "./features/chats/MessagesLayout";
import { ChatWindow } from "./features/chats/ChatWindow";
import { NotFoundPage } from "./routes/NotFoundPage";
import { GroupsListPage } from "./features/groups/GroupsListPage";
import { CreateGroupForm } from "./features/groups/CreateGroupForm";
import { GroupPage } from "./features/groups/GroupPage";
import { TagPage } from "./features/posts/TagPage";
import { SearchPage } from "./features/search/SearchPage";
import { PostDetailPage } from "./features/posts/PostDetailPage";
import { NotificationsPage } from "./features/notifications/NotificationsPage";
import { FollowListPage } from "./features/follows/FollowListPage";


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
            <Route path="/groups" element={<GroupsListPage />} />
            <Route path="/groups/new" element={<CreateGroupForm />} />
            <Route path="/groups/:id" element={<GroupPage />} />
            <Route path="/tags/:tag" element={<TagPage />} />

            <Route path="/messages" element={<MessagesLayout />}>
              <Route
                index
                element={
                  <div className="chatEmpty">
                    <h3>Your Messages</h3>
                    <p>Select a friend from the left to start chatting.</p>
                  </div>
                }
              />
              <Route path=":userId" element={<ChatWindow />} />
            </Route>

            <Route path="/search" element={<SearchPage />} />
            <Route path="/posts/:id" element={<PostDetailPage />} />
            <Route path="/activity" element={<NotificationsPage />} />
            <Route path="/profile/:id/followers" element={<FollowListPage type="followers" />} />
            <Route path="/profile/:id/following" element={<FollowListPage type="following" />} />

          </Route>
        </Route>
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;