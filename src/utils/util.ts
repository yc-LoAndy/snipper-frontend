import type { TreeNode } from 'primevue/treenode';

export function getTreeNodeByKey(nodes: TreeNode[], key: string): TreeNode | undefined {
    for (const node of nodes) {
        if (node.key === key) {
            return node;
        }
        if (node.children) {
            const found = getTreeNodeByKey(node.children, key);
            if (found) {
                return found;
            }
        }
    }
    return undefined;
}
