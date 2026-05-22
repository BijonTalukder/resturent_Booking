
const SectionTitle = ({ title, subTitle }) => {
    return (
        <div>
            {
                <div className="my-4 flex justify-start items-center">
                    <div className="flex items-center gap-3">
                        <span className="w-1 h-6 bg-primary rounded-full"></span>
                        <h1 className="text-[14px] lg:text-xl font-bold text-[#373b43]">{title}</h1>
                    </div>
                    <h5 className="text-base text-[#6b7588] ml-2">{subTitle}</h5>
                </div>
            }
        </div>
    );
};

export default SectionTitle;
