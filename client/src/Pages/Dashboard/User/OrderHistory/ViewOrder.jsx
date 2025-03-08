import React from "react";
import { Card, Row, Col, Typography, Steps, Divider, Table } from "antd";

const { Title, Text } = Typography;
const { Step } = Steps;

const ViewOrder = ({ selectedOrder }) => {
  if (!selectedOrder) {
    return <div>Loading...</div>;
  }

  // Order status steps
  const getOrderSteps = (status) => {
    const steps = [
      { title: "Pending", key: "pending", description: "Order placed." },
      { title: "Processing", key: "processing", description: "Your order is being processed." },
      { title: "Shipped", key: "shipped", description: "Your package is on the way." },
      { title: "Delivered", key: "delivered", description: "Your package has been delivered." },
      { title: "Cancelled", key: "cancelled", description: "Your order has been cancelled." },
    ];

    const currentStepIndex = steps.findIndex((step) => step.key === status);

    return { steps, currentStepIndex };
  };

  const { steps, currentStepIndex } = getOrderSteps(selectedOrder.orderStatus);

  // Table columns for ordered items
  const columns = [
    {
      title: "Product Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Attributes",
      dataIndex: "selectedAttributes",
      key: "selectedAttributes",
      render: (attributes) =>
        attributes
          ? Object.entries(attributes)
              .map(([key, value]) => `${key}: ${value}`)
              .join(", ")
          : "No attributes selected",
    },
    {
      title: "Price",
      dataIndex: "price",
      key: "price",
      render: (price) => `$${price}`,
    },
    {
      title: "Quantity",
      dataIndex: "quantity",
      key: "quantity",
    },
    {
      title: "Total",
      key: "total",
      render: (_, record) => `$${parseFloat(record.price) * record.quantity}`,
    },
  ];

  // Table data for ordered items
  const data = selectedOrder.orderItems.map((item, index) => ({
    key: index,
    ...item,
  }));

  return (
    <div style={{ padding: "" }}>
      <Card>
        {/* Order Header */}
        <div className="text-center">
          <h1 className="text-2xl mb-5 font-bold">Order Details</h1>
        </div>
        <Row gutter={[16, 16]}>
          <Col span={12}>
            <Text strong>Sold By:</Text> INKSPIRE
          </Col>
          <Col span={12}>
            <Text strong>Order Number:</Text> {selectedOrder.id}
          </Col>
          <Col span={12}>
            <Text strong>Purchase Date:</Text> {selectedOrder.createdAt}
          </Col>
          <Col span={12}>
            <Text strong>Name:</Text> {selectedOrder.name}
          </Col>
          <Col span={12}>
            <Text strong>Email:</Text> {selectedOrder.email}
          </Col>
          <Col span={12}>
            <Text strong>Phone:</Text> {selectedOrder.phone}
          </Col>
          <Col span={12}>
            <Text strong>Transaction-Id:</Text> {selectedOrder.transactionId}
          </Col>
        </Row>

        {/* Order Progress */}
        <Divider />
        <div className="">
          <Steps direction="vertical" current={currentStepIndex} style={{ marginTop: "24px" }}>
            {steps.map((step, index) => (
              <Step key={index} title={step.title} description={step.description} />
            ))}
          </Steps>
        </div>

        {/* Product Details */}
        <Divider />
        <div className="text-center">
          <Title level={5}>Ordered Items</Title>
        </div>
        <Table
          columns={columns}
          dataSource={data}
          pagination={false}
          bordered
          scroll={{ x: 500, y: 300 }} // Scroll horizontally and set fixed vertical height
          responsive={true} // Ensures the table is responsive

          summary={() => (
            <Table.Summary.Row>
              <Table.Summary.Cell colSpan={4} align="right">
                <Text strong>Subtotal</Text>
              </Table.Summary.Cell>
              <Table.Summary.Cell>
                <Text strong>
                  $
                  {selectedOrder.orderItems.reduce(
                    (total, item) => total + parseFloat(item.price) * item.quantity,
                    0
                  )}
                </Text>
              </Table.Summary.Cell>
            </Table.Summary.Row>
          )}
        />

        {/* Address Details */}
        <Divider />
        <Row gutter={[16, 16]}>
          <Col span={12}>
            <Title level={5}>Shipping Address</Title>
            <Text>{selectedOrder.shippingAddress}</Text>
          </Col>
          <Col span={12}>
            <Title level={5}>Billing Address</Title>
            <Text>{selectedOrder.billingAddress}</Text>
          </Col>
        </Row>

        {/* Total Summary */}
        <Divider />
        <Row gutter={[16, 16]}>
          <Col span={24}>
            <Title level={5}>Total Summary</Title>
            <Row>
              <Col span={12}>
                <Text>Subtotal</Text>
              </Col>
              <Col span={12}>
                <Text>${selectedOrder.orderTotal - selectedOrder.deliveryFee - selectedOrder.taxAmount}</Text>
              </Col>
            </Row>
            <Row>
              <Col span={12}>
                <Text>Shipping Fee</Text>
              </Col>
              <Col span={12}>
                <Text>${selectedOrder.deliveryFee}</Text>
              </Col>
            </Row>
            <Row>
              <Col span={12}>
                <Text>Tax</Text>
              </Col>
              <Col span={12}>
                <Text>${selectedOrder.taxAmount}</Text>
              </Col>
            </Row>
            <Row>
              <Col span={12}>
                <Text strong>Total</Text>
              </Col>
              <Col span={12}>
                <Text strong>${selectedOrder.orderTotal}</Text>
              </Col>
            </Row>
          </Col>
        </Row>
      </Card>
    </div>
  );
};

export default ViewOrder;