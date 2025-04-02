import React, { useState } from 'react';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { $getSelection, $isRangeSelection, FORMAT_TEXT_COMMAND } from 'lexical';
import { FaListUl, FaListOl, FaLink, FaQuoteRight } from 'react-icons/fa';
import { $wrapNodes } from '@lexical/selection';
import { $createQuoteNode } from '@lexical/rich-text';
import { TOGGLE_LINK_COMMAND } from '@lexical/link';
import { ButtonGroup } from 'react-bootstrap';
import Button from 'react-bootstrap/Button';
import Stack from 'react-bootstrap/Stack';
import Form from 'react-bootstrap/Form';
import { INSERT_ORDERED_LIST_COMMAND, INSERT_UNORDERED_LIST_COMMAND } from '@lexical/list';
import MarkdownPlugin from './plugins/MarkdownPlugin';
import { useEditorContext } from './EditorContext';

export function ToolbarPlugin() {
  const { isMarkdownModeActive, setMarkdownModeActive } = useEditorContext();
  const [editor] = useLexicalComposerContext();
  const [linkUrl, setLinkUrl] = useState('');
  const [showLinkInput, setShowLinkInput] = useState(false);

  const formatBold = () => {
    editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'bold');
  };

  const formatItalic = () => {
    editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'italic');
  };

  const formatUnderline = () => {
    editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'underline');
  };

  const formatStrikethrough = () => {
    editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'strikethrough');
    save();
  };

  const formatQuote = () => {
    editor.update(() => {
      const selection = $getSelection();
      if ($isRangeSelection(selection)) {
        $wrapNodes(selection, () => $createQuoteNode());
      }
    });
  };

  const toggleLinkInput = () => {
    setShowLinkInput(!showLinkInput);
    if (showLinkInput) {
      setLinkUrl('');
    }
  };

  const formatNumberedList = () => {
    editor.dispatchCommand(INSERT_ORDERED_LIST_COMMAND, undefined);
  };

  const formatBulletList = () => {
    editor.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND, undefined);
  };

  const insertLink = () => {
    if (linkUrl) {
      editor.dispatchCommand(TOGGLE_LINK_COMMAND, {
        url: linkUrl,
        target: '_blank',
      });
      setShowLinkInput(false);
      setLinkUrl('');
    }
  };

  const save = () => {};

  return (
    <Stack direction="horizontal" gap={3}>
      <ButtonGroup>
        <Button
          disabled={isMarkdownModeActive}
          variant="outline-primary"
          onClick={formatBold}
          className="toolbar-item"
          aria-label="Format Bold"
        >
          <strong>B</strong>
        </Button>
        <Button
          disabled={isMarkdownModeActive}
          variant="outline-primary"
          onClick={formatItalic}
          className="toolbar-item"
          aria-label="Format Italic"
        >
          <em>I</em>
        </Button>
        <Button
          disabled={isMarkdownModeActive}
          variant="outline-primary"
          onClick={formatUnderline}
          className="toolbar-item"
          aria-label="Format Underline"
        >
          <u>U</u>
        </Button>
        <Button
          disabled={isMarkdownModeActive}
          variant="outline-primary"
          onClick={formatStrikethrough}
          aria-label="Format Strikethrough"
        >
          <s>S</s>
        </Button>
      </ButtonGroup>

      <ButtonGroup>
        <Button
          disabled={isMarkdownModeActive}
          variant="outline-primary"
          onClick={formatQuote}
          className="toolbar-item"
          aria-label="Format Quote"
        >
          <FaQuoteRight />
        </Button>
        <Button
          disabled={isMarkdownModeActive}
          variant="outline-primary"
          active={showLinkInput}
          onClick={toggleLinkInput}
          className="toolbar-item"
          aria-label={showLinkInput ? 'Cancel Link' : 'Insert Link'}
        >
          <FaLink />
        </Button>
      </ButtonGroup>
      {showLinkInput && (
        <div className="link-input">
          <Form.Control
            type="text"
            value={linkUrl}
            onChange={(e) => setLinkUrl(e.target.value)}
            placeholder="Enter URL..."
          />
          <Button disabled={isMarkdownModeActive} variant="outline-primary" onClick={insertLink}>
            Add
          </Button>
        </div>
      )}
      <ButtonGroup>
        <Button
          disabled={isMarkdownModeActive}
          variant="outline-primary"
          onClick={formatNumberedList}
          className="toolbar-item"
          aria-label="Numbered List"
        >
          <span>
            <FaListOl />
          </span>
        </Button>
        <Button
          disabled={isMarkdownModeActive}
          variant="outline-primary"
          onClick={formatBulletList}
          className="toolbar-item"
          aria-label="Bullet List"
        >
          <span>
            <FaListUl />
          </span>
        </Button>
      </ButtonGroup>
      <ButtonGroup>
        <MarkdownPlugin isMarkdownModeActive={isMarkdownModeActive} setMarkdownActive={setMarkdownModeActive} />
      </ButtonGroup>
    </Stack>
  );
}
