import Header from "../Blogs/BlogPageHeader";
import { useFirebase } from "../../context/firebase";
import { useEffect, useState } from "react";
import RowScrollPostsWrapper from "../Blogs/RowScrollPostsWrapper";
import SectionHeading from "../Blogs/SectionHeading";
import SmallPostsWrapper from "../Blogs/SmallPostsWrapper";
import { Link } from "react-router-dom";
import SubscribeCard from "../Blogs/SubscribeCard";
import Footer from "../Blogs/BlogPageFooter";
import { useParams } from "react-router-dom";

const BlogHomePage = () => {

    const Firebase = useFirebase();
    const [postsData, setPostsData] = useState(null);
    const [featuredPosts, setFeaturedPosts] = useState(null);
    const [masterPost, setMasterPost] = useState(null);
    const [suggestedPosts, setSuggestedPosts] = useState(null);
    const [categoryWisePosts, setCategoryWisePosts] = useState(null);
    const [activeCategoryButton, setActiveCategoryButton] = useState(null);
    const [clickedPostData , setClickedPostData] = useState(null);
    const [relatedArticlesPosts, setRelatedArticlesPosts] = useState(null);

    let {categorySlug, titleSlug} = useParams();

    const categoryButtons = [
        {
            id : 1,
            categoryName : "Business How to's",
            categorySlug : "business-how-tos",
        },
        {
            id : 2,
            categoryName : "Culture & Community",
            categorySlug : "culture-and-community",
        },
        {
            id : 3,
            categoryName : "Productivity",
            categorySlug : "productivity",
        },
        {
            id : 4,
            categoryName : "Workspace Solutions",
            categorySlug : "workspace-solutions",
        },
        {
            id : 5,
            categoryName : "Inspiring Stories",
            categorySlug : "inspiring-stories",
        }
    ];

    const filterFeaturedPosts = async () => {
        if(postsData){
            return postsData?.filter(post => post.featuredBlog);
        }

        return [];
    }

    const filterSuggestedPosts = async () => {
        if(postsData){
            return postsData?.filter(post => post.suggested);
        }

        return [];
    }

    const filterCategoryWisePosts = (selectedCategory = "business-how-tos") => {
        if(postsData){
            setActiveCategoryButton(selectedCategory);
            return postsData?.filter(post => post.categorySlug === selectedCategory)
        }

        return [];
    }

    const addSubscriberMain = async (email) => {
        Firebase.addSubscriber(email).then((data) => {
            if(data === "Added")
            {
                alert("Thank you for subscribing!");
            }
        });
    }

    const fetchRelatedArticlesPosts = async ({categorySlug, titleSlug}) => {
        if(postsData){
            return postsData?.filter(post => post.categorySlug === categorySlug && post.Slug !== titleSlug);
        }
    }

    const fetchClickedPostData = ({categorySlug, titleSlug}) => {

        Firebase.getSingleBlog(`/blogs/${categorySlug}/${titleSlug}`).then((data) => {
            setClickedPostData(data);
        });

    }

    if(categorySlug && postsData)
    {
        if(titleSlug){
            fetchClickedPostData({categorySlug, titleSlug});
            fetchRelatedArticlesPosts({categorySlug, titleSlug}).then((data) => {
                setRelatedArticlesPosts(data);
            })
        }
        else{
            filterCategoryWisePosts(categorySlug).then((data) => {
                setCategoryWisePosts(data);
            });
        }
    }

    useEffect(() => {

        if(postsData){
            if(!featuredPosts)
            {
                const data = filterFeaturedPosts().then((data) => {

                    const singlePost = data[0];
                    setMasterPost(singlePost);

                    const newPosts = data.slice(1);
                    setFeaturedPosts(newPosts);

                });
            }

            if(!suggestedPosts)
            {
                const data = filterSuggestedPosts().then((data) => {
                    setSuggestedPosts(data);
                });
            }

            if(!categoryWisePosts)
            {
                setCategoryWisePosts(filterCategoryWisePosts());
            }
        }
        else{
            Firebase.getAllBlogs("/blogs").then((data) => {
                setPostsData(data);
            });
        }
        
    }, [postsData]);

    useEffect(() => {
        // console.log("featuredPosts : ", featuredPosts);
        // console.log("masterPost : ",masterPost);
    },[featuredPosts])

    return (
        <>
            {/* ########### Header Section starts here ########### */}

            <Header/>

            {/* ########### Header Section ends here ########### */}

            {
                categorySlug ? (
                    titleSlug ? (
                        <></>
                    )
                    : (
                        <></>
                    )
                )
                : (
                    <>
                        {/* ########### Hero Section starts here ########### */}

                        <section className="blogHome_hero_wrapper px-4 sm:px-0 sm:py-8 sm:pt-12">
                            <SectionHeading headingText={"Featured Posts"}/>
                            <div className="blogHome_hero_container">
                                <div className="left">
                                    <Link to={masterPost && `/${masterPost.categorySlug}/${masterPost.slug}`} className="block">
                                        <div className="front_featuredPost_container">
                                            <div className="post_image">
                                            {
                                                masterPost && <img src={masterPost.thumbnailImage} alt=""/>
                                            } 
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
                                    <div className="">
                                        {
                                            featuredPosts && featuredPosts.map((post) => (
                                                <SmallPostsWrapper postData={post}/>
                                            ))
                                        }
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* ########### Hero Section ends here ########### */}

                        {/* ########### Explore Category Section starts here ########### */}

                        <section className="category_wise_posts_wrapper px-4 sm:px-0 py-8 my-4 bg-[#f5f5f5]">
                            <SectionHeading headingText={"Explore Categories"}/>
                            <div className="filterCTAs my-4 md:my-8 mx-auto">
                                {
                                    categoryButtons.map((category) => (
                                        <button className={activeCategoryButton === category.categorySlug ? "activeCategory" : ""} onClick={() => {
                                            setCategoryWisePosts(filterCategoryWisePosts(category.categorySlug));
                                        }}>{category.categoryName}</button>
                                    ))
                                }
                            </div>

                            {
                                categoryWisePosts && <RowScrollPostsWrapper postsData={categoryWisePosts}/>
                            }
                        </section>

                        {/* ########### Explore Category Section ends here ########### */}
                    </>
                )
            }

            {/* ########### Suggested Posts Section starts here ########### */}

            <section className="suggestedPosts_wrapper px-4 sm:px-0 py-8 my-2 sm:my-6">
                <SectionHeading headingText={"Suggested Posts"}/>
                {
                    suggestedPosts && <RowScrollPostsWrapper postsData={suggestedPosts}/>
                }
            </section>

            {/* ########### Suggested Posts Section ends here ########### */}

            {/* ########### Subscribe us Section starts here ########### */}
            
            <section className="subscribeSection_wrapper bg-[#f5f5f5] py-8">
                <SubscribeCard addSubscriberMain={addSubscriberMain}/>
            </section>

            {/* ########### Subscribe us Section ends here ########### */}

            {/* ########### Footer Section starts here ########### */}

            <Footer/>

            {/* ########### Footer Section ends here ########### */}
            
        </>
    )
}

export default BlogHomePage;