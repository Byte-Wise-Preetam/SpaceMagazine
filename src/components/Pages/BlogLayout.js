import Header from "../Blogs/BlogPageHeader";
import Footer from "../Blogs/BlogPageFooter";
import SubscribeCard from "../Blogs/SubscribeCard";
import RowScrollPostsWrapper from "../Blogs/RowScrollPostsWrapper";
import SectionHeading from "../SectionHeading";
import { useFirebase } from "../../context/firebase";
import { Outlet } from "react-router-dom";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const BlogLayout = () => {

    const Firebase = useFirebase();
    const [suggestedPosts, setSuggestedPosts] = useState(null);
    let {categorySlug, titleSlug} = useParams();

    // Function for adding subscriber ID to firebase and display the alert message
    const addSubscriberMain = async (emailKey, emailId) => {
        Firebase.addSubscriber(emailKey, emailId).then((data) => {
            if(data === "Added")
            {
                alert("Thank you for subscribing!");
            }
        });
    }

    useEffect(() => {

        const fetchData = async () => {
            try {
                Firebase.getAllBlogs("/blogs").then((data) => {
                    Firebase.fetchSuggestedPosts().then((data) => {
                        setSuggestedPosts(data);
                    })
                });

            } catch (error) {
                // console.error("Error fetching data:", error);
            }
        };
        fetchData()

    },[Firebase]);

    useEffect(() => {

    }, [categorySlug, titleSlug]);

    return(
        <>
            <Header/>

            <Outlet/>

            {/* ########### Suggested Posts Section starts here ########### */}

            <section className="suggestedPosts_wrapper px-4 sm:px-0 py-8 my-2 sm:my-6">
                <SectionHeading content="Suggested Posts"/>
                {
                    suggestedPosts ? <RowScrollPostsWrapper postsData={suggestedPosts}/> : <RowScrollPostsWrapper/>
                }
            </section>

            {/* ########### Suggested Posts Section ends here ########### */}

            {/* ########### Subscribe us Section starts here ########### */}
            
            <section className="subscribeSection_wrapper bg-[#f5f5f5] py-8">
                <SubscribeCard addSubscriberMain={addSubscriberMain}/>
            </section>

            {/* ########### Subscribe us Section ends here ########### */}

            <Footer/>
        </>
    )
}

export default BlogLayout;