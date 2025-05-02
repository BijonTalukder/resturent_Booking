const { PrismaClient } = require("@prisma/client");

class DistrictService {
  constructor() {
    this.prisma = new PrismaClient();
  }

  // Create a new District
  async createDistrict(data) {
    try {
      const District = await this.prisma.disrtict.create({
        data,
      });
      return District;
    } catch (error) {
      throw new Error("Error creating District: " + error.message);
    }
  }

  // Get all cities
  async getAllCities() {
    try {
      const cities = await this.prisma.disrtict.findMany();
      return cities;
    } catch (error) {
      throw new Error("Error fetching cities: " + error.message);
    }
  }

  // Get a single District by ID
  async getDistrictById(id) {
    try {
      const District = await this.prisma.disrtict.findUnique({
        where: { id },
      });
      return District;
    } catch (error) {
      throw new Error("Error fetching District: " + error.message);
    }
  }

  // Update a District's data
  async updateDistrict(id, data) {
    try {
      const District = await this.prisma.disrtict.update({
        where: { id },
        data,
      });
      return District;
    } catch (error) {
      throw new Error("Error updating District: " + error.message);
    }
  }

  // Delete a District
  async deleteDistrict(id) {
    try {
      const District = await this.prisma.disrtict.delete({
        where: { id },
      });
      return District;
    } catch (error) {
      throw new Error("Error deleting District: " + error.message);
    }
  }
}

module.exports = DistrictService;
