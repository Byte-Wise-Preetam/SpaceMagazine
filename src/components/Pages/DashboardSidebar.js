import createNew from "../../utils/assets/icons/create-new.png";
import dashboard from "../../utils/assets/icons/dashboard.png";
import featured from "../../utils/assets/icons/featured.png";
import mightLike from "../../utils/assets/icons/might-like.png"
import subscribers from "../../utils/assets/icons/subscribers.png";
import trash from "../../utils/assets/icons/trash.png";
import signOut from "../../utils/assets/icons/sign-out.png";
import HeaderLogo from "../../utils/assets/icons/SpaceMagazineHeaderLogo.png";
import HeaderIcon from "../../utils/assets/icons/sort.png"
import { NavLink } from "react-router-dom";
import { useFirebase } from "../../context/firebase";
import { useState } from "react";


const DashboardSidebar = ({setCreateNewPostState, createNewPostState}) => {

    const [activeUL, setActiveUL] = useState(false);

    const Firebase = useFirebase();


    const handleMenuClick = () => {
        let viewportWidth = window.innerWidth;
        if(viewportWidth < 1200){
            setActiveUL(!activeUL);
        }
    }

    return(
        <div className="DashboardSidebar_Wrapper">
            <div className="header_container">
                <div className="firm_logo">
                    <img src={HeaderLogo} alt="SpaceMagazine"/>
                </div>
                <div className="menu" id="menu_bar" onClick={handleMenuClick}>
                    <img src={HeaderIcon} alt="Menu"/>
                </div>
            </div>
            <ul id="dashboard_sidebar_options" className={activeUL ? "show_sidebar" : ""}>
                <li className="option header_logo">
                    <a className="header_logo"><img src={HeaderLogo} alt="SpaceMagazine"/></a>
                </li>
                <li className="partition"></li>
                <li className="option">
                    {/* <a><img src={createNew}/>Create new Post</a>setCreateNewPostStateFunc */}
                    <span onClick={()=>{
                        setCreateNewPostState(true);
                        setActiveUL(false)
                    }}><img src={createNew} alt="new"/>Create new Post</span>
                </li>
                <li className="partition"></li>
                <li className="option">
                    <NavLink to="/dashboard/home" onClick={() => setActiveUL(false)}><img src={dashboard} alt=""/>Dashboard</NavLink>
                </li>
                <li className="option">
                    <NavLink to="/dashboard/featuredPosts" onClick={() => setActiveUL(false)}><img src={featured} alt=""/>Featured Posts</NavLink>
                </li>
                <li className="option">
                    <NavLink to="/dashboard/suggestedPosts" onClick={() => setActiveUL(false)}><img src={mightLike} alt=""/>You Might Also Like</NavLink>
                </li>
                <li className="partition"></li>
                <li className="option">
                    <a style={{"cursor":"not-allowed"}}><img src={subscribers} alt=""/>Subscribers <div style={{"color" : "#ed3335", "fontSize":"10px", "fontWeight":"400"}}>coming soon...</div></a>
                </li>
                {/* <li className="option">
                    <a><img src={users}/>Manage Users</a>
                </li> */}
                <li className="partition"></li>
                {/* <li className="option">
                    <a><img src={settings}/>Settings</a>
                </li> */}
                <li className="option">
                    <NavLink to="/dashboard/trash" onClick={() => setActiveUL(false)}><img src={trash} alt=""/>Trash</NavLink>
                </li>
                <li className="partition"></li>
                <li className="option SignIn">
                    <a onClick={() => {
                        Firebase.logOutUser();
                        setActiveUL(false);
                    }}><img src={signOut} alt=""/>Sign out</a><span className="tag">{Firebase.isUser}</span>
                </li>
            </ul>
        </div>
    )
}

export default DashboardSidebar;