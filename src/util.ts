import { DEBUG } from "./constants";
import { Vector } from "./types";

function debug_log(message: string, color?: string | undefined) {
    if (DEBUG) {
        log(message, color);
    }
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

export { debug_log, vectorPretty, myNearbyCharacters, myNearbyPartyMembers };
