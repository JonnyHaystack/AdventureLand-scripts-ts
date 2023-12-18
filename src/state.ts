import { Vector } from "./types";

enum StateKey {
    ATTACK_MODE,
    WAYPOINT_MODE,
    WAYPOINTS,
}

interface State {
    attackMode: boolean;
    waypointMode: boolean;
    waypoints: Vector[];
}

// type State = {
//     [key in StateKey]: any;
// };

const defaultState: State = {
    attackMode: false,
    waypointMode: false,
    waypoints: [],
};

let state: State;

function getState() {
    if (!state) {
        state = defaultState;
    }
    return state;
}

// function setState(key: StateKey, value: any) {
//     if (Object.keys(state).includes(key)) {
//         state[key] = value;
//     }
// }

export { StateKey, getState };
