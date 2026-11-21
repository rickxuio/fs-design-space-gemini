# Dialog — AI 调用参考

此文件自动生成，请修改组件契约、Preview、Token 或图标源文件，再运行 npm run component:sync。

范围：five-source-backed-desktop-templates；视觉审阅：pending。

按内容任务选择information只读说明、confirmation简短删除、form资料填写、cart750px商品表格、message已确认成功消息；禁止通过改宽度/原站嵌入绕过。每种模板只编辑其登记字段，生产动作由宿主接事件，移动和未登记状态不自动开放。

必须加载：components/tokens.css、components/components.css、components/dialog-current.css、components/form-current.css、components/button-current.css、components/button-runtime-current.css、components/input-current.css、components/checkbox-current.css、components/icon-button-current.css、components/input-number-current.css、components/form-dialog-content.css、components/list-dialog-cart.css、components/dialog-templates-current.css、components/dialog-current.js、components/input-current.js、components/checkbox-current.js、components/form-current.js、components/input-number-current.js、components/list-products-current.js、components/dialog-templates-current.js。

字体样式表：https://fonts.googleapis.com/css2?family=Open+Sans:wght@400;600&display=swap。在线字体不可用时使用 tokens.css 已声明的系统字体回退；精确视觉审阅需确认 Open Sans 实际加载。

为每个实例生成唯一 id，标题 id 同步 aria-labelledby，触发按钮 data-dialog-open 指向实例 id。

替换底部按钮文案时，同步对应 aria-label；关闭图标必须保留可读的无障碍名称。

不可修改：dialog 根元素与变体类名；必需结构；组件 CSS / JS；按钮变体与尺寸；关闭图标路径与尺寸；data-dialog-* 行为属性；IconButton/plain-l真实嵌套结构与独立原子样式。

## information

用：只读说明，采用650px原内容提示模板及既有分组结构。

不用：输入表单、加购提示、成功/警告消息、删除确认，或要求任意宽度/新增头底插槽。

可修改：title、body、contentSource。

```html
<dialog id="dialog-info" class="ds-dialog ds-dialog--information" aria-labelledby="dialog-info-title"><header class="ds-dialog__header"><h2 id="dialog-info-title" class="ds-dialog__title">Pay with eCheck/Check</h2><button class="ds-dialog__close-position ds-icon-btn ds-icon-btn--plain ds-icon-btn--l" type="button" aria-label="Close" data-dialog-close><img class="ds-icon-btn__icon" src="../icons/icon-close.svg" alt=""></button></header><div class="ds-dialog__body"><p>We accept eCheck or Check as the payment to make the purchase convenient for you at any time.</p><div class="ds-dialog__section"><h3 class="ds-dialog__subtitle">Pay with eCheck</h3><div class="ds-dialog__content"><p>Only U.S. bank accounts are accepted for payment by eCheck. To use your Check account as a payment option, please provide the following at Checkout page:</p><ul><li>Your bank routing number</li><li>Your bank account number (typically a checking account)</li><li>The name on your bank account</li></ul></div></div><div class="ds-dialog__section"><h3 class="ds-dialog__subtitle">Pay with Check</h3><div class="ds-dialog__content"><p>Please send your Check to the following address:</p><p>FS.COM Inc.<br>380 Centerpoint Blvd<br>New Castle, DE 19720<br>United States.</p></div></div></div></dialog>
```

## confirmation

用：普通简短删除确认，采用480px原模板，提供取消与确认操作。

不用：表单提交、任意业务确认、成功反馈，或750px加购页删除等专用模板。

可修改：title、body、footer.cancelLabel、footer.confirmLabel、confirmCallback。

```html
<dialog id="dialog-confirm" class="ds-dialog ds-dialog--confirmation" aria-labelledby="dialog-confirm-title"><header class="ds-dialog__header"><h2 id="dialog-confirm-title" class="ds-dialog__title">Confirmation</h2><button class="ds-dialog__close-position ds-icon-btn ds-icon-btn--plain ds-icon-btn--l" type="button" aria-label="Close" data-dialog-close><img class="ds-icon-btn__icon" src="../icons/icon-close.svg" alt=""></button></header><div class="ds-dialog__body"><p>Delete all products？</p></div><footer class="ds-dialog__footer"><button type="button" class="ds-btn ds-btn--filled-gray ds-btn--xl-regular" data-dialog-close autofocus aria-label="Cancel"><span class="ds-btn__text">Button</span></button><button type="button" class="ds-btn ds-btn--filled-red ds-btn--xl-regular" data-dialog-confirm aria-label="Confirm"><span class="ds-btn__text">Button</span></button></footer></dialog>
```

## form

用：需要在弹窗中填写资料；使用650px内容填写模板，校验与提交交给真实Form和宿主。

不用：只读说明、加购商品表格或成功消息；不自动保存、上传附件或调用后端。

可修改：title、formFields、cancelLabel、actionLabel、submitCallback。

```html
<dialog id="dialog-form" class="ds-dialog ds-dialog--form" aria-labelledby="dialog-form-title" data-dialog-backdrop="false"><header class="ds-dialog__header"><h2 class="ds-dialog__title" id="dialog-form-title">Tittle Tittle Tittle</h2><button class="ds-dialog__close-position ds-icon-btn ds-icon-btn--plain ds-icon-btn--l" type="button" aria-label="Close" data-dialog-close><img class="ds-icon-btn__icon" src="../icons/icon-close.svg" alt=""></button></header><div class="ds-dialog__body"><form class="ds-form" data-form-current="dialog-content" data-form-part="dialog-content"><div class="ds-form__dialog-fields"><div class="ds-input-field" data-input-current="" data-input-layout="fill">
<label class="ds-input-field__label" for="dialog-form-address1">Address line 1</label>
<input id="dialog-form-address1" class="ds-input-field__input ds-input-field__input--white" type="text" placeholder="Apt, Suite, floor, etc." name="dialog-form-address1">
<div class="ds-input-field__error" id="dialog-form-address1-error" hidden="">
<span class="ds-input-field__error-icon" aria-hidden="true">
</span>
<span class="ds-input-field__error-text">Please enter Prompt word.</span>
</div>
</div><div class="ds-input-field" data-input-current="" data-input-layout="fill">
<label class="ds-input-field__label" for="dialog-form-address2">Address line 2</label>
<input id="dialog-form-address2" class="ds-input-field__input ds-input-field__input--white" type="text" placeholder="Apt, Suite, floor, etc." name="dialog-form-address2">
<div class="ds-input-field__error" id="dialog-form-address2-error" hidden="">
<span class="ds-input-field__error-icon" aria-hidden="true">
</span>
<span class="ds-input-field__error-text">Please enter Prompt word.</span>
</div>
</div><label class="ds-checkbox" data-checkbox-current="" data-checkbox-control=""><input class="ds-checkbox__input" type="checkbox" name="sendToAccountManager" value="yes"><span class="ds-checkbox__box" aria-hidden="true"></span><span class="ds-checkbox__label">Send to Account Manager</span></label></div><div class="ds-input-field" data-input-current="" data-input-layout="fill" data-input-kind="textarea">
            <div class="ds-input-field__header"><label class="ds-input-field__label" for="dialog-form-comments">Comments*</label><span class="ds-input-field__count" id="dialog-form-count">0/5000</span></div>
            <textarea class="ds-input-field__input ds-input-field__input--white" placeholder="Your comments will help FS respond more quickly." id="dialog-form-comments" name="comments" maxlength="5000" aria-describedby="dialog-form-count" required=""></textarea>
          </div></form></div><footer class="ds-dialog__footer"><button type="button" class="ds-btn ds-btn--filled-gray ds-btn--xl-regular" data-dialog-close aria-label="Cancel"><span class="ds-btn__text">Cancel</span></button><button type="button" class="ds-btn ds-btn--filled-red ds-btn--xl-regular" data-dialog-submit aria-label="Submit"><span class="ds-btn__text">Submit</span></button></footer></dialog>
```

## cart

用：加购后展示商品、数量和金额，使用750px模板并交给宿主处理查看购物车动作。

不用：普通内容卡片、直接执行支付或伪造加购成功；不自动访问购物车接口。

可修改：title、products、cancelLabel、actionLabel、actionCallback。

```html
<dialog id="dialog-cart" class="ds-dialog ds-dialog--cart" aria-labelledby="dialog-cart-title"><header class="ds-dialog__header"><img class="ds-dialog__header-icon" src="../icons/mastergo-library/通用Icon/1818-1514.svg" alt=""><h2 class="ds-dialog__title" id="dialog-cart-title">Add to Cart</h2><button class="ds-dialog__close-position ds-icon-btn ds-icon-btn--plain ds-icon-btn--l" type="button" aria-label="Close" data-dialog-close><img class="ds-icon-btn__icon" src="../icons/icon-close.svg" alt=""></button></header><div class="ds-dialog__body"><div class="ds-list ds-list--products" data-list-current="products" data-list-part="dialog-cart-products">
          <div class="ds-list__product-source-grid ds-list__product-source-head">
            <div class="ds-list__product-source-head-item"><span>Item</span><span aria-hidden="true"></span></div><span class="ds-list__product-source-head-price">Price</span><span class="ds-list__product-source-head-qty">Qty</span><span>Item Total</span>
          </div>
          <div class="ds-list__product-source-grid ds-list__product-source-row">
            <div class="ds-list__product-source-item"><img class="ds-list__product-source-image" src="../../docs/assets/20250901105611h7ydr7.jpg.webp" alt="FS S5860 系列交换机" data-source-mapping="2e40a69ce3c752a499df9e6bd7510303.png"><div class="ds-list__product-source-info"><span class="ds-list__product-source-title">S5860-20SQ, 24-Port Ethernet L3 Fully Managed Switch, 20 x 10Gb SFP+, with 4 x 25Gb SFP28 and 2 x 40Gb QSFP+ Uplinks</span><div class="ds-list__product-source-meta"><span>P/N: S5860-24XB-U</span><span>SKU: 30962</span></div></div></div>
            <p class="ds-list__product-source-price">US$ 3,200.00</p>
            <div class="ds-list__product-source-qty"><div data-list-quantity-current="" data-input-number-current="" class="ds-input-number ds-input-number--outline ds-input-number--sm" data-input-number="" data-min="1" data-max="99" aria-label="商品数量"><button class="ds-input-number__button ds-input-number__button--decrement" type="button" data-input-number-decrement=""></button><input class="ds-input-number__input" type="text" value="1" aria-label="商品数量"><button class="ds-input-number__button ds-input-number__button--increment" type="button" data-input-number-increment=""></button></div></div>
            <div class="ds-list__product-source-total"><p class="ds-list__product-source-total-price">US$ 3,200.00</p></div>
          </div>
          
          
        </div></div><footer class="ds-dialog__footer"><button type="button" class="ds-btn ds-btn--filled-gray ds-btn--xl-regular" data-dialog-close aria-label="Continue Shopping"><span class="ds-btn__text">Continue Shopping</span></button><button type="button" class="ds-btn ds-btn--filled-red ds-btn--xl-regular" data-dialog-cart-action aria-label="View Cart"><span class="ds-btn__text">View Cart</span></button></footer></dialog>
```

## message

用：提交结果已由宿主确认，需要480px成功消息提示。

不用：尚未成功就显示成功消息，或将成功图标用于错误/警告；其他状态图标需独立来源。

可修改：title、description。

```html
<dialog id="dialog-message" class="ds-dialog ds-dialog--message" aria-labelledby="dialog-message-title"><div class="ds-dialog__message-icon"><img src="../icons/mastergo-library/通用Icon/1818-1514.svg" alt=""></div><div class="ds-dialog__message-content"><h2 class="ds-dialog__message-title" id="dialog-message-title">Your request has been submitted successfully.</h2><div class="ds-dialog__message-description"><p>We have received your request, our tech guys will check it ASAP, you can check the status at the <a href="#support">My support</a> page.</p></div></div><button class="ds-dialog__close-position ds-icon-btn ds-icon-btn--plain ds-icon-btn--l" type="button" aria-label="Close" data-dialog-close><img class="ds-icon-btn__icon" src="../icons/icon-close.svg" alt=""></button></dialog>
```

## 行为

- open：使用 data-dialog-open 指向唯一实例 id；调用原生 showModal。
- cancel：关闭、取消、Esc 与普通遮罩关闭均不执行确认动作。
- confirm：监听 fs-dialog-confirm；业务由宿主处理。异步或校验失败时 preventDefault，成功后由宿主 close。
- focus：打开时背景不可交互；关闭后焦点返回触发按钮。
- overflow：只让正文区滚动，不移动头部和底部。
- engineeringStatus：Engineering qualification is derived from components/quality/acceptance.json source/tool fingerprints; current finite browser observations are separate evidence, never a replacement for the original engineering suite or visual approval.
- currentRuntime：One document delegate set, including cancelled confirmations; native/ARIA disabled actions are guarded. Actual two-PC-instance modal/focus/Escape/backdrop/overflow observations are in currentBrowserReview; full business and browser coverage remains unverified. Do not co-load legacy dialog.js.
- backdropGesture：Each click consumes the outside-pointer-start state; pointercancel/close/reopen clear it. Only a fresh outside-start/outside-click closes the enabled backdrop. Actual default click-to-dismiss observed for both PC calls; exhaustive pointer gestures not claimed.
- closeAtom：头部关闭真实调用IconButton/plain-l；宿主仅定位与关闭路由，原子样式修改使Dialog引用过期，重新同步复核；冻结页面保持旧版。

## 关系

子组件：button、icon-button、form、list、input、checkbox、input-number。

已登记父组件：暂无；不根据视觉相似度猜测父关系。

图标：components/icons/icon-close.svg。

详细 Token 数值、适用变体和源文件指纹见同名 JSON；文件源自本地快照，不代表 MasterGo 已在线同步。
