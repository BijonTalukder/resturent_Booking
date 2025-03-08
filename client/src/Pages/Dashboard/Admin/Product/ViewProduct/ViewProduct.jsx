import React from "react";
import { Alert, Table, Tag } from "antd";
import { Link, useParams } from "react-router-dom";
import { useGetProductsByIdQuery } from "../../../../../redux/Feature/Admin/product/productApi";
import Skeleton from "../../../../../components/Skeleton/Skeleton";
import ProductImageSlider from "../../../../Home/ProductDetails/ProductImageSlider";
import moment from "moment";

const ViewProduct = () => {
  const { id } = useParams();
  const { data, isLoading, error } = useGetProductsByIdQuery(id);
  console.log(data)

  if (isLoading) {
    return (
      <div>
        <Skeleton />
      </div>
    );
  }

  if (error) {
    return <div>Error loading product details.</div>;
  }

  const product = data;

  const columns = [
    {
      title: "Variant SKU",
      dataIndex: "sku",
      key: "sku",
    },
    {
      title: "Stock",
      dataIndex: "stock",
      key: "stock",
    },
    {
      title: "Sale Price",
      dataIndex: "price",
      key: "price",
    },
    {
      title: "Attributes",
      dataIndex: "attributes",
      key: "attributes",
      render: (attributes) =>
        attributes
          ? Object.entries(attributes)
              .map(([key, value]) => `${key}: ${value}`)
              .join(", ")
          : "No attributes found",
    },
    {
      title: "Price Tiers",
      dataIndex: "priceTiers",
      key: "priceTiers",
      render: (priceTiers) => (
        <ul className="list-none pl-0 flex flex-row lg:flex-col gap-4">
          {priceTiers?.map((tier, index) => (
            <li key={index}>
              <Alert
                message={`${tier.minQty ? `${tier.minQty} pc -` : "≥"} ${
                  tier.maxQty || "No Max"
                } pc    Price: $${tier.price || "Not available"}`}
              />
            </li>
          ))}
        </ul>
      ),
    },
  ];

  return (
    <section>
      <Link to={`/admin/products`}>
        <div className="flex flex-col lg:flex-row items-center gap-x-2 justify-end my-5">
          <button className="bg-primary font-Poppins font-medium py-2 px-5 rounded-lg text-white">
            Back
          </button>
        </div>
      </Link>

      <div className="mt-7 mb-4 space-y-5">
        <h2 className="text-xl lg:text-3xl text-center font-semibold mb-4 underline">
          Product Information
        </h2>
        <h1 className="text-lg lg:text-4xl font-semibold">{product.name}</h1>
        <p className="text-xl text-gray-500">
          <span className="font-bold">Subtitle:</span> {product?.productSubtitle}
        </p>
        <div className="flex flex-col gap-10">
          {/* Slider Section */}
          <h2 className="text-xl font-semibold mb-5 underline">
            Product Images
          </h2>
          <div className="lg:w-[50%] lg:mx-auto">
            <ProductImageSlider
              images={product.variants.map((variant) => variant?.imageUrl)}
            />
          </div>

          {/* Product Details Section */}
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-8">
            <p className="font-bold">
              Availability:
              <span className=" font-medium ms-2">
                <Tag color={product.availability === true ? "green" : "red"}>
                  {product.availability === true ? "In Stock" : "Out of Stock"}
                </Tag>
              </span>
            </p>
            <p className="font-medium">
              <span className="font-bold me-2">Category:</span>{" "}
              {product?.category?.categoryName}
            </p>
            <p className="font-medium">
              <span className="font-bold me-2">Brand:</span>{" "}
              {product?.brand?.brandName}
            </p>

            {/* Dynamic Product Details */}
            {product.weight && (
              <p className="font-medium">
                <span className="font-bold me-2">Weight:</span> {product.weight}
              </p>
            )}
            {product.material && (
              <p className="font-medium">
                <span className="font-bold me-2">Material:</span> {product.material}
              </p>
            )}
            {product.thickness && (
              <p className="font-medium">
                <span className="font-bold me-2">Thickness:</span> {product.thickness}
              </p>
            )}
            {product.elasticity && (
              <p className="font-medium">
                <span className="font-bold me-2">Elasticity:</span> {product.elasticity}
              </p>
            )}
            {product.breathability && (
              <p className="font-medium">
                <span className="font-bold me-2">Breathability:</span>{" "}
                {product.breathability}
              </p>
            )}
            {product.createdAt && (
              <p className="font-medium">
                <span className="font-bold me-2">Created At:</span>{" "}
                {moment(product.createdAt).format('MMMM Do YYYY, h:mm:ss a')}
              </p>
            )}
            {product.topSale !== undefined && (
              <p className="font-medium">
                <span className="font-bold me-2">Top Sale:</span>{" "}
                <Tag color={product?.topSale === true ? 'green' : 'red'}>
                  {product?.topSale === true ? "Yes" : "No"}
                </Tag>
              </p>
            )}
            {product.newArrival !== undefined && (
              <p className="font-medium">
                <span className="font-bold me-2">New Arrival:</span>{" "}
                <Tag color={product?.newArrival === true ? 'green' : 'red'}>
                  {product?.newArrival === true ? "Yes" : "No"}
                </Tag>
              </p>
            )}
            {product.status !== undefined && (
              <p className="font-medium">
                <span className="font-bold me-2">Status:</span>{" "}
                <Tag color={product?.status === true ? 'green' : 'red'}>
                  {product?.status === true ? "Active" : "Inactive"}
                </Tag>
              </p>
            )}
          </div>


        </div>
      </div>

      <div>
        <h2 className="text-lg font-semibold mt-5 mb-2 underline">
          Product Variants
        </h2>
        <Table
          className="overflow-x-scroll"
          columns={columns}
          dataSource={product.variants}
          pagination={true}
          bordered={true}
          rowKey="id"
        />
      </div>
    </section>
  );
};

export default ViewProduct;