import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router } from "./_core/trpc";
import { z } from "zod";
import { addPetitionSignature, getPetitionSignatures, getPetitionSignatureCount } from "./db";

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  petition: router({
    sign: publicProcedure
      .input(
        z.object({
          fullName: z.string().min(2, "Nome completo é obrigatório"),
          cnf: z.string().min(1, "CNF (Cadastro Nacional de Filiação) é obrigatório"),
          whatsapp: z.string().min(10, "WhatsApp é obrigatório"),
          email: z.string().email("Email inválido"),
          city: z.string().min(2, "Cidade é obrigatória"),
          state: z.string().length(2, "Estado (UF) é obrigatório"),
          message: z.string().optional(),
          agreeToShare: z.boolean().default(false),
        })
      )
      .mutation(async ({ input }) => {
        try {
          await addPetitionSignature(input);
          return { success: true, message: "Assinatura registrada com sucesso!" };
        } catch (error: any) {
          if (error.message?.includes("Duplicate entry")) {
            throw new Error("Este email ou CNF já foi registrado.");
          }
          throw error;
        }
      }),
    getSignatures: publicProcedure.query(async () => {
      const signatures = await getPetitionSignatures();
      return signatures;
    }),
    getCount: publicProcedure.query(async () => {
      const count = await getPetitionSignatureCount();
      return { count };
    }),
  }),
});

export type AppRouter = typeof appRouter;
