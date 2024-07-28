import { useEffect, useState, useCallback } from "react";
import SectionHeading from "../SectionHeading";
import RelatedPostCard from "./RelatedPostCard";
import { useParams } from "react-router-dom";
import { useFirebase } from "../../context/firebase";
import ShimmerBlogLoader from "./ShimeerBlogLoader";


const BlogPost = () => {

    let {categorySlug, titleSlug} = useParams();
    const [singlePostData, setSinglePostData] = useState(null);
    const [relatedArticles, setRelatedArticles] = useState(null);

    const Firebase = useFirebase();

    const fetchPostsData = useCallback(async (categorySlug, titleSlug) => {
        Firebase.getSingleBlog(`/blogs/${categorySlug}/${titleSlug}`).then((data) => {
            setSinglePostData(data);
        })
    }, [Firebase]);

    const fetchRelatedArticlesData = useCallback((titleSlug, categorySlug) => {
        Firebase.getCategoryWiseBlogs(categorySlug).then((data) => {
            setRelatedArticles(data.filter(post => post.slug !== titleSlug));
        });
    }, [Firebase]);

    useEffect(() => {
        const fetchData = async () => {
            await fetchPostsData(categorySlug, titleSlug);
            fetchRelatedArticlesData(titleSlug, categorySlug);
        };
        fetchData();
    },[categorySlug, titleSlug, fetchPostsData, fetchRelatedArticlesData]);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [categorySlug, titleSlug]);

    return(
        <>
            {
                singlePostData ? <>
                    <section className="blog_Post_Hero_Wrapper">
                        <div className="blog_Post_Hero">
                            <div className="content">
                                <span className="category">{singlePostData.category}</span>
                                <h1 className="title">{singlePostData.blogTitle}<span style={{color:"#ed3335"}}>.</span></h1>
                                <div className="post_Date">Posted on : {singlePostData._createdAt}</div>
                            </div>
                            <div className="thumbnail_Image">
                                <img src={singlePostData.thumbnailImage} alt=""/>
                            </div>
                        </div>
                    </section>
                    <section className="blog_Post_Data_wrapper">
                        <div className="blog_Post_Data" id="blog_Post_Data">
                            <div className="blog_Post_Content">
                                <p>{singlePostData.introDescription}</p>
                                <hr/>
                                <div dangerouslySetInnerHTML={{ __html: singlePostData.content }} />
                            </div>

                            <div className="blog_Post_Related_Posts">
                                <SectionHeading content="Related Articles"/>

                                <div className="Related_Posts_Container">
                                    {
                                        relatedArticles && relatedArticles.map((post) => (
                                            <RelatedPostCard blogData={post} key={post._id}/>
                                        ))
                                    }
                                </div>
                            </div>
                        </div>
                    </section>
                </> : <ShimmerBlogLoader/>
            }
        </>
    )
}

export default BlogPost;

