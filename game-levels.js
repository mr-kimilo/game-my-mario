// 中国城市主题、景点剪影与关卡生成器。
// 关卡 = 手工调好的段落（平地/坑/台阶/水管/砖块/浮台/敌群）按种子拼装，坑宽与敌人密度由难度决定。

// ---------------- 难度 ----------------
export const DIFFS = [
  { id: "easy", name: "简单", pitMax: 2, pitChance: 0.45, goomba: 0.4, speed: 18, time: 400 },
  { id: "normal", name: "正常", pitMax: 3, pitChance: 0.75, goomba: 0.8, speed: 22, time: 300 },
  { id: "hard", name: "困难", pitMax: 3, pitChance: 1.0, goomba: 1.4, speed: 30, time: 250 },
];

// ---------------- 城市主题 ----------------
// sky: 天空渐变 [顶, 底]；hill: 远山；sil: 剪影色；night: 夜景（窗户亮灯）；ground: 地砖配色
export const CITIES = [
  { id: "chengdu", name: "成都", sky: ["#8ad8b8", "#fff0c0"], hill: "#4a9868", sil: "#1f5038", night: false, ground: ["#4a3410", "#9a6828", "#d89848"] },
  { id: "chongqing", name: "重庆", sky: ["#1a1040", "#702070"], hill: "#3a2060", sil: "#120828", night: true, ground: ["#181028", "#483060", "#685088"] },
  { id: "xian", name: "西安", sky: ["#f89848", "#ffd890"], hill: "#a05828", sil: "#502408", night: false, ground: ["#3c2008", "#885018", "#c08030"] },
  { id: "beijing", name: "北京", sky: ["#88b0d8", "#e0ecf4"], hill: "#5878a0", sil: "#283850", night: false, ground: ["#383028", "#786850", "#a08868"] },
  { id: "shanghai", name: "上海", sky: ["#0c1838", "#3050a8"], hill: "#1a3070", sil: "#080e28", night: true, ground: ["#101828", "#30405c", "#485878"] },
  { id: "shenzhen", name: "深圳", sky: ["#58c0f0", "#d8f4ff"], hill: "#3890b8", sil: "#184868", night: false, ground: ["#203838", "#487068", "#58988a"] },
];

// ---------------- 景点剪影 ----------------
// 形状原语，原点在地面基线（y=0，向上为负）：
// ["r",x,y,w,h] 矩形  ["roof",x,y,w,h] 中式挑檐屋顶  ["c",x,y,r] 圆  ["t",x,y,w,h] 三角
// ["l",x0,y0,x1,y1] 线  ["win",x,y,w,h] 区域内的亮窗点阵（夜景用）
const R = (x, y, w, h) => ["r", x, y, w, h];
const ROOF = (x, y, w, h) => ["roof", x, y, w, h];
const C = (x, y, r) => ["c", x, y, r];
const TRI = (x, y, w, h) => ["t", x, y, w, h];
const L = (x0, y0, x1, y1) => ["l", x0, y0, x1, y1];
const WIN = (x, y, w, h) => ["win", x, y, w, h];

function pagoda(x, w, tiers, th = 11) {
  const s = [];
  for (let i = 0; i < tiers; i++) {
    const y = -(i + 1) * th, ww = w - i * (w / (tiers + 2));
    s.push(R(x - ww / 2 + 2, y + th * 0.45, ww - 4, th * 0.55), ROOF(x - ww / 2 - 3, y + th * 0.45, ww + 6, th * 0.45));
  }
  s.push(L(x, -tiers * th, x, -tiers * th - 6));
  return s;
}
function tower(x, w, h, win = true) {
  const s = [R(x - w / 2, -h, w, h)];
  if (win) s.push(WIN(x - w / 2 + 2, -h + 3, w - 4, h - 6));
  return s;
}
function gate(x, w, h) {
  return [R(x - w / 2, -h, 4, h), R(x + w / 2 - 4, -h, 4, h), R(x - w / 2 - 2, -h - 6, w + 4, 5), ROOF(x - w / 2 - 8, -h - 6, w + 16, 10)];
}

// 每个城市 5 个景点：{ name, shapes }
export const LANDMARKS = [
  [ // 成都
    { name: "大熊猫基地", shapes: [R(-50, -34, 3, 34), R(-38, -42, 3, 42), R(-26, -30, 3, 30), R(-14, -38, 3, 38), L(-50, -20, -47, -20), L(-50, -12, -47, -12), L(-38, -26, -35, -26), L(-38, -16, -41, -16), L(-26, -18, -23, -18), L(-14, -22, -11, -22), C(18, -12, 13), C(18, -30, 9), C(11, -38, 4), C(25, -38, 4), C(52, -10, 8)] },
    { name: "宽窄巷子", shapes: [...gate(-20, 36, 30), ...pagoda(28, 30, 2, 12), R(48, -18, 22, 18), ROOF(44, -18, 30, 8)] },
    { name: "锦里", shapes: [...pagoda(-10, 44, 4, 12), WIN(-14, -30, 8, 20), R(30, -20, 26, 20), ROOF(26, -20, 34, 9), WIN(34, -16, 18, 10)] },
    { name: "武侯祠", shapes: [R(-45, -6, 90, 6), R(-36, -22, 72, 16), ROOF(-46, -22, 92, 12), R(-24, -34, 48, 10), ROOF(-34, -34, 68, 10)] },
    { name: "都江堰", shapes: [R(-60, -8, 120, 4), TRI(-48, -4, 16, -14), TRI(-14, -4, 16, -14), TRI(24, -4, 16, -14), L(-60, 2, -20, 2), L(-10, 3, 30, 3), L(40, 2, 60, 2)] },
  ],
  [ // 重庆
    { name: "洪崖洞", shapes: [R(-35, -16, 30, 16), R(-30, -30, 36, 14), R(-25, -44, 30, 14), R(-20, -58, 26, 14), WIN(-33, -14, 26, 40), L(-30, 0, -30, 8), L(-12, 0, -12, 8), L(0, 0, 0, 8), ...tower(28, 18, 46)] },
    { name: "解放碑", shapes: [R(-16, -8, 32, 8), R(-6, -52, 12, 44), R(-10, -58, 20, 6), L(0, -58, 0, -66), C(0, -68, 2), ...tower(-38, 16, 30), ...tower(30, 20, 38)] },
    { name: "长江索道", shapes: [R(-58, -50, 6, 50), R(52, -44, 6, 44), L(-55, -48, 55, -42), R(-18, -46, 12, 8), L(-12, -46, -12, -42), R(18, -44, 12, 8), L(24, -44, 24, -40)] },
    { name: "磁器口", shapes: [...gate(0, 40, 32), R(-52, -16, 24, 16), ROOF(-56, -16, 32, 8), R(34, -14, 22, 14), ROOF(30, -14, 30, 7)] },
    { name: "李子坝轻轨", shapes: [R(-22, -64, 44, 64), WIN(-18, -60, 36, 26), R(-50, -28, 90, 6), R(-44, -32, 14, 4), R(36, -32, 14, 4), R(-30, -34, 60, 6)] },
  ],
  [ // 西安
    { name: "兵马俑", shapes: [...[-48, -32, -16, 0, 16, 32, 48].flatMap((x) => [R(x - 3, -12, 6, 12), C(x, -15, 3)]), ...[-40, -24, -8, 8, 24, 40].flatMap((x) => [R(x - 3, -10, 6, 10), C(x, -13, 3)])] },
    { name: "大雁塔", shapes: pagoda(0, 52, 7, 10) },
    { name: "西安钟楼", shapes: [R(-30, -10, 60, 10), R(-22, -24, 44, 14), ROOF(-30, -24, 60, 10), R(-14, -36, 28, 8), ROOF(-22, -36, 44, 9), L(0, -45, 0, -52)] },
    { name: "古城墙", shapes: [R(-70, -16, 140, 16), ...[-64, -44, -24, -4, 16, 36, 56].map((x) => R(x, -20, 6, 4)), R(-8, -34, 16, 18), ROOF(-14, -34, 28, 8)] },
    { name: "回民街", shapes: [...gate(-30, 28, 24), C(22, -18, 12), R(22, -18, 24, 18), R(44, -34, 5, 34), C(46, -36, 3)] },
  ],
  [ // 北京
    { name: "天安门", shapes: [R(-46, -18, 92, 18), R(-40, -34, 80, 16), ROOF(-50, -34, 100, 12), R(-6, -30, 12, 10), R(-18, -8, 6, 8), R(-3, -8, 6, 8), R(12, -8, 6, 8)] },
    { name: "故宫", shapes: [R(-56, -8, 112, 8), R(-44, -20, 30, 12), ROOF(-50, -20, 42, 9), R(-12, -26, 36, 18), ROOF(-20, -26, 52, 11), R(26, -18, 26, 10), ROOF(21, -18, 36, 8)] },
    { name: "长城", shapes: [TRI(-70, 0, 50, -26), TRI(-20, 0, 60, -34), TRI(30, 0, 50, -22), L(-52, -18, -2, -28), L(-2, -28, 48, -16), R(-16, -40, 10, 12), R(34, -28, 10, 10)] },
    { name: "天坛", shapes: [R(-34, -8, 68, 8), R(-26, -18, 52, 10), C(0, -28, 20), C(0, -42, 14), C(0, -53, 9), L(0, -60, 0, -66)] },
    { name: "鸟巢", shapes: [C(0, -18, 30), L(-26, -30, 26, -6), L(-26, -6, 26, -30), L(0, -46, 0, 8), L(-30, -18, 30, -18)] },
  ],
  [ // 上海
    { name: "东方明珠", shapes: [L(-10, 0, 0, -70), L(10, 0, 0, -70), C(0, -26, 11), C(0, -52, 8), L(0, -70, 0, -88), C(0, -90, 2), R(-16, -4, 32, 4)] },
    { name: "外滩", shapes: [R(-56, -24, 22, 24), C(-45, -26, 8), R(-28, -32, 18, 32), R(-25, -40, 12, 8), C(-19, -42, 4), R(-4, -20, 24, 20), ROOF(-8, -20, 32, 8), ...tower(34, 16, 40, false)] },
    { name: "豫园", shapes: [...pagoda(-16, 36, 3, 11), L(8, -6, 20, -12), L(20, -12, 32, -6), L(32, -6, 44, -12), R(48, -20, 20, 20), ROOF(44, -20, 28, 8)] },
    { name: "南京路", shapes: [R(-52, -26, 20, 26), WIN(-50, -24, 16, 8), R(-26, -34, 24, 34), WIN(-24, -32, 20, 10), R(4, -28, 20, 28), WIN(6, -26, 16, 8), R(30, -38, 6, 38), R(36, -38, 12, 8)] },
    { name: "上海中心", shapes: [R(-14, -88, 24, 88), R(-10, -94, 20, 6), WIN(-10, -84, 16, 76), ...tower(-38, 14, 44), ...tower(30, 18, 56)] },
  ],
  [ // 深圳
    { name: "平安金融中心", shapes: [R(-12, -96, 24, 96), TRI(-12, -96, 24, -10), L(0, -106, 0, -114), WIN(-8, -92, 16, 84), ...tower(-40, 16, 52), ...tower(34, 18, 62)] },
    { name: "世界之窗", shapes: [L(-22, 0, 0, -52), L(22, 0, 0, -52), L(-14, -18, 14, -18), L(-7, -34, 7, -34), L(-22, 0, 22, 0), L(0, -52, 0, -60), C(0, -62, 2)] },
    { name: "东部华侨城", shapes: [C(0, -34, 26), L(0, -34, 0, -8), L(-22, -48, 22, -20), L(-22, -20, 22, -48), L(-26, -34, 26, -34), R(-10, -8, 20, 8), ...[-19, 0, 19].flatMap((x) => [C(x, -52 + Math.abs(x) * 0.6, 2)])] },
    { name: "深圳湾大桥", shapes: [R(-64, -6, 128, 4), R(-30, -34, 5, 30), R(25, -34, 5, 30), L(-27, -32, -56, -6), L(-27, -32, -2, -6), L(28, -32, 2, -6), L(28, -32, 56, -6), L(-60, 3, -20, 3), L(0, 4, 40, 4)] },
    { name: "市民中心", shapes: [R(-8, -10, 16, 10), TRI(-70, 0, 62, -30), TRI(8, -30, 62, 30), R(-60, -4, 120, 4)] },
  ],
];

// ---------------- 关卡生成 ----------------
function mulberry32(a) {
  return () => {
    a |= 0; a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const ROWS = 12;
/**
 * 生成一关：返回 12 行字符串。
 * 图例同 mario.html：# 地面  B 砖块  ? 问号(金币)  M 问号(蘑菇)  P 水管  o 金币  E 板栗仔  F 旗杆
 */
export function buildLevel(ci, li, di) {
  const d = DIFFS[di];
  const rng = mulberry32(ci * 7919 + li * 104729 + di * 31 + 7);
  const cols = [];
  const ground = () => { const c = Array(ROWS).fill(" "); c[10] = "#"; c[11] = "#"; return c; };
  const flat = (n) => { for (let i = 0; i < n; i++) cols.push(ground()); };
  const pick = (arr) => arr[(rng() * arr.length) | 0];

  flat(9); // 出生安全区
  const nSeg = 9 + li;
  for (let s = 0; s < nSeg; s++) {
    const roll = rng();
    if (roll < 0.22 * d.pitChance) {
      // 坑（简单难度坑更窄），坑上方常挂金币弧
      const w = 2 + ((rng() * (d.pitMax - 1)) | 0);
      const base = cols.length;
      for (let i = 0; i < w; i++) cols.push(Array(ROWS).fill(" "));
      flat(2 + ((rng() * 3) | 0));
      if (rng() < 0.6) for (let i = 0; i < w + 2; i++) cols[base - 1 + i][7 - Math.round(Math.sin((i / (w + 1)) * Math.PI) * 1.5)] = "o";
    } else if (roll < 0.38) {
      // 台阶上去再下来
      const h = 2 + ((rng() * 2) | 0);
      for (let i = 1; i <= h; i++) for (let k = 0; k < 2; k++) { const c = ground(); for (let r = 0; r < i; r++) c[9 - r] = "#"; cols.push(c); }
      for (let k = 0; k < 2; k++) { const c = ground(); for (let r = 0; r < h; r++) c[9 - r] = "#"; cols.push(c); } // 顶部平台
      for (let i = h - 1; i >= 1; i--) for (let k = 0; k < 2; k++) { const c = ground(); for (let r = 0; r < i; r++) c[9 - r] = "#"; cols.push(c); }
    } else if (roll < 0.52) {
      // 水管阵
      flat(1);
      const n = 1 + ((rng() * 2) | 0);
      for (let i = 0; i < n; i++) { const c = ground(); c[9] = "P"; if (rng() < 0.5) c[8] = "P"; cols.push(c); flat(1 + ((rng() * 2) | 0)); }
      if (rng() < d.goomba) { const c = ground(); c[9] = "E"; cols.push(c); }
      flat(2);
    } else if (roll < 0.68) {
      // 砖块问号排
      const pat = ["?B?B?", "B?B?B", "??B??", "B?M?B", "?BB B?"];
      const row7 = pick(pat);
      for (let i = 0; i < row7.length; i++) { const c = ground(); if (row7[i] !== " ") c[7] = row7[i]; cols.push(c); }
      if (rng() < 0.5) { const c = ground(); c[6] = "o"; cols.push(c); const c2 = ground(); c2[6] = "o"; cols.push(c2); }
      flat(1);
    } else if (roll < 0.82) {
      // 浮台 + 金币
      const w = 3 + ((rng() * 3) | 0), yr = pick([6, 7]);
      for (let i = 0; i < w; i++) { const c = ground(); c[yr] = "#"; if (rng() < 0.5) c[yr - 2] = "o"; cols.push(c); }
      if (rng() < d.goomba) { const c = ground(); c[9] = "E"; cols.push(c); }
      flat(2);
    } else {
      // 敌群巡逻
      const n = 1 + ((rng() * (d.goomba > 1 ? 3 : 2)) | 0);
      flat(1);
      for (let i = 0; i < n; i++) { const c = ground(); if (rng() < d.goomba) c[9] = "E"; cols.push(c); flat(1 + ((rng() * 2) | 0)); }
      flat(1);
    }
  }
  flat(8); // 终点前缓冲
  // 旗杆
  const fc = ground(); fc[9] = "F"; cols.push(fc);
  flat(3);

  // 转成 12 行字符串
  const rows = [];
  for (let r = 0; r < ROWS; r++) rows.push(cols.map((c) => c[r]).join(""));
  return rows;
}

export function levelTitle(ci, li) {
  return `${CITIES[ci].name} · ${LANDMARKS[ci][li].name}`;
}
