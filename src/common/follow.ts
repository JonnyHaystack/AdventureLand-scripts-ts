import { Entity } from "typed-adventureland";
import { StateKey, getState, setState } from "../state";
import { debug_log } from "../util";

const FOLLOW_DISTANCE = 60;

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
    const following = parent.entities[followingId];
    if (following == null) {
        return;
    }

    const distanceFromFollowee = simple_distance(
        { x: character.x, y: character.y },
        { x: following.x, y: following.y },
    );
    if (distanceFromFollowee > FOLLOW_DISTANCE) {
        debug_log(`distanceFromFollowee: ${distanceFromFollowee}`);
        debug_log(`xmoving to ${following.x}, ${following.y}`);
        if (can_move_to(following.x, following.y)) {
            await move(following.x, following.y);
        } else {
            await smart_move({ x: following.x, y: following.y, map: following.map });
        }
        // await xmove(following.x, following.y);
        // await xmove({
        //     x: following.x,
        //     y: following.y,
        //     map: following.map,
        //     real_x: following.real_x,
        //     real_y: following.real_y,
        // });
    }
}

export { startFollowing, stopFollowing, followTask };
