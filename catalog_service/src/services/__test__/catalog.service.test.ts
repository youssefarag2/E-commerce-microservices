import { ICatalogRepository } from "../../interface/catalogRepository.interface";
import { Product } from "../../models/product.model";
import { CatalogRepository } from "../../repository/catalog.repository";
import { CatalogService } from "../catalog.service";
import { faker } from "@faker-js/faker";

const mockProduct = () => {
  return {
    name: faker.commerce.productName(),
    description: faker.commerce.productDescription(),
    stock: faker.number.int({ min: 10, max: 100 }),
    price: +faker.commerce.price(),
  };
};

describe("catalogService", () => {
  let repository: ICatalogRepository;

  beforeEach(() => {
    repository = new CatalogRepository();
  });

  afterEach(() => {
    repository = {} as CatalogRepository;
  });

  describe("createProduct", () => {
    test("Should create product", async () => {
      const service = new CatalogService(repository);
      const reqBody = mockProduct();
      const result = await service.createProduct(reqBody);
      expect(result).toMatchObject({
        id: expect.any(Number),
        name: expect.any(String),
        description: expect.any(String),
        price: expect.any(Number),
        stock: expect.any(Number),
      });
    });

    test("Should throw error with product with unable to create product", async () => {
      const service = new CatalogService(repository);
      const reqBody = mockProduct();

      jest
        .spyOn(repository, "create")
        .mockImplementation(() => Promise.resolve({} as Product));

      await expect(service.createProduct(reqBody)).rejects.toThrow(
        "unable to create product"
      );
    });

    test("Should throw error with product already exist", async () => {
      const service = new CatalogService(repository);
      const reqBody = mockProduct();

      jest
        .spyOn(repository, "create")
        .mockImplementation(() =>
          Promise.reject(new Error("product already exist"))
        );

      await expect(service.createProduct(reqBody)).rejects.toThrow(
        "product already exist"
      );
    });
  });
});
