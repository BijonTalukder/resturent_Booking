const OrderService = require("../Order/OrderService");
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const stripe = require("stripe")(process.env.STRIPE_SECRETE_KEY);

class PaymentService extends OrderService{
    super(){

    }
    // Create payment intent for checkout session
    async createPaymentIntent(order, transactionId) {
    try {
        console.log(order);

        // Map order items to line items
        const lineItems = order.orderItems.map(item => ({
            price_data: {
                currency: "usd",
                product_data: {
                    name: item.name || "Unnamed Product",
                    description: item.selectedAttributes
                        ? Object.entries(item.selectedAttributes)
                              .map(([key, value]) => `${key}: ${value}`)
                              .join(", ")
                        : "No attributes selected",
                },
                unit_amount: Math.round(parseFloat(item.price) * 100) || 0, // Convert price to cents
            },
            quantity: item.quantity || 1,
        }));

        // Add delivery fee as a line item
        if (order.deliveryFee && order.deliveryFee > 0) {
            lineItems.push({
                price_data: {
                    currency: "usd",
                    product_data: {
                        name: "Delivery Fee",
                        description: "Shipping and handling charges",
                    },
                    unit_amount: Math.round(parseFloat(order.deliveryFee) * 100) || 0, // Convert to cents
                },
                quantity: 1,
            });
        }

        // Add tax amount as a line item
        if (order.taxAmount && order.taxAmount > 0) {
            lineItems.push({
                price_data: {
                    currency: "usd",
                    product_data: {
                        name: "Tax",
                        description: "Tax charges",
                    },
                    unit_amount: Math.round(parseFloat(order.taxAmount) * 100) || 0, // Convert to cents
                },
                quantity: 1,
            });
        }

        // Create Stripe Checkout Session
        const session = await stripe.checkout.sessions.create({
            client_reference_id: transactionId,
            line_items: lineItems,
            mode: "payment",
            success_url: `${process.env.SERVER_URL}/success?sessionId={CHECKOUT_SESSION_ID}&&transactionId=${transactionId}`,
            cancel_url: `${process.env.CLIENT_URL}/cancel`,
        });

        return session;
    } catch (error) {
        console.log(error);
        throw new Error("Payment Intent creation failed");
    }
}

    async paymentSuccess(req, res) {
        try {
            console.log("req.query", req.query);
            
            // Retrieve the session from Stripe using the sessionId
            const session = await stripe.checkout.sessions.retrieve(req.query.sessionId);
            
            console.log("session", session, session.payment_status);
            
            // Check if the payment was successful
            if (session.payment_status === "paid") {
                const transactionId = req.query.transactionId;  // Extract transactionId from query
                
                if (!transactionId) {
                    return res.status(400).send("Transaction ID is missing");
                }
    
                // // Update the order status to "paid" using the transactionId
                // const updatedOrder = await prisma.order.update({
                //     where: {
                //         transactionId: transactionId,  // Use transactionId to find the order
                //     },
                //     data: {
                //         paymentStatus: "paid",  // Mark payment status as "paid"
                //     },
                // });
                console.log(session.client_reference_id);
                const orderData = await prisma.order.findUnique({
                    where:{
                        transactionId: transactionId,
                    }
                })
                console.log(orderData,"orderData");
                const updatedOrder = await prisma.order.update({
                    where: {
                        id: orderData.id,  
                    },
                    data: {
                        paymentStatus: "paid",
                    },
                });
    
                console.log(updatedOrder);
                
    
                return res.redirect(`${process.env.CLIENT_URL}/success`);
                // return res.status(200).json({ success: true, message: "Payment successful" });
            } else {
   
                return res.redirect(`${process.env.CLIENT_URL}/cancel`);
                // return res.status(400).json({ success: false, message: "Payment failed" });
            }
        } catch (error) {
            console.error("Error processing payment success:", error);
            return res.redirect(`${process.env.CLIENT_URL}/cancel`);
        }
    }
    async paymentCancel(req, res) {
        return res.redirect(`${process.env.CLIENT_URL}/cancel`);
    }

   
}

module.exports = PaymentService;
