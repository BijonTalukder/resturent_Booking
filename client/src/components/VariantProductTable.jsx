// VariantProductTable.js
import { CiEdit, CiTrash } from "react-icons/ci";
import { toast } from "sonner";
import { useState } from "react";
import { Modal, Tooltip } from "antd";
import { IoMdClose } from "react-icons/io";
import { useAppDispatch, useAppSelector } from "../redux/Hook/Hook";
import { setIsVariantModalOpen } from "../redux/Modal/ModalSlice";
import EditVariation from "../Pages/Dashboard/Admin/Product/EditVariation/EditVariation";

export const VariantProductTable = ({ skus, setSkus }) => {
  const dispatch = useAppDispatch();
  const [selectedVariant, setSelectedVariant] = useState(null);
  const { isVariantModalOpen } = useAppSelector((state) => state.modal);
  const pathname = window.location.pathname;

  const handleDeleteTheVariant = async (id) => {
    try {
      const filteredVariants = skus.filter((item) => item.variationId !== id);
      setSkus(filteredVariants);
      if(pathname.startsWith("/admin/edit-product/")){
        toast.success("Variant deleted successfully from the product , apply the submit button to save the changes");
      }
    } catch (error) {
      toast.error("Failed to delete variant");
      console.error(error);
    }
  };

  const handleEditVariant = (variant) => {
    setSelectedVariant(variant);
    dispatch(setIsVariantModalOpen()); // Open modal
  };

  const handleCloseModal = () => {
    setSelectedVariant(null); // Reset selectedVariant
    dispatch(setIsVariantModalOpen()); // Close modal
  };

  return (
    <>
      {skus.length > 0 && (
        <div>
{  pathname.startsWith("/admin/edit-product/") ?        
           ( <h1 className="text-center lg:text-xl mt-9 mb-5 font-bold">
            Check your Previously Added Variant of The Product
          </h1>) : 
          (
            <h1 className="text-center lg:text-xl mt-9 mb-5 font-bold">
            Check your added Variant of The Product
          </h1>
          )
          
          }
          <div className="relative flex flex-col w-full h-full overflow-scroll text-gray-700 bg-white shadow-md rounded-xl bg-clip-border">
            <table className="w-full text-center table-auto min-w-max">
              <thead>
                <tr className="bg-gray-100">
                  <th className="p-4 border-b">Serial</th>
                  <th className="p-4 border-b">Attributes Value</th>
                  <th className="p-4 border-b">Price</th>
                  <th className="p-4 border-b">Stock</th>
                  <th className="p-4 border-b">Action</th>
                </tr>
              </thead>
              <tbody>
{skus.map((item, index) => (
  <tr key={item?.variationId} className="border-b">
    <td className="p-4">{index + 1}</td>
    <td className="p-4">{item?.sku}</td>
    <td className="p-4">{item?.price}</td>
    <td className="p-4">{item?.stock}</td>
    <td className="p-4">
      <div className="flex gap-2 justify-center">
        {/* Edit Button with Tooltip */}
        <Tooltip
          title={!item?.variationId ? "Submit the new variant of this product first to edit this variant" : ""}
        >
          <button
            disabled={!item?.variationId}
            onClick={() => handleEditVariant(item)}
            className={` ${
              !item?.variationId ? "bg-gray-400 cursor-not-allowed" : "bg-blue-500 hover:bg-blue-600"
            } text-white px-3 py-2 rounded-md transition-all ${
              pathname === "/admin/add-product" ? "hidden" : ""
            }`}
          >
            <CiEdit size={20} />
          </button>
        </Tooltip>

        {/* Delete Button */}
        <button
          onClick={() => handleDeleteTheVariant(item.variationId)}
          className="cursor-pointer bg-red-500 text-white px-3 py-2 rounded-md hover:bg-red-600 transition-all"
        >
          <CiTrash size={20} />
        </button>
      </div>
    </td>
  </tr>
))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Edit Variant Modal */}
      <Modal
        centered
        open={isVariantModalOpen}
        width={700}
        onCancel={handleCloseModal}
        closeIcon={
          <IoMdClose
            style={{
              fontSize: "24px",
              color: "white",
              backgroundColor: "red",
              padding: "2px",
              borderRadius: "100%",
            }}
          />
        }
        okButtonProps={{ style: { display: "none", color: "white" } }}
        cancelButtonProps={{ style: { display: "none" } }}
      >
        <EditVariation
          selectedVariant={selectedVariant}
          setSelectedVariant={setSelectedVariant}
          setSkus={setSkus}
          skus={skus}
          closeModal={handleCloseModal}
        />
      </Modal>
    </>
  );
};