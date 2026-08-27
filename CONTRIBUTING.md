# 参与开发

感谢你改进 LiquidUI。提交代码前请先创建议题说明使用场景；修复缺陷时请附最小复现，新增公开契约时请同时补充测试和中文文档。

```sh
npm install
npm run check
```

公开组件必须保持受控，不得读取 Router、状态仓库、Cookie、Token 或业务 API。样式应使用 LiquidUI 令牌和 `liqui-` 内部命名空间，不得加入具体业务选择器。涉及视觉变化时，还应在相邻的 `liquid-integration-lab` 中更新并复验快照。

提交信息建议使用 Conventional Commits，例如 `feat: add ...`、`fix: handle ...`、`docs: explain ...`。
