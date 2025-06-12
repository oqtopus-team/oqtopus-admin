import {
  $createTextNode,
  $getSelection,
  $isRangeSelection, COMMAND_PRIORITY_HIGH,
  COMMAND_PRIORITY_LOW, ElementNode,
  KEY_ENTER_COMMAND,
  KEY_TAB_COMMAND,
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
            const previousSibling = currentParagraph.getPreviousSibling() as ElementNode

            if (previousSibling && previousSibling.getType() === 'paragraph') {
              const prevText = previousSibling.getTextContent();

              const emptyListItemMatch = prevText.match(/^(\s*)(\d+)\.\s*$/);
              if (emptyListItemMatch) {
                const indentation = emptyListItemMatch[1];
                const number = emptyListItemMatch[2];

                if (indentation.length >= 4) {
                  const newIndentation = indentation.slice(4);

                  previousSibling.clear();
                  previousSibling.append($createTextNode(newIndentation + number + '. '));
                  previousSibling.selectEnd();
                } else {
                  previousSibling.remove();
                }

                commandHandled = true;
                return;
              }

              const match = prevText.match(/^(\s*)(\d+)\.\s+/);
              if (match) {
                const indentation = match[1];
                const prevNumber = parseInt(match[2], 10);
                const nextNumber = prevNumber + 1;

                currentParagraph.clear();
                currentParagraph.append($createTextNode(`${indentation}${nextNumber}. `));
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
      editor.registerCommand(KEY_TAB_COMMAND, (event) => {
        let commandHandled = false;

        editor.update(() => {
          const selection = $getSelection();
          if (!$isRangeSelection(selection) || !selection.isCollapsed()) return;

          const anchorNode = selection.anchor.getNode();
          const currentParagraph = anchorNode.getTopLevelElementOrThrow();
          const currentParagraphText = currentParagraph.getTextContent();

          const match = currentParagraphText.match(/^(\s*)(\d+)\./);
          if (match) {
            const currentIndentation = match[1];
            const number = match[2];

            const newIndentation = currentIndentation + '    ';

            currentParagraph.clear();
            currentParagraph.append($createTextNode(newIndentation + number + '. '));
            currentParagraph.selectEnd();
            commandHandled = true;
            if (event) {
              // Prevent changing focus to browser buttons
              event.preventDefault();
            }
            return;
          }
        });

        return commandHandled;
      }, COMMAND_PRIORITY_HIGH),
    );
  }, [editor]);

  return null;
}
