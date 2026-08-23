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
import { EditGroupForm } from "./features/groups/EditGroupForm";
import { GroupMembersPage } from "./features/groups/GroupMembersPage";
import AdminRoute from "./routes/AdminRoute";
import { AdminLayout } from "./features/admin/AdminLayout";
import { AdminOverviewPage } from "./features/admin/AdminOverviewPage";
import { AdminUsersPage } from "./features/admin/AdminUsersPage";
import { AdminPostsPage } from "./features/admin/AdminPostsPage";
import { AdminGroupsPage } from "./features/admin/AdminGroupsPage";
import { AdminCommentsPage } from "./features/admin/AdminCommentsPage";
import { AdminReportsPage } from "./features/admin/AdminReportsPage";

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
            <Route path="/groups/:id/edit" element={<EditGroupForm />} />
            <Route path="/groups/:id/members" element={<GroupMembersPage />} />

            <Route element={<AdminRoute />}>
              <Route path="/admin" element={<AdminLayout />}>
                <Route index element={<AdminOverviewPage />} />
                <Route path="users" element={<AdminUsersPage />} />
                <Route path="posts" element={<AdminPostsPage />} />
                <Route path="comments" element={<AdminCommentsPage />} />
                <Route path="groups" element={<AdminGroupsPage />} />
                <Route path="reports" element={<AdminReportsPage />} />
              </Route>
            </Route>

          </Route>
        </Route>

        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;