import img1 from "../../../assets/Brands/Rectangle 4348.png";
import img2 from "../../../assets/Brands//Rectangle 4350.png";
import img3 from "../../../assets/Brands/Rectangle 4352.png";
import img4 from "../../../assets/Brands/Rectangle 4354.png";
import img5 from "../../../assets/Brands/Rectangle 4355.png";
import img6 from "../../../assets/Brands/Rectangle 4356.png";
import HomeTitle from "../../../components/Home/HomeTitle";
const brandsArr = [
  { name: "Audi", img: img1 },
  { name: "Mitsubishi", img: img2 },
  { name: "Nissan", img: img3 },
  { name: "Honda", img: img4 },
  { name: "Philips", img: img5 },
  { name: "Daraz", img: img6 },
  { name: "Audi", img: img1 },
  { name: "Mitsubishi", img: img2 },
  { name: "Nissan", img: img3 },
  { name: "Honda", img: img4 },
  { name: "Philips", img: img5 },
  { name: "Daraz", img: img6 },
];
const TopBrands = () => {
  return (
    <div className="mt-16 mb-16">
       <HomeTitle text="Top Brands"/>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 mt-12 gap-x-4">
        {brandsArr?.map((item , index) => (
          <div key={index} className="flex border border-[#928D8D70] h-[180px] justify-center flex-col items-center">
            <img src={item?.img} alt="" className="object-cover"/>
            <p className="mt-6">{item?.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TopBrands;
