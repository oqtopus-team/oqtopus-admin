import * as React from 'react';
import { TRANSFORMERS } from '@lexical/markdown';
import {MarkdownShortcutPlugin} from '@lexical/react/LexicalMarkdownShortcutPlugin';


export default function MarkdownPlugin() {
  return <MarkdownShortcutPlugin transformers={TRANSFORMERS} />;
}