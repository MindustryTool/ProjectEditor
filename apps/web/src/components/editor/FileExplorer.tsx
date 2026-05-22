import { useState } from "react"
import { useQueryState } from "nuqs"
import { File, Folder, FolderOpen, ChevronRight, ChevronDown } from "lucide-react"
import { cn } from "~/lib/utils"
import { projectTree, type TreeNode } from "./file-explorer-data"

interface FileExplorerProps {
  className?: string
}

export function FileExplorer({ className }: FileExplorerProps) {
  const [path, setPath] = useQueryState("path")

  return (
    <div className={cn("space-y-0.5 px-1 py-1", className)}>
      {projectTree.map((node) => (
        <TreeNodeItem
          key={node.name}
          node={node}
          parentPath=""
          selectedPath={path ?? null}
          onSelect={setPath}
        />
      ))}
    </div>
  )
}

function getIcon(node: TreeNode, expanded: boolean) {
  if (node.type === "folder") {
    return expanded ? (
      <FolderOpen className="h-3.5 w-3.5 shrink-0 text-amber-500" />
    ) : (
      <Folder className="h-3.5 w-3.5 shrink-0 text-amber-500" />
    )
  }
  return <File className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
}

interface TreeNodeItemProps {
  node: TreeNode
  parentPath: string
  selectedPath: string | null
  onSelect: (value: string | null) => void
  depth?: number
}

function TreeNodeItem({
  node,
  parentPath,
  selectedPath,
  onSelect,
  depth = 0,
}: TreeNodeItemProps) {
  const [expanded, setExpanded] = useState(
    depth === 0 && node.type === "folder"
  )
  const currentPath = parentPath ? `${parentPath}/${node.name}` : node.name
  const isSelected = selectedPath === currentPath
  const isFolder = node.type === "folder"

  function handleClick() {
    if (isFolder) {
      setExpanded(!expanded)
    }
    onSelect(currentPath)
  }

  return (
    <div>
      <button
        onClick={handleClick}
        className={cn(
          "flex w-full cursor-pointer items-center gap-1 rounded px-2 py-1 text-xs text-foreground hover:bg-accent",
          isSelected && "bg-accent font-medium"
        )}
        style={{ paddingLeft: `${8 + depth * 16}px` }}
      >
        {isFolder && (
          <span className="shrink-0">
            {expanded ? (
              <ChevronDown className="h-3 w-3 text-muted-foreground" />
            ) : (
              <ChevronRight className="h-3 w-3 text-muted-foreground" />
            )}
          </span>
        )}
        {getIcon(node, expanded)}
        <span className="truncate">{node.name}</span>
      </button>
      {isFolder && expanded && node.children && (
        <div>
          {node.children.map((child) => (
            <TreeNodeItem
              key={child.name}
              node={child}
              parentPath={currentPath}
              selectedPath={selectedPath}
              onSelect={onSelect}
              depth={depth + 1}
            />
          ))}
        </div>
      )}
    </div>
  )
}
