import { Outlet } from "react-router-dom";
import { Navbar } from "./Navbar";
import '../styles/layout.css'

export function AppLayout() {
    return (
        <div className="appContainer">
            <Navbar />
            <main className="mainContent">
                <Outlet />
            </main>
        </div>
    )
}