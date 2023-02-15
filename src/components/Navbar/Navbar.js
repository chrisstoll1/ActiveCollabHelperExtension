import { useEffect, useState, useContext } from "react";
import RefreshButton from "./RefreshButton";
import BreadCrumb from "./BreadCrumb";
import SettingsButton from "./SettingsButton";
import Filter from "./Filter";
import './Navbar.css';
import { ExtState, SetExtState } from '../../store/ExtStateContext';

function Navbar() {
    const [scrolled, setScrolled] = useState(false);
    const setExtState = useContext(SetExtState);

    useEffect(() => {
        if (typeof window !== "undefined"){
            window.addEventListener("scroll", () =>
                setScrolled(window.pageYOffset > 10)
            );
        }
    }, []);

    return (
        <div class="main-header">
            <div className={scrolled ? "navbar breadcrumb-bar navbar-scrolled" : "navbar breadcrumb-bar navbar-normal"}>
                <BreadCrumb/> 
                <div class="extension-controls">
                    <Filter/>
                    <RefreshButton/>
                    <SettingsButton/>
                </div>
            </div>
        </div>
    );
}

export default Navbar;