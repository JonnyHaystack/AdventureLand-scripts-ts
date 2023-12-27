import { ServerIdentifier, ServerRegion } from "typed-adventureland";
import { StateKey, getState, setState } from "./state";
import { LOG } from "./util";

function currentServer() {
    return {
        region: parent.server_region,
        name: parent.server_identifier,
        key: `${parent.server_region}${parent.server_identifier}`,
    };
}

function switchToNextServer() {
    const servers = parent.X.servers;
    const myCurrentServer = currentServer();
    const currentServerIndex = servers.findIndex(
        ({ region, name }) => region === myCurrentServer.region && name === myCurrentServer.name,
    );
    const nextServerIndex = (currentServerIndex + 1) % servers.length;
    const nextServer = servers[nextServerIndex];
    change_server(nextServer.region as ServerRegion, nextServer.name as ServerIdentifier);
}

let serverCycleTimer: NodeJS.Timeout;

function startServerCycleTimer() {
    LOG("Switching server in 60 seconds!");
    serverCycleTimer = setTimeout(switchToNextServer, 60_000);
}

function stopServerCycleTimer() {
    clearTimeout(serverCycleTimer);
}

function startAutoServerCycle() {
    LOG("Started auto server cycler");
    startServerCycleTimer();
    setState(StateKey.AUTO_SERVER_CYCLE, true);
}

function stopAutoServerCycle() {
    if (getState(StateKey.AUTO_SERVER_CYCLE)) {
        LOG("Stopping auto server cycler");
        stopServerCycleTimer();
        setState(StateKey.AUTO_SERVER_CYCLE, false);
    }
}

export { startServerCycleTimer, stopServerCycleTimer, startAutoServerCycle, stopAutoServerCycle };
