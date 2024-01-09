import { Entity } from "typed-adventureland";
import { AttackMode, StateKey, getState, setState } from "../state";
import { debug_log } from "../util";

const COMBAT_FOLLOW_DISTANCE = 200;
const FOLLOW_DISTANCE = 80;

function startFollowing(entity: Entity) {
    if (entity == null) {
        return;
    }
    log(`Started following ${entity.name}`);
    setState(StateKey.FOLLOWING, entity.id);
}

function stopFollowing() {
    const followingId: string | null = getState(StateKey.FOLLOWING);
    if (followingId == null) {
        return;
    }
    const following = parent.entities[followingId];

    if (following != null) {
        log(`Stopped following ${following.name}`);
    }
    setState(StateKey.FOLLOWING, null);
}

async function followTask() {
    const followingId: string | null = getState(StateKey.FOLLOWING);
    if (followingId == null) {
        return;
    }
    const following =
        parent.entities[followingId] ??
        get_characters().find((character) => character.name === followingId);
    if (following == null) {
        debug_log(`followingId ${followingId} not found`);
        return;
    }

    const attackMode = getState(StateKey.ATTACK_MODE);
    const followDistance =
        attackMode === AttackMode.FARMING_ACTIVE ? COMBAT_FOLLOW_DISTANCE : FOLLOW_DISTANCE;
    const distanceFromFollowee = simple_distance(
        { x: character.x, y: character.y, map: character.map },
        { x: following.x, y: following.y, map: following.map },
    );
    // debug_log(
    //     `character.x: ${character.x}, character.y: ${character.y}, character.map: ${character.map}, character.real_x: ${character.real_x}, character.real_y: ${character.real_y}`,
    // );
    // debug_log(
    //     `following.x: ${following.x}, following.y: ${following.y}, following.map: ${following.map}, following.real_x: ${following.real_x}, following.real_y: ${following.real_y}`,
    // );
    if (distanceFromFollowee > followDistance || following.map !== character.map) {
        debug_log(`distanceFromFollowee: ${distanceFromFollowee}`);
        debug_log(`xmoving to ${following.x}, ${following.y}`);
        if (following.map === character.map && can_move_to(following.x, following.y)) {
            debug_log(`move(${following.x}, ${following.y})`);
            await move(following.x, following.y);
        } else {
            debug_log(
                `smart_move({real_x: ${following.real_x}, real_y: ${following.real_y}, map: ${following.map}})`,
            );
            await smart_move({
                x: following.x,
                y: following.y,
                map: following.map,
            });
        }
    }
}

export { startFollowing, stopFollowing, followTask };
