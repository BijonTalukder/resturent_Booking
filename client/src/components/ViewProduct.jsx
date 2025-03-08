import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import ProductImageSlider from "../Pages/Home/ProductDetails/ProductImageSlider";
import { FaGreaterThan, FaHome } from "react-icons/fa";
import { CiShoppingCart } from "react-icons/ci";
import { HiOutlineShoppingBag } from "react-icons/hi2";
import { useAppDispatch, useAppSelector } from "../redux/Hook/Hook";
import { addToCart } from "../redux/Cart/cartSlice";
import { toast } from "sonner";
import { Alert, Spin, Tooltip } from "antd";
import ProductDetailsSkeleton from "./Skeleton/ProductDetailsSkeleton";

const ViewProduct = ({ selectedProduct }) => {
  const dispatch = useAppDispatch();
  const [selectedAttributes, setSelectedAttributes] = useState({});
  const [quantity, setQuantity] = useState(1);
  const [price, setPrice] = useState(selectedProduct?.variants?.[0]?.price || 0);
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
  const selectedVariant = selectedProduct?.variants?.find((variant) => {
    const normalizedVariantAttributes = normalizeAttributes(variant.attributes);
    return Object.keys(selectedAttributes).every(
      (key) => normalizedVariantAttributes[key] === selectedAttributes[key]
    );
  });

  useEffect(() => {
    const isProductInCart = cartItems.some(
      (item) =>
        item.id === selectedProduct?.id &&
        JSON.stringify(item.selectedAttributes) ===
          JSON.stringify(selectedAttributes)
    );
    setIsAdded(isProductInCart);
  }, [cartItems, selectedProduct?.id, selectedAttributes]);

  // Group attributes by key (normalized to lowercase)
  const groupAttributesByKey = () => {
    const attributeMap = {};
    selectedProduct?.variants?.forEach((variant) => {
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

  // Handle attribute selection (normalize keys)
  const handleAttributeSelection = (key, value) => {
    const normalizedKey = key.toLowerCase();
    setSelectedAttributes((prev) => ({ ...prev, [normalizedKey]: value }));
    updatePriceBasedOnAttributes({ ...selectedAttributes, [normalizedKey]: value });
  };

  // Update price based on selected attributes
  const updatePriceBasedOnAttributes = (attributes) => {
    const selectedVariant = selectedProduct?.variants?.find((variant) => {
      const normalizedVariantAttributes = normalizeAttributes(variant.attributes);
      return Object.keys(attributes).every(
        (key) => normalizedVariantAttributes[key] === attributes[key]
      );
    });
    if (selectedVariant) {
      setPrice(selectedVariant.price);
    }
  };

  // Render attributes dynamically
  const renderAttributes = () => {
    const attributeMap = groupAttributesByKey();

    return Object.keys(attributeMap).map((key) => {
      const values = Array.from(attributeMap[key]);

      return (
        <div key={key} className="mt-4">
          <span className="font-medium capitalize">{key}:</span>
          <div className="flex gap-2 mt-2">
            {values?.map((value, index) => (
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
                  borderColor: selectedAttributes[key] === value ? "blue" : "",
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

  // Handle quantity change
  const handleQuantityChange = (type) => {
    if (type === "increase") {
      setQuantity((prev) => prev + 1);
    } else if (type === "decrease" && quantity > 1) {
      setQuantity((prev) => prev - 1);
    }
  };

  // Handle adding to cart
  const handleAddToCart = () => {
   

    if (
      Object.keys(selectedAttributes).length !==
      Object.keys(groupAttributesByKey()).length
    ) {
      toast.error("Please select all attributes before adding to cart!");
      return;
    }

    const selectedVariant = selectedProduct?.variants?.find((variant) => {
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
        item.id === selectedProduct.id &&
        item.variantId === selectedVariant.id &&
        JSON.stringify(normalizedItemAttributes) === JSON.stringify(normalizedSelectedAttributes)
      );
    });

    if (existingItem) {
      toast.error("Product already added to cart!");
      return;
    }

    const item = {
      ...selectedProduct,
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
      <div className="container mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10">
        <div>
          <ProductImageSlider
            images={selectedProduct?.variants?.map(
              (variant) => variant?.imageUrl
            )}
          />
        </div>

        <div className="space-y-5">
          <h1 className="text-4xl font-semibold">{selectedProduct?.name}</h1>
          <h1 className="text-xl font-semibold">#{selectedProduct?.referenceId}</h1>
          <p className="font-bold">
            Availability:
            <span className="text-green-500 font-medium ms-2">
              {selectedProduct?.availability === true ? "In Stock" : "Out of Stock"}
            </span>
          </p>
          <p className="font-medium">
            <span className="font-bold me-2">Category:</span>{" "}
            {selectedProduct?.category?.categoryName}
          </p>
          <p className="font-medium">
            <span className="font-bold me-2">Brand:</span>{" "}
            {selectedProduct?.brand?.brandName}
          </p>
          <div className="text-xl font-bold text-blue-500">Price: ${price}</div>
          <p className="text-xl text-gray-500">
            {selectedProduct?.productSubtitle}
          </p>

          {renderAttributes()}

          <div className="mt-4">
            <span className="font-medium">Quantity:</span>
            <div className="flex items-center gap-2 mt-2">
              <button onClick={() => handleQuantityChange("decrease")} className="px-4 py-2 border">-</button>
              <input type="text" value={quantity} readOnly className="w-12 text-center border py-2" />
              <button onClick={() => handleQuantityChange("increase")} className="px-4 py-2 border">+</button>
            </div>
          </div>

          
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

          {/* Add to Cart and Buy Now */}
          <div className="flex flex-col lg:flex-row lg:space-x-4 space-y-2 lg:space-y-0">
            <Tooltip title={!areAllAttributesSelected ? "Please select the attributes first" : ""}>
              <button
                onClick={handleAddToCart}
                disabled={!areAllAttributesSelected || isAdded}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-white hover:text-blue-500 transition-all border border-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
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
    </section>
  );
};

export default ViewProduct;