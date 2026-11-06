// 동백이·씨앗이 낙하 물리 (화면 그리기와 분리해 두어 따로 시험할 수 있게 함)

export const CONFIG = {
  START_COUNT: 6, // 처음 떨어지는 캐릭터 수
  MAX_ALIVE: 14, // 이 수를 넘으면
  REMOVE_EACH: 2, // 오래된 것부터 이만큼씩
  FADE_TIME: 1.2, // 서서히 사라지는 시간(초)
  SPAWN_EVERY: 4, // 새 캐릭터가 나타나는 간격(초)
  LIFT: 60, // 공중: 아래로 끄는 힘 (비눗방울처럼 천천히)
  DRAG: 0.8, // 공중: 공기 저항 → 최고 속도 ≈ 75px/s
  SWAY: 28, // 공중: 좌우 흔들림 폭(px)
  GROUND_G: 900, // 한 번 닿은 뒤: 통통 튈 때의 중력
  BOUNCES: [150, 90, 45], // 닿을 때마다 튀어 오르는 속도(px/s) — 통, 통, 통
  FRICTION: 2.5, // 바닥·서로 닿았을 때 미끄러짐 줄이기
  SLEEP_SPEED: 12,
  SLEEP_TIME: 0.5,
};

export type Body = {
  id: number;
  kind: number; // 0 동백이, 1 씨앗이
  size: number; // 그림 크기(px)
  r: number; // 충돌용 반지름
  x: number; // 중심
  y: number;
  vx: number;
  vy: number;
  rot: number;
  phase: number;
  freq: number;
  mode: "air" | "ground" | "sleep";
  bounces: number;
  still: number;
  born: number;
  fade: number; // 1 → 0
  fading: boolean;
};

const rand = (a: number, b: number) => a + Math.random() * (b - a);

export class FallingSim {
  bodies: Body[] = [];
  private nextId = 0;
  private spawnTimer = 0;
  time = 0;

  w: number;
  h: number;
  private small: boolean;

  constructor(w: number, h: number, small: boolean) {
    this.w = w;
    this.h = h;
    this.small = small;
  }

  /** 새 캐릭터를 y 위치에서 떨어뜨림 */
  spawn(y: number) {
    const base = this.small ? rand(96, 126) : rand(144, 186); // 기존 크기의 1.5배
    const kind = this.nextId % 2;
    const size = kind === 0 ? base : base * 0.85;
    this.bodies.push({
      id: this.nextId++,
      kind,
      size,
      r: size * 0.42,
      x: rand(size / 2, Math.max(size / 2, this.w - size / 2)),
      y,
      vx: 0,
      vy: rand(0, 30),
      rot: rand(-10, 10),
      phase: rand(0, Math.PI * 2),
      freq: rand(0.9, 1.5),
      mode: "air",
      bounces: 0,
      still: 0,
      born: this.time,
      fade: 1,
      fading: false,
    });
  }

  /** 처음 6개: 페이지 위쪽~중간 여기저기에서 출발 */
  seed() {
    for (let i = 0; i < CONFIG.START_COUNT; i++) this.spawn(rand(0.02, 0.6) * this.h);
  }

  /** 움직임 줄이기: 바닥에 나란히 앉혀 두기만 */
  seedStatic() {
    for (let i = 0; i < CONFIG.START_COUNT; i++) {
      this.spawn(0);
      const b = this.bodies[i];
      b.x = ((i + 0.5) / CONFIG.START_COUNT) * this.w;
      b.y = this.h - b.r;
      b.mode = "sleep";
      b.rot = 0;
    }
  }

  private impact(b: Body) {
    if (b.mode === "air") {
      b.mode = "ground";
      b.bounces = 0;
    }
    if (b.bounces < CONFIG.BOUNCES.length) {
      b.vy = -CONFIG.BOUNCES[b.bounces++];
    } else if (b.vy > 0) {
      b.vy = 0;
    }
  }

  private wakeAll() {
    for (const b of this.bodies) {
      if (b.mode === "sleep") {
        b.mode = "ground";
        b.bounces = CONFIG.BOUNCES.length; // 다시 튀지 않고 아래로 내려앉기만
        b.still = 0;
      }
    }
  }

  /** viewTopY: 지금 보이는 화면의 맨 위(무대 기준 y) — 새 캐릭터가 여기 바로 위에서 나타남 */
  step(dtTotal: number, viewTopY: number) {
    this.time += dtTotal;

    // 1) 새 캐릭터 등장
    this.spawnTimer += dtTotal;
    if (this.spawnTimer >= CONFIG.SPAWN_EVERY) {
      this.spawnTimer = 0;
      this.spawn(Math.max(viewTopY, 0) - 120);
    }

    // 2) 14개를 넘으면 오래된 것부터 2개씩 서서히 사라지게
    const alive = this.bodies.filter((b) => !b.fading);
    if (alive.length > CONFIG.MAX_ALIVE) {
      alive
        .sort((a, b) => (a.mode === "air" ? 1 : 0) - (b.mode === "air" ? 1 : 0) || a.born - b.born)
        .slice(0, CONFIG.REMOVE_EACH)
        .forEach((b) => (b.fading = true));
    }
    let removed = false;
    this.bodies = this.bodies.filter((b) => {
      if (!b.fading) return true;
      b.fade -= dtTotal / CONFIG.FADE_TIME;
      if (b.fade > 0) return true;
      removed = true;
      return false;
    });
    if (removed) this.wakeAll(); // 밑에 있던 게 사라지면 위에 있던 것들이 내려앉음

    // 3) 물리 (작게 나눠 계산해 안정적으로)
    const steps = 3;
    const dt = dtTotal / steps;
    for (let s = 0; s < steps; s++) this.substep(dt);
  }

  private substep(dt: number) {
    const C = CONFIG;
    for (const b of this.bodies) {
      if (b.mode === "sleep") continue;
      if (b.mode === "air") {
        b.vy += (C.LIFT - C.DRAG * b.vy) * dt;
        const swayV = C.SWAY * b.freq * Math.cos(this.time * b.freq + b.phase);
        b.x += swayV * dt;
        b.rot = Math.sin(this.time * b.freq * 0.8 + b.phase) * 14;
      } else {
        b.vy += C.GROUND_G * dt;
        b.rot += ((b.vx * dt) / b.r) * (180 / Math.PI) * 0.5; // 굴러가는 느낌
      }
      b.x += b.vx * dt;
      b.y += b.vy * dt;

      // 좌우 벽
      if (b.x - b.r < 0) {
        b.x = b.r;
        b.vx = Math.abs(b.vx) * 0.4;
      } else if (b.x + b.r > this.w) {
        b.x = this.w - b.r;
        b.vx = -Math.abs(b.vx) * 0.4;
      }

      // 바닥
      if (b.y + b.r > this.h) {
        b.y = this.h - b.r;
        this.impact(b);
        b.vx *= 1 - Math.min(1, C.FRICTION * dt);
      }
    }

    // 서로 부딪힘 → 위에 올라타면 통통 튀고, 비스듬하면 옆으로 미끄러져 쌓임
    const n = this.bodies.length;
    for (let i = 0; i < n; i++) {
      for (let j = i + 1; j < n; j++) {
        const a = this.bodies[i];
        const b = this.bodies[j];
        if (a.fading || b.fading) continue;
        const dx = b.x - a.x;
        const dy = b.y - a.y;
        const dist = Math.hypot(dx, dy) || 0.001;
        const overlap = a.r + b.r - dist;
        if (overlap <= 0) continue;
        const nx = dx / dist;
        const ny = dy / dist;
        const aFixed = a.mode === "sleep";
        const bFixed = b.mode === "sleep";
        if (aFixed && bFixed) continue;
        // 겹친 만큼 밀어내기
        const wa = aFixed ? 0 : bFixed ? 1 : 0.5;
        const wb = 1 - wa;
        a.x -= nx * overlap * wa;
        a.y -= ny * overlap * wa;
        b.x += nx * overlap * wb;
        b.y += ny * overlap * wb;
        // 위에 있는 쪽은 '착지'로 처리
        const top = ny > 0 ? a : b; // ny>0 이면 b가 아래, a가 위
        const under = top === a ? b : a;
        if (top.mode !== "sleep" && Math.abs(ny) > 0.5) {
          if (top.vy > under.vy) this.impact(top);
          // 비스듬히 올라탔으면 옆으로 미끄러지기
          const side = top === a ? -nx : nx;
          top.vx += side * 220 * (1 - Math.abs(ny));
          top.vx *= 1 - Math.min(1, CONFIG.FRICTION * dt);
        } else if (Math.abs(ny) <= 0.5) {
          // 옆으로 부딪힘
          const rv = (b.vx - a.vx) * nx;
          if (rv < 0) {
            if (!aFixed) a.vx += rv * 0.5 * nx;
            if (!bFixed) b.vx -= rv * 0.5 * nx;
          }
        }
      }
    }

    // 서로 밀어낸 뒤에도 바닥·벽 밖으로 나가지 않게 다시 맞추기
    for (const b of this.bodies) {
      if (b.y + b.r > this.h) {
        b.y = this.h - b.r;
        if (b.vy > 0) b.vy = 0;
      }
      if (b.x - b.r < 0) b.x = b.r;
      else if (b.x + b.r > this.w) b.x = this.w - b.r;
    }

    // 잠들기: 거의 안 움직이면 고정 (쌓인 더미가 흔들리지 않게)
    for (const b of this.bodies) {
      if (b.mode !== "ground") continue;
      if (Math.abs(b.vx) < CONFIG.SLEEP_SPEED && Math.abs(b.vy) < CONFIG.SLEEP_SPEED * 4 && b.bounces >= CONFIG.BOUNCES.length) {
        b.still += dt;
        if (b.still > CONFIG.SLEEP_TIME) {
          b.mode = "sleep";
          b.vx = 0;
          b.vy = 0;
        }
      } else {
        b.still = 0;
      }
    }
  }
}
