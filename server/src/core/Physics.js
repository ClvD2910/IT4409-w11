// server/src/core/Physics.js
import { MAP_SIZE } from 'shared/constants';
import { Quadtree } from '../utils/Quadtree.js';
import { CollisionResolver } from './physics/CollisionResolver.js';
import { CollisionDetector } from './physics/CollisionDetector.js';

export class Physics {
    constructor(game) {
        this.game = game;
        // Khởi tạo Resolver và Detector
        this.resolver = new CollisionResolver(game);
        this.detector = new CollisionDetector(game, this.resolver);
    }

    checkCollisions() {
        // 1. Build Quadtree cho frame hiện tại
        const boundary = { x: 0, y: 0, width: MAP_SIZE, height: MAP_SIZE };
        const qt = new Quadtree(boundary, 4);

        this.game.players.forEach(player => {
            qt.insert({ x: player.x, y: player.y, userData: player });
        });

        // 2. Build Quadtree cho foods (tránh O(n*m) linear scan)
        const foodQt = new Quadtree(boundary, 8);
        this.game.world.foods.forEach(food => {
            foodQt.insert({ x: food.x, y: food.y, userData: food });
        });

        // 3. Chạy Detection (Detector sẽ gọi Resolver nếu cần)
        this.detector.checkProjectiles(qt);
        this.detector.checkPlayers(qt, foodQt);
        this.detector.checkExplosions();
    }
}
