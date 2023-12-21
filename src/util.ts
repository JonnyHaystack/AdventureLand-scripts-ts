import { ItemInfo, ItemKey } from "typed-adventureland";
import { DEBUG, FRIENDS_LIST } from "./constants";
import { Vector } from "./types";

function debug_log(message: string) {
    if (DEBUG) {
        console.log(message);
    }
}

function LOG(message: string) {
    log(message);
    console.log(message);
}

function vectorPretty({ x, y }: Vector) {
    return `${x.toFixed(2)}, ${y.toFixed(2)}`;
}

function myNearbyCharacters() {
    return Object.values(parent.entities).filter((e) => e.owner === character.owner);
}

function myNearbyPartyMembers() {
    return Object.values(parent.entities).filter((e) => e.party === character.party);
}

function isMyCharacter(name: string) {
    return name != null && get_characters().findIndex((character) => character.name === name) >= 0;
}

function isFriend(name: string) {
    return FRIENDS_LIST.includes(name) || isMyCharacter(name);
}

function amountICanHeal(): number {
    for (const item of character.items) {
        if (item == null) continue;
        const givesArray: any[] = G.items[item.name]?.gives ?? [];
        for (const gives in givesArray) {
            if (gives.includes("hp") && gives.length > 1) {
                return parseInt(gives[1], 10);
            }
        }
    }
    return 50;
}

function amountICanMagicRegen(): number {
    for (const item of character.items) {
        if (item == null) continue;
        const givesArray: any[] = G.items[item.name]?.gives ?? [];
        for (const gives in givesArray) {
            if (gives.includes("mp") && gives.length > 1) {
                return parseInt(gives[1], 10);
            }
        }
    }
    return 100;
}

function inventoryItems(itemName: ItemKey) {
    return character.items.filter((item: ItemInfo | null) => item?.name === itemName);
}

function inventoryItemsIndexed(itemName: ItemKey) {
    return character.items.reduce(
        (items: { [key: number]: ItemInfo }, currentItem: ItemInfo | null, index: number) => {
            if (currentItem?.name === itemName) {
                items[index] = currentItem;
            }
            return items;
        },
        {},
    );
}

function locateItemWithLowestLevel(itemName: ItemKey) {
    let lowestLevelSeen = 99;
    let lowestLevelItemIndex = -1;
    character.items.forEach((currentItem, currentIndex) => {
        if (currentItem?.name === itemName) {
            const currentItemLevel = currentItem?.level ?? lowestLevelSeen;
            if (currentItemLevel < lowestLevelSeen) {
                lowestLevelSeen = currentItemLevel;
                lowestLevelItemIndex = currentIndex;
            }
        }
    });
    return lowestLevelItemIndex;
}

function sendItem(to: string, item: ItemKey, quantity: number = 1) {
    const inventoryPosition = locate_item(item);
    if (inventoryPosition < 0) {
        LOG(`Item ${item} not found in inventory!`);
        return;
    }
    send_item(to, inventoryPosition, quantity);
}

function sendItemViaGui(quantity: number = 1000) {
    const focus = character.focus;
    if (focus == null) {
        LOG("No player focused");
        return;
    }
    const target = parent.entities[focus];
    const itemString: string | undefined = (parent as any).last_invclick;
    if (!target?.player) {
        LOG(`Target ${target?.name} is not a player!`);
        return;
    }
    if (!isFriend(target.name)) {
        LOG(`${target.name} is not a friend!`);
    }
    if (itemString == null) {
        LOG("No valid item selected");
        return;
    }
    const inventoryPosition: number = parseInt(itemString, 10);
    send_item(target.name, inventoryPosition, quantity);
}

export {
    debug_log,
    LOG,
    vectorPretty,
    myNearbyCharacters,
    myNearbyPartyMembers,
    isMyCharacter,
    isFriend,
    amountICanHeal,
    amountICanMagicRegen,
    inventoryItems,
    inventoryItemsIndexed,
    locateItemWithLowestLevel,
    sendItem,
    sendItemViaGui,
};
