import { useRef, useEffect } from "react";

interface EditorProps {
  value: string;
  onChange: (value: string) => void;
  language?: string;
  readOnly?: boolean;
}

export function Editor({ value, onChange, language, readOnly }: EditorProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    textarea.value = value;
  }, [value]);

  return (
    <textarea
      ref={textareaRef}
      onChange={(e) => onChange(e.target.value)}
      readOnly={readOnly}
      data-language={language}
      className="editor"
      spellCheck={false}
    />
  );
}
