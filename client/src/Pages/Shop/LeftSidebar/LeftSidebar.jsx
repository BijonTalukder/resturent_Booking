import React, { useState, useEffect } from "react";
import { useAppSelector, useAppDispatch } from "../../../redux/Hook/Hook";
import { Slider } from "antd";
import { setPriceMin, setPriceMax } from "../../../redux/Modal/ModalSlice";

const LeftSidebar = ({
  categories,
  brands,
  selectedCategory,
  setSelectedCategory,
  selectedBrand,
  setSelectedBrand,
  isCategoriesLoading,
  isBrandsLoading,
}) => {
  const dispatch = useAppDispatch();
  const { isHomeCategorySidebarOpen, priceMin, priceMax } = useAppSelector((state) => state.modal);
  const [priceRange, setPriceRange] = useState([priceMin, priceMax]);
  const [isLoading, setIsLoading] = useState(true); // Loading state

  useEffect(() => {
    setPriceRange([priceMin, priceMax]);
  }, [priceMin, priceMax]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  const handleSliderChange = (value) => {
    setPriceRange(value);
    dispatch(setPriceMin(value[0]));
    dispatch(setPriceMax(value[1]));
  };

  const handleInputChange = (index, value) => {
    const newValue = parseFloat(value);
    if (!isNaN(newValue)) {
      const newRange = [...priceRange];
      newRange[index] = newValue;
      if (newRange[0] <= newRange[1]) {
        setPriceRange(newRange);
        dispatch(setPriceMin(newRange[0]));
        dispatch(setPriceMax(newRange[1]));
      }
    }
  };

  const handleCategoryChange = (categoryId) => {
    if (selectedCategory === categoryId) {
      setSelectedCategory("");
    } else {
      setSelectedCategory(categoryId);
    }
  };

  const handleBrandChange = (brandId) => {
    if (selectedBrand === brandId) {
      setSelectedBrand("");
    } else {
      setSelectedBrand(brandId);
    }
  };

  // Skeleton Component
  if (isLoading) {
    return (
      <div className="md:px-4 bg-white">
        <div className={`${isHomeCategorySidebarOpen ? "block" : "hidden"} lg:block w-[250px]`}>
          {/* Categories Skeleton */}
          <div className="mb-6">
            <div className="h-6 w-1/2 bg-gray-300 rounded mb-3 animate-pulse"></div>
            <div className="space-y-2">
              {[1, 2, 3].map((_, index) => (
                <div key={index} className="flex items-center">
                  <div className="h-4 w-4 bg-gray-300 rounded mr-2 animate-pulse"></div>
                  <div className="h-4 w-3/4 bg-gray-300 rounded animate-pulse"></div>
                </div>
              ))}
            </div>
          </div>

          {/* Brands Skeleton */}
          <div className="mb-6">
            <div className="h-6 w-1/2 bg-gray-300 rounded mb-3 animate-pulse"></div>
            <div className="space-y-2">
              {[1, 2, 3].map((_, index) => (
                <div key={index} className="flex items-center">
                  <div className="h-4 w-4 bg-gray-300 rounded mr-2 animate-pulse"></div>
                  <div className="h-4 w-3/4 bg-gray-300 rounded animate-pulse"></div>
                </div>
              ))}
            </div>
          </div>

          {/* Price Range Skeleton */}
          <div className="mb-6">
            <div className="h-6 w-1/2 bg-gray-300 rounded mb-3 animate-pulse"></div>
            <div className="h-4 w-full bg-gray-300 rounded animate-pulse"></div>
            <div className="flex items-center gap-4 justify-between mt-4">
              <div className="h-10 w-1/2 bg-gray-300 rounded animate-pulse"></div>
              <div className="h-10 w-1/2 bg-gray-300 rounded animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="md:px-4 bg-white">
      <div className={`${isHomeCategorySidebarOpen ? "block" : "hidden"} lg:block w-[250px]`}>
        {/* Categories Section */}
        <div className="mb-6">
          <h3 className="font-semibold mb-3 text-lg">CATEGORIES</h3>
          <div className="space-y-2">
            {categories?.data?.map((category) => (
              <div className="flex items-center" key={category.id}>
                <input
                  type="checkbox"
                  id={`category-${category.id}`}
                  className="mr-2"
                  checked={selectedCategory === category.id}
                  onChange={() => handleCategoryChange(category.id)}
                />
                <label htmlFor={`category-${category.id}`}>{category.categoryName}</label>
              </div>
            ))}
          </div>
        </div>

        {/* Brands Section */}
        <div className="mb-6">
          <h3 className="font-semibold mb-3 text-lg">BRANDS</h3>
          <div className="space-y-2">
            {brands?.data?.map((brand) => (
              <div className="flex items-center" key={brand.id}>
                <input
                  type="checkbox"
                  id={`brand-${brand.id}`}
                  className="mr-2"
                  checked={selectedBrand === brand.id}
                  onChange={() => handleBrandChange(brand.id)}
                />
                <label htmlFor={`brand-${brand.id}`}>{brand.brandName}</label>
              </div>
            ))}
          </div>
        </div>

        {/* Price Range Section */}
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold mb-3 text-lg">PRICE</h3>
            <span className="bg-black text-white text-sm px-2 py-1 rounded">
              {priceRange[0].toFixed(2)}-{priceRange[1].toFixed(2)}
            </span>
          </div>

          <div className="mt-6 px-2">
            <Slider
              range
              value={priceRange}
              onChange={handleSliderChange}
              min={1}
              max={9999}
              step={0.01}
              trackStyle={[{ backgroundColor: "black" }]}
              handleStyle={[
                { borderColor: "black", backgroundColor: "white" },
                { borderColor: "black", backgroundColor: "white" },
              ]}
              railStyle={{ backgroundColor: "#d1d5db" }}
            />
          </div>

          <div className="flex items-center justify-between mt-4">
            <div className="flex-1 mr-4">
              <label className="text-sm text-gray-600">Minimum</label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-gray-500 sm:text-sm">$</span>
                </div>
                <input
                  type="number"
                  value={priceRange[0] || 1}
                  onChange={(e) => handleInputChange(0, e.target.value)}
                  className="focus:ring-black focus:border-black block w-full pl-7 pr-2 py-2 sm:text-sm border-gray-300 rounded-md"
                />
              </div>
            </div>
            <div className="flex-1">
              <label className="text-sm text-gray-600">Maximum</label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-gray-500 sm:text-sm">$</span>
                </div>
                <input
                  type="number"
                  value={priceRange[1] || 1}
                  onChange={(e) => handleInputChange(1, e.target.value)}
                  className="focus:ring-black focus:border-black block w-full pl-7 pr-2 py-2 sm:text-sm border-gray-300 rounded-md"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeftSidebar;