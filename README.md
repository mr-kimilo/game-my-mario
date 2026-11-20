<p align="center">
  <img src="docs/readme/montage.gif" width="800" alt="A grid of pixel art effects from the pixelfx engine playing at once.">
</p>

# 马里奥 · 中国巡礼

**一个用代码实时绘制的像素风横版闯关游戏。** 6 座城市、30 个景点关卡、双人同屏、手柄支持，
画面中没有一个位图素材——地形、角色、金币、火球、烟花全部由 [pixelfx](docs/AUTHORING.md) 引擎逐帧画出来。

[玩法说明](play.md) · [特效目录](docs/CATALOG.md) · [创作规范](docs/AUTHORING.md) · [画廊](gallery/)

## 快速开始

需要 Node.js 18+（只用于起静态服务器，游戏本身零依赖）。

```bash
node tools/serve.mjs 8321
```

| 地址 | 内容 |
|---|---|
| http://localhost:8321/mario.html | 游戏本体（主菜） |
| http://localhost:8321/index.html | 大厅：全库 232 个特效实时预览 |
| http://localhost:8321/gallery/ | 官方画廊：调色板、背景、导出精灵图 |

## 玩法

- **模式**：1 人 / 2 人同屏（共享画面，协作闯关）/ 2 人轮流（比分定胜负）
- **难度**：简单（坑窄怪少、400 秒）/ 正常（300 秒）/ 困难（怪多且快、250 秒）
- **城市**：成都 · 重庆 · 西安 · 北京 · 上海 · 深圳，每城 5 个景点连打
- **操作**：P1 `A/D` 移动、`W/空格` 跳、`J/F` 火球；P2 `←/→`、`↑`、`回车`；`M` 静音、`R` 重开、`Esc` 回菜单
- **手柄**：左摇杆/十字键移动、`A/B` 跳、`X/Y` 火球、`Start` 重开
- **其他**：金币攒满 100 加命、问号块出蘑菇/金币、变大后可顶碎砖块、踩怪或火球击杀、碰到旗杆过关、本地 Top 10 排行榜

完整规则（含 2 人同屏细节、每城景点清单）见 [play.md](play.md)。

## 项目结构

```
mario.html       游戏本体：菜单、物理、碰撞、渲染、音效（单文件）
game-levels.js   关卡生成：城市/景点主题、难度曲线、地形与敌人布局
index.html       大厅：把整库特效同时跑起来，用于挑特效
src/core/        引擎核心：帧缓冲、painter、粒子、模拟、调色板
src/fx/          232 个特效，按火/冰/光/暗/天气/UI 等分类，每个一个文件
gallery/         画廊：实时调色板、背景切换、精灵图导出
tools/           静态服务器、渲染、检查、导出、新特效脚手架
docs/            特效目录与创作规范
skills/          pixelfx 的 Claude Code 技能（用同样的标准写新特效）
```

## 画面上的一切都是代码

游戏只依赖引擎的两个能力：**帧缓冲**（`color` 像素 + `light` 叠加光）和**特效**（`createFx(effect, opts)`）。
金币旋转、踩怪烟尘、火球、烟花、祝福光环都直接复用 `src/fx` 里的实现，
所有随机数都来自 `seed`，所以回放、重开和不同帧率下的表现一致。

特效可以单独用在自己的项目里：`import * as frostNova from "pixelfx/fx/ice/frost-nova"`；
给 Godot / Unity / GameMaker 用就导出精灵图：

```bash
node tools/render.mjs ice/frost-nova --sheet   # 透明 PNG + Aseprite 风格 JSON
node tools/sheets.mjs                          # 导出整库到 sheets/
```

## 许可证与致谢

MIT，代码与特效均可商用，见 [LICENSE](LICENSE)。

- 引擎 `pixelfx` 来自 [Patch](https://patch.gg)，本仓库在其基础上加了游戏、大厅与关卡。
- `src/core/sim.js` 以及文件头注明来源的特效改编自 [Hugo Duprez](https://x.com/HugoDuprez) 的
  [Sprite Fusion 开源像素 VFX](https://www.spritefusion.com/pixel-art-vfx)（MIT）。
- `gallery/fonts` 中的 Patch Pixel 字体为 Patch 自有，不在 MIT 许可范围内。

细节见 [NOTICE.md](NOTICE.md)。
