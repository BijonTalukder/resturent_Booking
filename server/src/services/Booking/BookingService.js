const { PrismaClient } = require("@prisma/client");
const PaymentGatewayService = require("../PaymentGateway/PaymentGatewayService");

class BookingService  {
    constructor() {
        this.prisma = new PrismaClient();
        this.paymentService =new PaymentGatewayService();
    }

    async createBooking(data) {
        // Check room availability before booking
        // const isAvailable = await this.checkRoomAvailability(data.roomId, data.checkIn, data.checkOut);
        // if (!isAvailable) throw new Error("Room is not available for the selected dates");

        const { GatewayPageURL, tranId } = await this.paymentService.createPayment({
            name: data.name,
            email: data.email,
            phone: data.phone,
            address: data.address,
            productName: "Room Booking",
            price: data.totalPrice
        });
console.log(GatewayPageURL,"--------------------")
       
// console.log(this.prisma,"--------------------")
        const booking = await this.prisma.booking.create({
            data: {
                ...data,
                transactionId: tranId,
            },
        });
        await this.prisma.payment.create({
            data: {
                bookingId: booking.id, // after creating booking
                tranId,
                method: 'sslcommerz',
                amount: data.totalPrice,
            },
        });
        return {
            booking,
            payment_url: GatewayPageURL,
        };
    }

    async getAllBookings() {
        return await this.prisma.booking.findMany({
            // include: { room: true },
        });
    }

    async getSingleBooking(bookingId) {
        return await this.prisma.booking.findUnique({
            where: { id: bookingId },
            // include: { room: true },
        });
    }

    async updateBooking(bookingId, data) {
        return await this.prisma.booking.update({
            where: { id: bookingId },
            data,
        });
    }

    async deleteBooking(bookingId) {
        return await this.prisma.booking.delete({
            where: { id: bookingId },
        });
    }

    async checkRoomAvailability(roomId, checkIn, checkOut) {
        const overlappingBookings = await this.prisma.booking.findMany({
            where: {
                roomId,
                OR: [
                    { checkIn: { lte: checkOut }, checkOut: { gte: checkIn } },
                ],
            },
        });

        return overlappingBookings.length === 0;
    }
}

module.exports = BookingService;
