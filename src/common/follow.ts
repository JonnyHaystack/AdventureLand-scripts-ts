import { Entity } from "typed-adventureland";
import { StateKey, getState, setState } from "../state";
import { debug_log } from "../util";

const FOLLOW_DISTANCE = 60;

function startFollowing(entity: Entity) {
    if (entity == null) {
        return;
    }
    log(`Started following ${entity.name}`);
    setState(StateKey.FOLLOWING, entity);
}

function stopFollowing() {
    const following = getState(StateKey.FOLLOWING);
    if (following != null) {
        log(`Stopped following ${following.name}`);
    }
    setState(StateKey.FOLLOWING, null);
}

function followTask() {
    const following: Entity | null = getState(StateKey.FOLLOWING);
    if (following != null) {
        const distanceFromFollowee = simple_distance(
            { x: character.x, y: character.y },
            { x: following.x, y: following.y },
        );
        if (distanceFromFollowee > FOLLOW_DISTANCE) {
            debug_log(`distanceFromFollowee: ${distanceFromFollowee}`);
            debug_log(`smart_moving to ${following.x}, ${following.y}`);
            smart_move(following.x, following.y);
        }
    }
}

export { startFollowing, stopFollowing, followTask };
