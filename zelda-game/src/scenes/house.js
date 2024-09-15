import { generateOldManComponents } from "../entities/oldMan.js";
import { generatePlayerComponents, setPlayerMovement } from "../entities/player.js";
import { colorizeBackground, drawBoundaries, drawTiles, fetchMapData } from "../utils.js";
import { playerState } from "../state/stateManager.js";
import { healthBar } from "../uiComponents/healthBar.js";
import { gameState } from "../state/stateManager.js";

export default async function house(k) {
    colorizeBackground(k, 27, 29, 52);
    const mapData = await fetchMapData("./assets/maps/house.json");

    const map = k.add([k.pos(520, 200)]);

    const entities = {
        player: null,
        oldMan: null
    }

    const layers = mapData.layers;
    for (const layer of layers) {
        if (layer.name === "Boundaries") {
            drawBoundaries(k, map, layer);
            continue;
        }

        if (layer.name === "SpawnPoints") {
            for (const object of layer.objects) {
                if (object.name === "player") {
                    entities.player = map.add(generatePlayerComponents(k, k.vec2(object.x, object.y)));
                }

                if (object.name === "oldman") {
                    entities.oldMan = map.add(generateOldManComponents(k, k.vec2(object.x, object.y)));
                }
            }
            continue;
        }

        drawTiles(k, map, layer, mapData.tileheight, mapData.tilewidth);
    }

    k.camScale(4);

    setPlayerMovement(k, entities.player);

    playerState.setIsSwordEquipped(true);

    entities.player.onCollide("door-exit", () => {
        gameState.setPreviousScene("house");
        k.go("world");
    });

    healthBar(k);
}