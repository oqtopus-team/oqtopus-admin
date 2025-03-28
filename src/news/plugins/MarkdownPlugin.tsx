import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { useCallback, useEffect } from 'react';
import {
  $convertFromMarkdownString,
  $convertToMarkdownString,
  TRANSFORMERS,
} from '@lexical/markdown';
import { $createTextNode, $getRoot } from 'lexical';
import { $createCodeNode } from '@lexical/code';
import Button from 'react-bootstrap/Button';
import { TbMarkdown, TbMarkdownOff } from 'react-icons/tb';

interface MarkdownPluginProps {
  isMarkdownActive: boolean;
  setMarkdownActive: (active: boolean) => void;
}

const MarkdownPlugin = ({ isMarkdownActive, setMarkdownActive }: MarkdownPluginProps) => {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    setMarkdownActive(isMarkdownActive);
  }, [isMarkdownActive]);

  const toggleMarkdown = useCallback(() => {
    editor.update(() => {
      const root = $getRoot();
      const firstChild = root.getFirstChild();

      const markdown = $convertToMarkdownString(
        TRANSFORMERS,
        undefined, // node
        false
      );
      if (!isMarkdownActive) {
        const codeNode = $createCodeNode('markdown');
        codeNode.append($createTextNode(markdown));
        root.clear().append(codeNode);
        if (markdown.length === 0) {
          codeNode.select();
        }
        setMarkdownActive(true);
      } else {
        editor.update(() => {
          if (!firstChild) return;
          $convertFromMarkdownString(
            firstChild.getTextContent(),
            TRANSFORMERS,
            undefined, // node
            true
          );
        });
        setMarkdownActive(false);
      }
    });
  }, [editor, isMarkdownActive]);

  return (
    <Button
      onClick={toggleMarkdown}
      variant={isMarkdownActive ? 'primary' : 'outline-primary'}
      className="toolbar-item"
      aria-label="Bullet List"
    >
      {isMarkdownActive ? <TbMarkdownOff /> : <TbMarkdown />}
    </Button>
  );
};

export default MarkdownPlugin;
