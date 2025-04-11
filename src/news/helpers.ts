import { $getSelection, $isRangeSelection, LexicalEditor } from 'lexical';

export function toggleMarkdownFormat(editor: LexicalEditor, formatMarkers: string) {
  editor.update(() => {
    const selection = $getSelection();

    if (!$isRangeSelection(selection)) {
      return;
    }

    if (!selection.isCollapsed()) {
      const selectedText = selection.getTextContent();

      if (
        selectedText.startsWith(formatMarkers) &&
        selectedText.endsWith(formatMarkers) &&
        selectedText.length >= formatMarkers.length * 2
      ) {
        const unformattedText = selectedText.slice(
          formatMarkers.length,
          selectedText.length - formatMarkers.length
        );
        selection.insertText(unformattedText);
      } else {
        selection.insertText(`${formatMarkers}${selectedText}${formatMarkers}`);
      }
      return;
    }

    const node = selection.anchor.getNode();

    if (!node || !node.isAttached()) {
      console.warn('Invalid node or node not attached to editor');
      return;
    }

    const textContent = node.getTextContent();
    const cursorOffset = selection.anchor.offset;

    const isWithinFormatted = isCaretInsideMarkdownFormat(textContent, cursorOffset, formatMarkers);

    if (isWithinFormatted) {
      const formattedRange = findFormattedTextRange(textContent, cursorOffset, formatMarkers);
      if (!formattedRange) return;

      const { start, end, textStart, textEnd } = formattedRange;
      const formattedText = textContent.substring(textStart, textEnd);

      try {
        selection.anchor.set(node.getKey(), start, 'text');
        selection.focus.set(node.getKey(), end, 'text');

        selection.insertText(formattedText);

        const newPosition = Math.max(
          start,
          Math.min(start + formattedText.length, start + (cursorOffset - textStart))
        );
        selection.anchor.set(node.getKey(), newPosition, 'text');
        selection.focus.set(node.getKey(), newPosition, 'text');
      } catch (error) {
        console.error('Error removing Markdown formatting:', error);
      }
    } else {
      const wordBoundaries = findWordBoundaries(textContent, cursorOffset);
      if (!wordBoundaries) return;

      const { start, end } = wordBoundaries;
      const word = textContent.substring(start, end);

      try {
        selection.anchor.set(node.getKey(), start, 'text');
        selection.focus.set(node.getKey(), end, 'text');

        selection.insertText(`${formatMarkers}${word}${formatMarkers}`);

        const newOffset = start + formatMarkers.length + (cursorOffset - start);
        selection.anchor.set(node.getKey(), newOffset, 'text');
        selection.focus.set(node.getKey(), newOffset, 'text');
      } catch (error) {
        console.error('Error applying Markdown formatting:', error);
      }
    }
  });
}

export function isCaretInsideMarkdownFormat(text:string, offset: number, markers: string) {
  const lastMarkerBeforeCursor = findLastMarkerBeforeCursor(text, offset, markers);
  if (lastMarkerBeforeCursor === -1) return false;

  const firstMarkerAfterCursor = findFirstMarkerAfterCursor(text, offset, markers);
  if (firstMarkerAfterCursor === -1) return false;

  const middleText = text.substring(
    lastMarkerBeforeCursor + markers.length,
    firstMarkerAfterCursor
  );
  return !middleText.includes(markers);
}

export function findLastMarkerBeforeCursor(text:string, offset: number, markers: string) {
  let position = -1;
  let index = 0;

  while (index < offset) {
    const found = text.indexOf(markers, index);
    if (found === -1 || found >= offset) break;

    position = found;
    index = position + markers.length;
  }

  return position;
}

export function findFirstMarkerAfterCursor(text:string, offset: number, markers: string) {
  return text.indexOf(markers, offset);
}

export function findFormattedTextRange(text:string, offset: number, markers: string) {
  const lastMarkerBeforeCursor = findLastMarkerBeforeCursor(text, offset, markers);
  if (lastMarkerBeforeCursor === -1) return null;

  const firstMarkerAfterCursor = findFirstMarkerAfterCursor(text, offset, markers);
  if (firstMarkerAfterCursor === -1) return null;

  const middleText = text.substring(
    lastMarkerBeforeCursor + markers.length,
    firstMarkerAfterCursor
  );
  if (middleText.includes(markers)) return null;

  return {
    start: lastMarkerBeforeCursor,
    end: firstMarkerAfterCursor + markers.length,
    textStart: lastMarkerBeforeCursor + markers.length,
    textEnd: firstMarkerAfterCursor,
  };
}

export function findWordBoundaries(text:string, cursorOffset: number) {
  if (!text) return null;

  let start = cursorOffset;
  while (start > 0 && !/\s/.test(text.charAt(start - 1))) {
    start--;
  }

  let end = cursorOffset;
  while (end < text.length && !/\s/.test(text.charAt(end))) {
    end++;
  }

  if (start !== end) {
    return { start, end };
  }

  return null;
}

export function formatLink(editor: LexicalEditor, payload: string | { url: string }) {
  editor.update(() => {
    const selection = $getSelection();

    if (!$isRangeSelection(selection) || selection.isCollapsed()) {
      return false;
    }

    const selectedText = selection.getTextContent();
    if (!selectedText.trim()) {
      return false;
    }

    const url = typeof payload === 'string' ? payload : payload?.url ?? '';
    if (!url) {
      return false;
    }

    const markdownLink = `[${selectedText}](${url})`;
    selection.insertText(markdownLink);
  });
}

export function formatQuote(editor: LexicalEditor) {
  editor.update(() => {
    const selection = $getSelection();
    if (!$isRangeSelection(selection)) {
      return;
    }

    const selectedText = selection.getTextContent();

    const isAlreadyQuote = selectedText
      .split('\n')
      .every((line) => line.trim().startsWith('> ') || line.trim() === '');

    if (isAlreadyQuote) {
      const unformattedText = selectedText
        .split('\n')
        .map((line) => (line.trim().startsWith('> ') ? line.substring(2) : line))
        .join('\n');

      selection.insertText(unformattedText);
    } else {
      const formattedText = selectedText
        .split('\n')
        .map((line) => (line.trim() ? `> ${line}` : line))
        .join('\n');

      selection.insertText(formattedText);
    }
  });
}
