import BlogPostCard from "./BlogPostCard";

const RecentPosts = ({recentPostsData, headingText}) => {

    return(
        <div className="recent_Posts_Wrapper">
            <div className="section_Heading"><span></span>{headingText}</div>
            <div className="recent_Posts">
                {
                    recentPostsData.map((post) => (
                        <BlogPostCard blogData={post} key={post._id}/>
                    ))
                }
            </div>
        </div>
    )
}

export default RecentPosts;