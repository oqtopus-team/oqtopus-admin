import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { useEffect, useState } from 'react';
import { $generateHtmlFromNodes } from '@lexical/html';

interface PostPreviewProps {
  title: string;
}

const EditorPreview = ({title}: PostPreviewProps) => {
  const [editor] = useLexicalComposerContext();
  const [htmlString, setHtmlString] = useState('')

  useEffect(() => {
    return editor.registerUpdateListener(({ editorState }) => {
      editorState.read(() => {
        const htmlString = $generateHtmlFromNodes(editor);
        setHtmlString(htmlString)
      });
    });
  }, [editor]);

  return  <div className="editor-preview">
    <span className="editor-preview-title">{title}</span>
    <div
      dangerouslySetInnerHTML={{ __html: htmlString }}
      className="editor-preview-content"
    />
  </div>
}

export default EditorPreview