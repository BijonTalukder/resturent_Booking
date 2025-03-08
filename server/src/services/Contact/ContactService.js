class ContactService {
    constructor(prisma) {
        this.prisma = prisma;
    }

    async createContact(data) {
        return await this.prisma.contact.create({
            data,
        });
    }

    async getContacts() {
        return await this.prisma.contact.findMany();
    }

    async getContactById(id) {
        return await this.prisma.contact.findUnique({
            where: { id },
        });
    }

    async updateContact(id, data) {
        return await this.prisma.contact.update({
            where: { id },
            data,
        });
    }

    async deleteContact(id) {
        return await this.prisma.contact.delete({
            where: { id },
        });
    }
}

module.exports = ContactService;
