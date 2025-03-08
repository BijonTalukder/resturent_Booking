
import { BsSignIntersectionFill } from "react-icons/bs";
const SectionTitle = ({ title, subTitle }) => {
    return (
        <div>
            {
                <div className="my-16 flex flex-col justify-center items-center">
                    <div className="flex items-center gap-2">

                        <span><BsSignIntersectionFill className="text-2xl text-[#24354C]" /></span>

                        <h1 className="text-2xl font-bold uppercase">{title}</h1>
                    </div>
                    <h5 className="text-base">{subTitle}</h5>
                </div>
            }
        </div>
    );
};

export default SectionTitle;