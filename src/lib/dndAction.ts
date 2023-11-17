import { dndzone } from 'svelte-dnd-action';

export function dndzoneAction(node: HTMLElement, params: any) {
    const { consider, finalize } = params;

    const dnd = dndzone(node, params);

    node.addEventListener('consider', consider);
    node.addEventListener('finalize', finalize);

    return {
        destroy() {
            node.removeEventListener('consider', consider);
            node.removeEventListener('finalize', finalize);
            dnd.destroy();
        }
    };
}
