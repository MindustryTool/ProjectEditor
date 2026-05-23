import { useState } from "react";
import type { FileEntry } from "@project/fs";

interface FileTreeProps {
  files: FileEntry[];
  onSelect: (path: string) => void;
  selectedPath?: string;
}

export function FileTree({ files, onSelect, selectedPath }: FileTreeProps) {
  return (
    <ul className="file-tree">
      {files.map((file) => (
        <FileTreeNode
          key={file.name}
          handle={file}
          onSelect={onSelect}
          isSelected={selectedPath === file.name}
        />
      ))}
    </ul>
  );
}

interface FileTreeNodeProps {
  handle: FileEntry;
  onSelect: (path: string) => void;
  isSelected: boolean;
}

function FileTreeNode({ handle, onSelect, isSelected }: FileTreeNodeProps) {
  const [expanded, setExpanded] = useState(false);

  if (handle.kind === "directory") {
    return (
      <li>
        <button
          onClick={() => setExpanded(!expanded)}
          className={`file-tree__dir ${isSelected ? "file-tree__dir--selected" : ""}`}
        >
          {expanded ? "▼" : "▶"} {handle.name}
        </button>
      </li>
    );
  }

  return (
    <li>
      <button
        onClick={() => onSelect(handle.name)}
        className={`file-tree__file ${isSelected ? "file-tree__file--selected" : ""}`}
      >
        {handle.name}
      </button>
    </li>
  );
}
