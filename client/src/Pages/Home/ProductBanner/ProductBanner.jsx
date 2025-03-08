import img6 from "../../../assets/Product/product-06.webp";
import img7 from "../../../assets/Product/product-07.webp";
import img8 from "../../../assets/Product/product-08.webp";
import img9 from "../../../assets/Product/product-09.webp";

const ProductBanner = () => {
    return (
        <div className="text-white bg-white grid grid-cols-[1fr_1fr_1fr_1fr] gap-1 md:gap-x-3">
            <div className="md:h-[200px] bg-[#edeeef] flex justify-center items-center">
                <img className="object-cover w-full h-full animate-zoom animate-zoom-2s" src={img6} alt="" />
            </div>
        
            <div className="md:h-[200px] bg-[#edeeef] flex justify-center items-center">
                <img className="object-cover w-full h-full animate-zoom animate-zoom-2s" src={img7} alt="" />
            </div>
        
            <div className="md:h-[200px] bg-[#edeeef] flex justify-center items-center">
                <img className="object-cover w-full h-full animate-zoom animate-zoom-2s" src={img8} alt="" />
            </div>
        
            <div className="md:h-[200px] bg-[#edeeef] flex justify-center items-center">
                <img className="object-cover w-full h-full animate-zoom animate-zoom-2s" src={img9} alt="" />
            </div>
        
        </div>
    );
};

export default ProductBanner;
