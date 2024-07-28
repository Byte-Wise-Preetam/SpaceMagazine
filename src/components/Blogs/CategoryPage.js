import { useEffect, useState } from "react";
import { useFirebase } from "../../context/firebase";
import { useParams } from "react-router-dom";
import RowScrollPostsWrapper from "./RowScrollPostsWrapper";
import SectionHeading from "../SectionHeading";
import NotFound from "../Pages/NotFound";

const CategoryPage = () => {

    const Firebase = useFirebase();
    const [categoryWisePostsData, setCategoryWisePostsData] = useState(null);
    const [category, setCategory] = useState(true);
    let { categorySlug } = useParams();

    useEffect(() => {
        const fetchCategoryWisePostsData = async (categorySlug) => {
            try {
                const data = await Firebase.getCategoryWiseBlogs(categorySlug);
                setCategory(data[0].category);
                setCategoryWisePostsData(data);
            } catch (error) {
                // console.error("Error fetching category-wise posts:", error);
                setCategory(false);
            }
        };

        fetchCategoryWisePostsData(categorySlug);

    },[categorySlug, Firebase]) 

    return(
        <section className="categoryPagePosts_wrapper py-8 px-4 sm:px-0 mt-4">
            {
                category ? 
                    categoryWisePostsData ? (
                        <>
                            <SectionHeading content={category} />
                            <RowScrollPostsWrapper postsData={categoryWisePostsData} />
                        </>
                    ) : <RowScrollPostsWrapper/>
                : <NotFound/>
            }
        </section>
    )
}

export default CategoryPage;