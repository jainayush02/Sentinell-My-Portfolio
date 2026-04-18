import React, { useEffect } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import Link from '@tiptap/extension-link';
import { 
  Bold, Italic, Underline as UnderlineIcon, 
  List, ListOrdered, Link as LinkIcon, 
  Eraser, Heading1, Heading2, Quote, Code
} from 'lucide-react';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

const MenuBar = ({ editor }: { editor: any }) => {
  if (!editor) return null;

  const addLink = () => {
    const url = window.prompt('URL');
    if (url) {
      editor.chain().focus().setLink({ href: url }).run();
    }
  };

  return (
    <div className="flex flex-wrap gap-1 p-2 border-b border-white/10 bg-white/[0.02] rounded-t-xl">
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleBold().run()}
        className={`p-2 rounded-lg transition-all ${editor.isActive('bold') ? 'bg-violet-500/20 text-violet-400' : 'text-white/40 hover:text-white hover:bg-white/5'}`}
      >
        <Bold className="w-4 h-4" />
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleItalic().run()}
        className={`p-2 rounded-lg transition-all ${editor.isActive('italic') ? 'bg-violet-500/20 text-violet-400' : 'text-white/40 hover:text-white hover:bg-white/5'}`}
      >
        <Italic className="w-4 h-4" />
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleUnderline().run()}
        className={`p-2 rounded-lg transition-all ${editor.isActive('underline') ? 'bg-violet-500/20 text-violet-400' : 'text-white/40 hover:text-white hover:bg-white/5'}`}
      >
        <UnderlineIcon className="w-4 h-4" />
      </button>
      <div className="w-px h-6 bg-white/10 mx-1 self-center" />
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
        className={`p-2 rounded-lg transition-all ${editor.isActive('heading', { level: 1 }) ? 'bg-violet-500/20 text-violet-400' : 'text-white/40 hover:text-white hover:bg-white/5'}`}
      >
        <Heading1 className="w-4 h-4" />
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        className={`p-2 rounded-lg transition-all ${editor.isActive('heading', { level: 2 }) ? 'bg-violet-500/20 text-violet-400' : 'text-white/40 hover:text-white hover:bg-white/5'}`}
      >
        <Heading2 className="w-4 h-4" />
      </button>
      <div className="w-px h-6 bg-white/10 mx-1 self-center" />
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className={`p-2 rounded-lg transition-all ${editor.isActive('bulletList') ? 'bg-violet-500/20 text-violet-400' : 'text-white/40 hover:text-white hover:bg-white/5'}`}
      >
        <List className="w-4 h-4" />
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        className={`p-2 rounded-lg transition-all ${editor.isActive('orderedList') ? 'bg-violet-500/20 text-violet-400' : 'text-white/40 hover:text-white hover:bg-white/5'}`}
      >
        <ListOrdered className="w-4 h-4" />
      </button>
      <div className="w-px h-6 bg-white/10 mx-1 self-center" />
      <button
        type="button"
        onClick={addLink}
        className={`p-2 rounded-lg transition-all ${editor.isActive('link') ? 'bg-violet-500/20 text-violet-400' : 'text-white/40 hover:text-white hover:bg-white/5'}`}
      >
        <LinkIcon className="w-4 h-4" />
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
        className={`p-2 rounded-lg transition-all ${editor.isActive('blockquote') ? 'bg-violet-500/20 text-violet-400' : 'text-white/40 hover:text-white hover:bg-white/5'}`}
      >
        <Quote className="w-4 h-4" />
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleCodeBlock().run()}
        className={`p-2 rounded-lg transition-all ${editor.isActive('codeBlock') ? 'bg-violet-500/20 text-violet-400' : 'text-white/40 hover:text-white hover:bg-white/5'}`}
      >
        <Code className="w-4 h-4" />
      </button>
      <div className="w-px h-6 bg-white/10 mx-1 self-center" />
      <button
        type="button"
        onClick={() => editor.chain().focus().unsetAllMarks().clearNodes().run()}
        className="p-2 rounded-lg text-white/40 hover:text-red-400 hover:bg-red-400/10 transition-all"
        title="Clear Formatting"
      >
        <Eraser className="w-4 h-4" />
      </button>
    </div>
  );
};

const RichTextEditor: React.FC<RichTextEditorProps> = ({ value, onChange, placeholder }) => {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-cyan-400 underline decoration-cyan-400/30 hover:text-cyan-300 transition-colors cursor-pointer',
        },
      }),
    ],
    content: value,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: 'prose prose-invert max-w-none min-h-[150px] p-4 focus:outline-none text-white/80 text-sm leading-relaxed ql-editor-style',
      },
    },
  });

  // Sync content if value changes externally (e.g. on load)
  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value);
    }
  }, [value, editor]);

  return (
    <div className="relative bg-[#0c0c1e]/50 border border-white/10 rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-violet-500/30 transition-all shadow-inner">
      <MenuBar editor={editor} />
      <EditorContent editor={editor} />
      {!editor?.getText() && (
        <div className="absolute top-[68px] left-4 pointer-events-none text-white/20 text-xs font-medium uppercase tracking-widest italic">
          {placeholder || 'Begin engineering report...'}
        </div>
      )}
    </div>
  );
};

export default RichTextEditor;
