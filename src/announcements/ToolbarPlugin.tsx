import React, { useState } from 'react';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { FORMAT_TEXT_COMMAND, type LexicalCommand } from 'lexical';
import { FaCode, FaLink, FaListOl, FaListUl, FaQuoteRight, FaRegCheckSquare } from 'react-icons/fa';
import { TOGGLE_LINK_COMMAND } from '@lexical/link';
import { ButtonGroup } from 'react-bootstrap';
import Button from 'react-bootstrap/Button';
import Stack from 'react-bootstrap/Stack';
import Form from 'react-bootstrap/Form';
import {
  INSERT_CHECK_LIST_COMMAND,
  INSERT_ORDERED_LIST_COMMAND,
  INSERT_UNORDERED_LIST_COMMAND,
} from '@lexical/list';
import { formatQuote } from './helpers';
import { Select } from '../common/Select';
import { INSERT_CODE_BLOCK_COMMAND } from './plugins/MarkdownCodeBlockPlugin';

export const PROGRAMMING_LANGUAGES = {
  c: 'C',
  clike: 'C-like',
  cpp: 'C++',
  css: 'CSS',
  html: 'HTML',
  java: 'Java',
  javascript: 'JavaScript',
  markdown: 'Markdown',
  objectivec: 'Objective-C',
  plaintext: 'Plain Text',
  powershell: 'PowerShell',
  python: 'Python',
  rust: 'Rust',
  sql: 'SQL',
  swift: 'Swift',
  typescript: 'TypeScript',
  xml: 'XML',
};

export function ToolbarPlugin() {
  const [editor] = useLexicalComposerContext();
  const [linkUrl, setLinkUrl] = useState('https://');
  const [showLinkInput, setShowLinkInput] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState(PROGRAMMING_LANGUAGES.javascript);

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

  const insertNumberedList = () => {
    editor.dispatchCommand(INSERT_ORDERED_LIST_COMMAND, undefined);
  };

  const insertBulletList = () => {
    editor.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND, undefined);
  };

  const insertCheckList = () => {
    editor.dispatchCommand(INSERT_CHECK_LIST_COMMAND, undefined);
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

  const insertCode = () => {
    const languageKey =
      Object.entries(PROGRAMMING_LANGUAGES).find(([, value]) => value === currentLanguage)?.[0] ||
      currentLanguage.toLowerCase();

    editor.dispatchCommand(INSERT_CODE_BLOCK_COMMAND, languageKey);
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
          onClick={insertNumberedList}
          className="toolbar-item"
          aria-label="Numbered List"
        >
          <span>
            <FaListOl />
          </span>
        </Button>
        <Button
          variant="outline-primary"
          onClick={insertBulletList}
          className="toolbar-item"
          aria-label="Bullet List"
        >
          <span>
            <FaListUl />
          </span>
        </Button>
        <Button
          variant="outline-primary"
          onClick={insertCheckList}
          className="toolbar-item"
          aria-label="Check List"
        >
          <span>
            <FaRegCheckSquare />
          </span>
        </Button>
      </ButtonGroup>
      <ButtonGroup>
        <Button
          variant="outline-primary"
          onClick={insertCode}
          className="toolbar-item"
          aria-label="Code Block"
        >
          <span>
            <FaCode />
          </span>
        </Button>
      </ButtonGroup>
      <ButtonGroup>
        <Select
          value={currentLanguage}
          defaultValue={currentLanguage}
          onChange={(e) => {
            const language = (e.target as unknown as { value: string }).value;
            setCurrentLanguage(language);
          }}
          className="border-primary text-primary"
        >
          {Object.values(PROGRAMMING_LANGUAGES).map((value) => (
            <option key={value} value={value} className="text-black">
              {value}
            </option>
          ))}
        </Select>
      </ButtonGroup>
    </Stack>
  );
}
