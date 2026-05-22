class SettingService {
    constructor(prisma) {
        this.prisma = prisma;
    }

    async upsert(key, value) {
        return await this.prisma.setting.upsert({
            where: { key },
            update: { value },
            create: { key, value },
        });
    }

    async get(key) {
        return await this.prisma.setting.findUnique({
            where: { key },
        });
    }

    async getAll() {
        return await this.prisma.setting.findMany();
    }
}

module.exports = SettingService;
