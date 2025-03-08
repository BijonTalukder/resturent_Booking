import { useState, useEffect } from "react";
import { toast } from "sonner";
import ZFormTwo from "../../../../../components/Form/ZFormTwo";
import ZInputTwo from "../../../../../components/Form/ZInputTwo";
import ZNumber from "../../../../../components/Form/ZNumber";
import ZImageInput from "../../../../../components/Form/ZImageInput";
import { useAppDispatch } from "../../../../../redux/Hook/Hook";
import axios from "axios";
import { AiOutlinePlus, AiOutlineMinus } from "react-icons/ai";

const EditVariation = ({ selectedVariant, setSkus, skus, closeModal, setSelectedVariant }) => {
  const [priceTiers, setPriceTiers] = useState(
    selectedVariant?.priceTiers || [{ minQty: "", maxQty: "", price: "" }]
  );
  const [isImageRemoved, setIsImageRemoved] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Reset priceTiers and isImageRemoved when selectedVariant changes
  useEffect(() => {
    setPriceTiers(selectedVariant?.priceTiers || [{ minQty: "", maxQty: "", price: "" }]);
    // setIsImageRemoved(false); 
  }, [selectedVariant]);

  // Handle Price Tier Updates
  const handlePriceTierChange = (index, field, value) => {
    const updatedTiers = [...priceTiers];
    updatedTiers[index] = { ...updatedTiers[index], [field]: value };
    setPriceTiers(updatedTiers);
  };

  // Add new price tier
  const handleAddTier = () => {
    setPriceTiers([...priceTiers, { minQty: "", maxQty: "", price: "" }]);
  };

  // Remove a price tier
  const handleRemoveTier = (index) => {
    const updatedTiers = priceTiers.filter((_, i) => i !== index);
    setPriceTiers(updatedTiers);
  };

  const handleSubmit = async (data) => {
    setIsLoading(true);

    try {
      let imageUrl = selectedVariant?.imageUrl;

      // Upload image if a new file is selected and isImageRemoved is false
      if (data?.imageUrl && !isImageRemoved) {
        const image_hosting_key = import.meta.env.VITE_IMAGE_HOSTING_KEY;
        const image_hosting_api = `https://api.imgbb.com/1/upload?key=${image_hosting_key}`;

        const imageFile = new FormData();
        imageFile.append("image", data?.imageUrl);

        const res = await axios.post(image_hosting_api, imageFile);

        if (res?.data?.success) {
          imageUrl = res?.data?.data?.display_url;
        } else {
          throw new Error("Image upload failed");
        }
      }

      // If image is removed, set imageUrl to an empty string
      if (!data?.imageUrl && isImageRemoved) {
        imageUrl = "";
      }

      // Create updated variant object
      const updatedVariant = {
        ...data,
        price: parseFloat(data.price),
        stock: parseInt(data.stock),
        priceTiers,
        imageUrl,
      };

      // Update the skus array with the new variant data
      const updatedSkus = skus.map((item) =>
        item.variationId === selectedVariant.variationId
          ? { 
            ...item,
             ...updatedVariant }
          : item
      );

           // Update selectedVariant with the new imageUrl
           setSelectedVariant((prev) => ({
            ...prev,
            imageUrl,
          }));
    

      setSkus(updatedSkus);

 
      // Simulate a 3-second delay
      setTimeout(() => {
        setIsLoading(false);
        toast.success("Changes applied successfully! Don't forget to submit your updates.");
        closeModal();
      }, 3000);
    } catch (error) {
      console.error("Error updating variant:", error);
      setIsLoading(false);
      toast.error("Failed to update variant. Please try again.");
    }
  };

  return (
    <ZFormTwo
      submit={handleSubmit}
      formType="edit"
      closeModal={closeModal}
    >
      <div className="grid grid-cols-2 gap-4">
        <ZInputTwo
          readOnly
          name="sku"
          label="SKU"
          placeholder="Enter SKU"
          value={selectedVariant?.sku}
          disabled={1}
        />
        <ZNumber
          name="stock"
          label="Stock Quantity"
          placeholder="Enter Stock Quantity"
          value={selectedVariant?.stock}
        />
        <ZNumber
          name="price"
          label="Sale Price"
          placeholder="Enter Sale Price"
          value={parseFloat(selectedVariant?.price)}
        />
        <ZImageInput
          name="imageUrl"
          label="Product Image"
          onRemove={() => setIsImageRemoved(true)}
          onChange={() => setIsImageRemoved(false)} 
          defaultValue={
            selectedVariant?.imageUrl
              ? [
                  {
                    uid: "-1",
                    name: "Previous Image",
                    status: "done",
                    url: selectedVariant?.imageUrl,
                  },
                ]
              : []
          }
        />
      </div>

      {/* Price Tiers */}
      <div className="mt-6">
        <h4 className="mb-3">Price Tiers</h4>
        <div className="max-h-[400px] overflow-y-auto scrollbar-0 mb-5">
          {priceTiers.map((tier, index) => (
            <div key={index} className="flex gap-4">
              <div className="w-[85%] flex items-center gap-2">
                <ZInputTwo
                  name={`priceTiers.${index}.minQty`}
                  type={"text"}
                  placeholder="Min Quantity"
                  value={tier.minQty}
                  onChange={(e) =>
                    handlePriceTierChange(index, "minQty", e.target.value)
                  }
                />
                <ZInputTwo
                  name={`priceTiers.${index}.maxQty`}
                  placeholder="Max Quantity"
                  value={tier.maxQty}
                  onChange={(e) =>
                    handlePriceTierChange(index, "maxQty", e.target.value)
                  }
                />
                <ZInputTwo
                  name={`priceTiers.${index}.price`}
                  placeholder="Price"
                  value={tier.price}
                  onChange={(e) =>
                    handlePriceTierChange(index, "price", e.target.value)
                  }
                />
              </div>
              <div className="w-[15%]">
                {index === 0 ? (
                  <button
                    type="button"
                    onClick={handleAddTier}
                    className="bg-blue-500 text-white py-1 mt-1 px-2 rounded"
                  >
                    <AiOutlinePlus size={15} />
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => handleRemoveTier(index)}
                    className="bg-red-500 text-white rounded px-2 mt-1 py-1"
                  >
                    <AiOutlineMinus size={15} />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Submit Button */}
    <div className="flex justify-end">
    <button
        type="submit"
        disabled={isLoading}
        className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
      >
        {isLoading ? "Submitting..." : "Submit"}
      </button>
    </div>
    </ZFormTwo>
  );
};

export default EditVariation;