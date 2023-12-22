import { ItemInfo } from "typed-adventureland";
import { LOG, debug_log } from "./util";

function compareItems(item1: ItemInfo, item2: ItemInfo) {
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
    debug_log(`Comparing ${item1.name} with ${item2.name}, result is ${nameComparisonResult}`);
    if (nameComparisonResult != 0) {
        return nameComparisonResult;
    }
    const item1Level = item1.level ?? 0;
    const item2Level = item2.level ?? 0;
    return item1Level - item2Level;
}

async function sortInventory() {
    const slotsToSort = character.isize - 4;
    for (let i = 0; i < slotsToSort; i++) {
        let swapped = false;
        for (let j = 0; j < slotsToSort - i - 1; j++) {
            const item1 = character.items[j];
            const item2 = character.items[j + 1];
            if (compareItems(item1, item2) > 0) {
                await swap(j, j + 1);
                swapped = true;
            }
        }
        if (!swapped) {
            break;
        }
    }
    LOG("Inventory sorted!");
}

export { sortInventory };
