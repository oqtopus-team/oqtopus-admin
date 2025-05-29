import {
  $createTextNode,
  $getSelection,
  $isRangeSelection,
  COMMAND_PRIORITY_LOW,
  KEY_ENTER_COMMAND,
  LexicalCommand,
} from 'lexical';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { mergeRegister } from '@lexical/utils';
import { useEffect } from 'react';
import { INSERT_ORDERED_LIST_COMMAND } from '@lexical/list';

const insertOrderedListCommand: LexicalCommand<null> = INSERT_ORDERED_LIST_COMMAND;

export default function MarkdownOrderedListPlugin() {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    return mergeRegister(
      editor.registerCommand(
        insertOrderedListCommand,
        () => {
          editor.update(() => {
            const selection = $getSelection();
            if (!$isRangeSelection(selection) || !selection.isCollapsed()) return false;

            const anchorNode = selection.anchor.getNode();
            const currentParagraph = anchorNode.getTopLevelElementOrThrow();
            const text = currentParagraph.getTextContent();

            const match = text.match(/^(\d+)\.\s+/);
            if (match) {
              const prefixLength = match[0].length;
              currentParagraph.clear();
              currentParagraph.append($createTextNode(text.slice(prefixLength)));
            } else {
              currentParagraph.clear();
              currentParagraph.append($createTextNode('1. ' + text));
            }

            currentParagraph.selectEnd();
          });

          return true;
        },
        COMMAND_PRIORITY_LOW
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

              if (/^\d+\.\s*$/.test(prevText)) {
                previousSibling.remove();
                commandHandled = true;
                return;
              }

              const match = prevText.match(/^(\d+)\.\s+/);
              if (match) {
                const prevNumber = parseInt(match[1], 10);
                const nextNumber = prevNumber + 1;

                currentParagraph.clear();
                currentParagraph.append($createTextNode(`${nextNumber}. `));
                currentParagraph.selectEnd();
                commandHandled = true;
                return;
              }
            }
          });

          return commandHandled;
        },
        COMMAND_PRIORITY_LOW
      ),
    );
  }, [editor]);

  return null;
}
