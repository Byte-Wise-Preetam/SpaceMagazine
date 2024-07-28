import { useEffect } from "react";

const SectionHeading = ({headingText}) => {

    useEffect(() => {
        // console.log("headingText : ", headingText);
    },[])

    return(
        <div className="SectionHeading_container">
            <span></span>
            <span>{headingText}</span>
        </div>
    )
}

export default SectionHeading;