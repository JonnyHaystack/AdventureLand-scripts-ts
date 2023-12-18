import { MapClickHandler, attachMapClickHandler, detachMapClickHandler } from "./eventHandlers";
import { getState } from "./state";
import { Vector } from "./types";
import { debug_log } from "./util";

const LINE_THICKNESS = 1;
const CIRCLE_RADIUS = 3;

type WaypointsType = Vector[];

let currentWaypoints: WaypointsType;

function renderWaypoints(waypoints: WaypointsType) {
    debug_log(`Rendering ${waypoints.length} waypoints`);
    clear_drawings();
    for (let i = 0; i < waypoints.length; i++) {
        const waypoint = waypoints[i];
        if (i === 0) {
            draw_line(character.x, character.y, waypoint.x, waypoint.y, LINE_THICKNESS);
        } else {
            const previousWaypoint = waypoints[i - 1];
            draw_line(
                previousWaypoint.x,
                previousWaypoint.y,
                waypoint.x,
                waypoint.y,
                LINE_THICKNESS,
            );
        }
        draw_circle(waypoint.x, waypoint.y, CIRCLE_RADIUS, LINE_THICKNESS);
    }
}

const waypointClickHandler: MapClickHandler = (x, y) => {
    debug_log(`getState().waypointMode: ${getState().waypointMode}`);
    debug_log(`Adding waypoint: ${x}, ${y}`);
    currentWaypoints.push({ x, y });
    renderWaypoints(currentWaypoints);

    return true;
};

function startWaypointEditor() {
    getState().waypointMode = true;
    currentWaypoints = [];
    attachMapClickHandler(waypointClickHandler);
}

function stopWaypointEditor() {
    getState().waypointMode = false;
    detachMapClickHandler(waypointClickHandler);
    clear_drawings();
    return currentWaypoints;
}

function undoLastWaypoint() {
    if (!getState().waypointMode) {
        log("Cannot undo waypoint - editor is not active!");
        return;
    }
    if (currentWaypoints.length < 1) {
        log("No waypoints to undo!");
        return;
    }
    currentWaypoints.pop();
    renderWaypoints(currentWaypoints);
}

export { startWaypointEditor, stopWaypointEditor, undoLastWaypoint };
