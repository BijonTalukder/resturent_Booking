import { ReactNode, useEffect } from "react";
import { Form } from "antd";
import {
  FormProvider,
  useForm,
} from "react-hook-form";
import { toast } from "sonner";
import ErrorHandling from "../ErrorHandling/ErrorHandling";
import SaveAndCloseButton from "../Button/SaveAndCloseButton";
import { useAppSelector } from "../../redux/Hook/Hook";





const ZFormTwo = ({ 
  children,
  submit,
  defaultValues,
  resolver,
  isSuccess,
  isLoading,
  closeModal,
  isError,
  error,
  data,
  formType,
  buttonName,
}) => {

  const { isAddModalOpen, isEditModalOpen , isCustomerModalOpen,isProductModalOpen } = useAppSelector(
    (state) => state.modal
  );
  // const formConfig: defaultAndResolver = {};

  // if (defaultValues) {
  //   formConfig["defaultValues"] = defaultValues;
  // }
  // if (resolver) {
  //   formConfig["resolver"] = resolver;
  // }

  const methods = useForm({mode:"all"});

  const onSubmit = (data) => {
    // console.log(data)
    submit(data);
  };

  // const errors = ErrorHandling(
  //   error?.data?.errors,
  //   // isAddModalOpen,
  //   // isEditModalOpen
  // );
  
  useEffect(() => {

    if (formType === "create") {
         methods.reset();
      if (!isAddModalOpen || !isEditModalOpen || !isCustomerModalOpen || !isProductModalOpen) {
        methods.reset();
      }
    }
    if (formType === "edit") {
      if (!isEditModalOpen) { 
        methods.clearErrors();
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAddModalOpen, isEditModalOpen,isCustomerModalOpen, isProductModalOpen, methods]);

  
  useEffect(() => {
    if (isSuccess && closeModal) {
      closeModal()
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSuccess]);


  useEffect(() => {
    toast.dismiss(1);
  }, []);

  
  useEffect(() => {
    if (isLoading || isSuccess || isError) {
      if (isLoading) {
        toast.loading("loading...", { id: 1 });
      }
      if (isSuccess) {
        toast.success(data?.message, { id: 1 });
      }
      if (isError) {
        toast.error(error?.data?.message, { id: 1, duration: 3000 });
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSuccess, isLoading, isError]);

  return (
    
    <FormProvider {...methods}>
      <Form layout="vertical" onFinish={methods.handleSubmit(onSubmit)}>
        <div>{children}</div>
       
           { buttonName &&
             <SaveAndCloseButton
             closeModal={closeModal}
             isLoading={isLoading}
             isSuccess={isSuccess}
             title={buttonName}
           />
           }
        
      
        {/* <div className="mt-5">
          {Array.isArray(errors) &&
            errors.length > 0 &&
            errors.map((item) => (
              // eslint-disable-next-line react/jsx-key
              <div
                className="bg-red-100 my-2 border border-red-400 text-red-700 px-4 py-3 rounded relative"
                role="alert"
              >
                <span className="block sm:inline">{item}</span>
              </div>
            ))}
        </div> */}
      </Form>
    </FormProvider>
  );
};

export default ZFormTwo;
