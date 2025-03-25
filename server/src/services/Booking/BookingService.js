const { PrismaClient } = require("@prisma/client");

class BookingService {
    constructor() {
        this.prisma = new PrismaClient();
    }

    async createBooking(data) {
        // Check room availability before booking
        const isAvailable = await this.checkRoomAvailability(data.roomId, data.checkIn, data.checkOut);
        if (!isAvailable) throw new Error("Room is not available for the selected dates");

        return await this.prisma.booking.create({ data });
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
