import { Link } from "react-router-dom";
import rArrow from "../../utils/assets/icons/r-arrow.png";

const BlogPostCard = ({blogData, onClick}) => {

    const {blogTitle, subTitle, _createdAt, category, thumbnailImage} = blogData;

    return (
        <div className="blog_card_box" >
            <div className="blog_card mx-auto cursor-pointer" onClick={onClick}>
                <div className="image">
                    <img src={thumbnailImage} loading="lazy" alt=""/>
                </div>
                <div className="content">
                    <span className="category capitalize">{category}</span>
                    <div className="post_date">{_createdAt}</div>
                    <div className="title">{blogTitle}</div>
                    <div className="sub_title">{subTitle}</div>
                    <div className="CTA">
                        <Link to={`/${blogData.categorySlug}/${blogData.slug}`} className="cursor-pointer">Read Article <img src={rArrow} alt=""/></Link>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default BlogPostCard;