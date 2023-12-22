import { ItemKey } from "typed-adventureland";
import {
    LOG,
    currentHighestItemLevel,
    debug_log,
    freeInventorySlots,
    inventoryItemsIndexed,
    inventoryQuantity,
    itemCost,
} from "../util";

let compounding = false;
let itemToCompound: ItemKey | null;
let scrollToUse: ItemKey | null;
let compoundTargetLevel: number;
let currentLevel: number;
let compoundBudget: number;
let totalSpent: number;

function startCompound(
    itemName: ItemKey,
    scrollName: ItemKey,
    targetLevel: number,
    budget: number,
) {
    if (compounding) {
        log(`We are already compounding ${itemToCompound} to level ${compoundTargetLevel}`);
        return;
    }
    if (budget > character.gold) {
        log(`Budget ${budget} is greater than current gold ${character.gold}`);
    }

    log(`Starting compound of ${itemName} to level ${targetLevel}`);

    compounding = true;
    itemToCompound = itemName;
    scrollToUse = scrollName;
    compoundTargetLevel = targetLevel;
    currentLevel = 0;
    compoundBudget = budget;
    totalSpent = 0;
}

function stopCompound() {
    if (!compounding) {
        return;
    }
    LOG(
        `Compound stopped: ${itemToCompound} -> ${compoundTargetLevel}, budget: ${compoundBudget}, ` +
            `total spend: ${totalSpent}`,
    );

    compounding = false;
    itemToCompound = null;
    scrollToUse = null;
    compoundTargetLevel = 0;
    currentLevel = 0;
    compoundBudget = 0;
}

async function compoundItemsTask() {
    if (!compounding || itemToCompound == null || scrollToUse == null) {
        return;
    }
    if (!can_use("interact") || Object.keys(character.q).includes("compound")) {
        debug_log("Can't interact/already compounding");
        return;
    }

    // Stop automatically once desired level attained.
    if (currentHighestItemLevel(itemToCompound) >= compoundTargetLevel) {
        LOG(`We got ourselves a level ${compoundTargetLevel} ${itemToCompound}!`);
        stopCompound();
        return;
    }

    // Get all of item at current level.
    let itemsAtCurrentLevel = inventoryItemsIndexed(itemToCompound, currentLevel);

    const currentItemQuantity = Object.keys(itemsAtCurrentLevel).length;
    const currentScrollQuantity = inventoryQuantity(scrollToUse);

    const remainingBudget = compoundBudget - totalSpent;

    /* Top up scrolls */
    if (currentScrollQuantity < 1) {
        const scrollCost = itemCost(scrollToUse);
        if (scrollCost > remainingBudget) {
            log(
                `Scroll cost (${scrollCost}) is higher than remaining budget (${remainingBudget})!`,
            );
            stopCompound();
            return;
        }
        if (scrollCost > character.gold) {
            log(`Refill cost ${scrollCost} is greater than current gold ${character.gold}`);
            stopCompound();
            return;
        }

        debug_log(`Buying ${scrollToUse} for ${scrollCost}`);
        await buy_with_gold(scrollToUse, 1);
        totalSpent += scrollCost;
        await sleep(250);
    }

    /* Top up items */
    if (currentItemQuantity < 3) {
        // Keep trying to compound until we reach target level.
        if (currentLevel !== compoundTargetLevel) {
            currentLevel++;
            return;
        }

        let spareSlotsForItems = freeInventorySlots() - 1;

        const itemPurchaseQuantity = Math.min(3 - currentItemQuantity, spareSlotsForItems);

        const itemsCost = itemCost(itemToCompound) * itemPurchaseQuantity;

        if (itemsCost > remainingBudget) {
            log(`Item cost (${itemsCost}) is higher than remaining budget (${remainingBudget})!`);
            stopCompound();
            return;
        }
        if (itemsCost > character.gold) {
            log(`Refill cost ${itemsCost} is greater than current gold ${character.gold}`);
            stopCompound();
            return;
        }

        debug_log(`Buying ${itemPurchaseQuantity}x ${itemToCompound}`);
        if (itemPurchaseQuantity > 0) {
            await buy_with_gold(itemToCompound, itemPurchaseQuantity);
            // Go back to combining +0 items because we just bought more of them.
            currentLevel = 0;
            totalSpent += itemsCost;
            await sleep(250);
            return;
        }
    }

    const scrollIndex = locate_item(scrollToUse);
    if (scrollIndex === -1) {
        LOG("Item or scroll not found in inventory");
        return;
    }

    debug_log("Performing compound...");
    const [item1, item2, item3] = Object.keys(itemsAtCurrentLevel).map((key) =>
        Number.parseInt(key),
    );
    const compoundResult = await compound(item1, item2, item3, scrollIndex);
    debug_log(`Compound result: ${JSON.stringify(compoundResult)}`);
    await sleep(250);
}

export { startCompound, stopCompound, compoundItemsTask };
