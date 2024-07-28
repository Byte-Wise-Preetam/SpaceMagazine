import { useEffect, useState, useCallback } from "react";
import { useFirebase } from "../../context/firebase";
import SectionHeading from "../SectionHeading";
import { Link } from "react-router-dom";
import RowScrollPostsWrapper from "./RowScrollPostsWrapper";
import SmallPostsWrapper from "./SmallPostsWrapper";
import { useParams } from "react-router-dom";
import ShimmerSmallPostWrapper from "./ShimmerSmallPostWrapper";

const HeroCategorySection = () => {
    const Firebase = useFirebase();
    const [featuredPosts, setFeaturedPosts] = useState(null);
    const [masterPost, setMasterPost] = useState(null);
    const [activeCategoryButton, setActiveCategoryButton] = useState(null);
    const [categoryWisePosts, setCategoryWisePosts] = useState(null);
    const { categorySlug } = useParams();

    const categoryButtons = [
        { id: 1, categoryName: "Business How to's", categorySlug: "business-how-tos" },
        { id: 2, categoryName: "Culture & Community", categorySlug: "culture-and-community" },
        { id: 3, categoryName: "Productivity", categorySlug: "productivity" },
        { id: 4, categoryName: "Workspace Solutions", categorySlug: "workspace-solutions" },
        { id: 5, categoryName: "Inspiring Stories", categorySlug: "inspiring-stories" }
    ];

    const fetchFeaturedPosts = useCallback(async () => {
        try {
            const data = await Firebase.fetchFeaturedPosts();
            if (data.length) {
                setMasterPost(data[0]);
                setFeaturedPosts(data.slice(1));
            }
        } catch (error) {
            // console.error("Error fetching featured posts:", error);
        }
    }, [Firebase]);

    const filterCategoryWisePosts = useCallback(async (selectedCategory = "business-how-tos") => {
        try{
            const data = await Firebase.getCategoryWiseBlogs(selectedCategory);
            setActiveCategoryButton(selectedCategory);
            setCategoryWisePosts(data);
        }catch (error) {
            // console.error("Error filtering category-wise posts:", error);
        }
    }, [Firebase]);

    useEffect(() => {
        const fetchData = async () => {
            await fetchFeaturedPosts();
            await filterCategoryWisePosts(categorySlug || "business-how-tos");
        };
        fetchData().then(() => {
            // console.log("masterPost : ",masterPost);
        });
    }, [categorySlug, fetchFeaturedPosts, filterCategoryWisePosts]);

    return (
        <>
            {/* ############## Hero Section starts here ################ */}
            {
                <section className="blogHome_hero_wrapper px-4 sm:px-0 sm:py-8 sm:pt-12">
                    <SectionHeading content="Featured Posts" />
                    <div className="blogHome_hero_container">
                        <div className="left">
                            <Link to={masterPost && `/${masterPost.categorySlug}/${masterPost.slug}`} className="block">
                                <div className="front_featuredPost_container">
                                    <div className="post_image">
                                        {masterPost && <img src={masterPost.thumbnailImage} alt={masterPost.blogTitle} />}
                                    </div>
                                    <div className="post_info">
                                        <span className="categoryTag">{masterPost && masterPost.category}</span>
                                        <div className="title">{masterPost && masterPost.blogTitle}</div>
                                        <div className="postDate">{masterPost && masterPost._createdAt}</div>
                                    </div>
                                </div>
                            </Link>
                        </div>
                        <div className="right">
                            {featuredPosts ? featuredPosts.map((post) => (
                                <SmallPostsWrapper key={post.id} postData={post} />
                            )) : <><ShimmerSmallPostWrapper/> <ShimmerSmallPostWrapper/> <ShimmerSmallPostWrapper/></>}
                        </div>
                    </div>
                </section>
            }
            {/* ############## Hero Section ends here ################ */}

            {/* ########### Explore Category Section starts here ########### */}
            <section className="category_wise_posts_wrapper px-4 sm:px-0 py-8 my-4 bg-[#f5f5f5]">
                <SectionHeading content={"Explore Categories"} />
                <div className="filterCTAs my-4 md:my-8 mx-auto">
                    {
                        categoryButtons.map((category) => (
                            <button
                                key={category.id}
                                className={activeCategoryButton === category.categorySlug ? "activeCategory" : ""}
                                onClick={() => filterCategoryWisePosts(category.categorySlug)}
                            >
                                {category.categoryName}
                            </button>
                        ))
                    }
                </div>
                {
                    categoryWisePosts ? <RowScrollPostsWrapper postsData={categoryWisePosts} /> : <RowScrollPostsWrapper/>
                }
            </section>
            {/* ########### Explore Category Section ends here ########### */}
        </>
    );
};

export default HeroCategorySection;
