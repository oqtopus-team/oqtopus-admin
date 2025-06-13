import { useEffect } from 'react';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { $createParagraphNode, $createTextNode, $getRoot } from 'lexical';

interface ComponentProps {
  children: JSX.Element;
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
