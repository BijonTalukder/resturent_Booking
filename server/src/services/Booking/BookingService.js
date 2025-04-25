const { PrismaClient } = require("@prisma/client");
const PaymentGatewayService = require("../PaymentGateway/PaymentGatewayService");
const catchAsync = require("../../shared/catchAsync");
const { ObjectId } = require('mongodb');
class BookingService {
    constructor() {
        this.prisma = new PrismaClient();
        this.paymentService = new PaymentGatewayService();
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
        console.log(GatewayPageURL, "--------------------")

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
        const bookings = await this.prisma.booking.findMany({
           
          });
        
          // For each booking, fetch the rooms using the roomIds
        //   const bookingsWithRooms = await Promise.all(bookings.map(async (booking) => {
        //     const rooms = await this.prisma.room.findMany({
        //       where: {
        //         id: {
        //           in: booking.roomIds, // Use roomIds to filter the rooms
        //         }
        //       }
        //     });
        
        //     return {
        //         bookings // Add the rooms to the booking object
        //     };
        //   }));
        
          return bookingsWithRooms;
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
    async getBookingsByUser(userId) {
        return await this.prisma.booking.findMany({
            where: { userId },
            // include: { room: true },
        });
    }
    async checkAvailability({ roomId, checkIn, checkOut }) {
        const start = new Date(checkIn);
        const end = new Date(checkOut);

        const overlappingBookings = await this.prisma.booking.findMany({
            where: {
                roomIds: {
                    has: roomId // Use has operator for array field
                },
                AND: [
                    { checkIn: { lt: end } },
                    { checkOut: { gt: start } }
                ]
            }
        });

        if (overlappingBookings.length > 0) {
            return {
                available: false,
                message: "Room is already booked in this time slot.",
                bookings: overlappingBookings
            };
        }

        return {
            available: true,
            message: "Room is available for booking."
        };
    }

    // async checkAvailability(roomId, checkIn, checkOut) {
    //     const overlappingBookings = await this.prisma.booking.findMany({
    //         where: {
    //             roomId,
    //             OR: [
    //                 { checkIn: { lte: checkOut }, checkOut: { gte: checkIn } },
    //             ],
    //         },
    //     });

    //     return overlappingBookings.length === 0;
    // }
}

module.exports = BookingService;
