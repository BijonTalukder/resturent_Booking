export default function ProductDetailsSkeleton () {
    return (
      <section className="py-5 animate-pulse">
        {/* Breadcrumb Skeleton */}
        <nav className="flex justify-start space-x-3 py-8 px-5">
          <div className="w-6 h-6 bg-gray-300 rounded-full"></div>
          <div className="w-6 h-6 bg-gray-300 rounded-full"></div>
          <div className="w-20 h-6 bg-gray-300 rounded"></div>
          <div className="w-6 h-6 bg-gray-300 rounded-full"></div>
          <div className="w-32 h-6 bg-gray-300 rounded"></div>
        </nav>
  
        {/* Product Details Skeleton */}
        <div className="container mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Image Slider Skeleton */}
          <div className="space-y-4">
            <div className="w-full h-96 bg-gray-300 rounded"></div>
            <div className="flex gap-2">
              {[1, 2, 3].map((_, index) => (
                <div key={index} className="w-24 h-24 bg-gray-300 rounded"></div>
              ))}
            </div>
          </div>
  
          {/* Product Info Skeleton */}
          <div className="space-y-5">
            <div className="w-3/4 h-8 bg-gray-300 rounded"></div>
            <div className="w-1/2 h-6 bg-gray-300 rounded"></div>
            <div className="w-1/4 h-6 bg-gray-300 rounded"></div>
            <div className="w-1/3 h-6 bg-gray-300 rounded"></div>
            <div className="w-1/2 h-6 bg-gray-300 rounded"></div>
            <div className="w-1/4 h-8 bg-gray-300 rounded"></div>
  
            {/* Attributes Skeleton */}
            <div className="space-y-4">
              {[1, 2].map((_, index) => (
                <div key={index} className="space-y-2">
                  <div className="w-1/4 h-6 bg-gray-300 rounded"></div>
                  <div className="flex gap-2">
                    {[1, 2, 3].map((_, i) => (
                      <div key={i} className="w-16 h-8 bg-gray-300 rounded"></div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
  
            {/* Quantity Selector Skeleton */}
            <div className="w-1/4 h-10 bg-gray-300 rounded"></div>
  
            {/* Buttons Skeleton */}
            <div className="flex gap-4">
              <div className="w-32 h-10 bg-gray-300 rounded"></div>
              <div className="w-32 h-10 bg-gray-300 rounded"></div>
            </div>
          </div>
        </div>
  
        {/* Tabs Section Skeleton */}
        <div className="container mx-auto lg:mt-[50px] mb-16">
          <div className="w-1/4 h-8 bg-gray-300 rounded mx-auto"></div>
          <div className="mt-6 space-y-4">
            <div className="w-full h-4 bg-gray-300 rounded"></div>
            <div className="w-full h-4 bg-gray-300 rounded"></div>
            <div className="w-full h-4 bg-gray-300 rounded"></div>
          </div>
        </div>
      </section>
    );
  };