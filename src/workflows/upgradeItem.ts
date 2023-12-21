import { ItemInfo, ItemKey } from "typed-adventureland";
import { LOG, debug_log, locateItemWithLowestLevel } from "../util";

function inventoryQuantity(itemName: ItemKey) {
    return character.items.reduce((quantity: number, currentItem: ItemInfo | null) => {
        if (currentItem?.name === itemName) {
            const stackQuantity = currentItem.q ?? 0;
            if (stackQuantity > 1) {
                return quantity + stackQuantity;
            }
            return quantity + 1;
        }
        return quantity;
    }, 0);
}

function currentHighestItemLevel(itemName: ItemKey) {
    return character.items.reduce((highestLevel: number, currentItem: ItemInfo | null) => {
        if (currentItem?.name === itemName) {
            return Math.max(currentItem.level ?? 0, highestLevel);
        }
        return highestLevel;
    }, 0);
}

function freeInventorySlots() {
    return character.items.filter((item: ItemInfo | null) => item == null).length;
}

function itemCost(itemName: ItemKey) {
    const itemInfo = G.items[itemName];
    return itemInfo?.g ?? -1;
}

function maxPurchaseQuantityWithinBudget(
    itemName: ItemKey,
    scrollName: ItemKey,
    scrollsPerItem: number,
    budget: number,
) {
    const itemInfo = G.items[itemName];
    const scrollInfo = G.items[scrollName];
    if (itemInfo?.g == null || scrollInfo?.g == null) {
        return -1;
    }

    const itemPrice = itemInfo.g;
    const scrollPrice = scrollInfo.g;

    debug_log(`itemPrice="${itemPrice}", scrollPrice=${scrollPrice}`);

    let currentItemCount = 0;
    let currentPrice = 0;
    while (currentPrice < budget) {
        currentItemCount++;
        currentPrice =
            itemPrice * currentItemCount + scrollPrice * currentItemCount * scrollsPerItem;
    }
    return currentItemCount - 1;
}

let upgrading = false;
let itemToUpgrade: ItemKey | null;
let scrollToUse: ItemKey | null;
let upgradeTargetLevel: number;
let upgradeBudget: number;
let totalSpent: number;

function startUpgradeItem(
    itemName: ItemKey,
    scrollName: ItemKey,
    targetLevel: number,
    budget: number,
) {
    if (upgrading) {
        log(`We are already upgrading ${itemToUpgrade} to level ${upgradeTargetLevel}`);
        return;
    }
    if (budget > character.gold) {
        log(`Budget ${budget} is greater than current gold ${character.gold}`);
    }

    log(`Starting upgrade of ${itemName} to level ${targetLevel}`);

    upgrading = true;
    itemToUpgrade = itemName;
    scrollToUse = scrollName;
    upgradeTargetLevel = targetLevel;
    upgradeBudget = budget;
    totalSpent = 0;
}

function stopUpgradeItem() {
    if (!upgrading) {
        return;
    }
    LOG(
        `Upgrade stopped: ${itemToUpgrade} -> ${upgradeTargetLevel}, budget: ${upgradeBudget}, ` +
            `total spend: ${totalSpent}`,
    );

    upgrading = false;
    itemToUpgrade = null;
    scrollToUse = null;
    upgradeTargetLevel = 0;
    upgradeBudget = 0;
}

async function upgradeItemTask() {
    if (!upgrading || itemToUpgrade == null || scrollToUse == null) {
        return;
    }
    if (!can_use("interact") || Object.keys(character.q).includes("upgrade")) {
        debug_log("Can't interact/already upgrading");
        return;
    }

    // Stop automatically once desired level attained.
    if (currentHighestItemLevel(itemToUpgrade) >= upgradeTargetLevel) {
        log(`We got ourselves a level ${upgradeTargetLevel} ${itemToUpgrade}!`);
        stopUpgradeItem();
        return;
    }

    // const currentItemQuantity = locate_item(itemToUpgrade) < 0 ? 0 : 1;
    // const currentScrollQuantity = locate_item(scrollToUse) < 0 ? 0 : 1;
    const currentItemQuantity = inventoryQuantity(itemToUpgrade);
    const currentScrollQuantity = inventoryQuantity(scrollToUse);
    const shouldRefill = currentItemQuantity < 1 || currentScrollQuantity < 1;

    if (shouldRefill) {
        debug_log(
            `Refilling items: current itemQuantity: ${currentItemQuantity}, current ` +
                `scrollQuantity: ${currentScrollQuantity}`,
        );
        let spareSlotsForItems = freeInventorySlots() - Math.min(1, currentScrollQuantity);

        // If we have no scrolls currently, make sure we leave a free slot for scrolls.
        if (currentScrollQuantity < 1) {
            spareSlotsForItems--;
        }

        const remainingBudget = upgradeBudget - totalSpent;

        let itemPurchaseQuantity = 0;
        if (currentItemQuantity < 1) {
            itemPurchaseQuantity = 1;
        }

        let scrollPurchaseQuantity = 0;
        if (currentScrollQuantity < 1) {
            scrollPurchaseQuantity = 1;
        }

        // If non-stackable, limit the purchase amount to the number of free slots.
        const stackable = (G.items[itemToUpgrade]?.s ?? 1) > 1;
        if (!stackable) {
            itemPurchaseQuantity = Math.min(itemPurchaseQuantity, spareSlotsForItems);
        }

        const refillCost =
            itemCost(itemToUpgrade) * itemPurchaseQuantity +
            itemCost(scrollToUse) * scrollPurchaseQuantity;

        if (refillCost > remainingBudget) {
            log(
                `Refill cost (${refillCost}) is higher than remaining budget (${remainingBudget})!`,
            );
            stopUpgradeItem();
            return;
        }
        if (refillCost > character.gold) {
            log(`Refill cost ${refillCost} is greater than current gold ${character.gold}`);
            stopUpgradeItem();
            return;
        }

        debug_log(
            `Making purchase of ${itemPurchaseQuantity}x ${itemToUpgrade}, ` +
                `${scrollPurchaseQuantity}x ${scrollToUse}`,
        );
        if (itemPurchaseQuantity > 0) {
            await buy_with_gold(itemToUpgrade, itemPurchaseQuantity);
        }
        if (scrollPurchaseQuantity > 0) {
            await buy_with_gold(scrollToUse, scrollPurchaseQuantity);
        }
        await sleep(250);

        totalSpent += refillCost;
    }

    const itemIndex = locateItemWithLowestLevel(itemToUpgrade);
    const scrollIndex = locate_item(scrollToUse);
    if (itemIndex === -1 || scrollIndex === -1) {
        LOG("Item or scroll not found in inventory");
        return;
    }

    debug_log("Performing upgrade...");
    const upgradeResult = await upgrade(itemIndex, scrollIndex);
    debug_log(`Upgrade result: ${upgradeResult}`);
    await sleep(250);
}

export { startUpgradeItem, stopUpgradeItem, upgradeItemTask };
