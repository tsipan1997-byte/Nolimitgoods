// Заглушка клієнта, щоб Next.js не падав під час збірки на Vercel
const dummyProxy: any = new Proxy({}, {
  get: () => () => Promise.resolve({ id: 'dummy-id', success: true }),
});

export const prisma: any = dummyProxy;
export default prisma;