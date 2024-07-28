import { useState } from "react";
import HeaderLogo from "../../utils/assets/icons/SpaceMagazineHeaderLogo.png";
import Sort from "../../utils/assets/icons/sort.png";
import { Link } from "react-router-dom";
const Header = () => {

    const [activeCL, setActiveCL] = useState(false);

    const handleMenuClick = () => {
        let viewportWidth = window.innerWidth;
        if(viewportWidth < 1050){
            setActiveCL(!activeCL);
        }
    }

    return(
        <header className="blog_frontend_header">
            <div className="header_container">
                <div className="header_logo text-center">
                    <Link to=""><img src={HeaderLogo} alt="SpaceMagazine"/></Link>
                </div>
                <div className="menu_icon lg:hidden" onClick={handleMenuClick}>
                    <img src={Sort} alt=""/>
                </div>
                
                <div className={activeCL ? "category_list show_category_list" : "category_list"}>
                    <div className="category_CTA" onClick={() => {setActiveCL(false)}}>
                        <Link to="/business-how-tos">Business How to's</Link>
                    </div>
                    <div className="category_CTA" onClick={() => {setActiveCL(false)}}>
                        <Link to="/culture-and-community">Culture & Community</Link>
                    </div>
                    <div className="category_CTA" onClick={() => {setActiveCL(false)}}>
                        <Link to="/productivity">Productivity</Link>
                    </div>
                    <div className="category_CTA" onClick={() => {setActiveCL(false)}}>
                        <Link to="/workspace-solutions">Workspace Solutions</Link>
                    </div>
                    <div className="category_CTA" onClick={() => {setActiveCL(false)}}>
                        <Link to="/inspiring-stories">Inspiring Stories</Link>
                    </div>
                </div>
            </div>
        </header>
    )
}

export default Header;