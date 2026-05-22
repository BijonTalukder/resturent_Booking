import { useLocation } from 'react-router-dom';

const Skeleton = () => {
  const location = useLocation();
  const isHomePage = location.pathname === "/";

  return (
    <>
      {isHomePage ? (
        <div className="neu-card p-4 animate-pulse">
          <div className="h-48 bg-[#d1d5db] rounded-xl"></div>
          <span className="sr-only text-black">Loading banner...</span>
        </div>
      ) :
      <div className="neu-card p-6 animate-pulse mt-10">
        <div className="space-y-4">
          {Array.from({ length: 10 }).map((_, index) => (
            <div key={index} className="flex justify-between items-center gap-5">
              <div className="h-4 w-10 lg:w-24 md:w-12 bg-[#d1d5db] rounded-lg"></div>
              <div className="w-10 lg:w-32 md:w-12 h-4 bg-[#d1d5db] rounded-lg"></div>
              <div className="w-10 lg:w-32 md:w-12 h-4 bg-[#d1d5db] rounded-lg"></div>
              <div className="h-4 w-10 lg:w-24 md:w-12 bg-[#d1d5db] rounded-lg"></div>
            </div>
          ))}
        </div>
        <span className="sr-only">Loading...</span>
      </div>
      }
    </>
  );
};

export default Skeleton;
