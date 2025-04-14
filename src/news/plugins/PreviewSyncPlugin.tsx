import { useEffect } from 'react';
import { $getRoot, COMMAND_PRIORITY_HIGH, FORMAT_TEXT_COMMAND, type LexicalEditor } from 'lexical';
import { $convertFromMarkdownString, TRANSFORMERS } from '@lexical/markdown';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { TOGGLE_LINK_COMMAND } from '@lexical/link';
import { formatLink, toggleMarkdownFormat } from '../helpers';

interface PreviewSyncPluginProps {
  editor: LexicalEditor;
}

const MARKDOWN_FORMATS = {
  bold: {
    format: 'bold',
    markers: '**',
    hotkey: 'Ctrl+B',
  },
  italic: {
    format: 'italic',
    markers: '_',
    hotkey: 'Ctrl+I',
  },
  code: {
    format: 'code',
    markers: '`',
    hotkey: 'Ctrl+`',
  },
  strikethrough: {
    format: 'strikethrough',
    markers: '~~',
    hotkey: 'Ctrl+Shift+S',
  },
  underline: {
    format: 'underline',
    markers: '',
    hotkey: 'Ctrl+U',
  },
};

const PreviewSyncPlugin = ({ editor }: PreviewSyncPluginProps) => {
  const [previewEditor] = useLexicalComposerContext();

  useEffect(() => {
    const removeListener = editor.registerUpdateListener(({ editorState }) => {
      editorState.read(() => {
        const root = $getRoot();
        const textContent = root.getTextContent();

        previewEditor.update(() => {
          const root = $getRoot();
          root.clear();
          $convertFromMarkdownString(textContent || '', TRANSFORMERS, undefined, false);
        });
      });
    });

    return removeListener;
  }, [editor, previewEditor]);

  // Intercept "FORMAT_TEXT" command
  useEffect(() => {
    return editor.registerCommand(
      FORMAT_TEXT_COMMAND,
      (formatType) => {
        const formatConfig = Object.values(MARKDOWN_FORMATS).find(
          (config) => config.format === formatType
        );

        if (formatConfig) {
          toggleMarkdownFormat(editor, formatConfig.markers);
          return true;
        }

        return false;
      },
      COMMAND_PRIORITY_HIGH
    );
  }, [editor]);

  // Intercept "TOGGLE_LINK" command
  useEffect(() => {
    return editor.registerCommand(
      TOGGLE_LINK_COMMAND,
      (payload) => {
        if(payload){
          formatLink(editor, payload)
          return true
        }

        return false
      },
      COMMAND_PRIORITY_HIGH
    );
  }, [editor]);

  // Intercept "TOGGLE_LINK" command
  useEffect(() => {
    return editor.registerCommand(
      TOGGLE_LINK_COMMAND,
      (payload) => {
        if(payload){
          formatLink(editor, payload)
          return true
        }

        return false
      },
      COMMAND_PRIORITY_HIGH
    );
  }, [editor]);

  return null;
};

export default PreviewSyncPlugin;
