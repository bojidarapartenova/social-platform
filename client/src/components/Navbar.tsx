import { NavLink, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import type { RootState } from "../app/store";
import { logout } from "../features/auth/authSlice";
import "../styles/navigation.css"
import { useGetUnreadCountQuery } from "../features/notifications/notificationApiSlice";

import logo from '../images/logo.png'
import homeIcon from '../images/home.png'
import newIcon from '../images/plus.png'
import searchIcon from '../images/search.png'
import messageIcon from '../images/message.png'
import activityIcon from '../images/activity.png'
import profileIcon from '../images/user.png'
import savedIcon from '../images/saved.png'

export function Navbar() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const currentUser = useSelector((state: RootState) => state.auth.user);

    const { data: unread } = useGetUnreadCountQuery(undefined, { pollingInterval: 15000 });

    function handleLogout() {
        dispatch(logout());
        navigate('/login');
    }

    return (
        <aside className="sidebar">
            <nav className="sidebarNav">
                <NavLink to="/" end id="appLogo" className={({ isActive }) => isActive ? " " : ""}>
                    <img src={logo} alt="Logo" className="navIcon" />
                </NavLink>

                <NavLink to="/" end className={({ isActive }) => isActive ? "navItem active" : "navItem"}>
                    <img src={homeIcon} alt="Home" className="navIcon" />
                    <span>Home</span>
                </NavLink>

                <NavLink to="/create" className={({ isActive }) => isActive ? "navItem active" : "navItem"}>
                    <img src={newIcon} alt="New Post" className="navIcon" />
                    <span>New Post</span>
                </NavLink>

                <NavLink to="/search" className={({ isActive }) => isActive ? "navItem active" : "navItem"}>
                    <img src={searchIcon} alt="Search" className="navIcon" />
                    <span>Search</span>
                </NavLink>

                <br />

                <NavLink to="/messages" className={({ isActive }) => isActive ? "navItem active" : "navItem"}>
                    <img src={messageIcon} alt="Messages" className="navIcon" />
                    <span>Messages</span>
                </NavLink>

                <NavLink to="/activity" className={({ isActive }) => isActive ? "navItem active" : "navItem"}>
                    <img src={activityIcon} alt="Activity" className="navIcon" />
                    <span>Activity</span>
                    {!!unread?.count && <span className="navBadge">{unread.count}</span>}
                </NavLink>

                {currentUser && (
                    <NavLink to={`/profile/${currentUser._id}`} className={({ isActive }) => isActive ? "navItem active" : "navItem"}>
                        <img src={profileIcon} alt="Profile" className="navIcon" />
                        <span>Profile</span>
                    </NavLink>
                )}

                <NavLink to="/favorites" className={({ isActive }) => isActive ? "navItem active" : "navItem"}>
                    <img src={savedIcon} alt="Saved" className="navIcon" />
                    <span>Saved</span>
                </NavLink>

                <br />
                <NavLink to="/groups" className={({ isActive }) => isActive ? "navItem active" : "navItem"}>
                    <span>Groups</span>
                </NavLink>
            </nav>

            <div className="sidebarFooter">
                <button type="button" onClick={handleLogout} className="logoutBtn">
                    Log Out
                </button>
            </div>
        </aside>
    )
}