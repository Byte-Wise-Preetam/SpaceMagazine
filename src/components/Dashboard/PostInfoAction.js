import { useFirebase } from "../../context/firebase";
import { useParams } from "react-router-dom";

const PostInfoAction = ({post, categorySlug, setPopUpListData}) => {

    let {value} = useParams();

    const Firebase = useFirebase();

    if(value === "suggestedPosts" ){
        if(post.suggested){
            return;
        }
    }
    else if(value === "featuredPosts"){
        if(post.featuredBlog){
            return;
        }
    }

    return(
        <div className="postInfo">
            <div className="postName">{post.blogTitle}</div>
            <button onClick={async () => {
                let actionKey;
                if(value === "suggestedPosts"){
                    actionKey = "suggested";
                }
                else if(value === "featuredPosts")
                {
                    actionKey = "featuredBlog";
                }
                // let popUpData;
                Firebase.includePost({category : categorySlug, slug : post.slug, actionOnKey : actionKey})
                .then(async () => {
                    // value === "featuredPosts" ? popUpData = await Firebase.fetchNotFeaturedPosts() : popUpData = await Firebase.fetchNotFeaturedPosts();

                    await setPopUpListData((prevData) => 
                        prevData.map((postData) => 
                        postData.slug === post.slug 
                                ? { ...postData, [actionKey]: true }
                                : postData 
                        )
                    );

                    // await setPopUpListData(popUpData);
                })

                
            }}>Add</button>
        </div>
    )
}

export default PostInfoAction;