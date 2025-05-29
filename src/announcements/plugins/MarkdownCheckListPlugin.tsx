import { useEffect } from 'react';
import {
  $createTextNode,
  $getSelection,
  $isRangeSelection,
  COMMAND_PRIORITY_HIGH,
  KEY_ENTER_COMMAND,
} from 'lexical';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { mergeRegister } from '@lexical/utils';
import { INSERT_CHECK_LIST_COMMAND } from '@lexical/list';

export default function MarkdownCheckListPlugin() {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    return mergeRegister(
      editor.registerCommand(
        INSERT_CHECK_LIST_COMMAND,
        () => {
          editor.update(() => {
            const selection = $getSelection();
            if (!$isRangeSelection(selection) || !selection.isCollapsed()) return false;

            const anchorNode = selection.anchor.getNode();
            const currentParagraph = anchorNode.getTopLevelElementOrThrow();
            const text = currentParagraph.getTextContent();

            if (text.startsWith('- [ ]')) {
              currentParagraph.clear();
              currentParagraph.append($createTextNode(text.slice(5)));
            } else {
              currentParagraph.clear();
              currentParagraph.append($createTextNode('- [ ] ' + text));
            }

            currentParagraph.selectEnd();
          });

          return true;
        },
        COMMAND_PRIORITY_HIGH
      ),
      editor.registerCommand(
        KEY_ENTER_COMMAND,
        () => {
          let commandHandled = false;

          editor.update(() => {
            const selection = $getSelection();
            if (!$isRangeSelection(selection) || !selection.isCollapsed()) return;

            const anchorNode = selection.anchor.getNode();
            const currentParagraph = anchorNode.getTopLevelElementOrThrow();
            const previousSibling = currentParagraph.getPreviousSibling();

            if (previousSibling && previousSibling.getType() === 'paragraph') {
              const prevText = previousSibling.getTextContent();

              if (prevText === '- [ ]' || prevText === '- [ ] ') {
                previousSibling.remove();
                commandHandled = true;
                return;
              }

              if (prevText.startsWith('- [ ]')) {
                currentParagraph.clear();
                currentParagraph.append($createTextNode('- [ ] '));
                currentParagraph.selectEnd();
                commandHandled = true;
                return;
              }
            }
          });

          return commandHandled;
        },
        COMMAND_PRIORITY_HIGH
      )
    );
  }, [editor]);

  return null;
}
