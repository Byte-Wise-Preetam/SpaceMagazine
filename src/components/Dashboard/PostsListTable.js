import { useEffect, useState } from "react";
import PostsListRow from "./PostsListRow";
import { useParams } from "react-router-dom";


const PostsListTable = ({postsData, setCreateNewPostState, createNewPostState, setEditData}) => {
    let { value } = useParams();

    const [posts, setPosts] = useState(postsData);

    useEffect(() => {
        setPosts(postsData);
    },[postsData]);

    return (
        <div className="postsListTable_Wrapper overflow-x-auto">
            <div className="postsListTable_Layer">
                <table className="postsListTable_Container">
                    <tbody>
                        <tr className="postsListRow_Wrapper postsListRowHeading">
                            <th className="status cell">Status</th>
                            <th className="postTitle cell">Post Title</th>
                            <th className="category cell">Category</th>
                            <th className="createdAt cell">Created At</th>
                            <th className="actions cell"></th>
                        </tr>
                        {
                            posts && posts.map((post) => (
                                value === "trash" || value === "home" ? <PostsListRow RowData={post} key={post._id} setCreateNewPostState={setCreateNewPostState} createNewPostState={createNewPostState} setEditData={setEditData}/>
                                : post.published && <PostsListRow RowData={post} key={post._id} setCreateNewPostState={setCreateNewPostState} createNewPostState={createNewPostState} setEditData={setEditData}/>
                            ))
                        }
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default PostsListTable;