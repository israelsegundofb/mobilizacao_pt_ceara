import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Bold,
  Italic,
  List,
  ListOrdered,
  Heading2,
  Heading3,
  Image as ImageIcon,
  Link as LinkIcon,
  Undo2,
  Redo2,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface BlogEditorProps {
  onSave: (data: {
    title: string;
    slug: string;
    excerpt: string;
    content: string;
    category: string;
    tags: string;
    featuredImage?: string;
  }) => void;
  initialData?: {
    title: string;
    slug: string;
    excerpt: string;
    content: string;
    category: string;
    tags: string;
    featuredImage?: string;
  };
}

export default function BlogEditor({ onSave, initialData }: BlogEditorProps) {
  const [title, setTitle] = useState(initialData?.title || "");
  const [slug, setSlug] = useState(initialData?.slug || "");
  const [excerpt, setExcerpt] = useState(initialData?.excerpt || "");
  const [category, setCategory] = useState(initialData?.category || "");
  const [tags, setTags] = useState(initialData?.tags || "");
  const [featuredImage, setFeaturedImage] = useState(initialData?.featuredImage || "");

  const editor = useEditor({
    extensions: [
      StarterKit,
      Image.configure({
        allowBase64: true,
      }),
      Link.configure({
        openOnClick: false,
      }),
    ],
    content: initialData?.content || "<p>Comece a escrever seu post aqui...</p>",
  });

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const imageUrl = event.target?.result as string;
      if (editor) {
        editor.chain().focus().setImage({ src: imageUrl }).run();
      }
    };
    reader.readAsDataURL(file);
  };

  const handleAddLink = () => {
    const url = prompt("Digite a URL:");
    if (url && editor) {
      editor
        .chain()
        .focus()
        .extendMarkRange("link")
        .setLink({ href: url })
        .run();
    }
  };

  const handleSave = () => {
    if (!title || !slug || !excerpt || !category) {
      toast.error("Preencha todos os campos obrigatórios");
      return;
    }

    if (!editor) {
      toast.error("Erro ao salvar post");
      return;
    }

    onSave({
      title,
      slug,
      excerpt,
      content: editor.getHTML(),
      category,
      tags,
      featuredImage,
    });
  };

  if (!editor) {
    return <div>Carregando editor...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Título */}
      <div>
        <label className="block text-sm font-medium mb-2">Título do Post *</label>
        <Input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Digite o título do post"
          className="w-full"
        />
      </div>

      {/* Slug */}
      <div>
        <label className="block text-sm font-medium mb-2">URL Amigável (Slug) *</label>
        <Input
          value={slug}
          onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/\s+/g, "-"))}
          placeholder="meu-primeiro-post"
          className="w-full"
        />
      </div>

      {/* Resumo */}
      <div>
        <label className="block text-sm font-medium mb-2">Resumo do Post *</label>
        <Textarea
          value={excerpt}
          onChange={(e) => setExcerpt(e.target.value)}
          placeholder="Escreva um breve resumo do seu post"
          className="w-full h-20"
        />
      </div>

      {/* Categoria */}
      <div>
        <label className="block text-sm font-medium mb-2">Categoria *</label>
        <Input
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          placeholder="Ex: Política, Mobilização, Notícias"
          className="w-full"
        />
      </div>

      {/* Tags */}
      <div>
        <label className="block text-sm font-medium mb-2">Tags (separadas por vírgula)</label>
        <Input
          value={tags}
          onChange={(e) => setTags(e.target.value)}
          placeholder="tag1, tag2, tag3"
          className="w-full"
        />
      </div>

      {/* Imagem de Destaque */}
      <div>
        <label className="block text-sm font-medium mb-2">Imagem de Destaque</label>
        <Input
          type="text"
          value={featuredImage}
          onChange={(e) => setFeaturedImage(e.target.value)}
          placeholder="URL da imagem de destaque"
          className="w-full"
        />
      </div>

      {/* Editor Toolbar */}
      <div className="border rounded-lg p-4 bg-gray-50 space-y-4">
        <div className="flex flex-wrap gap-2">
          <Button
            size="sm"
            variant={editor.isActive("bold") ? "default" : "outline"}
            onClick={() => editor.chain().focus().toggleBold().run()}
          >
            <Bold className="w-4 h-4" />
          </Button>

          <Button
            size="sm"
            variant={editor.isActive("italic") ? "default" : "outline"}
            onClick={() => editor.chain().focus().toggleItalic().run()}
          >
            <Italic className="w-4 h-4" />
          </Button>

          <Button
            size="sm"
            variant={editor.isActive("heading", { level: 2 }) ? "default" : "outline"}
            onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          >
            <Heading2 className="w-4 h-4" />
          </Button>

          <Button
            size="sm"
            variant={editor.isActive("heading", { level: 3 }) ? "default" : "outline"}
            onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          >
            <Heading3 className="w-4 h-4" />
          </Button>

          <Button
            size="sm"
            variant={editor.isActive("bulletList") ? "default" : "outline"}
            onClick={() => editor.chain().focus().toggleBulletList().run()}
          >
            <List className="w-4 h-4" />
          </Button>

          <Button
            size="sm"
            variant={editor.isActive("orderedList") ? "default" : "outline"}
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
          >
            <ListOrdered className="w-4 h-4" />
          </Button>

          <Button
            size="sm"
            variant="outline"
            onClick={handleAddLink}
          >
            <LinkIcon className="w-4 h-4" />
          </Button>

          <label>
            <Button size="sm" variant="outline" asChild>
              <span>
                <ImageIcon className="w-4 h-4" />
              </span>
            </Button>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />
          </label>

          <Button
            size="sm"
            variant="outline"
            onClick={() => editor.chain().focus().undo().run()}
          >
            <Undo2 className="w-4 h-4" />
          </Button>

          <Button
            size="sm"
            variant="outline"
            onClick={() => editor.chain().focus().redo().run()}
          >
            <Redo2 className="w-4 h-4" />
          </Button>
        </div>

        {/* Editor Content */}
        <div className="border rounded bg-white p-4 min-h-96">
          <EditorContent editor={editor} />
        </div>
      </div>

      {/* Save Button */}
      <Button onClick={handleSave} className="w-full bg-red-600 hover:bg-red-700">
        Salvar Post
      </Button>
    </div>
  );
}
