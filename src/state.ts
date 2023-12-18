import { Vector } from "./types";

interface State {
    attackMode: boolean;
    waypointMode: boolean;
    waypoints: Vector[];
}

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

export { getState };
