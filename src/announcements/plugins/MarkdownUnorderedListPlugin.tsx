import { useEffect } from 'react';
import {
  $createTextNode,
  $getSelection,
  $isRangeSelection,
  COMMAND_PRIORITY_HIGH, ElementNode,
  KEY_ENTER_COMMAND,
  KEY_TAB_COMMAND,
  LexicalCommand,
} from 'lexical';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { mergeRegister } from '@lexical/utils';
import { INSERT_UNORDERED_LIST_COMMAND } from '@lexical/list';

const insertOrderedListCommand: LexicalCommand<null> = INSERT_UNORDERED_LIST_COMMAND;

export default function MarkdownUnorderedListPlugin() {
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

            if (text.startsWith('- ')) {
              currentParagraph.clear();
              currentParagraph.append($createTextNode(text.slice(2)));
            } else {
              currentParagraph.clear();
              currentParagraph.append($createTextNode('- ' + text));
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

              if (prevText.includes('- [')) {
                return;
              }

              if (prevText === '-' || prevText === '- ') {
                previousSibling.remove();
                commandHandled = true;
                return;
              }

              const match = prevText.match(/^(\s*)-\s*$/);
              if (match) {
                const indentation = match[1];

                if (indentation.length >= 4) {
                  const newIndentation = indentation.slice(4);

                  previousSibling.clear();
                  previousSibling.append($createTextNode(newIndentation + '- '));
                  previousSibling.selectEnd();
                } else {
                  previousSibling.remove();
                }

                commandHandled = true;
                return;
              }

              const listItemMatch = prevText.match(/^(\s*)-\s+/);
              if (listItemMatch) {
                const indentation = listItemMatch[1];

                currentParagraph.clear();
                currentParagraph.append($createTextNode(indentation + '- '));
                currentParagraph.selectEnd();
                commandHandled = true;
                return;
              }
            }
          });

          return commandHandled;
        },
        COMMAND_PRIORITY_HIGH
      ),
      editor.registerCommand(
        KEY_TAB_COMMAND,
        (event) => {
          let commandHandled = false;

          editor.update(() => {
            const selection = $getSelection();
            if (!$isRangeSelection(selection) || !selection.isCollapsed()) return;

            const anchorNode = selection.anchor.getNode();
            const currentParagraph = anchorNode.getTopLevelElementOrThrow();
            const currentParagraphText = currentParagraph.getTextContent();

            const match = currentParagraphText.match(/^(\s*)-/);
            if (match) {
              const currentIndentation = match[1];

              const newIndentation = currentIndentation + '    ';

              currentParagraph.clear();
              currentParagraph.append($createTextNode(newIndentation + '- '));
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
        },
        COMMAND_PRIORITY_HIGH
      )
    );
  }, [editor]);

  return null;
}
