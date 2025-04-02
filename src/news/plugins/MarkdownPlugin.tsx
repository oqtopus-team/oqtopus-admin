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
  isMarkdownModeActive: boolean;
  setMarkdownActive: (active: boolean) => void;
}

const MarkdownPlugin = ({ isMarkdownModeActive, setMarkdownActive }: MarkdownPluginProps) => {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    setMarkdownActive(isMarkdownModeActive);
  }, [isMarkdownModeActive]);

  const toggleMarkdown = useCallback(() => {
    editor.update(() => {
      const root = $getRoot();
      const firstChild = root.getFirstChild();

      const markdown = $convertToMarkdownString(
        TRANSFORMERS,
        undefined, // node
        false
      );
      if (!isMarkdownModeActive) {
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
            false
          );
        });
        setMarkdownActive(false);
      }
    });
  }, [editor, isMarkdownModeActive]);

  return (
    <Button
      onClick={toggleMarkdown}
      variant={isMarkdownModeActive ? 'primary' : 'outline-primary'}
      className="toolbar-item"
      aria-label="Bullet List"
    >
      {isMarkdownModeActive ? <TbMarkdownOff /> : <TbMarkdown />}
    </Button>
  );
};

export default MarkdownPlugin;
