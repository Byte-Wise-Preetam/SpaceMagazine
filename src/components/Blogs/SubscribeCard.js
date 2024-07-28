import { useForm } from "react-hook-form";

const SubscribeCard = ({addSubscriberMain}) => {

    const Form = useForm();
    const {register, handleSubmit, reset} = Form;

    const sanitizeEmail =async (email) => {
        return email.replace(/[.#$[\]]/g, '_');
    };

    const formSubmit = (data) => {
        sanitizeEmail(data.email).then((email) => {
            addSubscriberMain(email, data.email).then(() => {
                reset();
            });
        })
    }

    return (
        <div className="subscribeCard_wrapper">
            <div className="title">Subscribe with your email to stay updated with our latest posts!</div>
            <div className="form_wrapper">
                <form onSubmit={handleSubmit(formSubmit)}>
                    <input type="email" {...register("email")} placeholder="Enter you email-id"/>
                    <button type="submit">Subscribe</button>
                </form>
            </div>
        </div>
    )
}

export default SubscribeCard;