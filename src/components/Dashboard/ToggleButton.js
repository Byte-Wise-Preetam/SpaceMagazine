import { useState } from "react"
import { useFirebase } from "../../context/firebase";

const ToggleButton = ({isActive, categorySlug, titleSlug, published}) => {

    const [active, setActive] = useState(isActive);
    const Firebase = useFirebase();

    const handleToggleClick = () => {
        Firebase.changePublishStatus({category: categorySlug, slug : titleSlug, actionOnKey : "published", status : published});
        
        setActive(prevActive => !prevActive);
    }

    const buttonClass = ["toggle_Btn w-9 h-5 lg:w-11 lg:h-6 bg-[#0B57D0] rounded-xl cursor-pointer flex flex-row items-center px-1", active ? "justify-end bg-[#0B57D0" : "justify-start bg-[rgba(168,199,250,0.75)]",
    ]
    .filter(Boolean)
    .join(" ");

    const tag = [ "border-2 py-1 px-2 rounded-[24px] font-medium text-xs lg:text-sm inline-block ms-3",
    active ? "border-[#0B57D0] text-[#0B57D0]" : "border-[rgba(11,87,208,0.55)] text-[rgba(11,87,208,0.55)]" 
    ]
    .filter(Boolean)
    .join(" ");

    return(
        <span className="flex flex-row items-center">
            <div className={buttonClass} onClick={handleToggleClick}>
                <div className="toggler w-3 h-3 lg:w-4 lg:h-4 bg-white rounded-[50%]"></div>
            </div>
            <span className={tag}> {active ? "Published" : "Unpublished"}</span>
        </span>
    )
}

export default ToggleButton