import { initializeApp } from "firebase/app";
import { createContext, useContext, useState } from "react";
import { auth, getAuth, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { getDatabase, onValue, ref as dbRef, set, get, update, remove, child } from "firebase/database";
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL } from "firebase/storage";
import Cookies from 'js-cookie';

const firebaseConfig = {
    apiKey: process.env.REACT_APP_MY_API_KEY,
    authDomain: process.env.REACT_APP_MY_AUTH_DOMAIN,
    projectId: process.env.REACT_APP_MY_PROJECT_ID,
    storageBucket: process.env.REACT_APP_MY_STORAGE_BUCKET,
    messagingSenderId: process.env.REACT_APP_MY_API_KEY_MESSAGING_SENDER_ID,
    appId: process.env.REACT_APP_MY_APP_ID,
    databaseURL : process.env.REACT_APP_MY_DATABASE_URL
}

const firebaseApp = initializeApp(firebaseConfig);
const firebaseAuth = getAuth(firebaseApp);
const database = getDatabase(firebaseApp);
const storage = getStorage(firebaseApp);

const FirebaseContext = createContext(null);

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
}

export const useFirebase = () => useContext(FirebaseContext);


export const FirebaseProvider = (props) => {

    const [postsData, setPostsData] = useState(null);
    const [isUser, setIsUser] = useState(null);
    const [editPostState, setEditPostState] = useState(false);
    const [defaultData,setDefaultData] = useState(null);

    const setUserRole = async (userID) => {
        try{
            const userRoleRef = dbRef(database,`roles/${userID}`);
            const snapshot = await get(userRoleRef);
            if(snapshot.exists()) {
                const userData = snapshot.val();
                // console.log("role :", userData.role)
                userData && await setIsUser(userData.role);
            }else{
                // console.log("no data available");
            }
        }catch(error)
        {
            // console.log("Error in setUserRole", error);
            alert("Error in Setting User Role");
        }
    }

    const logInUser =async ({email, password}) => {
        try{
            const userCredential = await signInWithEmailAndPassword(firebaseAuth, email, password);
            const uid = userCredential.user.uid;

            setUserRole(uid).then(() => {
                Cookies.set('uid', uid, { expires: 1 });
            })
        }
        catch(error){
            // console.log("Error logging in:", error);
            alert("Invalid Credentials");
        }
    }

    const logOutUser = async () => {
        try {
            await signOut(firebaseAuth);
            setIsUser(null);
            Cookies.remove('uid');
            // console.log('User signed out successfully');
        } catch (error) {
            // console.error('Error signing out:', error);
            alert("Error in signing out");
        }
    };

    const getAllBlogs = async (path) => {

        if(postsData){
            return postsData;
        }

        const blogsRef = dbRef(database, path)
        const snapshot = await get(blogsRef);
        
        if(snapshot.exists())
        {
            const data = snapshot.val();
            const blogs = [];

            for(const category in data){
                for(const slug in data[category]){
                    const fetchedBlogData = data[category][slug];

                    const filteredBlog= {
                        _createdAt: fetchedBlogData._createdAt,
                        _id: fetchedBlogData._id,
                        blogTitle: fetchedBlogData.blogTitle,
                        category: fetchedBlogData.category,
                        categorySlug: fetchedBlogData.categorySlug,
                        featuredBlog: fetchedBlogData.featuredBlog,
                        published: fetchedBlogData.published,
                        slug: fetchedBlogData.slug,
                        suggested: fetchedBlogData.suggested,
                        //
                        thumbnailImage: fetchedBlogData.thumbnailImage,
                        subTitle: fetchedBlogData.subTitle,
                    };

                    blogs.push(filteredBlog);

                }
            }

            shuffleArray(blogs);

            setPostsData(blogs);

            return blogs;
        }
        else{
            // console.log("No Data Available");
            return [];
        }
    }


    const getCategoryWiseBlogs = async (categorySlug) => {

        if(!postsData)
        {
            await getAllBlogs("/blogs");
        }

        return postsData ? postsData.filter(post => post.categorySlug === categorySlug) : [];
    }

    const getSingleBlog = async (path) => {

        const blogsRef = dbRef(database, path)
        const snapshot = await get(blogsRef);
        
        if(snapshot.exists())
        {
            const data = snapshot.val();

            return data;
        }
        else{
            // console.log("No Data Available");
            return [];
        }
    }

    const fetchFeaturedPosts = async () => {
        if(!postsData)
        {
            await getAllBlogs("/blogs");
        }

        return postsData ? postsData.filter(post => post.featuredBlog) : [];
    }

    const fetchNotFeaturedPosts = async () => {
        if(postsData)
        {
            return postsData?.filter(post => post.featuredBlog === false);
        }

        return [];
    }

    const fetchSuggestedPosts = async () => {
        if(!postsData)
        {
            await getAllBlogs("/blogs");
        }

        return postsData ? postsData.filter(post => post.suggested) : [];
    }

    const fetchNotSuggestedPosts = async () => {
        if(postsData)
        {
            return postsData?.filter(post => post.suggested===false);
        }

        return [];
    }

    const removePost = async ({category, slug, actionOnKey}) => {
        const blogsRef = dbRef(database, `blogs/${category}/${slug}`);

        const updateData = {};
        updateData[actionOnKey] = false;

        try{
            await update(blogsRef, updateData);
            console.log("Update Successful");

            if(postsData){
                setPostsData((prevData) => 
                    prevData.map((post) => 
                        post.slug === slug 
                            ? { ...post, [actionOnKey]: false }
                            : post 
                    )
                );
            }
        }
        catch(error) {
            // console.log("Error updating featuredblog : ",error);
            alert("Error in updating Featured Blog")
        }
    }

    const fetchTrashPosts = async () => {
        const blogsRef = dbRef(database, 'trash')
        const snapshot = await get(blogsRef);

        if(snapshot.exists())
        {
            const data = snapshot.val();
            
            const blogs = [];

            for(const slug in data){
                const fetchedBlogData = data[slug];

                const filteredBlog= {
                    _createdAt: fetchedBlogData._createdAt,
                    _id: fetchedBlogData._id,
                    blogTitle: fetchedBlogData.blogTitle,
                    category: fetchedBlogData.category,
                    categorySlug : fetchedBlogData.categorySlug,
                    featuredBlog: fetchedBlogData.featuredBlog,
                    published: fetchedBlogData.published,
                    slug: fetchedBlogData.slug,
                    suggested: fetchedBlogData.suggested
                };

                blogs.push(filteredBlog);

            }

            return blogs;
        }
        else{
            return [];
        }
    }

    const moveToTrash = async ({category,slug}) => {

        const blogsRef = dbRef(database, `blogs/${category}/${slug}`);
        const snapshot = await get(blogsRef);

        if(snapshot.exists())
        {
            const data = snapshot.val();
            data.published = false;
            set(dbRef(database, `trash/${slug}`), data);

            deletePost(category, slug, false);
        }
        else{
            return {};
        }
    }

    const postNewBlog = async (key, blogData) => {
        try{
            set(dbRef(database, key), blogData);
            return true;
        }catch(error){
            // console.error('Error posting blog:', error);
            alert("Error in posting Blog");
            return false;
        }
    }
    

    const deletePost = async (category, slug, trash) => {
        let path;
        if(trash){
            path = `trash/${slug}`;
        }
        else{
            path = `blogs/${category}/${slug}`;
        }
        const postRef = dbRef(database, path);
        try {
            await remove(postRef);
            
            // Optionally, update the local state to reflect the deletion
            if(postsData && !trash)
            {
                setPostsData((prevData) => prevData.filter((post) => post.slug !== slug));
            }

        }catch(error) {
            // console.error("Error deleting post:", error);
            alert("Error in Deleting Post:");
        }
    };


    const restorePost =async ({category, slug}) => {
        const blogsRef = dbRef(database, `trash/${slug}`);
        const snapshot = await get(blogsRef);

        if(snapshot.exists())
        {
            const data = snapshot.val();

            try{
                await set(dbRef(database, `blogs/${category}/${slug}`), data);

                const filteredBlog= {
                    _createdAt: data._createdAt,
                    _id: data._id,
                    blogTitle: data.blogTitle,
                    category: data.category,
                    categorySlug : data.categorySlug,
                    featuredBlog: data.featuredBlog,
                    published: data.published,
                    slug: data.slug,
                    suggested: data.suggested
                };

                setPostsData((prevData) => [...postsData, filteredBlog]);

                deletePost(category, slug, true);
            }catch(error){
                // console.error("Error restoring post:", error);
                alert("Error in restoring post");
            }
        }
        else{
            return {};
        }
    }

    const includePost = async ({category, slug, actionOnKey}) => {

        const blogsRef = dbRef(database, `blogs/${category}/${slug}`);

        const updateData = {};
        updateData[actionOnKey] = true;

        try{
            console.log("updateData : ",updateData)
            await update(blogsRef, updateData);

            if(postsData){
                await setPostsData((prevData) => 
                    prevData.map((post) => 
                        post.slug === slug 
                            ? { ...post, [actionOnKey]: true }
                            : post 
                    )
                );
            }
        }
        catch(error) {
            // console.log("Error updating featuredblog : ",error);
        }
    }

    const changePublishStatus = async ({category, slug, actionOnKey, status}) => {

        const blogsRef = dbRef(database, `blogs/${category}/${slug}`);

        const updateData = {};
        updateData[actionOnKey] = !status;

        try{
            // console.log("updateData : ",updateData);
            await update(blogsRef, updateData);

            if(postsData){
                await setPostsData((prevData) => 
                    prevData.map((post) => 
                        post.slug === slug 
                            ? { ...post, [actionOnKey]: !status }
                            : post 
                    )
                );
            }
        }
        catch(error) {
            // console.log("Error updating featuredblog : ",error);
        }
    }

    const imageURL = async (imageName) => {
        const Ref = storageRef(storage, imageName);

        try {
            const url = await getDownloadURL(Ref);
            // console.log("ImageURL : ",url);
            return url;
          } catch (error) {
            // console.error('Error fetching thumbnail URL:', error);
            return null;
          }
    }

    const putImage = (image, imageName) => {
        const Ref = storageRef(storage, `/images/thumbnail/${imageName}`);
        
        return new Promise((resolve, reject) => {
            uploadBytes(Ref, image)
                .then((snapshot) => {
                    console.log('Image uploaded successfully:', snapshot);
                    resolve(true);  // Resolve with true to indicate success
                })
                .catch((error) => {
                    console.error('Error uploading image:', error);
                    reject(error);  // Reject with false to indicate failure
                });
        });
    };

    const addSubscriber = async (email, emailId) => {
        const emailKey = email.replace('.', '_'); 
        const subscriberRef = dbRef(database, `subscribers/${emailKey}`);
      
        try {
          const snapshot = await get(subscriberRef);
      
          if (snapshot.exists()) {
            throw new Error("Email already exists");
          }
      
          await set(subscriberRef, {
            email: emailId,
            subscribedAt: new Date().toISOString()
          });
      
          return "Added";
        } catch (e) {
        //   console.error("Error adding subscriber: ", e);
          if(e.message === "Email already exists"){
            alert("Email already exists");
          }
          else{
            alert("Error subscribing. Please try again.");
          }
        }
    };

    return (
        <FirebaseContext.Provider value={{
            isUser,
            setIsUser,
            setUserRole,
            logInUser,
            getAllBlogs,
            postsData,
            editPostState,
            setEditPostState,
            fetchFeaturedPosts,
            fetchSuggestedPosts,
            fetchNotSuggestedPosts,
            fetchNotFeaturedPosts,
            removePost,
            fetchTrashPosts,
            moveToTrash,
            restorePost,
            includePost,
            logOutUser,
            changePublishStatus,
            putImage,
            imageURL,
            postNewBlog,
            getSingleBlog,
            defaultData,
            setDefaultData,
            addSubscriber,
            getCategoryWiseBlogs,
            
        }}>
            {props.children}
        </FirebaseContext.Provider>
    )
}