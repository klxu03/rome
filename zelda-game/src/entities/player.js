import { gameState } from "../state/stateManager.js";
import { playAnimIfNotPlaying, areAnyKeysDown, areAllKeysDown } from "../utils.js";
import { playerState } from "../state/stateManager.js";

// pos is the Vec2
export function generatePlayerComponents(k, pos) {
  return [
    k.sprite("assets", {
      anim: "player-idle-down",
    }),
    k.area({ shape: new k.Rect(k.vec2(3, 4), 10, 12) }), // relative offset 3 pixels from sprite left and 4 down, width 10 and height 12
    k.body(),
    k.pos(pos),
    k.opacity(),
    {
        speed: 100,
        attackPower: 1,
        direction: "down",
        isAttacking: false,
    },
    "player"
  ];
}

export function setPlayerMovement(k, player) {
  const horizontalKeys = ["left", "a", "right", "d"];
  const verticalKeys = ["up", "w", "down", "s"];

  k.onKeyDown((key) => {
    // cannot move diagonal, duplicate both
    if (areAnyKeysDown(k, horizontalKeys) && areAnyKeysDown(k, verticalKeys)) {
      return;
    }

    const leftKeys = ["left", "a"];
    if (leftKeys.includes(key)) {
      if (areAllKeysDown(k, leftKeys)) return;

      player.flipX = true;
      playAnimIfNotPlaying(player, "player-side");
      player.move(-player.speed, 0);
      player.direction = "left";
      return;
    }

    const rightKeys = ["right", "d"];
    if (rightKeys.includes(key)) {
      if (areAllKeysDown(k, rightKeys)) return;

      player.flipX = false;
      playAnimIfNotPlaying(player, "player-side");
      player.move(player.speed, 0);
      player.direction = "right";
      return;
    }

    const upKeys = ["up", "w"];
    if (upKeys.includes(key)) {
      if (areAllKeysDown(k, upKeys)) return;

      playAnimIfNotPlaying(player, "player-up");
      player.move(0, -player.speed);
      player.direction = "up";
      return;
    }

    const downKeys = ["down", "s"];
    if (downKeys.includes(key)) {
      if (areAllKeysDown(k, downKeys)) return;

      playAnimIfNotPlaying(player, "player-down");
      player.move(0, player.speed);
      player.direction = "down";
      return;
    }
  });

  k.onKeyPress((key) => {
    if (key !== "space") return;
    if (gameState.getFreezePlayer()) return;
    
    // Player hasn't unlocked the sword yet
    if (!playerState.getIsSwordEquipped()) {
      return;
    }

    player.isAttacking = true;

    // Create a sword hit box in front of player
    if (k.get("swordHitBox").length === 0) {
      const swordHitBoxPosX = {
        left: player.worldPos().x - 2,
        right: player.worldPos().x + 10,
        up: player.worldPos().x + 5,
        down: player.worldPos().x + 2,
      };

      const swordHitBoxPosY = {
        left: player.worldPos().y + 5,
        right: player.worldPos().y + 5,
        up: player.worldPos().y,
        down: player.worldPos().y + 10,
      };

      k.add([
        k.area({shape: new k.Rect(k.vec2(0), 8, 8)}),
        k.pos(
          swordHitBoxPosX[player.direction],
          swordHitBoxPosY[player.direction]
        ),
        "swordHitBox"
      ]);

      const waitBeforeDestroyingSwordHitBox = 0.1;
      k.wait(waitBeforeDestroyingSwordHitBox, () => {
        k.destroyAll("swordHitBox");

        if (player.direction === "left" || player.direction === "right") {
          playAnimIfNotPlaying(player, "player-side");
        } else {
          playAnimIfNotPlaying(player, `player-${player.direction}`);
        }

        player.stop();
      });

      playAnimIfNotPlaying(player, `player-attack-${player.direction}`);
    }
  });

  k.onKeyRelease(() => {
    player.isAttacking = false;
    player.stop();
  })
}