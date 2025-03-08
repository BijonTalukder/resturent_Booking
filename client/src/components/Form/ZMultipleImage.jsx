
import { Form, Upload, Button, message } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { Controller, useFormContext } from "react-hook-form";
import { useEffect } from "react";

const ZMultipleImage = ({
  name,
  label,
  defaultValue,
  onRemove,
}) => {
  const { control, resetField } = useFormContext();

  const beforeUpload = (file) => {
    const isImage = file.type.startsWith('image/');
    if (!isImage) {
      message.error('You can only upload image files!');
    }
    return false; // Prevent auto upload
  };

  useEffect(() => {
    if (resetField) {
      resetField(name, { defaultValue: defaultValue || [] });
    }
  }, [resetField, name, defaultValue]);

  return (
    <Controller
      name={name}
      control={control}
      defaultValue={defaultValue || []}
      render={({ field, fieldState: { error } }) => (
        <Form.Item
          label={label}
          validateStatus={error ? "error" : ""}
          help={error?.message}
        >
          <Upload
            listType="picture"
            multiple
            beforeUpload={beforeUpload}
            onPreview={(file) => {
              window.open(file.url || file.preview, '_blank');
            }}
            onChange={({ fileList }) => {
              const updatedFileList = fileList.map(file => ({
                ...file,
                preview: file.originFileObj ? URL.createObjectURL(file.originFileObj) : file.url,
              }));
              field.onChange(updatedFileList); // Properly update field value
            }}
            onRemove={(file) => {
              const newFileList = field.value.filter(item => item.uid !== file.uid);
              field.onChange(newFileList);
              if (onRemove) {
                onRemove(file);
              }
            }}
            fileList={field.value.map((file) => ({
              ...file,
              status: 'done',
              url: file.preview || file.url,
            }))}
            maxCount={5}
          >
           
              <Button icon={<UploadOutlined />}>
                Upload (Max: 5)
              </Button>
 
          </Upload>
        </Form.Item>
      )}
    />
  );
};

export default ZMultipleImage;
