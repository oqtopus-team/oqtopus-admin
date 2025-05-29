import { useEffect } from 'react';
import {
  $createTextNode,
  $getSelection,
  $isRangeSelection,
  COMMAND_PRIORITY_LOW,
  createCommand,
} from 'lexical';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { mergeRegister } from '@lexical/utils';

export const INSERT_CODE_BLOCK_COMMAND = createCommand<string>();

export default function MarkdownCodeBlockPlugin() {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    return mergeRegister(
      editor.registerCommand(
        INSERT_CODE_BLOCK_COMMAND,
        (language: string) => {
          editor.update(() => {
            const selection = $getSelection();
            if (!$isRangeSelection(selection)) return;

            const anchorNode = selection.anchor.getNode();
            const paragraph = anchorNode.getTopLevelElementOrThrow();
            const text = paragraph.getTextContent();

            const codeBlockPattern = /^```(\w*)\n([\s\S]*?)\n```$/;

            if (codeBlockPattern.test(text)) {
              // If already a code block, extract the code and remove the formatting
              const [, , code] = text.match(codeBlockPattern)!;
              paragraph.clear();
              paragraph.append($createTextNode(code));
            } else {
              // If not a code block, wrap it in a code block
              const newBlock = `\`\`\`${language}\n${text}\n\`\`\``;
              paragraph.clear();
              paragraph.append($createTextNode(newBlock));
            }

            paragraph.selectEnd();
          });

          return true;
        },
        COMMAND_PRIORITY_LOW
      )
    );
  }, [editor]);

  return null;
}
