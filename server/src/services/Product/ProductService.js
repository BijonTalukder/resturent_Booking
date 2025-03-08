class ProductService {
  prisma;
  constructor(prisma) {
    this.prisma = prisma;
  }
  generateReferenceId() {
    const date = new Date();
    const formattedDate = date
      .toISOString()
      .replace(/[-T:.Z]/g, "")
      .slice(0, 14);
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    return `PROD-${formattedDate}-${randomNum}`;
  }
  buildWhereClause(filters, searchTerm) {
    const searchCondition = searchTerm
      ? {
          OR: [
            { name: { contains: searchTerm, mode: "insensitive" } },
            { description: { contains: searchTerm, mode: "insensitive" } },
            { productSubtitle: { contains: searchTerm, mode: "insensitive" } },
          ],
        }
      : {};

    return {
      AND: [filters, searchCondition],
    };
  }

  async createProducts(data) {
    try {
      const { variants, ...productData } = data;

      // console.log(productData);

      let referenceId = this.generateReferenceId();
      const product = await this.prisma.product.create({
        data: { ...productData, referenceId },
      });

      console.log("Finding product with ID:", product.id); // Check the ID used for lookup

      if (variants && variants.length > 0) {
        const variantsData = variants.map((variant) => ({
          ...variant,
          productId: product.id,
        }));

        await this.prisma.variant.createMany({
          data: variantsData,
        });
      }
      console.log("Finding product with ID:", product.id); // Check the ID used for lookup

      const fullProduct = await this.prisma.product.findUnique({
        where: { id: product.id },
        include: { variants: true },
      });

      return fullProduct;
    } catch (error) {
      console.log(error);
    }
  }

  async getAllProducts() {
    try {
      const products = await this.prisma.product.findMany({
        orderBy: {
          createdAt: "desc",
        },
        include: {
          category: true,
          variants: true,
          brand: true,
        },
      });
      return products; // Return all categories
    } catch (error) {
      console.error("Error fetching products:", error);
      throw new Error("Failed to fetch products");
    }
  }

  // Get all products with optional filtering
  async getProducts(filters = {}, searchTerm = null, page = 1, limit = 10, sortBy = "") {
  try {
    const whereClause = this.buildWhereClause(filters, searchTerm);
    const skip = (page - 1) * limit;

    // Define the orderBy clause based on the sortBy parameter
    let orderBy = {};
    switch (sortBy) {
      case "price-low":
        orderBy = { price: "asc" }; // Sort by price: low to high
        break;
      case "price-high":
        orderBy = { price: "desc" }; // Sort by price: high to low
        break;
      case "newest":
        orderBy = { newArrival: "desc" };
        break;
      case "popular":
        // Assuming you have a field like `popularity` or `salesCount` to sort by popularity
        orderBy = { topSale: "desc" }; 
        break;
      default:
        orderBy = { createdAt: "desc" }; // Default sorting: newest first
        break;
    }
    
    // console.log("Sort By (Backend):", sortBy);
    // console.log("Order By (Backend):", orderBy);
    const products = await this.prisma.product.findMany({
      where: whereClause,
      skip,
      take: limit,
      include: {
        category: true,
        variants: true,
        brand: true,
      },
      orderBy,
    });

    // Count total products for pagination meta
    const totalProducts = await this.prisma.product.count({
      where: whereClause,
    });

    // Pagination metadata
    const meta = {
      totalItems: totalProducts,
      totalPages: Math.ceil(totalProducts / limit),
      currentPage: page,
      itemsPerPage: limit,
    };

    return { products, meta };
  } catch (error) {
    console.error("Error fetching products:", error);
    throw new Error("Failed to fetch products");
  }
}

  // Get a single product by ID
  async getProductById(id) {
    try {
      const product = await this.prisma.product.findUnique({
        where: { id },
        include: {
          category: true,
          variants: true,
          brand: true,
        },
      });
      if (!product) throw new Error("Product not found");
      return product;
    } catch (error) {
      console.error("Error fetching product by ID:", error);
      throw new Error("Product not found");
    }
  }

  async getRelatedProducts(
  productId, 
  limit = 12
) {
  try {
    // Get the current product details
    const product = await this.prisma.product.findUnique({
      where: { id: productId },
      select: { categoryId: true }, // Only categoryId is needed
    });

    if (!product) throw new Error("Product not found");

    // Find related products by the same category (excluding the same product)
    const relatedProducts = await this.prisma.product.findMany({
      where: {
        categoryId: product.categoryId, // Match the same category
        NOT: { id: productId }, // Exclude the current product
      },
      take: limit, // Limit the number of related products
      include: {
        category: true,
        brand: true,
        variants: true,
      },
      orderBy: { createdAt: "desc" }, // Newest related products first
    });

    return relatedProducts;
  } catch (error) {
    console.error("Error fetching related products:", error);
    throw new Error("Failed to fetch related products");
  }
}


  // Update a product by ID
  async updateProduct(id, data) {
    try {
      // Update product details
      const product = await this.prisma.product.update({
        where: { id },
        data: {
          name: data.name,
          description: data.description,
          productSubtitle: data.productSubtitle,
          price: data.price,
          imageUrl: data.imageUrl,
          weight: data.weight,
          material: data.material,
          thickness: data.thickness,
          elasticity: data.elasticity,
          breathability: data.breathability,
          categoryId: data.categoryId,
          brandId: data.brandId,
          referenceId: data.referenceId,
          topSale: data.topSale,
          newArrival: data.newArrival,
          status: data.status,
          availability: data.availability,
          updatedAt: new Date(),
        },
        include: {
          category: true,
          brand: true,
          variants: true,
        },
      });

      // Extract variant IDs from the request
      const variantIds =
        data.variants?.map((variant) => variant.id).filter(Boolean) || [];

      // Remove variants not in the update request
      await this.prisma.variant.deleteMany({
        where: {
          productId: id,
          NOT: { id: { in: variantIds } },
        },
      });

      // Handle Variants
      if (data.variants && data.variants.length > 0) {
        await Promise.all(
          data.variants.map(async (variant) => {
            if (variant.id) {
              // Update existing variant
              await this.prisma.variant.update({
                where: { id: variant.id },
                data: {
                  attributes: variant.attributes,
                  stock: variant.stock,
                  price: variant.price,
                  priceTiers: variant.priceTiers,
                  imageUrl: variant.imageUrl,
                  sku: variant.sku,
                  updatedAt: new Date(),
                },
              });
            } else {
              // Create new variant
              await this.prisma.variant.create({
                data: {
                  productId: id,
                  attributes: variant.attributes,
                  stock: variant.stock,
                  price: variant.price,
                  priceTiers: variant.priceTiers,
                  imageUrl: variant.imageUrl,
                  sku: variant.sku,
                },
              });
            }
          })
        );
      }

      // Fetch updated product with variants
      const updatedProduct = await this.prisma.product.findUnique({
        where: { id },
        include: {
          category: true,
          brand: true,
          variants: true,
        },
      });

      return updatedProduct;
    } catch (error) {
      console.error("Error updating product:", error);
      throw new Error("Product update failed");
    }
  }

  // Delete a product by ID
  async deleteProduct(id) {
    try {
      await this.prisma.variant.deleteMany({
        where: { productId: id },
      });
      const product = await this.prisma.product.delete({
        where: { id },
      });
      return product;
    } catch (error) {
      console.error("Error deleting product:", error);
      throw new Error("Product deletion failed");
    }
  }
}
module.exports = ProductService;
