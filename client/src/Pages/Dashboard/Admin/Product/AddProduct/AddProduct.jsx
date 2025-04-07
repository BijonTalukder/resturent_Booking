import React, { useEffect, useState } from "react";
import { Button, Spin } from "antd";
import { toast } from "sonner";
import { AiOutlineMinus, AiOutlinePlus } from "react-icons/ai";
import { useGetAttributesQuery } from "../../../../../redux/Feature/Admin/attribute/attributesApi";
import { useGetBrandQuery } from "../../../../../redux/Feature/Admin/brand/brandApi";
import { useAddProductMutation } from "../../../../../redux/Feature/Admin/hotel/productApi";
import { useGetCategoryQuery } from "../../../../../redux/Feature/Admin/category/categoryApi";
import { useNavigate } from "react-router-dom";
import { VariantProductTable } from "../../../../../components/VariantProductTable";
import ZFormTwo from "../../../../../components/Form/ZFormTwo";
import ZInputTwo from "../../../../../components/Form/ZInputTwo";
import ZSelect from "../../../../../components/Form/ZSelect";
import ZInputTextArea from "../../../../../components/Form/ZInputTextArea";
import { variantExists } from "../../../../../components/helper/SameVariantExist";
import BreadCrumb from "../../../../../components/BreadCrumb/BreadCrumb";
import ZNumber from "../../../../../components/Form/ZNumber";
import ZImageInput from "../../../../../components/Form/ZImageInput";
import axios from "axios";
import { CiCircleMinus, CiCirclePlus } from "react-icons/ci";

function generateUniqueId(length = 2) {
  const chars = "123456789";
  let result = "";
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return parseInt(result, 10);
}

const AddProduct = () => {
  const navigate = useNavigate();
  const [addonPages, setAddonPages] = useState([
    { minQty: "", maxQty: "", price: "" },
  ]);
  const [isLoading, setIsLoading] = useState(false);

  // attribute State - 1 from db
  const [attributeValue, setAttributeValue] = useState([]);

  // selected attribute State - 2
  const [selectedAttribute, setSelectedAttribute] = useState([]);
  // attribute options for selected options state-3
  const [attributeOptions, setAttributeOptions] = useState([]);
  //  product type state - 4
  const [typeProduct, setProductType] = useState("");
  // selectedAttribute UnderTheValue - 5
  const [selectedAttributeUnderTheValue, setSelectedAttributeUnderTheValue] =
    useState([]);
  // per sku - 6
  const [perSku, setPerSku] = useState([]);
  //  skus - 7
  const [skus, setSkus] = useState([]);

  //  refresh state for variant
  const [refresh, setRefresh] = useState(false);

  // image file , price , quantity - 8 for vairant product
  const [priceQuantityImage, setPriceQuantityImage] = useState({
    imageUrl: "",
    stock: "",
    price: "",
    // serialNo: "",
    // qrCode: "",
  });
  const { data: eData, isLoading: eLoading } = useGetCategoryQuery();
  const { data: bData, isLoading: bLoading } = useGetBrandQuery();
  const { data: attributeWithValue, isLoading: attributeIsLoading } =
    useGetAttributesQuery();
  const [
    createProduct,
    {
      isLoading: CIsloading,
      isError: CIsError,
      error: CError,
      isSuccess: CIsSuccess,
      data,
    },
  ] = useAddProductMutation();

  //  console.log(attributeWithValue);

  const categoryData = eData?.data?.map((eCategory) => ({
    label: eCategory.categoryName,
    value: eCategory.id,
  }));

  const brandData = bData?.data?.map((brand) => ({
    label: brand.brandName,
    value: brand.id,
  }));

  useEffect(() => {
    if (
      Array.isArray(attributeWithValue?.data) &&
      attributeWithValue?.data?.length > 0
    ) {
      const attributeOptions = attributeWithValue?.data?.map((item) => ({
        label: item.name,
        value: item.name,
      }));
      setAttributeOptions([...attributeOptions]);
      setAttributeValue([...attributeWithValue.data]);
    }
  }, [attributeWithValue, attributeWithValue?.data]);

  useEffect(() => {
    if (selectedAttribute) {
      const arr = [];
      for (let index = 0; index < selectedAttribute.length; index++) {
        const element = selectedAttribute[index];
        const findTheAttributeWithValue = attributeValue?.find(
          (item) => item.name == element
        );

        if (findTheAttributeWithValue) {
          arr.push({ ...findTheAttributeWithValue });
        }
      }
      setSelectedAttributeUnderTheValue([...(arr || [])]);
    }
  }, [selectedAttribute.length, selectedAttribute, attributeValue]);

  useEffect(() => {
    setSkus([]);
  }, [typeProduct]);

  useEffect(() => {
    if (CIsSuccess) {
      navigate("/admin/products");
    }
  }, [CIsSuccess]);

  const handleAddPage = () => {
    setAddonPages([...addonPages, { minQty: "", maxQty: "", price: "" }]);
  };

  const handleRemovePage = (itemValue) => {
    const filterData = addonPages.filter((item) => item !== itemValue);
    setAddonPages([...filterData]);
  };

  const handleInputChange = (index, field, value) => {
    const updatedPages = [...addonPages];
    updatedPages[index][field] = value;
    setAddonPages(updatedPages);
  };

  const handleAddPerSkuInSkus = () => {
    const attributes = {};
    const valuesName = [];

    if (perSku.length === 0) {
      toast.error("Select minimum an attribute value", {
        id: 2,
        duration: 1000,
        position: "top-right",
      });
    }
    if (priceQuantityImage.stock === "") {
      toast.error("Enter variation stock", { id: 1 });
    }
    if (priceQuantityImage.price === "") {
      toast.error("Enter variation price", { id: 2 });
    }

    if (
      perSku.length > 0 &&
      priceQuantityImage.stock &&
      priceQuantityImage.price
    ) {
      perSku.forEach((element) => {
        const proPertyKey = element.split("-")[0];
        const proPertyValue = element.split("-")[1];
        valuesName.push(proPertyValue);
        attributes[proPertyKey] = proPertyValue;
      });

      const sku = {
        variationId: generateUniqueId(),
        sku: `${valuesName.join("-")}`,
        stock: priceQuantityImage.stock,
        price: priceQuantityImage.price,
        imageUrl: priceQuantityImage.imageUrl || "",
        attributes,
        priceTiers: addonPages.map((page) => ({
          minQty: page.minQty || "",
          maxQty: page.maxQty || "",
          price: page.price || "",
        })),
      };

      console.log(sku);
      if (skus.length === 0) {
        setSkus([...skus, { ...sku }]);
        handleRefreshVariantState();
        // Reset priceTiers to default state (only the first field)
        setAddonPages([{ minQty: "", maxQty: "", price: "" }]);
      } else if (skus.length > 0) {
        const skusAttributes = skus.map((sku) => sku.attributes);
        const exist = variantExists(skusAttributes, sku.attributes);
        if (!exist) {
          setSkus([...skus, { ...sku }]);
          handleRefreshVariantState();
          // Reset priceTiers to default state (only the first field)
          setAddonPages([{ minQty: "", maxQty: "", price: "" }]);
        } else {
          toast.error("Already exists the variant of the product", {
            duration: 2000,
          });
          // Do not reset priceTiers if the variant already exists
        }
      }
    }
  };

  const handleRefreshVariantState = () => {
    setPerSku([]);
    setPriceQuantityImage({
      stock: "",
      price: "",
      imageUrl: "",
    });
    setRefresh(!refresh);
  };

  const handleSubmit = async (data) => {
    setIsLoading(true);

    const uploadImage = async (file) => {
      if (!file) return "";

      try {
        const imageHostingKey = import.meta.env.VITE_IMAGE_HOSTING_KEY;
        const imageHostingApi = `https://api.imgbb.com/1/upload?key=${imageHostingKey}`;

        const imageFile = new FormData();
        imageFile.append("image", file);

        const res = await axios.post(imageHostingApi, imageFile, {
          headers: { "content-type": "multipart/form-data" },
        });

        if (res?.data?.success) {
          return res.data.data.display_url;
        } else {
          throw new Error("Image upload failed");
        }
      } catch (error) {
        console.error("Error uploading image:", error.message);
        return ""; // Return an empty string if the upload fails
      }
    };

    const mainImageUrl = await uploadImage(data?.ImageUrl);

    // Prepare the main product data
    const modifiedData = {
      brandId: data?.brandId || "",
      categoryId: data?.categoryId || "",
      status: data?.status || true,
      topSale: data?.topSale || false,
      availability: data?.availability || true,
      newArrival: data?.newArrival || false,
      description: data.description || "",
      productSubtitle: data.productSubtitle || "",
      name: data.name || "",
      material: data.material || "",
      thickness: data.thickness || "",
      elasticity: data.elasticity || "",
      breathability: data.breathability || "",
      weight: data?.weight || "",
      imageUrl: mainImageUrl || "",
      price: parseFloat(data?.Price),
    };

    if (skus.length > 0) {
      // Upload images for each variation
      const variantProductData = {
        ...modifiedData,
        variants: await Promise.all(
          skus.map(async (sku) => {
            const uploadedImageUrl = await uploadImage(sku.imageUrl);

            return {
              attributes: sku.attributes,
              sku: sku.sku,
              stock: sku.stock,
              price: sku.price,
              imageUrl: uploadedImageUrl || "",
              priceTiers: sku.priceTiers || [],
            };
          })
        ),
      };

      console.log("Final Product Data:", variantProductData);
      createProduct(variantProductData);
      setTimeout(() => {
        setIsLoading(false);
        toast.success("Product added successfully");
      }, 4000);
    }
  };

  if (eLoading || bLoading || attributeIsLoading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <p>
          <Spin size="large" />
        </p>
      </div>
    );
  }

  return (
    <div className="">
      <BreadCrumb />
      <ZFormTwo
        // isLoading={CIsloading}
        // isSuccess={CIsSuccess}
        isError={CIsError}
        error={CError}
        submit={handleSubmit}
        formType="create"
        data={data}
        // buttonName="Submit"
      >
        <>
          <div className="grid md:grid-cols-2 grid-cols-1 gap-3 mt-10">
            <ZInputTwo
              name="name"
              type="text"
              label="Product Name"
              placeholder="Enter product title"
              required={1}
            />
            <ZInputTwo
              name="productSubtitle"
              type="text"
              label="Subtitle"
              placeholder="Enter product subtitle"
              required={1}
            />

            <ZNumber required={1} name="Price" label="Price" placeholder="Enter Price" />

            <ZSelect
              name="categoryId"
              isLoading={eLoading}
              label="Product Category"
              options={categoryData}
              placeholder="Select category"
              required={1}
            />

            <ZSelect
              name="brandId"
              isLoading={bLoading}
              label="Product Brand"
              options={brandData}
              placeholder="Select brand"
            />

            <ZImageInput name="ImageUrl" label="Thumbnail Image" />

            <div className="lg:col-span-2">
              <ZInputTextArea
                name="description"
                type="text"
                label="Description"
                placeholder="Enter product description"
              />
            </div>
            <ZInputTwo
              name="weight"
              type="text"
              label="Weight(gm) (optional)"
              placeholder="Enter weight"
            />

            <ZInputTwo
              name="material"
              type="text"
              label="Material(optional)"
              placeholder="Enter material"
            />

            <ZInputTwo
              name="thickness"
              type="text"
              label="Thickness(optional)"
              placeholder="Enter thickness"
            />

            <ZInputTwo
              name="elasticity"
              type="text"
              label="Elasticity(optional)"
              placeholder="Enter elasticity"
            />

            <ZInputTwo
              name="breathability"
              type="text"
              label="Breathability(optional)"
              placeholder="Enter breathability"
            />

            <ZSelect
              name="status"
              label="Status"
              options={[
                { label: "Active", value: true },
                { label: "Inactive", value: false },
              ]}
              placeholder="Select status"
            />
            <ZSelect
              name="topSale"
              label="Top Sale"
              options={[
                { label: "Yes", value: true },
                { label: "No", value: false },
              ]}
              placeholder="Select status"
            />
            <ZSelect
              name="newArrival"
              label="New Arrival"
              options={[
                { label: "Yes", value: true },
                { label: "No", value: false },
              ]}
              placeholder="Select status"
            />
            <ZSelect
              name="availability"
              label="Availability"
              options={[
                { label: "Yes", value: true },
                { label: "No", value: false },
              ]}
              placeholder="Select status"
            />
            {/* <div>
              <h4 className="mb-3">Price Tiers</h4>
              <div className="max-h-[400px] overflow-y-scroll scrollbar-0 mb-5">
                {addonPages.map((page, index) => (
                  <div key={index} className="flex gap-4">
                    <div className="w-[85%] flex items-center gap-2">
                      <ZInputTwo
                        name={`priceTiers.${index}.minQty`}
                        type="text"
                        label={""}
                        placeholder="Min Quantity"
                        value={page.minQty}
                        onChange={(e) =>
                          handleInputChange(index, "minQty", e.target.value)
                        }
                      />
                      <ZInputTwo
                        name={`priceTiers.${index}.maxQty`}
                        type="text"
                        label={""}
                        placeholder="Max Quantity"
                        value={page.maxQty}
                        onChange={(e) =>
                          handleInputChange(index, "maxQty", e.target.value)
                        }
                      />
                      <ZInputTwo
                        name={`priceTiers.${index}.price`}
                        type="text"
                        label={""}
                        placeholder="Price"
                        value={page.price}
                        onChange={(e) =>
                          handleInputChange(index, "price", e.target.value)
                        }
                      />
                    </div>
                    <div className="w-[15%]">
                      {index === 0 ? (
                        <button
                          type="button"
                          onClick={handleAddPage}
                          className="bg-blue-500 text-white py-1 mt-1 px-2 rounded"
                        >
                          <AiOutlinePlus size={15} />
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() => handleRemovePage(page)}
                          className="bg-red-500 text-white rounded px-2 mt-1 py-1"
                        >
                          <AiOutlineMinus size={15} />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div> */}
          </div>

          {/* variant Product type start */}

          <div className="mb-3">
            {/* per sku  */}

            {/* multiple attribute */}
            <ZSelect
              setSelectedAttributes={setSelectedAttribute}
              options={attributeOptions}
              isLoading={attributeIsLoading}
              mode={"multiple"}
              label={"Select Variations (if any)"}
              name={"attribute-selected"}
              defaultKey="product"
              placeholder={"Select Variant Name"}
              refresh={refresh}
            ></ZSelect>

            {/* selected attribute underTheValue */}
            <div className="border border-gray-400 p-3">
              {/* attribute value */}
              <div className="mt-12 grid lg:grid-cols-5 gap-5">
                {selectedAttributeUnderTheValue.map((item) => {
                  return (
                    <ZSelect
                      key={item?.id}
                      options={item?.value?.map((option) => ({
                        value: `${item?.name}-${option?.name}`,
                        label: option?.name,
                      }))}
                      isLoading={attributeIsLoading}
                      mode={undefined}
                      label={`${item.name} value`}
                      name={`${item.name}`}
                      setPerSku={setPerSku}
                      defaultKey="product"
                      selectedAttribute={selectedAttribute}
                      refresh={refresh}
                      placeholder={`Select ${item.name} value`}
                    ></ZSelect>
                  );
                })}
              </div>
              {/* image, quantity, price*/}
              <div className="grid grid-cols-1 items-center gap-x-2 lg:grid-cols-3">
                <>
                  <ZImageInput
                    defaultKey="product"
                    setPriceQuantityImage={setPriceQuantityImage}
                    label="Picture"
                    name="imageUrl"
                    refresh={refresh}
                  ></ZImageInput>
                  <ZNumber
                    name="stock"
                    label="Stock Quantity"
                    placeholder="Enter Stock Quantity"
                    defaultKey="product"
                    setPriceQuantityImage={setPriceQuantityImage}
                    refresh={refresh}
                  />

                  <ZNumber
                    name="price"
                    label="Price"
                    placeholder="Enter Price"
                    defaultKey="product"
                    setPriceQuantityImage={setPriceQuantityImage}
                    refresh={refresh}
                  />

                  <div>
                    <h4 className="mb-3">Price Tiers</h4>
                    <div className="max-h-[400px] overflow-y-scroll scrollbar-0 mb-5">
                      {addonPages.map((page, index) => (
                        <div key={index} className="flex gap-4">
                          <div className="w-[85%] flex items-center gap-2">
                            <ZInputTwo
                              name={`priceTiers.${index}.minQty`}
                              type="text"
                              label={""}
                              placeholder="Min Quantity"
                              value={page.minQty}
                              onChange={(e) =>
                                handleInputChange(
                                  index,
                                  "minQty",
                                  e.target.value
                                )
                              }
                            />
                            <ZInputTwo
                              name={`priceTiers.${index}.maxQty`}
                              type="text"
                              label={""}
                              placeholder="Max Quantity"
                              value={page.maxQty}
                              onChange={(e) =>
                                handleInputChange(
                                  index,
                                  "maxQty",
                                  e.target.value
                                )
                              }
                            />
                            <ZInputTwo
                              name={`priceTiers.${index}.price`}
                              type="text"
                              label={""}
                              placeholder="Price"
                              value={page.price}
                              onChange={(e) =>
                                handleInputChange(
                                  index,
                                  "price",
                                  e.target.value
                                )
                              }
                            />
                          </div>
                          <div className="w-[15%]">
                            {index === 0 ? (
                              <button
                                type="button"
                                onClick={handleAddPage}
                                className="bg-blue-500 text-white py-1 mt-1 px-2 rounded"
                              >
                                <AiOutlinePlus size={15} />
                              </button>
                            ) : (
                              <button
                                type="button"
                                onClick={() => handleRemovePage(page)}
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

                  {/* <ZNumber
                    name="serialNo"
                    label="Serial No"
                    placeholder="Enter Serial No"
                    defaultKey="product"
                    setPriceQuantityImage={setPriceQuantityImage}
                    refresh={refresh}
                  />
                  <ZNumber
                    name="qrCode"
                    label="Qr Code No"
                    placeholder="Enter Qr code"
                    defaultKey="product"
                    setPriceQuantityImage={setPriceQuantityImage}
                    refresh={refresh}
                  /> */}
                </>
              </div>

              {/* button */}
              <div className="flex justify-end">
                <Button
                  htmlType="button"
                  onClick={() => handleAddPerSkuInSkus()}
                  style={{ backgroundColor: "#162447", color: "white" }}
                >
                  + Add Variant
                </Button>
              </div>
            </div>
            {/* per sku end */}
          </div>
          <div className="flex justify-end">
    <button
        type="submit"
        disabled={isLoading}
        className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
      >
        {isLoading ? "Submitting..." : "Submit"}
      </button>
    </div>
        </>
      </ZFormTwo>
      <VariantProductTable skus={skus} setSkus={setSkus}></VariantProductTable>
    </div>
  );
};

export default AddProduct;
