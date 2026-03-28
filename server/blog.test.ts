import { describe, it, expect } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

type AuthenticatedUser = NonNullable<TrpcContext["user"]>;

function createAdminContext(): { ctx: TrpcContext } {
  const user: AuthenticatedUser = {
    id: 1,
    openId: "admin-user",
    email: "admin@example.com",
    name: "Admin User",
    loginMethod: "manus",
    role: "admin",
    createdAt: new Date(),
    updatedAt: new Date(),
    lastSignedIn: new Date(),
  };

  const ctx: TrpcContext = {
    user,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {} as TrpcContext["res"],
  };

  return { ctx };
}

function createUserContext(): { ctx: TrpcContext } {
  const user: AuthenticatedUser = {
    id: 2,
    openId: "regular-user",
    email: "user@example.com",
    name: "Regular User",
    loginMethod: "manus",
    role: "user",
    createdAt: new Date(),
    updatedAt: new Date(),
    lastSignedIn: new Date(),
  };

  const ctx: TrpcContext = {
    user,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {} as TrpcContext["res"],
  };

  return { ctx };
}

describe("blog router", () => {
  it("should allow admin to create a blog post", async () => {
    const { ctx } = createAdminContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.blog.create({
      title: "Test Post",
      slug: "test-post",
      excerpt: "This is a test post",
      content: "<p>Test content</p>",
      category: "Test",
      tags: "test, blog",
    });

    expect(result.success).toBe(true);
  });

  it("should prevent regular users from creating blog posts", async () => {
    const { ctx } = createUserContext();
    const caller = appRouter.createCaller(ctx);

    try {
      await caller.blog.create({
        title: "Test Post",
        slug: "test-post",
        excerpt: "This is a test post",
        content: "<p>Test content</p>",
        category: "Test",
      });
      expect.fail("Should have thrown an error");
    } catch (error: any) {
      expect(error.message).toBe("Unauthorized");
    }
  });

  it("should allow anyone to get published blog posts", async () => {
    const { ctx } = createUserContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.blog.getPublished({
      limit: 10,
      offset: 0,
    });

    expect(Array.isArray(result)).toBe(true);
  });

  it("should allow admin to get all blog posts", async () => {
    const { ctx } = createAdminContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.blog.getAll();

    expect(Array.isArray(result)).toBe(true);
  });

  it("should prevent regular users from getting all blog posts", async () => {
    const { ctx } = createUserContext();
    const caller = appRouter.createCaller(ctx);

    try {
      await caller.blog.getAll();
      expect.fail("Should have thrown an error");
    } catch (error: any) {
      expect(error.message).toBe("Unauthorized");
    }
  });
});
