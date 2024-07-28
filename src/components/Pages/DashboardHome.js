import "./dashboardHome-responsive.css";
import DashboardSidebar from "./DashboardSidebar";
import DashboardMainBody from "./DashboardMainBody";
import { useEffect, useState } from "react";
import { useFirebase } from "../../context/firebase";
import { useForm } from "react-hook-form";
import HeaderLogo from "../../utils/assets/icons/SpaceMagazineHeaderLogo.png";
import Cookies from "js-cookie";

const DashboardHome = () => {

    const Firebase = useFirebase();
    const [firstStepData, setFirstStepData] = useState(null);
    const Form = useForm();
    const [createNewPostState, setCreateNewPostState] = useState(false);
    // console.log("Form : ", Form);
    const {register, handleSubmit} = Form;

    useEffect(() => {

        let userId;

        async function getData(){
            const data = await Firebase.getAllBlogs('blogs');
            setFirstStepData(data);
        }

        Firebase.isUser && getData();

        if(Firebase.isUser){
            let authWrapper = document.getElementById("Authentication_Wrapper");
            authWrapper.style.display = 'none';
        }else if(Firebase.isUser === null){
            userId = Cookies.get("uid");
            Firebase.setUserRole(userId);
            if(userId === undefined)
            {
                let authWrapper = document.getElementById("Authentication_Wrapper");
                authWrapper.style.display = 'flex';
            }
                
        }

    },[Firebase.postsData, Firebase.isUser]);

    const formSubmit = (data) => {
        // console.log(data);
        Firebase.logInUser({email : data.email, password : data.password})
    }

    return(
        <div className="DashboardHome_Main_Wrapper">

            <div className="Authentication_Wrapper" id="Authentication_Wrapper">
                <div className="Authentication_Container">
                    <form className="authentication_Form" onSubmit={handleSubmit(formSubmit)}>
                        <div className="text-center">
                            <img className="logo" src={HeaderLogo} alt="SpaceMagazine"/>
                        </div>
                        <div className="form_Field">
                            <label htmlFor="email">Email</label>
                            <input type="email" id="email" {...register("email")} placeholder="Enter your email"/>
                        </div>
                        <div className="form_Field">
                            <label htmlFor="password">Password</label>
                            <input type="password" id="password" {...register("password")} placeholder="Enter your password"/>
                        </div>
                        <div className="form_Field">
                            <button>Submit</button>
                        </div>
                        <div className="partition"></div>
                        <div className="test_Credentials mt-4">
                            <div className="title">Test Credentials :</div>
                            <div className="text">test.spacemagazine@gmail.com</div>
                            <div className="text">space#4356</div>
                        </div>
                    </form>
                </div>
            </div>

            <div className="DashboardHome_Main_Container">
                <DashboardSidebar setCreateNewPostState={setCreateNewPostState} createNewPostState={createNewPostState}/>
                <DashboardMainBody firstStepPostsData={firstStepData} setCreateNewPostState={setCreateNewPostState} createNewPostState={createNewPostState}/>
            </div>
        </div>
    )
}

export default DashboardHome;