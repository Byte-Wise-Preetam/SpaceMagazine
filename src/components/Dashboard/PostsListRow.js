import { useParams } from "react-router-dom";
import ToggleButton from "./ToggleButton";
import edit from "../../utils/assets/icons/edit.png";
import deleteIcon from "../../utils/assets/icons/trash.png";
import removeIcon from "../../utils/assets/icons/remove.png";
import restoreIcon from "../../utils/assets/icons/restore.png";
import { useFirebase } from "../../context/firebase";
import Tooltip from "./Tooltip";
// import { useNewPostObject } from "../../context/createNewPostContext";

const generateSlug = (title) => {
    return title
        .toLowerCase() 
        .trim() 
        .replace(/[^\w\s-]/g, '') 
        .replace(/\s+/g, '-') 
        .replace(/-+/g, '-'); 
};

const PostsListRow = ({RowData, setCreateNewPostState, createNewPostState, setEditData}) => {
    let {value} = useParams();

    const Firebase = useFirebase();
    const {editPostState, setEditPostState} = Firebase;
    // const {newPostData, setNewPostData} = useNewPostObject();

    if (!RowData) {
        return null;
    }

    const {published, category, categorySlug, slug} = RowData;

    return (

        <tr className="postsListRow_Wrapper">
            <td className="status cell">
                {
                    <ToggleButton isActive={RowData.published} categorySlug={categorySlug} titleSlug={slug} category={category} published={published}/>
                }
            </td>
            <td className="postTitle cell">{RowData.blogTitle}</td>
            <td className="category cell">{RowData.category}</td>
            <td className="createdAt cell">{RowData._createdAt}</td>
            <td className="actions cell">
                {
                    value === "home" && <div>
                        <button onClick={() => {
                            Firebase.getSingleBlog(`blogs/${RowData.categorySlug}/${RowData.slug}`).then((data)=>{
                                setEditPostState(true);
                                setEditData(data);
                            })
                        }} id="first"><img src={edit} alt=""/><Tooltip text={"Edit"}/></button>

                        <button onClick={async () => {
                            const data = await Firebase.moveToTrash({category : generateSlug(RowData.category),slug : RowData.slug});
                        }}><img src={deleteIcon} alt=""/><Tooltip text={"Move to trash"}/></button>
                    </div> 
                }
                {
                    (value === "featuredPosts" || value === "suggestedPosts") && <div>
                        <button onClick={
                            () => {
                                if(value === "featuredPosts")
                                {
                                    Firebase.removePost({category : generateSlug(RowData.category),slug : RowData.slug, actionOnKey : "featuredBlog"})
                                }
                                else if(value === "suggestedPosts"){
                                    Firebase.removePost({category : generateSlug(RowData.category),slug : RowData.slug, actionOnKey : "suggested"})
                                }    
                            }
                        }><img src={removeIcon} alt=""/><Tooltip text={"Remove"}/></button>
                    </div>
                }
                {
                    value === "trash" && <div>
                        <button id="first" onClick={() => {
                            Firebase.restorePost({category: generateSlug(RowData.category), slug : RowData.slug})
                        }}><img src={restoreIcon} alt=""/><Tooltip text={"Restore"}/></button>
                        <button onClick={() => {
                            if(Firebase.isUser !== "admin"){
                                alert("Test User does not have the authority to permanently delete a post.");
                                return;
                            }
                        }}><img src={deleteIcon} alt=""/><Tooltip text={"Delete Permanently"}/></button>
                    </div>
                }
            </td>
        </tr>
    )
}

export default PostsListRow;