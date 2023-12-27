enum StateKey {
    ATTACK_MODE = "attackMode",
    WAYPOINT_MODE = "waypointMode",
    WAYPOINTS = "waypoints",
    FOLLOWING = "following",
    AUTO_SERVER_CYCLE = "autoServerCycle",
}

type State = Record<StateKey, any>;

const defaultState: State = {
    [StateKey.ATTACK_MODE]: false,
    [StateKey.WAYPOINT_MODE]: false,
    [StateKey.WAYPOINTS]: [],
    [StateKey.FOLLOWING]: null,
    [StateKey.AUTO_SERVER_CYCLE]: false,
};

let state: State;

function getState(key: StateKey) {
    if (!state) {
        state = get(character.id);
    }
    if (!state) {
        state = defaultState;
    }
    return state[key];
}

function setState(key: StateKey, value: any) {
    if (!state) {
        state = defaultState;
    }
    state[key] = value;
    set(character.id, state);
}

export { StateKey, getState, setState };
