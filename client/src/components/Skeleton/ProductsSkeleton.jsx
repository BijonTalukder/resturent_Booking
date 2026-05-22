import { Skeleton } from 'primereact/skeleton';

const ProductsSkeleton = ({ hotelData, viewMode = 'grid' }) => {
  const skeletonItems = Array.from({ length: hotelData?.length || 6 });

  return (
    <>
      {/* Desktop View */}
      <div className="hidden md:block">
        {viewMode === 'grid' ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {skeletonItems.map((_, index) => (
              <div key={index} className="neu-card p-4">
                <div className="mb-3">
                  <Skeleton width="100%" height="270px" className="mb-3 !rounded-xl" />
                  <Skeleton width="70%" height="1.5rem" className="mb-2 !rounded-lg" />
                  <Skeleton width="50%" height="1rem" className="mb-3 !rounded-lg" />
                  <div className="flex gap-2 mb-3">
                    <Skeleton width="30%" height="1.5rem" className="!rounded-lg" />
                    <Skeleton width="25%" height="1.5rem" className="!rounded-lg" />
                  </div>
                  <Skeleton width="100%" height="2.5rem" className="!rounded-xl" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {skeletonItems.map((_, index) => (
              <div key={index} className="neu-card flex flex-row h-48 overflow-hidden">
                <div className="w-1/3 h-full">
                  <Skeleton width="100%" height="100%" className="!rounded-none" />
                </div>
                <div className="w-2/3 p-4 flex flex-col justify-between">
                  <div>
                    <Skeleton width="60%" height="1.5rem" className="mb-2 !rounded-lg" />
                    <Skeleton width="40%" height="1rem" className="mb-3 !rounded-lg" />
                    <div className="flex flex-wrap gap-2 mb-3">
                      <Skeleton width="20%" height="1.5rem" className="!rounded-lg" />
                      <Skeleton width="25%" height="1.5rem" className="!rounded-lg" />
                      <Skeleton width="22%" height="1.5rem" className="!rounded-lg" />
                      <Skeleton width="18%" height="1.5rem" className="!rounded-lg" />
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <Skeleton width="30%" height="1.5rem" className="!rounded-lg" />
                    <Skeleton width="25%" height="2.5rem" className="!rounded-xl" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Mobile View */}
      <div className="grid grid-cols-2 gap-3 md:hidden">
        {skeletonItems.map((_, index) => (
          <div key={index} className="neu-card p-2">
            <Skeleton
              width="100%"
              height="110px"
              className="!rounded-xl mb-2"
            />
            <div className="p-1">
              <Skeleton
                width="80%"
                height="16px"
                className="mb-1 !rounded-lg"
              />
              <Skeleton
                width="60%"
                height="12px"
                className="mb-2 !rounded-lg"
              />
              <Skeleton
                width="100%"
                height="28px"
                className="!rounded-xl"
              />
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default ProductsSkeleton;
