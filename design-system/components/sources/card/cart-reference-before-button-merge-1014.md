# Cart — AI 调用参考

此文件自动生成，请修改组件契约、Preview、Token 或图标源文件，再运行 npm run component:sync。

范围：necessary-product-card-cart-default-hover；视觉审阅：pending。

Only actual Card product purchase/recent-view Add slots; fixed Add label and official whiteCart1; no other Cart usage or unverified states.

必须加载：components/tokens.css、components/cart-current.css。

字体样式表：https://fonts.googleapis.com/css2?family=Open+Sans:wght@400;600&display=swap。

button type=button with fixed official icon and Add span; host owns assembly position and business event only.



不可修改：button root and type；official14px icon and Add label；atom-owned padding/gap/font/radius/paint。

## product-card

用：仅嵌入真实产品小卡片/产品完整卡片Add入口；不作为普通Button或其他Cart用途。

不用：undefined

可修改：label。

```html
<button class="ds-cart ds-cart--product-card" type="button" data-ai-example="ai-cart-product-card"><img class="ds-cart__icon" src="../icons/icon-cart-add.svg" alt=""><span class="ds-cart__text">Add</span></button>
```

## 行为

- hover：Actual pointer shows source20% Gray1 overlay.
- business：Host attaches business events; atom has no invented purchase logic.

## 关系

子组件：无。

已登记父组件：card。

图标：components/icons/icon-cart-add.svg。

详细 Token 数值、适用变体和源文件指纹见同名 JSON；文件源自本地快照，不代表 MasterGo 已在线同步。
