import { Skeleton } from 'primereact/skeleton';

const ProductsSkeleton = ({hotelData}) => {

  return (
    <>
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {hotelData?.map((_, index) => (
        <div key={index} className="border-round border-1 surface-border p-4 surface-card hidden md:block">
          {/* Remove the circle skeleton and adjust the layout */}
          <div className="mb-3">
            <Skeleton width="100%" height="270px" className="mb-2" />
            <Skeleton width="50%" height="1rem" />
            <Skeleton width="30%" height="1.5rem" className="mt-2 mb-2" />
            <Skeleton width="100%" height="1rem" className="mb-2" />
          </div>


        
        </div>
      ))}
    </div>
    
    <div className="grid grid-cols-2 gap-3 md:hidden">
      {hotelData?.map((_, index) => (
        <div key={index} className="border border-gray-200 rounded-lg overflow-hidden bg-white">
          {/* Image placeholder */}
          <Skeleton 
            width="100%" 
            height="110px" 
            className="rounded-none" 
          />
          
          {/* Content area */}
          <div className="p-2">
            {/* Hotel name (short) */}
            <Skeleton 
              width="80%" 
              height="16px" 
              className="mb-1" 
            />
            
            {/* Location (shorter) */}
            <Skeleton 
              width="60%" 
              height="12px" 
              className="mb-2" 
            />
            
            {/* "Choose Room" button */}
            <Skeleton 
              width="100%" 
              height="28px" 
              borderRadius="6px"
            />
          </div>
        </div>
      ))}
    </div>
    
    
    </>
  );
};

export default ProductsSkeleton;