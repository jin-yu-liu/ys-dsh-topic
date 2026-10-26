# DSH Topic

DSH 社区主题目录（topic/theme）。`dsh-leap` 插件从本仓库的 `catalog.json` 获取主题，并仅把通过白名单校验的 DSH 设计 token 应用到浅色与深色外观。

主题是纯数据，不是插件：仓库不接收 JavaScript、任意 CSS、HTML 或远程字体。这样既方便社区提交，也避免主题成为代码执行或数据外传通道。

## 目录格式

```text
catalog.json             唯一发布入口
scripts/validate.mjs     零依赖结构与安全检查
package.json             npm run validate
```

`catalog.json` 使用稳定的 `format: 1`，并带可读的 `version`。插件忽略未知字段，因此后续可以向后兼容地增加元数据；删除或改变现有字段语义时必须升级 `format`。

## Topic 收录规则

1. **标识稳定。** `id` 使用小写字母、数字和连字符，最长 64 个字符，仓库内唯一。`default` 为保留主题，必须存在且 token 为空。
2. **中英文可发现。** `name` 至少包含 `zh` 和 `en`；名称简短、客观，不使用他人商标制造官方背书。
3. **浅色/深色成对。** `tokens.light` 与 `tokens.dark` 都必须存在。可以为空，但不能只提交一种外观。主题应与 DSH“通用 → 外观”的模式切换叠加生效。
4. **只覆盖 DSH alias token。** 键必须匹配 `--dsw-alias-[a-z0-9-]+`。不接收基础组件内部 token，也不接收 CSS 选择器、变量定义块或任意样式表。
5. **值只允许颜色。** 支持十六进制、`rgb/rgba`、`hsl/hsla` 颜色；禁止 `url()`、`var()`、`calc()`、图片、字体、动画和脚本。插件还会在运行时再次过滤。
6. **先小后大。** 优先覆盖品牌色、主按钮和基础背景等少量稳定 alias；避免一次重写大量 token，以降低 DSH 升级后的视觉回归风险。
7. **预览真实。** `preview` 提供 2–5 个与主题一致的颜色，首个为主色、第二个为主要背景色；颜色格式与 token 值规则相同。
8. **可访问性。** 正文与背景、按钮文字与按钮背景应达到 WCAG 2.2 AA 的常规文本对比度（通常至少 4.5:1）；不能只靠颜色表达状态。浅色与深色都要人工检查。
9. **不改变行为。** 主题只能改变视觉 token，不能隐藏安全提示、弱化禁用态、改变布局语义或模拟其他站点/品牌的登录界面。
10. **兼容当前 DSH。** 提交前在仓库支持的最低 DSH 版本和当前版本各检查一次；不存在或已废弃的 token 不收录。若 DSH 更名 token，应在一个兼容窗口内保留旧主题可用性。

最小示例：

```json
{
  "id": "example",
  "name": { "zh": "示例", "en": "Example" },
  "preview": ["#2457d6", "#f7f9ff"],
  "tokens": {
    "light": { "--dsw-alias-brand-primary": "#2457d6" },
    "dark": { "--dsw-alias-brand-primary": "#7da2ff" }
  }
}
```

## 提交流程

1. 在 `catalog.json` 的 `themes` 中新增一项，不修改其他主题的含义或顺序。
2. 运行 `npm run validate`。
3. 在 DSH 浅色、深色模式各截图验证设置页、会话页、按钮、输入框、禁用态、错误态和焦点态。
4. 合并请求需写明设计目标、测试的 DSH 版本、覆盖的 token、对比度结果和截图；改编自第三方配色时注明来源与许可证。
5. 维护者按安全、可读性、可访问性、DSH 兼容性、与现有主题的差异度评审。只改名称、对比度不合格或依赖未公开内部 token 的主题不会收录。

插件默认读取：`https://gitee.com/leapai/dsh-topic/raw/master/catalog.json`。

