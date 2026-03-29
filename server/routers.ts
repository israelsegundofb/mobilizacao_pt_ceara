import { COOKIE_NAME, ONE_YEAR_MS } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router } from "./_core/trpc";
import { z } from "zod";
import * as db from "./db";
import { sendNewsletterPostNotification } from "./email";
import { protectedProcedure } from "./_core/trpc";
import { sdk } from "./_core/sdk";
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
    
    login: publicProcedure
      .input(z.object({
        username: z.string(),
        password: z.string(),
      }))
      .mutation(async ({ input, ctx }) => {
        // Obter usuário do banco ou validar credencial mestre 'israel_franca'
        let user = await db.getUserByEmail(input.username);
        if (!user) {
          user = await db.getUserByOpenId(input.username); // Fallback para username como openId
        }

        const isMaster = input.username === 'israel_franca' && input.password === '@Estrat13#Luta';
        
        if (!isMaster && (!user || user.password !== input.password)) {
          throw new Error('Credenciais inválidas');
        }

        // Se for o mestre e não existir no DB, cria agora
        if (isMaster && !user) {
          await db.upsertUser({
            openId: 'israel_franca', // Username as openId for simplicity
            name: 'Israel França',
            email: 'israel@mobiliza.pt',
            password: '@Estrat13#Luta',
            role: 'admin',
          });
          user = await db.getUserByOpenId('israel_franca');
        }

        if (!user) throw new Error('Falha ao autenticar usuário');

        // Criar token de sessão (JWT)
        const sessionToken = await sdk.createSessionToken(user.openId!, {
          name: user.name || 'Admin',
        });

        // Configurar Cookie
        const cookieOptions = getSessionCookieOptions(ctx.req);
        ctx.res.cookie(COOKIE_NAME, sessionToken, {
          ...cookieOptions,
          maxAge: ONE_YEAR_MS,
        });

        return { success: true, user };
      }),

    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  // Router para gestão de equipe (Admin Only)
  adminUsers: router({
    list: protectedProcedure.query(async ({ ctx }) => {
      if (ctx.user?.role !== 'admin') throw new Error('Unauthorized');
      return await db.getAllUsers();
    }),
    
    create: protectedProcedure
      .input(z.object({
        name: z.string(),
        email: z.string().email(),
        password: z.string(),
        role: z.enum(['admin', 'editor']),
      }))
      .mutation(async ({ input, ctx }) => {
        if (ctx.user?.role !== 'admin') throw new Error('Unauthorized');
        
        // No manual login, usamos o email como openId único
        await db.upsertUser({
          openId: input.email,
          name: input.name,
          email: input.email,
          password: input.password,
          role: input.role,
        });
        
        return { success: true };
      }),

    delete: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input, ctx }) => {
        if (ctx.user?.role !== 'admin') throw new Error('Unauthorized');
        await db.deleteUser(input.id);
        return { success: true };
      }),
  }),

  content: router({
    getAll: publicProcedure.query(async () => {
      const content = await db.getSiteContent();
      return content;
    }),
    getBySection: publicProcedure
      .input(z.object({ section: z.string() }))
      .query(async ({ input }) => {
        const content = await db.getSiteContentBySection(input.section);
        return content;
      }),
    update: protectedProcedure
      .input(z.object({ 
        key: z.string(), 
        value: z.string() 
      }))
      .mutation(async ({ input, ctx }) => {
        // Apenas admin pode atualizar conteúdo
        if (ctx.user?.role !== 'admin' && ctx.user?.role !== 'editor') {
          throw new Error('Unauthorized');
        }
        
        const result = await db.updateSiteContent(input.key, input.value);
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
          const result = await db.addPetitionSignature({
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
      const signatures = await db.getPetitionSignatures();
      return signatures;
    }),

    getCount: publicProcedure.query(async () => {
      const count = await db.getPetitionSignatureCount();
      return count;
    }),
  }),

  blog: router({
    create: protectedProcedure
      .input(z.object({
        title: z.string().min(1),
        slug: z.string().min(1),
        excerpt: z.string().min(1),
        content: z.string().min(1),
        category: z.string().min(1),
        tags: z.string().optional(),
        featuredImage: z.string().optional(),
      }))
      .mutation(async ({ input, ctx }) => {
        if (ctx.user?.role !== 'admin' && ctx.user?.role !== 'editor') {
          throw new Error('Unauthorized');
        }
        await db.createBlogPost({
          title: input.title,
          slug: input.slug,
          excerpt: input.excerpt,
          content: input.content,
          category: input.category,
          tags: input.tags,
          featuredImage: input.featuredImage,
          author: ctx.user.name || 'Anônimo',
          published: false,
        });
        return { success: true };
      }),

    update: protectedProcedure
      .input(z.object({
        id: z.number(),
        title: z.string().optional(),
        slug: z.string().optional(),
        excerpt: z.string().optional(),
        content: z.string().optional(),
        category: z.string().optional(),
        tags: z.string().optional(),
        featuredImage: z.string().optional(),
        published: z.boolean().optional(),
      }))
      .mutation(async ({ input, ctx }) => {
        if (ctx.user?.role !== 'admin' && ctx.user?.role !== 'editor') {
          throw new Error('Unauthorized');
        }
        const { id, ...data } = input;
        
        // Se o post está sendo publicado agora, notifica a newsletter
        if (data.published === true) {
          const currentPost = await db.getBlogPostById(id);
          if (currentPost && !currentPost.published) {
            const subscribers = await db.getNewsletterSubscribers();
            const activeEmails = subscribers.filter((s: any) => s.active).map((s: any) => s.email);
            
            // Disparo assíncrono para não travar a resposta da API
            sendNewsletterPostNotification({
              title: data.title || currentPost.title,
              excerpt: data.excerpt || currentPost.excerpt,
              slug: data.slug || currentPost.slug
            }, activeEmails).catch(console.error);
          }
        }

        await db.updateBlogPost(id, data);
        return { success: true };
      }),

    delete: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input, ctx }) => {
        if (ctx.user?.role !== 'admin' && ctx.user?.role !== 'editor') {
          throw new Error('Unauthorized');
        }
        await db.deleteBlogPost(input.id);
        return { success: true };
      }),

    getAll: protectedProcedure.query(async ({ ctx }) => {
      if (ctx.user?.role !== 'admin') {
        throw new Error('Unauthorized');
      }
      return await db.getAllBlogPosts();
    }),

    getPublished: publicProcedure
      .input(z.object({ limit: z.number().default(10), offset: z.number().default(0) }))
      .query(async ({ input }) => {
        return await db.getPublishedBlogPosts(input.limit, input.offset);
      }),

    getBySlug: publicProcedure
      .input(z.object({ slug: z.string() }))
      .query(async ({ input }) => {
        const post = await db.getBlogPostBySlug(input.slug);
        if (post) {
          await db.incrementBlogPostViews(post.id);
        }
        return post;
      }),

    getByCategory: publicProcedure
      .input(z.object({ category: z.string(), limit: z.number().default(10) }))
      .query(async ({ input }) => {
        return await db.getBlogPostsByCategory(input.category, input.limit);
      }),

    addComment: publicProcedure
      .input(z.object({
        postId: z.number(),
        authorName: z.string().min(2),
        content: z.string().min(2),
      }))
      .mutation(async ({ input }) => {
        await db.addBlogComment({
          postId: input.postId,
          authorName: input.authorName,
          content: input.content,
          published: false, // Requer moderação
        });
        return { success: true };
      }),

    getComments: publicProcedure
      .input(z.object({ postId: z.number(), admin: z.boolean().default(false) }))
      .query(async ({ input, ctx }) => {
        const showAll = input.admin && ctx.user?.role === 'admin';
        return await db.getBlogComments(input.postId, !showAll);
      }),

    getAllComments: protectedProcedure.query(async ({ ctx }) => {
      if (ctx.user?.role !== 'admin') throw new Error('Unauthorized');
      // No db.ts, precisamos de uma função que pegue TODOS os comentários
      return await db.getAllBlogComments();
    }),

    approveComment: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input, ctx }) => {
        if (ctx.user?.role !== 'admin') throw new Error('Unauthorized');
        await db.updateBlogComment(input.id, { published: true });
        return { success: true };
      }),

    deleteComment: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input, ctx }) => {
        if (ctx.user?.role !== 'admin') throw new Error('Unauthorized');
        await db.deleteBlogComment(input.id);
        return { success: true };
      }),
  }),

  newsletter: router({
    subscribe: publicProcedure
      .input(z.object({ name: z.string().optional(), email: z.string().email() }))
      .mutation(async ({ input }) => {
        await db.addNewsletterSubscriber({
          name: input.name || null,
          email: input.email,
        });
        return { success: true };
      }),
    
    getAll: protectedProcedure.query(async ({ ctx }) => {
      if (ctx.user?.role !== 'admin') throw new Error('Unauthorized');
      return await db.getNewsletterSubscribers();
    }),
  }),

  gallery: router({
    getAll: publicProcedure.query(async () => {
      return await db.getMediaItems();
    }),

    add: protectedProcedure
      .input(z.object({
        url: z.string().url(),
        caption: z.string().optional(),
        type: z.enum(['image', 'video']),
        category: z.string().optional(),
      }))
      .mutation(async ({ input, ctx }) => {
        if (ctx.user?.role !== 'admin') throw new Error('Unauthorized');
        await db.addMediaItem(input);
        return { success: true };
      }),

    delete: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input, ctx }) => {
        if (ctx.user?.role !== 'admin') throw new Error('Unauthorized');
        await db.deleteMediaItem(input.id);
        return { success: true };
      }),
  }),

  timeline: router({
    getAll: publicProcedure.query(async () => {
      return await db.getTimelineEvents();
    }),

    add: protectedProcedure
      .input(z.object({
        title: z.string(),
        description: z.string(),
        eventDate: z.string(), // ISO string from frontend
        order: z.number().default(0),
      }))
      .mutation(async ({ input, ctx }) => {
        if (ctx.user?.role !== 'admin') throw new Error('Unauthorized');
        await db.addTimelineEvent({
          ...input,
          eventDate: new Date(input.eventDate),
        });
        return { success: true };
      }),

    delete: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input, ctx }) => {
        if (ctx.user?.role !== 'admin') throw new Error('Unauthorized');
        await db.deleteTimelineEvent(input.id);
        return { success: true };
      }),
  }),
});

export type AppRouter = typeof appRouter;
