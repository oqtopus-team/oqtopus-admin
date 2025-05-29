import { useEffect, useRef } from 'react';
import { $getRoot, $createTextNode, COMMAND_PRIORITY_HIGH, FORMAT_TEXT_COMMAND, type LexicalEditor } from 'lexical';
import { $convertFromMarkdownString, TRANSFORMERS, CHECK_LIST, ElementTransformer } from '@lexical/markdown';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { TOGGLE_LINK_COMMAND } from '@lexical/link';
import { formatLink, toggleMarkdownFormat } from '../helpers';
import { $createListItemNode, $createListNode, ListItemNode, ListNode } from '@lexical/list';

interface PreviewSyncPluginProps {
  editor: LexicalEditor;
}

const MARKDOWN_CHECK_LIST_TRANSFORMER: ElementTransformer = {
  dependencies: [ListNode, ListItemNode],
  export: (node, traverseChildren) => {
    if (!node.isInline()) {
      return traverseChildren(node as any);
    }
    return null;
  },
  regExp: /^[-*]\s*\[([x ])]\s+/,
  replace: (parentNode, children, match, isImport) => {
    const listNode = $createListNode('check');
    const isChecked = match[1] === 'x';
    const listItemNode = $createListItemNode(isChecked);

    const textContent = match.input?.replace(/^[-*]\s*\[(x| )\]\s+/, '') || '';

    const textNode = $createTextNode(textContent);

    listItemNode.append(textNode);

    listNode.append(listItemNode);

    parentNode.replace(listNode);

    return true;
  },
  type: 'element',
};

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
  const observerRef = useRef<MutationObserver | null>(null);

  const transformChecklistItems = (element: HTMLElement) => {
    if (element.hasAttribute('data-checklist-processed')) {
      return;
    }

    const checklistItems = element.querySelectorAll('.editor-listitem[value="checked"], .editor-listitem[value="unchecked"]');

    checklistItems.forEach((item) => {
      if (item.parentElement?.hasAttribute('data-checklist-processed')) {
        return;
      }


      // Functionality for announcements feed component
      const isChecked = item.getAttribute('value') === 'checked';

      const checkbox = document.createElement('input');
      checkbox.type = 'checkbox';
      checkbox.checked = isChecked;
      checkbox.style.display = 'none';

      item.addEventListener('click', (e) => {
        const newCheckedState = !checkbox.checked;
        checkbox.checked = newCheckedState;

        item.setAttribute('value', newCheckedState ? 'checked' : 'unchecked');

        editor.update(() => {
          const root = $getRoot();
          const text = root.getTextContent();

          const lines = text.split('\n');
          const index = Array.from(element.querySelectorAll('.editor-listitem')).indexOf(item as HTMLElement);

          if (index >= 0 && index < lines.length) {
            const line = lines[index];
            const newLine = line.replace(
              /^(-\s*\[)([x ]?)(\].*)$/,
              (_, start, __, end) => `${start}${newCheckedState ? 'x' : ' '}${end}`
            );

            lines[index] = newLine;

            const newText = lines.join('\n');
            root.clear();
            root.append($createTextNode(newText));
          }
        });

        e.stopPropagation();
      });

      item.prepend(checkbox);

      item.setAttribute('data-checklist-processed', 'true');
      if (item.parentElement) {
        item.parentElement.setAttribute('data-checklist-processed', 'true');
      }
    });

    element.setAttribute('data-checklist-processed', 'true');
  };

  useEffect(() => {
    observerRef.current = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'childList') {
          mutation.addedNodes.forEach((node) => {
            if (node.nodeType === Node.ELEMENT_NODE) {
              transformChecklistItems(node as HTMLElement);
            }
          });
        }
      });
    });

    const previewElement = document.querySelector('.editor-preview');
    if (previewElement) {
      observerRef.current.observe(previewElement, {
        childList: true,
        subtree: true,
      });

      transformChecklistItems(previewElement as HTMLElement);
    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [editor]);

  useEffect(() => {
    const removeListener = editor.registerUpdateListener(({ editorState }) => {
      editorState.read(() => {
        const root = $getRoot();
        const textContent = root.getTextContent();

        previewEditor.update(() => {
          const root = $getRoot();
          root.clear();
          $convertFromMarkdownString(textContent || '', [MARKDOWN_CHECK_LIST_TRANSFORMER, ...TRANSFORMERS], undefined, false);
        });
      });
    });

    return removeListener;
  }, [editor, previewEditor]);

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
