import { useEffect } from 'react';
import { $getRoot, type LexicalEditor } from 'lexical';
import { $convertFromMarkdownString, TRANSFORMERS } from '@lexical/markdown';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';

interface PreviewSyncPluginProps {
  editor: LexicalEditor;
  isMarkdownModeActive: boolean;
}

const PreviewSyncPlugin = ({ editor, isMarkdownModeActive }: PreviewSyncPluginProps) => {
  const [previewEditor] = useLexicalComposerContext();

  useEffect(() => {
    const removeListener = editor.registerUpdateListener(({ editorState }) => {
      editorState.read(() => {
        const root = $getRoot();
        const firstChildContent = root.getFirstChild()?.getTextContent();

        if (isMarkdownModeActive) {
          previewEditor.update(() => {
            const root = $getRoot();
            root.clear();
            $convertFromMarkdownString(firstChildContent || '', TRANSFORMERS, undefined, false);
          });
        } else {
          editorState.read(() => {
            const serializedState = editorState.toJSON();

            previewEditor.update(() => {
              const root = $getRoot();
              root.clear();
            });

            previewEditor.setEditorState(previewEditor.parseEditorState(serializedState));

          });
        }
      });
    });

    return removeListener;
  }, [editor, previewEditor, isMarkdownModeActive]);

  return null;
};

export default PreviewSyncPlugin;
