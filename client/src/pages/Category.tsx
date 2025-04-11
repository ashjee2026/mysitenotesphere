import { useParams } from "wouter";
import CategoryHeader from "@/components/CategoryPage/CategoryHeader";
import ResourceList from "@/components/CategoryPage/ResourceList";

export default function Category() {
  const params = useParams<{ categoryId: string }>();
  const { categoryId } = params;

  return (
    <main>
      <CategoryHeader categoryId={categoryId} />
      <ResourceList categoryId={categoryId} />
    </main>
  );
}
