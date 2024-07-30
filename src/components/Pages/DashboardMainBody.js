import PostsListTable from "../Dashboard/PostsListTable"
import createNewLight from "../../utils/assets/icons/create-new-light.png"
// import sort from "../../utils/assets/icons/sort.png"
import { useFirebase } from "../../context/firebase"
import { useState, useEffect } from "react"
import { useParams } from "react-router-dom"
import PostInfoAction from "../Dashboard/PostInfoAction"
import cancelDarkIcon from "../../utils/assets/icons/cancelDark.png"
import CreatePostMain from "../Dashboard/CMS/CreatePostMain"
import { CreateNewPostProvider } from "../../context/createNewPostContext"
import EditPostMain from "../Dashboard/CMS/EditPostMain"

const generateSlug = (title) => {
    return title
        .toLowerCase() 
        .trim() 
        .replace(/[^\w\s-]/g, '') 
        .replace(/\s+/g, '-') 
        .replace(/-+/g, '-'); 
};


const DashboardMainBody = ({firstStepPostsData, setCreateNewPostState, createNewPostState}) => {

    const [fetchedData, setFetchedData] = useState(null);
    const [popUpListData, setPopUpListData] = useState(null);
    const [loading, setLoading] = useState(true);
    const Firebase = useFirebase();
    const {editPostState,setEditPostState} = Firebase;
    let { value } = useParams();
    // let actionPage;

    const [editData, setEditData] = useState(null);

    useEffect(()=>{

        let actionPage;

        async function getData(value){
            setLoading(true);
            let data;

            try{
                switch(value){
                    case "home" :
                        data = firstStepPostsData;
                        break;
                    case "featuredPosts" : 
                        data = await Firebase.fetchFeaturedPosts(); 
                        actionPage = "featuredBlog";
                        break;
                    case "suggestedPosts" : 
                        data = await Firebase.fetchSuggestedPosts(); 
                        actionPage = "suggested"
                        break;
                    case "trash" : 
                        data = await Firebase.fetchTrashPosts();
                        break;
                    default:
                        data=[];
                }

                setFetchedData(data);
                
            }
            catch(error){
                // console.log("Error : ",error);
            }
            finally{
                setLoading(false);
            }
            
        }

        getData(value);
    },[value, firstStepPostsData]);

    useEffect(() => {

    },[fetchedData, popUpListData,createNewPostState]);

    return (
        <div className="Dashboard_Main_Body_Wrapper">
            <div className="Dashboard_Main_Body_Container">
                <div className="dashBoard_Main_Body_Header">
                    <div className="content">
                        <div className="heading">Admin Dashboard</div>
                        <div className="desc">Central hub for seamless control, creation, and optimization.</div>
                    </div>
                    <div className={value==="trash" ? "hidden" : "buttons"}>
                        <button id="dark_bg" onClick={async () => {
                            let popUpData;

                            switch(value){
                                case "home":
                                    setCreateNewPostState(true);
                                    return;
                                case "featuredPosts":
                                    popUpData = await Firebase.fetchNotFeaturedPosts();
                                    break;
                                case "suggestedPosts":
                                    popUpData = await Firebase.fetchNotSuggestedPosts();
                                    break;
                                default : 
                                    popUpData = [];
                            }

                            setPopUpListData(popUpData);

                            let popUpListWrapper = document.getElementById("PopUpList_Wrapper");
                            popUpListWrapper.classList.add("PopUpList_Wrapper_Active");

                            // console.log("Activated");

                        }}><img src={createNewLight} alt="Add" className= "me-1"/>Add Post</button>
                    </div>
                </div>

                {
                    loading ? <div>Loading...</div> : <CreateNewPostProvider><PostsListTable postsData={fetchedData} setCreateNewPostState={setCreateNewPostState} createNewPostState={createNewPostState} setEditData={setEditData}/></CreateNewPostProvider>
                }

                {
                    createNewPostState && <CreateNewPostProvider>
                        <CreatePostMain setCreateNewPostState={setCreateNewPostState} createNewPostState={createNewPostState} />
                    </CreateNewPostProvider>
                }

                {
                    editPostState && <EditPostMain setEditPostState={setEditPostState} defaultData={editData}/>
                }

                <div className="PopUpList_Wrapper" id="PopUpList_Wrapper">
                    <div className="PopUpList_Container">
                        <div className="PopUpList_Header">
                            <img className="close" src={cancelDarkIcon} alt="close" onClick={() => {
                                let popUpListWrapper = document.getElementById("PopUpList_Wrapper");
                                popUpListWrapper.classList.remove("PopUpList_Wrapper_Active");
                            }}/>
                        </div>
                        <div className="PopUpList_Content">
                            {
                                popUpListData && popUpListData.map((post) => (
                                    post.published && <PostInfoAction post={post} categorySlug = {generateSlug(post.category)} key={post._id} setPopUpListData={setPopUpListData}/>
                                ))
                            }
                        </div>
                    </div>
                </div>
                
            </div>
        </div>
    )
}

export default DashboardMainBody;