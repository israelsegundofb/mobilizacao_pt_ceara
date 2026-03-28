import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router } from "./_core/trpc";
import { z } from "zod";
import { addPetitionSignature, getPetitionSignatures, getPetitionSignatureCount, getSiteContent, getSiteContentBySection, updateSiteContent } from "./db";
import { protectedProcedure } from "./_core/trpc";
import { fetchInstagramFeedCached } from "./instagram-scraper";

export const appRouter = router({
  system: systemRouter,
  
  instagram: router({
    getFeed: publicProcedure.query(async () => {
      try {
        const posts = await fetchInstagramFeedCached('israelfranca');
        return posts;
      } catch (error) {
        console.error("Error fetching Instagram feed:", error);
        return [];
      }
    }),
  }),

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

  content: router({
    getAll: publicProcedure.query(async () => {
      const content = await getSiteContent();
      return content;
    }),
    getBySection: publicProcedure
      .input(z.object({ section: z.string() }))
      .query(async ({ input }) => {
        const content = await getSiteContentBySection(input.section);
        return content;
      }),
    update: protectedProcedure
      .input(z.object({ 
        key: z.string(), 
        value: z.string() 
      }))
      .mutation(async ({ input, ctx }) => {
        // Apenas admin pode atualizar conteúdo
        if (ctx.user?.role !== 'admin') {
          throw new Error('Unauthorized');
        }
        
        const result = await updateSiteContent(input.key, input.value);
        return result;
      }),
  }),

  petition: router({
    sign: publicProcedure
      .input(z.object({
        fullName: z.string().min(3),
        cnf: z.string().min(10),
        whatsapp: z.string().min(10),
        email: z.string().email(),
        city: z.string().min(2),
        state: z.string().min(2),
      }))
      .mutation(async ({ input }) => {
        try {
          const result = await addPetitionSignature({
            fullName: input.fullName,
            cnf: input.cnf,
            whatsapp: input.whatsapp,
            email: input.email,
            city: input.city,
            state: input.state,
          });
          return result;
        } catch (error) {
          console.error("Error signing petition:", error);
          throw new Error("Erro ao registrar assinatura");
        }
      }),
    
    getAll: protectedProcedure.query(async ({ ctx }) => {
      if (ctx.user?.role !== 'admin') {
        throw new Error('Unauthorized');
      }
      const signatures = await getPetitionSignatures();
      return signatures;
    }),

    getCount: publicProcedure.query(async () => {
      const count = await getPetitionSignatureCount();
      return count;
    }),
  }),
});

export type AppRouter = typeof appRouter;
