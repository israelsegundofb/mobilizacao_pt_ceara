import { trpc } from "@/lib/trpc";

export function useSiteContent() {
  const { data: allContent = [] } = trpc.content.getAll.useQuery();

  const getContent = (key: string, defaultValue: string = ""): string => {
    const item = allContent.find((c: any) => c.key === key);
    return item?.content || defaultValue;
  };

  const getContentBySection = (section: string) => {
    return allContent.filter((c: any) => c.section === section);
  };

  return { getContent, getContentBySection, allContent };
}
