import { createContext, Dispatch, ReactNode, SetStateAction, useContext, useState } from 'react';

interface MarkdownEditorContextType {
  isMarkdownModeActive: boolean;
  setMarkdownModeActive: Dispatch<SetStateAction<boolean>>;
}

const EditorContext = createContext<MarkdownEditorContextType | null>(null);

export function EditorProvider({ children }: { children: ReactNode }) {
  const [isMarkdownModeActive, setMarkdownModeActive] = useState(false);

  return (
    <EditorContext.Provider
      value={{
        isMarkdownModeActive,
        setMarkdownModeActive,
      }}
    >
      {children}
    </EditorContext.Provider>
  );
}

export function useEditorContext() {
  const context = useContext(EditorContext);
  if (!context) {
    throw new Error('useEditorContext must be used within a EditorProvider');
  }
  return context;
}