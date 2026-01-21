# WebGame - SpaceCraft.io

Game IO không gian vũ trụ thời gian thực. Người chơi điều khiển tàu vũ trụ, thu thập tài nguyên, nâng cấp vũ khí và chiến đấu PvP trong hai chế độ: **Endless** (vô tận) và **Arena** (đấu trường).

## Công nghệ

| Phần | Công nghệ |
|------|-----------|
| Frontend | React 18, Phaser 3, Vite 5 |
| Backend | Node.js v18+, Express 4, WebSocket (`ws`), MongoDB Atlas (`mongoose`) |
| Shared | Logic/constants dùng chung cho cả client và server |
| Auth | JWT (`jsonwebtoken`), bcryptjs |

## Tính năng chính

- **PvP thời gian thực** — Chiến đấu mượt mà nhờ client-side interpolation & projectile extrapolation
- **Chế độ Endless** — Map vô tận, thu thập điểm, cạnh tranh bảng xếp hạng toàn server
- **Chế độ Arena** — Battle royale 10 người hoặc 1v1, có zone thu hẹp
- **Hệ thống vũ khí** — 3 loại vũ khí (Blue/Green/Red) với cơ chế nạp đạn
- **Hệ thống items** — Shield, Speed Boost, Invisible, Bomb
- **Bảng xếp hạng & thống kê** — Lưu kills, score, coins vào MongoDB Atlas
- **Hệ thống tài khoản** — Đăng ký / đăng nhập, trang bị skin tàu

---

## Yêu cầu hệ thống

- **Node.js** v18 trở lên ([nodejs.org](https://nodejs.org))
- **npm** v8 trở lên (đi kèm Node.js)
- Kết nối Internet (để kết nối MongoDB Atlas)

---

## Cài đặt & Chạy (Development)

### Bước 1 — Clone repository

```bash
git clone <repository-url>
cd WebGame
```

### Bước 2 — Cài đặt tất cả dependencies

Chạy **một lần duy nhất** tại thư mục gốc:

```bash
npm run install-all
```

Lệnh này cài đặt dependencies cho cả 3 package: `shared`, `server`, `client`.

### Bước 3 — Tạo file cấu hình server

Tạo file `server/.env` với nội dung sau:

```env
MONGODB_URI=mongodb+srv://<user>:<password>@<cluster>.mongodb.net/webgame?appName=<AppName>
JWT_SECRET=your-super-secret-jwt-key-change-this
WS_PORT=3000
HTTP_PORT=8080
NODE_ENV=development
CLIENT_URL=http://localhost:5173
```


### Bước 4 — Chạy Development

```bash
npm run dev
```

Lệnh này khởi chạy **đồng thời** cả server và client:

| Service | URL |
|---------|-----|
| Client (Vite) | http://localhost:5173 |
| Server HTTP (REST API) | http://localhost:8080 |
| Server WebSocket | ws://localhost:3000 |

Mở trình duyệt tại **http://localhost:5173** để chơi.

---

## Cấu trúc dự án

```
WebGame/
├── package.json          # Root workspace config
├── shared/               # Code dùng chung (constants, packetTypes, utils)
├── server/               # Game server (Node.js)
│   ├── src/
│   │   ├── index.js      # Entry point
│   │   ├── config.js     # Cấu hình (đọc từ .env)
│   │   ├── api/          # REST API (auth, leaderboard, friends)
│   │   ├── arena/        # Arena mode logic
│   │   ├── core/         # Game loop, physics, collision
│   │   ├── entities/     # Player, Bot, Projectile, ...
│   │   └── db/           # MongoDB models
│   └── .env              # ← Tạo file này (không commit)
└── client/               # Game client (React + Phaser)
    ├── src/
    │   ├── game/         # Phaser scenes & entities
    │   ├── components/   # React UI (HUD, HomeScreen, ...)
    │   └── network/      # WebSocket client
    └── public/           # Assets (sprites, sounds, ...)
```

---

## Scripts có sẵn

Chạy tại thư mục gốc (`E:\WebGame\WebGame`):

| Script | Mô tả |
|--------|-------|
| `npm run install-all` | Cài đặt tất cả dependencies |
| `npm run dev` | Chạy cả server + client (development) |
| `npm run dev:server` | Chỉ chạy server (auto-reload với `--watch`) |
| `npm run dev:client` | Chỉ chạy client (Vite HMR) |
| `npm run build` | Build client cho production |
| `npm run start` | Chạy server (production, không auto-reload) |

---

## API Endpoints

Base URL: `http://localhost:8080`

| Method | Endpoint | Mô tả |
|--------|----------|-------|
| POST | `/api/auth/register` | Đăng ký tài khoản |
| POST | `/api/auth/login` | Đăng nhập |
| GET | `/api/auth/profile` | Lấy thông tin tài khoản (cần JWT) |
| GET | `/api/leaderboard` | Bảng xếp hạng |

**Ví dụ đăng ký:**
```bash
curl -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"player1","email":"player1@example.com","password":"123456"}'
```

---

## Điều khiển trong game

| Phím | Hành động |
|------|-----------|
| `W` / `↑` | Tiến lên |
| `S` / `↓` | Lùi lại |
| `A` / `←` | Xoay trái |
| `D` / `→` | Xoay phải |
| `Space` | Bắn |
| `Shift` | Boost |
| `1` `2` `3` `4` `5` | Chọn slot item |
| `E` | Sử dụng item đang chọn |

---

## Xử lý lỗi thường gặp

**Server không kết nối được MongoDB:**
- Kiểm tra `MONGODB_URI` trong `server/.env` có đúng không
- Kiểm tra IP của máy đã được whitelist trong MongoDB Atlas Network Access

**Port đã bị dùng (EADDRINUSE):**
```powershell
# Kiểm tra và kill process đang dùng port 8080
Get-NetTCPConnection -LocalPort 8080 | ForEach-Object { Stop-Process -Id $_.OwningProcess -Force }
```

**Lỗi `Cannot find module` khi chạy server:**
- Đảm bảo đang chạy từ thư mục `server/`: `cd server ; node src/index.js`
- Hoặc dùng lệnh root: `npm run dev:server`
