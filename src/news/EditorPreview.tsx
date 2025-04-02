import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { editorConfig } from './editorSettings';
import { InitialConfigType, LexicalComposer } from '@lexical/react/LexicalComposer';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import { LexicalErrorBoundary } from '@lexical/react/LexicalErrorBoundary';
import PreviewSyncPlugin from './plugins/PreviewSyncPlugin';
import { useEditorContext } from './EditorContext';
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin';
import { ListPlugin } from '@lexical/react/LexicalListPlugin';
import { LinkPlugin } from '@lexical/react/LexicalLinkPlugin';
import { CheckListPlugin } from '@lexical/react/LexicalCheckListPlugin';

const previewConfig: InitialConfigType = {
  ...editorConfig,
  namespace: 'PreviewEditor',
  editable: false,
};

const EditorPreview = () => {
  const { isMarkdownModeActive } = useEditorContext();
  const [editor] = useLexicalComposerContext();

  return (
    <LexicalComposer initialConfig={previewConfig}>
      <RichTextPlugin contentEditable={<ContentEditable />} ErrorBoundary={LexicalErrorBoundary} />
      <PreviewSyncPlugin editor={editor} isMarkdownModeActive={isMarkdownModeActive}/>
      <HistoryPlugin />
      <ListPlugin />
      <LinkPlugin />
      <CheckListPlugin />
    </LexicalComposer>
  );
};

export default EditorPreview;
