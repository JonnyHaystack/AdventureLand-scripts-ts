enum StateKey {
    ATTACK_MODE = "attackMode",
    WAYPOINT_MODE = "waypointMode",
    WAYPOINTS = "waypoints",
    FOLLOWING = "following",
}

type State = Record<StateKey, any>;

const defaultState: State = {
    [StateKey.ATTACK_MODE]: false,
    [StateKey.WAYPOINT_MODE]: false,
    [StateKey.WAYPOINTS]: [],
    [StateKey.FOLLOWING]: null,
};

let state: State;

function getState(key: StateKey) {
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
}

export { StateKey, getState, setState };
