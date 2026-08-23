import { NavLink, Outlet } from "react-router-dom";
import "../../styles/admin.css";

export function AdminLayout() {
    return (
        <div className="adminPage">
            <aside className="adminSidebar">
                <h2>Admin</h2>
                <NavLink to="/admin" end className={({ isActive }) => isActive ? "adminNavItem active" : "adminNavItem"}>Overview</NavLink>
                <NavLink to="/admin/users" className={({ isActive }) => isActive ? "adminNavItem active" : "adminNavItem"}>Users</NavLink>
                <NavLink to="/admin/posts" className={({ isActive }) => isActive ? "adminNavItem active" : "adminNavItem"}>Posts</NavLink>
                <NavLink to="/admin/comments" className={({ isActive }) => isActive ? "adminNavItem active" : "adminNavItem"}>Comments</NavLink>
                <NavLink to="/admin/groups" className={({ isActive }) => isActive ? "adminNavItem active" : "adminNavItem"}>Groups</NavLink>
                <NavLink to="/admin/reports" className={({ isActive }) => isActive ? "adminNavItem active" : "adminNavItem"}>Reports</NavLink>
            </aside>
            <main className="adminContent">
                <Outlet />
            </main>
        </div>
    );
}