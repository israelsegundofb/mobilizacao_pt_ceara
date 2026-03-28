import { describe, expect, it, beforeEach, vi } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

// Mock do banco de dados
vi.mock("./db", () => ({
  addPetitionSignature: vi.fn(async (data) => {
    if (data.email === "duplicate@test.com") {
      const error = new Error("Duplicate entry");
      throw error;
    }
    return { insertId: 1 };
  }),
  getPetitionSignatures: vi.fn(async () => [
    {
      id: 1,
      fullName: "Test User",
      cnf: "12345",
      whatsapp: "85999999999",
      email: "test@test.com",
      city: "Fortaleza",
      state: "CE",
      message: "Test message",
      agreeToShare: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ]),
  getPetitionSignatureCount: vi.fn(async () => 1),
}));

function createPublicContext(): TrpcContext {
  return {
    user: null,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {
      clearCookie: vi.fn(),
    } as unknown as TrpcContext["res"],
  };
}

describe("petition.sign", () => {
  let caller: ReturnType<typeof appRouter.createCaller>;

  beforeEach(() => {
    const ctx = createPublicContext();
    caller = appRouter.createCaller(ctx);
  });

  it("should successfully register a petition signature with valid data", async () => {
    const result = await caller.petition.sign({
      fullName: "João Silva",
      cnf: "12345678",
      whatsapp: "85999999999",
      email: "joao@example.com",
      city: "Fortaleza",
      state: "CE",
      message: "Apoio total!",
      agreeToShare: true,
    });

    expect(result.success).toBe(true);
    expect(result.message).toContain("sucesso");
  });

  it("should reject signature with invalid email", async () => {
    try {
      await caller.petition.sign({
        fullName: "João Silva",
        cnf: "12345678",
        whatsapp: "85999999999",
        email: "invalid-email",
        city: "Fortaleza",
        state: "CE",
      });
      expect.fail("Should have thrown an error");
    } catch (error: any) {
      expect(error.message).toContain("Email");
    }
  });

  it("should reject signature with missing required fields", async () => {
    try {
      await caller.petition.sign({
        fullName: "",
        cnf: "12345678",
        whatsapp: "85999999999",
        email: "joao@example.com",
        city: "Fortaleza",
        state: "CE",
      });
      expect.fail("Should have thrown an error");
    } catch (error: any) {
      expect(error.message).toContain("obrigatório");
    }
  });

  it("should accept valid state code", async () => {
    const result = await caller.petition.sign({
      fullName: "João Silva",
      cnf: "87654321",
      whatsapp: "85999999999",
      email: "joao2@example.com",
      city: "Fortaleza",
      state: "CE",
    });

    expect(result.success).toBe(true);
  });

  it("should handle duplicate email registration", async () => {
    try {
      await caller.petition.sign({
        fullName: "João Silva",
        cnf: "12345678",
        whatsapp: "85999999999",
        email: "duplicate@test.com",
        city: "Fortaleza",
        state: "CE",
      });
      expect.fail("Should have thrown an error");
    } catch (error: any) {
      expect(error.message).toContain("já foi registrado");
    }
  });
});

describe("petition.getSignatures", () => {
  let caller: ReturnType<typeof appRouter.createCaller>;

  beforeEach(() => {
    const ctx = createPublicContext();
    caller = appRouter.createCaller(ctx);
  });

  it("should retrieve all petition signatures", async () => {
    const result = await caller.petition.getSignatures();

    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBeGreaterThan(0);
  });
});

describe("petition.getCount", () => {
  let caller: ReturnType<typeof appRouter.createCaller>;

  beforeEach(() => {
    const ctx = createPublicContext();
    caller = appRouter.createCaller(ctx);
  });

  it("should return the total count of signatures", async () => {
    const result = await caller.petition.getCount();

    expect(result).toHaveProperty("count");
    expect(typeof result.count).toBe("number");
    expect(result.count).toBeGreaterThanOrEqual(0);
  });
});
