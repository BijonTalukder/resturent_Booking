import { useEffect, useState } from "react";
import { Link, useLoaderData } from "react-router-dom";
import ProductImageSlider from "./ProductImageSlider";
import { FaGreaterThan, FaHome } from "react-icons/fa";
import { CiShoppingCart } from "react-icons/ci";
import { HiOutlineShoppingBag } from "react-icons/hi2";
import { useAppDispatch, useAppSelector } from "../../../redux/Hook/Hook";
import { addToCart } from "../../../redux/Cart/cartSlice";
import { toast } from "sonner";
import { Alert, Tooltip } from "antd";
import NewProduct from "../NewProduct/NewProduct";
import ProductDetailsSkeleton from "../../../components/Skeleton/ProductDetailsSkeleton";

const ProductDetails = () => {
  const singleProduct = useLoaderData();
  const dispatch = useAppDispatch();
  const [selectedAttributes, setSelectedAttributes] = useState({});
  const [quantity, setQuantity] = useState(1);
  const [price, setPrice] = useState(singleProduct?.variants[0]?.price || 0);
  const [isAdded, setIsAdded] = useState(false);
  const [isLoading, setIsLoading] = useState(true); // Loading state
  const cartItems = useAppSelector((state) => state.cart?.items);

  // Simulate loading for 5 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  // Normalize attribute keys to lowercase
  const normalizeAttributes = (attributes) => {
    const normalized = {};
    for (const key in attributes) {
      normalized[key.toLowerCase()] = attributes[key];
    }
    return normalized;
  };

  // Find the selected variant based on normalized attributes
  const selectedVariant = singleProduct.variants.find((variant) => {
    const normalizedVariantAttributes = normalizeAttributes(variant.attributes);
    return Object.keys(selectedAttributes).every(
      (key) => normalizedVariantAttributes[key] === selectedAttributes[key]
    );
  });

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const isProductInCart = cartItems.some(
      (item) =>
        item.id === singleProduct.id &&
        JSON.stringify(item.selectedAttributes) ===
          JSON.stringify(selectedAttributes)
    );
    setIsAdded(isProductInCart);
  }, [cartItems, singleProduct.id, selectedAttributes]);

  // Function to group attribute values by key across all variants
  const groupAttributesByKey = () => {
    const attributeMap = {};
    singleProduct.variants.forEach((variant) => {
      const normalizedAttributes = normalizeAttributes(variant.attributes);
      Object.keys(normalizedAttributes).forEach((key) => {
        if (!attributeMap[key]) {
          attributeMap[key] = new Set(); // Use a Set to avoid duplicate values
        }
        attributeMap[key].add(normalizedAttributes[key]);
      });
    });

    return attributeMap;
  };

  // Function to handle attribute selection
  const handleAttributeSelection = (key, value) => {
    const normalizedKey = key.toLowerCase();
    setSelectedAttributes((prev) => ({ ...prev, [normalizedKey]: value }));
    updatePriceBasedOnAttributes({ ...selectedAttributes, [normalizedKey]: value });
  };

  // Function to update price based on selected attributes
  const updatePriceBasedOnAttributes = (attributes) => {
    const selectedVariant = singleProduct.variants.find((variant) => {
      const normalizedVariantAttributes = normalizeAttributes(variant.attributes);
      return Object.keys(attributes).every(
        (key) => normalizedVariantAttributes[key] === attributes[key]
      );
    });
    if (selectedVariant) {
      setPrice(selectedVariant.price);
    }
  };

  // Function to render attributes dynamically
  const renderAttributes = () => {
    const attributeMap = groupAttributesByKey();

    return Object.keys(attributeMap).map((key) => {
      const values = Array.from(attributeMap[key]); // Convert Set to Array

      return (
        <div key={key} className="mt-4">
          <span className="font-medium capitalize">{key}:</span>
          <div className="flex gap-2 mt-2">
            {values.map((value, index) => (
              <button
                key={index}
                onClick={() => handleAttributeSelection(key, value)}
                className={`border border-gray-300 px-4 py-2 rounded hover:border-blue-500 
                  ${
                    selectedAttributes[key] === value
                      ? " border-2 border-blue-500 shadow-md"
                      : "hover:bg-gray-100"
                  }`}
                style={{
                  backgroundColor:
                    key === "color" ? value.toLowerCase() : "transparent",
                  borderWidth:
                    selectedAttributes[key] === value ? "5px" : "1px",
                  color: selectedAttributes[key] === value ? "blueviolet" : "",
                  borderColor: selectedAttributes[key] === value ? "aqua" : "",
                }}
              >
                {key !== "color" && value}
              </button>
            ))}
          </div>
        </div>
      );
    });
  };

  // Function to handle quantity change
  const handleQuantityChange = (type) => {
    if (type === "increase") {
      setQuantity((prev) => prev + 1);
    } else if (type === "decrease" && quantity > 1) {
      setQuantity((prev) => prev - 1);
    }
  };

  // Function to handle adding to cart
  const handleAddToCart = () => {

    if (
      Object.keys(selectedAttributes).length !==
      Object.keys(groupAttributesByKey()).length
    ) {
      toast.error("Please select all attributes before adding to cart!");
      return;
    }

    // Find the selected variant based on attributes
    const selectedVariant = singleProduct.variants.find((variant) => {
      const normalizedVariantAttributes = normalizeAttributes(variant.attributes);
      return Object.keys(selectedAttributes).every(
        (key) => normalizedVariantAttributes[key] === selectedAttributes[key]
      );
    });
 

    if (!selectedVariant) {
      toast.error("Invalid selection! No matching variant found.");
      return;
    }

    const normalizedSelectedAttributes = normalizeAttributes(selectedAttributes);

    const existingItem = cartItems.find((item) => {
      const normalizedItemAttributes = normalizeAttributes(item.selectedAttributes);
      return (
        item.id === singleProduct.id &&
        item.variantId === selectedVariant.id &&
        JSON.stringify(normalizedItemAttributes) === JSON.stringify(normalizedSelectedAttributes)
      );
    });

    if (existingItem) {
      toast.error("Product already added to cart!");
      return;
    }

    const item = {
      ...singleProduct,
      variantId: selectedVariant.id,
      selectedAttributes,
      quantity,
      price: selectedVariant.price.toFixed(2),
      priceTiers: selectedVariant.priceTiers || [],
    };

    dispatch(addToCart(item));
    toast.success("Added to cart successfully!");
  };

  // Check if all required attributes are selected
  const areAllAttributesSelected = Object.keys(groupAttributesByKey()).every(
    (key) => selectedAttributes[key]
  );

  if (isLoading) {
    return <ProductDetailsSkeleton />;
  }

  return (
    <section className="py-5">
      <nav className="flex justify-start space-x-3 py-8 px-5">
        <Link
          to="/"
          className="text-lg font-medium hover:text-gray-300 transition-all duration-200"
        >
          <FaHome className="text-blue-500" size={20} />
        </Link>
        <span className="text-lg text-gray-300 mt-1">
          <FaGreaterThan size={15} />
        </span>
        <Link
          to="/shop"
          className="text-base font-medium hover:text-gray-300 transition-all duration-200 text-blue-500"
        >
          Shop
        </Link>
        <span className="text-lg text-gray-300 mt-1">
          <FaGreaterThan size={15} />
        </span>
        <Link className="text-base font-medium hover:text-gray-300 transition-all duration-200">
          {singleProduct.name}
        </Link>
      </nav>
      <div className="container mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Slider Section */}
        <div>
          <ProductImageSlider
            images={singleProduct.variants.map(
              (variant) => variant?.imageUrl
            )}
          />
        </div>

        {/* Product Details Section */}
        <div className="space-y-5">
          <h1 className="text-4xl font-semibold">{singleProduct.name}</h1>
          <h1 className="text-xl font-semibold">#{singleProduct.referenceId}</h1>
          <p className="font-bold">
            Availability:
            <span className="text-green-500 font-medium ms-2">
              {singleProduct.availability === true
                ? "In Stock"
                : "Out of Stock"}
            </span>
          </p>
          <p className="font-medium">
            <span className="font-bold me-2">Category:</span>{" "}
            {singleProduct?.category?.categoryName}
          </p>
          <p className="font-medium">
            <span className="font-bold me-2">Brand:</span>{" "}
            {singleProduct?.brand?.brandName}
          </p>
          <div className="text-xl font-bold text-blue-500">Price: ${price}</div>
          <p className="text-xl text-gray-500">
            {singleProduct?.productSubtitle}
          </p>

          {/* Render Attributes Dynamically */}
          {renderAttributes()}

          {/* Price Tiers */}
          <div className="mt-4">
            <span className="font-medium">
              Per Unit Price discount (according to quantity):
            </span>

            {selectedVariant?.priceTiers?.length === 0 ||
            selectedVariant?.priceTiers?.every(
              (tier) => !tier.minQty && !tier.maxQty && !tier.price
            ) ? (
              <p className="text-sm text-red-500">No price tiers available</p>
            ) : (
              <ul className="mt-1 text-sm list-none pl-0 flex flex-col lg:flex-row gap-4">
                {selectedVariant?.priceTiers?.map((tier, index) => (
                  <li className="mb-5" key={index}>
                    <Alert
                      message={`${tier.minQty ? `${tier.minQty} pc -` : "≥"}  ${
                        tier.maxQty || "No Max"
                      } pc Price: $${tier.price || "Not available"}`}
                    />
                  </li>
                ))}
              </ul>
            )}
          </div>
          {/* Quantity Selector */}
          <div className="mt-4">
            <span className="font-medium">Quantity:</span>
            <div className="flex items-center gap-2 mt-2">
              <button
                onClick={() => handleQuantityChange("decrease")}
                className="px-4 py-2 border"
              >
                -
              </button>
              <input
                type="text"
                value={quantity}
                readOnly
                className="w-12 text-center border py-2"
              />
              <button
                onClick={() => handleQuantityChange("increase")}
                className="px-4 py-2 border"
              >
                +
              </button>
            </div>
          </div>

          {/* Add to Cart and Buy Now */}
          <div className="flex flex-col lg:flex-row lg:space-x-4 space-y-2 lg:space-y-0">
            <Tooltip title={!areAllAttributesSelected ? "Please select the attributes first" : ""}>
              <button
                onClick={handleAddToCart}
                disabled={!areAllAttributesSelected || isAdded}
                className="bg-blue-500 text-white px-5 py-2 rounded hover:bg-white hover:text-blue-500 transition-all border border-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <p className="flex items-center justify-center">
                  <CiShoppingCart className="me-2" size={30} />
                  {isAdded ? "Added to cart" : "Add to cart"}
                </p>
              </button>
            </Tooltip>
            <Link to={`/checkout`}>
              <Tooltip title={!areAllAttributesSelected ? "Please select the attributes first" : ""}>
                <button
                  onClick={handleAddToCart}
                  disabled={!areAllAttributesSelected || isAdded}
                  className="border border-gray-300 px-6 py-3 rounded hover:border-blue-500 hover:bg-green-500 hover:text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed w-full"
                >
                  <p className="flex items-center justify-center">
                    <HiOutlineShoppingBag className="me-2" size={24} />
                    {isAdded ? "Go to Cart to Complete Purchase" : "Buy Now"}
                  </p>
                </button>
              </Tooltip>
            </Link>
          </div>
        </div>
      </div>

      {/* Tabs Section */}
      <div className="container break-words mx-auto lg:mt-[50px] mb-16">
        <div className="">
          <ul className="flex justify-center space-x-8 text-2xl font-medium">
            <li className="text-blue-500 border-b-2 border-blue-500">
              Product Description
            </li>
          </ul>
        </div>

        {/* Tab Content */}
        <div className="mt-6">
          <p className="text-lg text-gray-500">{singleProduct?.description}</p>
          <table className="mt-6 w-full lg:w-[50%] mx-auto border border-gray-300 text-left">
            <thead>
              <tr>
                <th className="px-4 py-2 border border-gray-300">Feature</th>
                <th className="px-4 py-2 border border-gray-300">Details</th>
              </tr>
            </thead>
            <tbody>
              {singleProduct.weight && (
                <tr>
                  <td className="px-4 py-2 border border-gray-300">Weight</td>
                  <td className="px-4 py-2 border border-gray-300">
                    <p className="font-medium">{singleProduct.weight}</p>
                  </td>
                </tr>
              )}
              {singleProduct.material && (
                <tr>
                  <td className="px-4 py-2 border border-gray-300">Material</td>
                  <td className="px-4 py-2 border border-gray-300">
                    <p className="font-medium">{singleProduct.material}</p>
                  </td>
                </tr>
              )}
              {singleProduct.thickness && (
                <tr>
                  <td className="px-4 py-2 border border-gray-300">Thickness</td>
                  <td className="px-4 py-2 border border-gray-300">
                    <p className="font-medium">{singleProduct.thickness}</p>
                  </td>
                </tr>
              )}
              {singleProduct.elasticity && (
                <tr>
                  <td className="px-4 py-2 border border-gray-300">Elasticity</td>
                  <td className="px-4 py-2 border border-gray-300">
                    <p className="font-medium">{singleProduct.elasticity}</p>
                  </td>
                </tr>
              )}
              {singleProduct.breathability && (
                <tr>
                  <td className="px-4 py-2 border border-gray-300">Breathability</td>
                  <td className="px-4 py-2 border border-gray-300">
                    <p className="font-medium">{singleProduct.breathability}</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
};

export default ProductDetails;