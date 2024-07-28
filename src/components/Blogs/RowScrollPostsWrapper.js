import BlogPostCard from "./BlogPostCard";
import { useNavigate } from "react-router-dom";
import ShimmerPostCard from "./ShimmerPostCard";

const RowScrollPostsWrapper = ({postsData}) => {

    const navigate = useNavigate();

    const handleReadMore = (post) => {
        navigate(`/${post.categorySlug}/${post.slug}`);
    };

    return(
        <div className="rowScrollPosts_wrapper">
            <div className="rowScrollPosts_container">

                {
                    postsData ? postsData.map((post) => (
                            post.published && <BlogPostCard blogData={post} key={post._id} onClick={() => handleReadMore(post)}/>
                        )) : <>
                            <ShimmerPostCard/>
                            <ShimmerPostCard/>
                            <ShimmerPostCard/>
                        </>
                }

            </div>
        </div>
    )
}
export default RowScrollPostsWrapper;