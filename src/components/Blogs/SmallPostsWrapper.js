import { Link } from "react-router-dom";

const SmallPostsWrapper = ({postData}) => {
    return (
        <div className="SmallPosts_wrapper">
            <Link to={`/${postData.categorySlug}/${postData.slug}`} className="SmallPosts_wrapper_CTA">
                <div className="SmallPosts_container">
                    <div className="post_image">
                    <img src={postData.thumbnailImage} alt=""/>
                    </div>
                    <div className="post_content">
                        <span className="category_tag">{postData.category}</span>
                        <div className="post_title">{postData.blogTitle}</div>
                        <div className="post_date">{postData._createdAt}</div>
                    </div>
                </div>
            </Link>
        </div>
    )
}

export default SmallPostsWrapper;