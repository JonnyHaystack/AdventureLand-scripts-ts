import { LOG, debug_log } from "./util";

type ItemInfoWithIndex = {
    name?: string;
    level?: number;
    index: number;
};

function compareItems(item1: ItemInfoWithIndex | null, item2: ItemInfoWithIndex | null) {
    if (item1 == null && item2 == null) {
        return 0;
    }
    if (item1 == null || item1.name == null) {
        return 1;
    }
    if (item2 == null || item2.name == null) {
        return -1;
    }
    const nameComparisonResult = item1.name.localeCompare(item2.name);
    if (nameComparisonResult != 0) {
        return nameComparisonResult;
    }
    const item1Level = item1.level ?? 0;
    const item2Level = item2.level ?? 0;
    return item1Level - item2Level;
}

async function sortItemPack(
    items: ItemInfoWithIndex[],
    swapFunction: (destSlot: number, slot: number) => Promise<unknown>,
) {
    items.forEach((item, index, array) => {
        if (item == null) {
            array[index] = { index };
            return;
        }
        item.index = index;
    });
    items.sort(compareItems);
    for (let sortedArrayIndex = 0; sortedArrayIndex < items.length; sortedArrayIndex++) {
        const item = items[sortedArrayIndex];
        if (item == null || item.index === sortedArrayIndex) {
            continue;
        }
        await swapFunction(sortedArrayIndex, item.index);

        // Update index pointer of the item we just swapped with the current item, so we still know
        // where it's actual position in the inventory is.
        const swappedItem = items.find((item) => item.index === sortedArrayIndex);
        if (swappedItem != null) {
            swappedItem.index = item.index;
        }
        item.index = sortedArrayIndex;
    }
}

async function sortInventory() {
    const slotsToSort = character.isize - 4;
    const itemsCopy = character.items.slice(0, slotsToSort) as ItemInfoWithIndex[];
    sortItemPack(itemsCopy, async (destSlot, slot) => await swap(destSlot, slot));
    LOG("Inventory sorted!");
}

async function sortBankItems() {
    if (character?.bank == null) {
        debug_log("No bank slots accessible - not sorting");
        return;
    }
    Object.entries(character?.bank ?? {}).forEach(async ([packName, pack]) => {
        if (packName === "gold" || pack == null) {
            return;
        }
        const itemsCopy = (pack as ItemInfoWithIndex[]).slice();
        sortItemPack(
            itemsCopy,
            async (destSlot, slot) => await bank_swap(packName, destSlot, slot),
        );
    });
    LOG("Bank items sorted!");
}

export { sortInventory, sortBankItems };
