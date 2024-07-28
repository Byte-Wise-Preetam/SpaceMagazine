import { Link } from "react-router-dom";
import FooterLogo from "../../utils/assets/images/SpaceMagazineLightLogo.png";

const Footer = () => {
    return(
        <footer className="footer_wrapper">
            <div className="footer_container">
                <Link to={`/dashboard/home`} className="adminBtn ms-4 sm:ms-0">Admin</Link>
                <div className="footer_logo"><img src={FooterLogo} alt="SpaceMagazine"/></div>
                <div className="partition"></div>
                <div className="copyright">Copyright © Space Magazine 2024. All rights reserved.</div>
            </div>
        </footer>
    )
}

export default Footer;