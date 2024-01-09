import { attachMapClickHandler, detachMapClickHandler } from "./eventHandlers";
import { StateKey, getState } from "./state";

function xmoveMapClickHandler(x: number, y: number) {
    if (!getState(StateKey.WAYPOINT_MODE)) {
        xmove(x, y);
    }
    return true;
}

function startXmoveMapClickHandler() {
    attachMapClickHandler(xmoveMapClickHandler);
}

function stopXmoveMapClickHandler() {
    detachMapClickHandler(xmoveMapClickHandler);
}

export { startXmoveMapClickHandler, stopXmoveMapClickHandler };
