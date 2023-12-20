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
    return get_characters().findIndex((character) => character.name === name) >= 0;
}

function isFriend(name: string) {
    return FRIENDS_LIST.includes(name) || isMyCharacter(name);
}

function amountICanHeal(): number {
    for (const item of character.items) {
        if (item == null) continue;
        const givesArray: any[] = G.items[item.name]?.givesArray ?? [];
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
        const givesArray: any[] = G.items[item.name]?.givesArray ?? [];
        for (const gives in givesArray) {
            if (gives.includes("mp") && gives.length > 1) {
                return parseInt(gives[1], 10);
            }
        }
    }
    return 100;
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
};
