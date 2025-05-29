import { ReactNode, useEffect } from 'react';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { $getRoot, $createParagraphNode, $createTextNode } from 'lexical';

interface ComponentProps {
  children: ReactNode;
  setEditorState: (editorState: any) => void;
  initialContent?: string;
}

export const ComposerWrapper = ({ children, setEditorState, initialContent }: ComponentProps) => {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    if (initialContent) {
      editor.update(() => {
        const root = $getRoot();
        root.clear();
        const paragraph = $createParagraphNode();
        const text = $createTextNode(initialContent);
        paragraph.append(text);
        root.append(paragraph);
      });
    }
  }, [initialContent, editor]);

  useEffect(() => {
    const removeListener = editor.registerUpdateListener(({ editorState }) => {
      editorState.read(() => {
        const root = $getRoot();
        const textContent = root.getTextContent();

        setEditorState(textContent);
      });
    });

    return removeListener;
  }, [editor, setEditorState]);
  return children;
};
