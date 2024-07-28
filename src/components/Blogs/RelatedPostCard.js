import { Link } from "react-router-dom";
import rArrow from "../../utils/assets/icons/r-arrow.png";

const RelatedPostCard = ({blogData}) => {

    const {postDate, blogTitle, subTitle, thumbnailImage} = blogData;
    return (
        <div className="Related_Post_Box">
            <div className="Related_Post">
                <div className="image">
                    <img src={thumbnailImage} alt=""/>
                </div>
                <div className="content">
                    <div className="post_Date">{postDate}</div>
                    <div className="title">{blogTitle}</div>
                    <div className="sub_Title">{subTitle}</div>
                    <div className="CTA">
                        <Link to={`/${blogData.categorySlug}/${blogData.slug}`} className="cursor-pointer">Read Article <img src={rArrow} alt=""/></Link>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default RelatedPostCard;