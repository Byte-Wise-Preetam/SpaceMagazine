const TiptapHeaderButton = ({buttonClass, disabledValue, onClickFunction, content}) => {

    return(
        <button className={buttonClass} onClick={onClickFunction} disabled={disabledValue}>
            { content }
        </button>
    )
}

export default TiptapHeaderButton;