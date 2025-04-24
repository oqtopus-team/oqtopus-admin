import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { LexicalComposer } from '@lexical/react/LexicalComposer';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import { LexicalErrorBoundary } from '@lexical/react/LexicalErrorBoundary';
import PreviewSyncPlugin from './plugins/PreviewSyncPlugin';
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin';
import { ListPlugin } from '@lexical/react/LexicalListPlugin';
import { LinkPlugin } from '@lexical/react/LexicalLinkPlugin';
import { editorPreviewConfig } from './editorSettings';
import { CheckListPlugin } from '@lexical/react/LexicalCheckListPlugin';

const EditorPreview = () => {
  const [editor] = useLexicalComposerContext();

  return (
    <LexicalComposer initialConfig={editorPreviewConfig}>
      <RichTextPlugin contentEditable={<ContentEditable />} ErrorBoundary={LexicalErrorBoundary} />
      <PreviewSyncPlugin editor={editor} />
      <HistoryPlugin />
      <ListPlugin />
      <LinkPlugin />
      <CheckListPlugin />
    </LexicalComposer>
  );
};

export default EditorPreview;
