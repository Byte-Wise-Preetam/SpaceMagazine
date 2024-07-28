import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useEditor, EditorContent } from "@tiptap/react";
import { StarterKit } from "@tiptap/starter-kit";
import TiptapHeaderButton from "../../Buttons/TiptapHeaderButton";
import UploadIcon from "../../../utils/assets/images/UploadIcon.png";
import CancelIcon from "../../../utils/assets/icons/cancelLight.png";
import { useFirebase } from "../../../context/firebase";

const extensions = [StarterKit];

const EditPostMain = ({ setEditPostState, defaultData }) => {
  const generateSlug = (title) => {
    return title
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-");
  };

  const CHECKOUT_STEPS = ["Blog Post Details", "Blog Content", "Related Articles & Thumbnail Image"];

  const Form = useForm();
  const Firebase = useFirebase();
  const { register, handleSubmit, setValue } = Form;
  const [editedData, setEditedData] = useState({ ...defaultData });
  const [currentStep, setCurrentStep] = useState(1);
  const [progressBarWidth, setProgressBarWidth] = useState(0);

  const content = defaultData.content;

  const editor = useEditor({
    extensions,
    content,
  });

  const handleDisplayDefaultData = () => {
    Object.keys(defaultData).forEach((key) => {
      setValue(key, defaultData[key]);
    });
  };

  useEffect(() => {
    if (currentStep !== CHECKOUT_STEPS.length + 1) {
      let width = ((currentStep - 1) / (CHECKOUT_STEPS.length - 1)) * 100;
      setProgressBarWidth(width);
    }

    // console.log("editedData : ", editedData);
  }, [currentStep, defaultData, editedData]);

  if (!editor) {
    return null;
  }

  const textEditorHeadorButtonsList = [
    {
      id: 1,
      buttonName: "bold",
      buttonClass: editor.isActive("bold") ? "is-active" : "",
      disabledValue: !editor.can().chain().focus().toggleBold().run(),
      onClickFunction: () => editor.chain().focus().toggleBold().run(),
    },
    {
      id: 2,
      buttonName: "italic",
      buttonClass: editor.isActive("italic") ? "is-active" : "",
      disabledValue: !editor.can().chain().focus().toggleItalic().run(),
      onClickFunction: () => editor.chain().focus().toggleItalic().run(),
    },
    {
      id: 3,
      buttonName: "paragraph",
      buttonClass: editor.isActive("paragraph") ? "is-active" : "",
      disabledValue: false,
      onClickFunction: () => editor.chain().focus().setParagraph().run(),
    },
    {
      id: 4,
      buttonName: "h1",
      buttonClass: editor.isActive("heading", { level: 1 }) ? "is-active" : "",
      disabledValue: false,
      onClickFunction: () => editor.chain().focus().toggleHeading({ level: 1 }).run(),
    },
    {
      id: 5,
      buttonName: "h2",
      buttonClass: editor.isActive("heading", { level: 2 }) ? "is-active" : "",
      disabledValue: false,
      onClickFunction: () => editor.chain().focus().toggleHeading({ level: 2 }).run(),
    },
    {
      id: 6,
      buttonName: "h3",
      buttonClass: editor.isActive("heading", { level: 3 }) ? "is-active" : "",
      disabledValue: false,
      onClickFunction: () => editor.chain().focus().toggleHeading({ level: 3 }).run(),
    },
    {
      id: 7,
      buttonName: "h4",
      buttonClass: editor.isActive("heading", { level: 4 }) ? "is-active" : "",
      disabledValue: false,
      onClickFunction: () => editor.chain().focus().toggleHeading({ level: 4 }).run(),
    },
    {
      id: 8,
      buttonName: "h5",
      buttonClass: editor.isActive("heading", { level: 5 }) ? "is-active" : "",
      disabledValue: false,
      onClickFunction: () => editor.chain().focus().toggleHeading({ level: 5 }).run(),
    },
    {
      id: 9,
      buttonName: "h6",
      buttonClass: editor.isActive("heading", { level: 6 }) ? "is-active" : "",
      disabledValue: false,
      onClickFunction: () => editor.chain().focus().toggleHeading({ level: 6 }).run(),
    },
    {
      id: 10,
      buttonName: "ul",
      buttonClass: editor.isActive("bulletList") ? "is-active" : "",
      disabledValue: false,
      onClickFunction: () => editor.chain().focus().toggleBulletList().run(),
    },
    {
      id: 11,
      buttonName: "ol",
      buttonClass: editor.isActive("orderedList") ? "is-active" : "",
      disabledValue: false,
      onClickFunction: () => editor.chain().focus().toggleOrderedList().run(),
    },
    {
      id: 12,
      buttonName: "horizontal rule",
      buttonClass: "",
      disabledValue: false,
      onClickFunction: () => editor.chain().focus().setHorizontalRule().run(),
    },
  ];

  const handleStepClick = (index) => {
    if (currentStep !== index + 1 && currentStep > index + 1) setCurrentStep(index + 1);
  };

  const handleEditorContentSave = async () => {
    const html = await editor.getHTML();
    return html;
  };

  const stepOneFormSubmit = (data) => {
    const titleSlug = generateSlug(data.blogTitle);
    const categorySlug = generateSlug(data.category);

    // console.log("editedDataStep1 : ", editedData);

    setEditedData({
      ...editedData,
      blogTitle: data.blogTitle,
      category: data.category,
      introDescription: data.introDescription,
      subTitle: data.subTitle,
      slug: titleSlug,
      categorySlug: categorySlug,
    });

    setCurrentStep(currentStep + 1);
  };

  const stepTwoFormSubmit = () => {
    handleEditorContentSave().then((data) => {
      // console.log("HTML Data : ", data);
      setEditedData({
        ...editedData,
        content: data,
      });

      setCurrentStep(currentStep + 1);
    });
  };

  const stepThreeFormSubmit = (newData) => {
    const imageFile = newData.thumbnailImage[0];
    if(imageFile)
    {
      Firebase.putImage(imageFile, editedData.slug).then(async () => {
        Firebase.imageURL(`/images/thumbnail/${editedData.slug}`).then((URL) => {
          setEditedData({
            ...editedData,
            thumbnailImage: URL,
          });
        });
      });
    }else{
      setEditedData({
        ...editedData,
        thumbnailImage: editedData.thumbnailImage,
      });
    }

    Firebase.postNewBlog(`/blogs/${editedData.categorySlug}/${editedData.slug}`, editedData).then((success) => {
      // success ? alert("Post Edited Successfully") : alert("Error in Editing Blog");
      if(success)
      {
        alert("Post Edited Successfully");
        setEditPostState(false);
      }
      else{
        alert("Error in Editing Blog");
      }
    });

    // console.log("editedDataStep3 : ",editedData);
  };

  return (
    <div className="create_post_main_wrapper">
      <div className="create_post_main_container">
        <div
          className="close cursor-pointer"
          onClick={() => {
            setEditPostState(false);
          }}
        >
          <img src={CancelIcon} alt=""/>
        </div>
        <div className="create_post_stepper_container flex flex-row items-center justify-between relative">
          {CHECKOUT_STEPS.map((step, index) => {
            return (
              <div className="step_value flex flex-col items-center w-[200px]" key={index}>
                <div
                  onClick={() => {
                    handleStepClick(index);
                  }}
                  className={`flex cursor-pointer flex-row justify-center items-center text-lg font-semibold rounded-[50%] w-10 h-10 mb-1 z-10 ${
                    currentStep > index + 1 ? "bg-[#0000ff] bg-[#0B57D0] text-white" : "bg-[#EAECF0] text-[#344054]"
                  } ${currentStep === index + 1 ? "border-2 border-[#0000ff] border-[#0B57D0] bg-white" : ""}`}
                >
                  {index + 1}
                </div>
              </div>
            );
          })}

          <div id="progress_bar_wrapper" className="h-1 absolute">
            <div
              id="progress-bar"
              style={{ width: `${progressBarWidth}%` }}
              className={"h-1 bg-[#0000ff] transition-[width] duration-500 bg-[#0B57D0]"}
            ></div>
          </div>
        </div>
        <div className="create_post_step_title">{CHECKOUT_STEPS[currentStep - 1]}</div>
        {currentStep === 1 && (
          <div className="create_post_input_area">
            <div className="stepOneArea">
              <form onSubmit={handleSubmit(stepOneFormSubmit)}>
                <div className="form_field">
                  <label htmlFor="post_title">Title*</label>
                  <input type="text" id="post_title" {...register("blogTitle")} defaultValue={editedData.blogTitle} placeholder="Enter title here" />
                </div>
                <div className="form_field">
                  <label htmlFor="post_sub_title">Sub-Title*</label>
                  <input type="text" id="post_sub_title" {...register("subTitle")} defaultValue={editedData.subTitle} placeholder="Enter sub-title here" />
                </div>
                <div className="form_field">
                  <label htmlFor="post_category">Category*</label>
                  <select id="post_category" {...register("category")} defaultValue={editedData.category}>
                    <option value="" disabled>
                      --select--
                    </option>
                    <option value="Business How To's">Business How To's</option>
                    <option value="Culture and Community">Culture and Community</option>
                    <option value="Inspiring Stories">Inspiring Stories</option>
                    <option value="Productivity">Productivity</option>
                    <option value="Workspace Solutions">Workspace Solutions</option>
                  </select>
                </div>
                <div className="form_field">
                  <label htmlFor="intro_description">Description*</label>
                  <input type="text" id="intro_description" {...register("introDescription")} defaultValue={editedData.introDescription} placeholder="Enter description here" />
                </div>
                <div className="text-center mt-8">
                  <button>Continue</button>
                </div>
              </form>
            </div>
          </div>
        )}

        {currentStep === 2 && (
          <div className="tiptap_box">
            <div className="w-[90%] lg:max-w-[800px] mx-auto my-8 rounded-md overflow-hidden border-2 border-[#D0D5DD]">
              <div className="tiptap-header">
                {textEditorHeadorButtonsList.map((button) => (
                  <TiptapHeaderButton key={button.id} buttonClass={button.buttonClass} disabledValue={button.disabledValue} onClickFunction={button.onClickFunction} content={button.buttonName} />
                ))}
              </div>
              <div className="tiptap-content">
                <EditorContent className="editor" editor={editor} />
              </div>
            </div>
            <div className="text-center mt-8">
              <button className="submit_btn" onClick={stepTwoFormSubmit}>
                Continue
              </button>
            </div>
          </div>
        )}

        {currentStep === 3 && (
          <div className="step_three_area">
            <div className="step_three_container">
              <form onSubmit={handleSubmit(stepThreeFormSubmit)}>
                <div className="form_box">
                  <div className="form_field" id="image_upload">
                    <label className="cursor-pointer">
                      <input type="file" {...register("thumbnailImage")} />
                      <div className="custom_label">
                        <img src={UploadIcon} alt=""/>
                        <p>
                          <span className="text-[#0B57D0] font-medium">Click to upload</span> or drag and drop
                        </p>
                        <p>SVG, PNG, JPG (max. 800x400px)</p>
                      </div>
                    </label>
                  </div>
                </div>
                <div className="text-center mt-[1.5rem]">
                  <button className="submit_btn">Publish</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EditPostMain;
