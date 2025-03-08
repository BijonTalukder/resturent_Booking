const SendEmailUtility = require("../../shared/SendEmailUtility ");


class OrderService {
    constructor(prisma) {
        this.prisma = prisma;
        this.adminEmail =  "hossainsazza9079@gmail.com";
    }

    async createOrder(postBody) {
        try {
            // Create the order
            const order = await this.prisma.order.create({
                data: postBody,
            });
        //  if (order.email) {
        //         const customerEmailSubject = "Your Order Has Been Placed";
        //         const customerEmailBody = `
        //             <h1>Thank you for your order!</h1>
        //             <p>Your order has been successfully placed. Below are the details:</p>
        //             <ul>
        //                 <li><strong>Order ID:</strong> ${order.id}</li>
        //                 <li><strong>Transaction ID:</strong> ${order.transactionId}</li>
        //                 <li><strong>Total Amount:</strong> $${order.orderTotal}</li>
        //             </ul>
        //             <p>We will notify you once your order is shipped.</p>
        //         `;

        //         await SendEmailUtility.sendEmail(order.email, customerEmailBody, customerEmailSubject);
        //     }

         
        //     const adminEmailSubject = "New Order Notification";
        //     const adminEmailBody = `
        //         <h1>New Order Received</h1>
        //         <p>A new order has been placed. Below are the details:</p>
        //         <ul>
        //             <li><strong>Order ID:</strong> ${order.id}</li>
        //             <li><strong>Transaction ID:</strong> ${order.transactionId}</li>
        //             <li><strong>Customer Email:</strong> ${order.email || "Not provided"}</li>
        //             <li><strong>Total Amount:</strong> $${order.orderTotal}</li>
        //         </ul>
        //         <p>Please review the order and proceed with the next steps.</p>
        //     `;

        //     await SendEmailUtility.sendEmail(this.adminEmail, adminEmailBody, adminEmailSubject);

            return order;
        } catch (error) {
            console.error("Error creating order:", error);
            throw new Error("Failed to create order");
        }
    }

    async getOrders() {
        const orders = await this.prisma.order.findMany({
            orderBy: {
                createdAt: "desc", // Sorts orders from latest to earliest
            },
        });
        return orders;
    }

    async getOrderById(id) {
        const order = await this.prisma.order.findUnique({
            where: {
                id: id,
            },
        });
        return order;
    }

    async getOrdersByUserId(userId) {
        const orders = await this.prisma.order.findMany({
            where: {
                userId: userId, // Fetch orders for the specific user
            },
        });
        return orders;
    }

    async updateOrder(id, postBody) {
        const order = await this.prisma.order.update({
            where: {
                id: id,
            },
            data: postBody,
        });
        return order;
    }

    async deleteOrder(id) {
        const order = await this.prisma.order.delete({
            where: {
                id: id,
            },
        });
        return order;
    }

    async getOrderByTrackingNumber(trackingNumber) {
        const order = await this.prisma.order.findUnique({
            where: {
                transactionId: trackingNumber,
            },
        });
        return order;
    }
}

module.exports = OrderService;