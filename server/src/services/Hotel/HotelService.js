class HotelService{
    constructor(prismaClient){
        this.prisma = prismaClient;
    }
    async createHotel(data){
        const hotel = await this.prisma.hotel.create({
            data
        })
        return hotel;
    }
    async getAllHotels(){
        return await this.prisma.hotel.findMany();
    }
    async getSingleHotel(hotelId){
        const hotel = await this.prisma.hotel.findUnique({
            where: { id: hotelId },
        });
        return hotel;
    }
    async updateHotel(hotelId, data){
        const updatedHotel = await this.prisma.hotel.update({
            where: { id: hotelId },
            data,
        });
        return updatedHotel;
    }
    async deleteHotel(hotelId){
        return await this.prisma.hotel.delete({
            where: { id: hotelId },
        });
    }
}

module.exports = HotelService