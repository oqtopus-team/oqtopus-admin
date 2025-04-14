import React, { useState } from 'react';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { FORMAT_TEXT_COMMAND } from 'lexical';
import { FaLink, FaListOl, FaListUl, FaQuoteRight } from 'react-icons/fa';
import { TOGGLE_LINK_COMMAND } from '@lexical/link';
import { ButtonGroup } from 'react-bootstrap';
import Button from 'react-bootstrap/Button';
import Stack from 'react-bootstrap/Stack';
import Form from 'react-bootstrap/Form';
import { INSERT_ORDERED_LIST_COMMAND, INSERT_UNORDERED_LIST_COMMAND } from '@lexical/list';
import { formatQuote } from './helpers';

export function ToolbarPlugin() {
  const [editor] = useLexicalComposerContext();
  const [linkUrl, setLinkUrl] = useState('https://');
  const [showLinkInput, setShowLinkInput] = useState(false);

  const insertBold = () => {
    editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'bold');
  };

  const formatItalic = () => {
    editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'italic');
  };

  const formatStrikethrough = () => {
    editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'strikethrough');
    save();
  };

  const formatQuoteFunc = () => {
    formatQuote(editor);
  };

  const toggleLinkInput = () => {
    setShowLinkInput(!showLinkInput);
    if (showLinkInput) {
      setLinkUrl('https://');
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
      setLinkUrl('https://');
    }
  };

  const save = () => {};

  return (
    <Stack direction="horizontal" gap={3}>
      <ButtonGroup>
        <Button
          variant="outline-primary"
          onClick={insertBold}
          className="toolbar-item"
          aria-label="Format Bold"
        >
          <strong>B</strong>
        </Button>
        <Button
          variant="outline-primary"
          onClick={formatItalic}
          className="toolbar-item"
          aria-label="Format Italic"
        >
          <em>I</em>
        </Button>
        <Button
          variant="outline-primary"
          onClick={formatStrikethrough}
          aria-label="Format Strikethrough"
        >
          <s>S</s>
        </Button>
      </ButtonGroup>

      <ButtonGroup>
        <Button
          variant="outline-primary"
          onClick={formatQuoteFunc}
          className="toolbar-item"
          aria-label="Format Quote"
        >
          <FaQuoteRight />
        </Button>
        <Button
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
          <Button variant="outline-primary" onClick={insertLink}>
            Add
          </Button>
        </div>
      )}
      <ButtonGroup>
        <Button
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
    </Stack>
  );
}
