import { Skeleton } from 'primereact/skeleton';

const SliderSkeleton = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {[...Array(4)].map((_, index) => (
        <div key={index} className="neu-card p-4">
          <div className="mb-3">
            <Skeleton width="100%" height="150px" className="mb-2 !rounded-xl" />
            <Skeleton width="50%" height="1rem" className="!rounded-lg" />
            <Skeleton width="30%" height="1.5rem" className="mt-2 mb-2 !rounded-lg" />
            <Skeleton width="100%" height="1rem" className="mb-2 !rounded-lg" />
          </div>
        </div>
      ))}
    </div>
  );
};

export default SliderSkeleton;
