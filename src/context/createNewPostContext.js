import { useContext, createContext, useState } from "react";

const CreateNewPostContext = createContext(null);

export const useNewPostObject = () => useContext(CreateNewPostContext);

export const CreateNewPostProvider = (props) => {
    const [newPostData, setNewPostData] = useState({
        "_id": "",
        "_createdAt": "",
        "slug": "",
        "category": "",
        "categorySlug" : "",
        "blogTitle": "",
        "subTitle": "",
        "featuredBlog": false,
        "published": false,
        "suggested": false,
        "introDescription": "",
        "thumbnailImage": "",
        "content" : ""
    });

    const [editPostData, setEditPostData] = useState(null);

    const generateRandomNumber = () => {
        const min = 10000000;
        const max = 99999999;
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    const getCurrentTimeStamp = () => {
        return new Date().toLocaleDateString('en-GB', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
        });
    }

    const generateSlug = (title) => {
        return title
            .toLowerCase() 
            .trim() 
            .replace(/[^\w\s-]/g, '') 
            .replace(/\s+/g, '-') 
            .replace(/-+/g, '-'); 
    };

    return (
        <CreateNewPostContext.Provider value={{
            newPostData,
            setNewPostData,
            generateSlug,
            generateRandomNumber,
            getCurrentTimeStamp,
            editPostData,
            setEditPostData
        }}>
            {props.children}
        </CreateNewPostContext.Provider>
    )
}