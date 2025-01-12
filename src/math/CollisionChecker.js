import Entity        from "../entity/Entity";
import MapHandler    from "../map/MapHandler";
import { TILE_SIZE } from "../game/constants";

let instance = null;

class _CollisionChecker {
  constructor() {
    if (instance) throw new Error("CollisionChecker singleton reconstructed");
    instance = this;
  }

  /**
   * @brief Check if next tile position is solid
   *
   * @param {Entity} entity - Entity to stop if collision occurs
   * @param {Number} dt     - Delta time
   * @param {String} map    - Map the tiles belong to
   */
  checkTile(entity=null, dt=0, map=null) {
    // Four sides of hitbox
    const left   = entity.dst.x + entity.hitbox.x;
    const right  = entity.dst.x + entity.hitbox.x + entity.hitbox.w;
    const top    = entity.dst.y + entity.hitbox.y;
    const bottom = entity.dst.y + entity.hitbox.y + entity.hitbox.h;

    // Entity's placement on map
    let gridLeft   = left   / TILE_SIZE;
    let gridRight  = right  / TILE_SIZE;
    let gridTop    = top    / TILE_SIZE;
    let gridBottom = bottom / TILE_SIZE;

    // Prevent OOB checks
    if ((gridBottom + 0.5) >= MapHandler.getMap(map).height) return;

    // Tile references
    let t1 = false;
    let t2 = false;

    // Check collision based on next position
    // - Up
    if (entity.dir.y < 0) {
      gridTop = (top + entity.vel.y * entity.dir.y * dt) / TILE_SIZE;
      t1 = MapHandler.getMap(map)?.getTile(gridLeft,  gridTop)?.isSolid;
      t2 = MapHandler.getMap(map)?.getTile(gridRight, gridTop)?.isSolid;
    }
    // - Down
    else if (entity.dir.y > 0) {
      gridBottom = (bottom + entity.vel.y * entity.dir.y * dt) / TILE_SIZE;
      t1 = MapHandler.getMap(map)?.getTile(gridLeft,  gridBottom)?.isSolid;
      t2 = MapHandler.getMap(map)?.getTile(gridRight, gridBottom)?.isSolid;
    }
    // - Left
    else if (entity.dir.x < 0) {
      gridLeft = (left + entity.vel.x * entity.dir.x * dt) / TILE_SIZE;
      t1 = MapHandler.getMap(map)?.getTile(gridLeft, gridTop)?.isSolid;
      t2 = MapHandler.getMap(map)?.getTile(gridLeft, gridBottom)?.isSolid;
    }
    // - Right
    else if (entity.dir.x > 0) {
      gridRight = (right + entity.vel.x * entity.dir.x * dt) / TILE_SIZE;
      t1 = MapHandler.getMap(map)?.getTile(gridRight, gridTop)?.isSolid;
      t2 = MapHandler.getMap(map)?.getTile(gridRight, gridBottom)?.isSolid;
    }

    entity.block = t1 || t2;
  }
};

const CollisionChecker = new _CollisionChecker;
export default CollisionChecker;