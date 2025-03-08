/* eslint-disable react-hooks/exhaustive-deps */
import { Form, Select } from "antd";
import { useEffect, useState } from "react";
import { Controller, useFormContext } from "react-hook-form";

const ZSelect = ({
  name,
  label,
  mode,
  options,
  isLoading,
  value,
  placeholder,
  required,
  refresh,
  defaultKey,
  setSelectedAttributes,
  selectedAttribute,
  setPerSku
}) => {
  const { control, setValue, resetField , getValues } = useFormContext();
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    if (name === "attribute-selected") {
      resetField("attribute-selected");
    }
    setRefreshKey((prevKey) => prevKey + 1);
  }, []);

  useEffect(() => {
    if (value) {
      setValue(name, value);
    }
  }, [value, setValue]);


  useEffect(() => {
    if (defaultKey === "product" && selectedAttribute && setPerSku) {
      const s = selectedAttribute.includes(name);
      const nameVa = getValues(name);
      if (s === false) {
        setPerSku((prev) => {
          const newPrev = [...prev];
          const filtered = newPrev.filter((item) => item !== nameVa);
          return filtered;
        });
        resetField(name);
      }
    }
  }, [selectedAttribute, selectedAttribute?.length]);



  useEffect(() => {
    if (defaultKey === "product") {
      if (setPerSku) {
        setPerSku([]);
      }
      if (setSelectedAttributes) {
        setSelectedAttributes([]);
      }
    }
  }, []);



  useEffect(() => {
    if (defaultKey === "product" && selectedAttribute) {
      selectedAttribute.forEach((item) => resetField(item));
    }
  }, [refresh]);


  const onChange = (value) => {
    if (
      setSelectedAttributes &&
      mode === "multiple" &&
      defaultKey === "product"
    ) {
      setSelectedAttributes([...value]);
    }

    if (mode === undefined && setPerSku && defaultKey === "product") {
      setPerSku((prev) => {
        const newPrev = [...prev];
        if (Array.isArray(value)) {
          value.forEach((val) => {
            const [newCategory] = val.split("-");
            const index = newPrev.findIndex((item) =>
              item.startsWith(newCategory)
            );
            if (index !== -1) {
              newPrev[index] = val;
            } else {
              newPrev.push(val);
            }
          });
        } else {
          const [newCategory] = value.split("-");
          const index = newPrev.findIndex((item) =>
            item.startsWith(newCategory)
          );
          if (index !== -1) {
            newPrev[index] = value;
          } else {
            newPrev.push(value);
          }
        }
        return newPrev;
      });
    }
  };

  const onSearch = (_value) => {
    // Custom onSearch logic if needed
    // console.log(_value)
  };

  const filterOption = (input, option) =>
    (option?.label ?? "").toLowerCase().includes(input.toLowerCase());

  return (
    <Controller
       key={refreshKey}
      name={name}
      control={control}
      rules={{
        ...(required && { required: ` This ${label} field is required` }),
      }}
      render={({ field, fieldState: { error } }) => (
        <Form.Item
          label={label}
          validateStatus={error ? "error" : ""}
          help={error?.message}
        >
          <Select
            {...field}
            virtual={true}
            allowClear={true}
            showSearch
            placeholder={placeholder}
            optionFilterProp="children"
            onChange={(value) => {
              field.onChange(value);
              onChange(value);
            }}
            onSearch={onSearch}
            filterOption={filterOption}
            options={options || []}
            mode={mode ? mode : undefined}
            loading={isLoading ? isLoading : false}
            disabled={isLoading ? isLoading : false}
          />
        </Form.Item>
      )}
    />
  );
};

export default ZSelect;
