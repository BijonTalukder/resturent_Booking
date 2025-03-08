import React from "react";
import { toast } from "sonner";
import { useUpdateOrderMutation } from "../../../../redux/Feature/Admin/order/orderApi";
import { useAppDispatch } from "../../../../redux/Hook/Hook";
import ZFormTwo from "../../../../components/Form/ZFormTwo";
import ZSelect from "../../../../components/Form/ZSelect";
import { setIsEditModalOpen } from "../../../../redux/Modal/ModalSlice";

const EditOrders = ({ selectedOrder }) => {
  const dispatch = useAppDispatch();
  const [editOrder, { isLoading: OIsloading, isError: OIsError, error: OError, isSuccess: OIsSuccess, data }] = useUpdateOrderMutation();

  const handleSubmit = async (formData) => {
    try {
      const orderData = {
        orderStatus: formData?.orderStatus,
      };
      
      await editOrder({ id: selectedOrder.id, data: orderData });
    } catch (error) {
      console.error('Error updating order:', error);
      toast.error('Error updating order. Please try again.');
    }
  };

  const handleCloseAndOpen = () => {
    dispatch(setIsEditModalOpen());
  };

  return (
    <div className="">
      <ZFormTwo
        isLoading={OIsloading}
        isSuccess={OIsSuccess}
        isError={OIsError}
        error={OError}
        submit={handleSubmit}
        closeModal={handleCloseAndOpen}  
        formType="edit"  
        data={data}
        buttonName="Update"
      >
        <div className="grid grid-cols-1 gap-3 mt-10">
          <ZSelect
            name="orderStatus"
            label="Status"
            options={[
              { label: "Pending", value: "pending" },
              { label: "Processing", value: "processing" },
              { label: "Shipped", value: "shipped" },
              { label: "Delivered", value: "delivered" },
              { label: "Cancelled", value: "cancelled" },
            ]}
            placeholder="Select status"
            value={selectedOrder?.orderStatus}
          />
        </div>
      </ZFormTwo>
    </div>
  );
};

export default EditOrders;
