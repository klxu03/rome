import { playAnimIfNotPlaying } from "../utils.js";

const directionStates = ["left", "right", "up", "down"];

export function generateProjectileComponents(k, pos, direction) {
    const projectileHitBoxPosX = {
        left: pos.x - 2,
        right: pos.x + 20,
        up: pos.x + 5,
        down: pos.x + 2,
    };

    const projectileHitBoxPosY = {
        left: pos.y + 10,
        right: pos.y + 5,
        up: pos.y,
        down: pos.y + 10,
    };

    return [
      k.sprite("projectile", {
        anim: "projectile-air",
      }),
      k.area({ shape: new k.Rect(k.vec2(0), 16, 16) }),
      k.body(),
      k.pos(projectileHitBoxPosX[direction], projectileHitBoxPosY[direction]),
      k.offscreen(),
      k.opacity(),
      k.rotate(0),
      k.state(direction, directionStates),
      k.health(3),
      {
          speed: 200,
          attackPower: 0.5,
          direction,
      },
      "projectile"
    ];
}
  
export async function startProjectile(k, projectile) {
    k.onUpdate(() => {
        if (!projectile) return;

        switch (projectile.state) {
        case "right":
            console.log("projectile right");
            projectile.angle = 90;
            projectile.move(projectile.speed, 0);
            break;
        case "left":
            console.log("projectile left");
            projectile.angle = 270;
            projectile.move(-projectile.speed, 0);
            break;
        case "up":
            console.log("projectile up");
            projectile.move(0, -projectile.speed);
            break;
        case "down":
            console.log("projectile down");
            projectile.flipY = true;
            projectile.move(0, projectile.speed);
            break;
        }
    });

    setTimeout(() => {
        projectile.onCollide((ignored) => {
            if (projectile) {
                k.destroy(projectile);
                projectile = null;
                return;
            }
        });
    }, 50);
}