export interface TreeNode {
  name: string
  type: "file" | "folder"
  children?: TreeNode[]
}

export const projectTree: TreeNode[] = [
  { name: "mod.hjson", type: "file" },
  {
    name: "content",
    type: "folder",
    children: [
      { name: "items", type: "folder" },
      { name: "blocks", type: "folder" },
      { name: "liquids", type: "folder" },
      { name: "units", type: "folder" },
    ],
  },
  { name: "maps", type: "folder" },
  { name: "bundles", type: "folder" },
  { name: "sounds", type: "folder" },
  { name: "schematics", type: "folder" },
  { name: "scripts", type: "folder" },
  { name: "sprites-override", type: "folder" },
  { name: "sprites", type: "folder" },
]

export function getNodePath(node: TreeNode, parents: string[] = []): string {
  return [...parents, node.name].join("/")
}

export function findTreeNodeByPath(
  path: string,
  nodes: TreeNode[] = projectTree
): TreeNode | null {
  for (const node of nodes) {
    if (node.name === path) return node
    if (node.children) {
      const parts = path.split("/")
      if (parts[0] === node.name) {
        const result = findTreeNodeByPath(parts.slice(1).join("/"), node.children)
        if (result) return result
      }
    }
  }
  return null
}
