# Form — AI 调用参考

此文件自动生成，请修改组件契约、Preview、Token 或图标源文件，再运行 npm run component:sync。

范围：two-finite-native-desktop-forms；视觉审阅：pending。

先判断固定表单还是来源初始字段组合，再按背景选gray/white。gray支持sourceFields，white仍只支持固定结构；来源字段、选项、必填/可选及提示保留，不补造联系方式或隐私同意。Input/Select/Textarea/Checkbox/Button沿用原依赖。sourceFields仅支持已声明text/email/textarea/select，不从MG文件上传/验证码/多步骤原件推断当前接口支持。只做本地校验及ds:form-submit；网络提交、区号搜索、完整成功弹窗与移动表单仍未开放，不用原站iframe替代。

必须加载：components/tokens.css、components/components.css、components/form-current.css、components/button-current.css、components/button-runtime-current.css、components/input-current.css、components/checkbox-current.css、components/select-current.css、components/form-dialog-content.css、components/input-current.js、components/checkbox-current.js、components/form-current.js、components/select-current.js。

字体样式表：https://fonts.googleapis.com/css2?family=Open+Sans:wght@400;600&display=swap。

Native form, three two-column PC rows, linked unique IDs/names, counter/contact/consent/Submit and two display-only legal links. All six Input slots use complete atomic DOM; both fifth and gray sixth arrow=down. Phone inner external/start Input; prefix is genuine Input-owned static assembly. No Dropdown/options/hidden bridge.



不可修改：Genuine Input calls at registered slots and exact Submit/Button/L; native text-field identities; no invented Dropdown/options.；No inline style, SVG, action URL or transport behavior；White card marker, gray-9 surface, spacing.20 and border-radius.lg; matching white native fields；Native Form row/field wrappers and real child atoms; specimen row count, contact and consent copy are not universal business requirements.。

## gray

用：白色背景的既有灰底字段表单，或已保留来源字段的初始组合。

不用：需要网络提交、新设备、任意HTML或未支持的字段类型。

可修改：title、description、fieldContent、submitLabel、submitCallback、sourceFields。

```html
<form class="ds-form" data-form-current="" data-ai-example="ai-form-gray-current">
        <p class="ds-form__title">Product and Project Inquiry</p>
        <p class="ds-form__desc">Have a question about purchasing a product or solution that you are interested in? Fill in the form and we'll respond in 1 working day.</p>
        <div class="ds-form__row">
          <div class="ds-form__field"><div class="ds-input-field" data-input-current="" data-input-layout="fill"><label class="ds-input-field__label" for="form-native-example-1">Label</label><input class="ds-input-field__input ds-input-field__input--gray" placeholder="Please enter text" id="form-native-example-1" type="text" name="fieldOne"><div class="ds-input-field__error" id="form-native-example-1-error" hidden><span class="ds-input-field__error-icon" aria-hidden="true"></span><span class="ds-input-field__error-text">Please enter text.</span></div></div></div>
          <div class="ds-form__field"><div class="ds-input-field" data-input-current="" data-input-layout="fill"><label class="ds-input-field__label" for="form-native-example-2">Label</label><input class="ds-input-field__input ds-input-field__input--gray" placeholder="Please enter text" id="form-native-example-2" type="text" name="fieldTwo"><div class="ds-input-field__error" id="form-native-example-2-error" hidden><span class="ds-input-field__error-icon" aria-hidden="true"></span><span class="ds-input-field__error-text">Please enter text.</span></div></div></div>
        </div>
        <div class="ds-form__row">
          <div class="ds-form__field"><div class="ds-input-field" data-input-current="" data-input-layout="fill"><label class="ds-input-field__label" for="form-native-example-3">Label</label><input class="ds-input-field__input ds-input-field__input--gray" placeholder="Please enter text" id="form-native-example-3" type="text" name="fieldThree"><div class="ds-input-field__error" id="form-native-example-3-error" hidden><span class="ds-input-field__error-icon" aria-hidden="true"></span><span class="ds-input-field__error-text">Please enter text.</span></div></div></div>
          <div class="ds-form__field">
            <label class="ds-input-field__label" data-input-current for="form-native-example-4">Phone Number</label>
            <div class="ds-form__phone-row">
              <div class="ds-input-prefix" data-input-current data-input-prefix="static" data-input-color="gray" aria-label="Country code +1"><span>+1</span><img src="../icons/icon-input-down.svg" alt=""></div>
              <div class="ds-input-field" data-input-current data-input-layout="fill" data-input-label="external" data-input-join="start">
                <input class="ds-input-field__input ds-input-field__input--gray" placeholder="" id="form-native-example-4" type="text" name="phone">
                <div class="ds-input-field__error" id="form-native-example-4-error" hidden><span class="ds-input-field__error-icon" aria-hidden="true"></span><span class="ds-input-field__error-text">Please check this value.</span></div>
              </div>
            </div>
          </div>
        </div>
        <div class="ds-form__row">
          <div class="ds-form__field"><div class="ds-input-field" data-input-current data-input-layout="fill" data-input-arrow="down"><label class="ds-input-field__label" for="form-current-choice-input">Lable</label><input class="ds-input-field__input ds-input-field__input--gray" placeholder="Please enter text" id="form-current-choice-input" type="text" name="choice"><div class="ds-input-field__error" id="form-current-choice-input-error" hidden><span class="ds-input-field__error-icon" aria-hidden="true"></span><span class="ds-input-field__error-text">Please check this value.</span></div></div></div>
          <div class="ds-form__field"><div class="ds-input-field" data-input-current data-input-layout="fill" data-input-arrow="down"><label class="ds-input-field__label" for="form-native-example-5">Label</label><input class="ds-input-field__input ds-input-field__input--gray" placeholder="Please enter text" id="form-native-example-5" type="text" name="fieldFour"><div class="ds-input-field__error" id="form-native-example-5-error" hidden><span class="ds-input-field__error-icon" aria-hidden="true"></span><span class="ds-input-field__error-text">Please check this value.</span></div></div></div>
        </div>
        <div class="ds-form__field">
          <div class="ds-input-field" data-input-current="" data-input-layout="fill" data-input-kind="textarea">
            <div class="ds-input-field__header"><label class="ds-input-field__label" for="form-native-example-6">Comments</label><span class="ds-input-field__count" id="form-current-comments-count">0/5000</span></div>
            <textarea class="ds-input-field__input ds-input-field__input--gray" placeholder="Your comments will help FS respond more quickly." id="form-native-example-6" name="comments" maxlength="5000" aria-describedby="form-current-comments-count"></textarea>
          </div>
        </div>
        <div class="ds-form__field"><span class="ds-form__label">How would you like us to contact you?</span>
          <div class="ds-form__radio-group">
            <label class="ds-checkbox ds-checkbox--sm" data-checkbox-current="" data-checkbox-control=""><input class="ds-checkbox__input" type="checkbox" checked="" name="contactMethods" value="email"><span class="ds-checkbox__box" aria-hidden="true"></span><span class="ds-checkbox__label">Email</span></label>
            <label class="ds-checkbox ds-checkbox--sm" data-checkbox-current="" data-checkbox-control=""><input class="ds-checkbox__input" type="checkbox" name="contactMethods" value="phone"><span class="ds-checkbox__box" aria-hidden="true"></span><span class="ds-checkbox__label">Phone</span></label>
          </div>
        </div>
        <label class="ds-form__consent"><span class="ds-checkbox ds-checkbox--sm" data-checkbox-current="" data-checkbox-control=""><input class="ds-checkbox__input" type="checkbox" name="consent" value="agreed"><span class="ds-checkbox__box" aria-hidden="true"></span></span><span class="ds-form__consent-copy">I have read and agree to the FS.COM <a aria-disabled="true" role="link">Terms and Conditions</a> and acknowledge the <a aria-disabled="true" role="link">Privacy Policy and Notice at Collection</a>.</span></label>
        <div><button class="ds-btn ds-btn--filled-red ds-btn--xl-regular" type="submit"><span class="ds-btn__text">Submit</span></button></div>
      </form>
```

## white

用：灰色背景中使用当前白底描边固定结构表单。

不用：需要sourceFields或任意增减字段、动态区号与上传。

可修改：title、description、fieldContent、submitLabel、submitCallback。

```html
<form class="ds-form" data-form-current="white" data-ai-example="ai-form-white-current">
        <p class="ds-form__title">Product and Project Inquiry</p>
        <p class="ds-form__desc">Have a question about purchasing a product or solution that you are interested in? Fill in the form and we'll respond in 1 working day.</p>
        <div class="ds-form__row">
          <div class="ds-form__field"><div class="ds-input-field" data-input-current="" data-input-layout="fill"><label class="ds-input-field__label" for="white-form-native-example-1">Label</label><input class="ds-input-field__input ds-input-field__input--white" placeholder="Please enter text" id="white-form-native-example-1" type="text" name="fieldOne"><div class="ds-input-field__error" id="white-form-native-example-1-error" hidden><span class="ds-input-field__error-icon" aria-hidden="true"></span><span class="ds-input-field__error-text">Please enter text.</span></div></div></div>
          <div class="ds-form__field"><div class="ds-input-field" data-input-current="" data-input-layout="fill"><label class="ds-input-field__label" for="white-form-native-example-2">Label</label><input class="ds-input-field__input ds-input-field__input--white" placeholder="Please enter text" id="white-form-native-example-2" type="text" name="fieldTwo"><div class="ds-input-field__error" id="white-form-native-example-2-error" hidden><span class="ds-input-field__error-icon" aria-hidden="true"></span><span class="ds-input-field__error-text">Please enter text.</span></div></div></div>
        </div>
        <div class="ds-form__row">
          <div class="ds-form__field"><div class="ds-input-field" data-input-current="" data-input-layout="fill"><label class="ds-input-field__label" for="white-form-native-example-3">Label</label><input class="ds-input-field__input ds-input-field__input--white" placeholder="Please enter text" id="white-form-native-example-3" type="text" name="fieldThree"><div class="ds-input-field__error" id="white-form-native-example-3-error" hidden><span class="ds-input-field__error-icon" aria-hidden="true"></span><span class="ds-input-field__error-text">Please enter text.</span></div></div></div>
          <div class="ds-form__field">
            <label class="ds-input-field__label" data-input-current for="white-form-native-example-4">Phone Number</label>
            <div class="ds-form__phone-row">
              <div class="ds-input-prefix" data-input-current data-input-prefix="static" data-input-color="white" aria-label="Country code +1"><span>+1</span><img src="../icons/icon-input-down.svg" alt=""></div>
              <div class="ds-input-field" data-input-current data-input-layout="fill" data-input-label="external" data-input-join="start">
                <input class="ds-input-field__input ds-input-field__input--white" placeholder="" id="white-form-native-example-4" type="text" name="phone">
                <div class="ds-input-field__error" id="white-form-native-example-4-error" hidden><span class="ds-input-field__error-icon" aria-hidden="true"></span><span class="ds-input-field__error-text">Please check this value.</span></div>
              </div>
            </div>
          </div>
        </div>
        <div class="ds-form__row">
          <div class="ds-form__field"><div class="ds-input-field" data-input-current data-input-layout="fill" data-input-arrow="down"><label class="ds-input-field__label" for="white-form-current-choice-input">Lable</label><input class="ds-input-field__input ds-input-field__input--white" placeholder="Please enter text" id="white-form-current-choice-input" type="text" name="choice"><div class="ds-input-field__error" id="white-form-current-choice-input-error" hidden><span class="ds-input-field__error-icon" aria-hidden="true"></span><span class="ds-input-field__error-text">Please check this value.</span></div></div></div>
          <div class="ds-form__field"><div class="ds-input-field" data-input-current data-input-layout="fill"><label class="ds-input-field__label" for="white-form-native-example-5">Label</label><input class="ds-input-field__input ds-input-field__input--white" placeholder="Please enter text" id="white-form-native-example-5" type="text" name="fieldFour"><div class="ds-input-field__error" id="white-form-native-example-5-error" hidden><span class="ds-input-field__error-icon" aria-hidden="true"></span><span class="ds-input-field__error-text">Please check this value.</span></div></div></div>
        </div>
        <div class="ds-form__field">
          <div class="ds-input-field" data-input-current="" data-input-layout="fill" data-input-kind="textarea">
            <div class="ds-input-field__header"><label class="ds-input-field__label" for="white-form-native-example-6">Comments</label><span class="ds-input-field__count" id="white-form-current-comments-count">0/5000</span></div>
            <textarea class="ds-input-field__input ds-input-field__input--white" placeholder="Your comments will help FS respond more quickly." id="white-form-native-example-6" name="comments" maxlength="5000" aria-describedby="white-form-current-comments-count"></textarea>
          </div>
        </div>
        <div class="ds-form__field"><span class="ds-form__label">How would you like us to contact you?</span>
          <div class="ds-form__radio-group">
            <label class="ds-checkbox ds-checkbox--sm" data-checkbox-current="" data-checkbox-control=""><input class="ds-checkbox__input" type="checkbox" checked="" name="contactMethods" value="email"><span class="ds-checkbox__box" aria-hidden="true"></span><span class="ds-checkbox__label">Email</span></label>
            <label class="ds-checkbox ds-checkbox--sm" data-checkbox-current="" data-checkbox-control=""><input class="ds-checkbox__input" type="checkbox" name="contactMethods" value="phone"><span class="ds-checkbox__box" aria-hidden="true"></span><span class="ds-checkbox__label">Phone</span></label>
          </div>
        </div>
        <label class="ds-form__consent"><span class="ds-checkbox ds-checkbox--sm" data-checkbox-current="" data-checkbox-control=""><input class="ds-checkbox__input" type="checkbox" name="consent" value="agreed"><span class="ds-checkbox__box" aria-hidden="true"></span></span><span class="ds-form__consent-copy">I have read and agree to the FS.COM <a aria-disabled="true" role="link">Terms and Conditions</a> and acknowledge the <a aria-disabled="true" role="link">Privacy Policy and Notice at Collection</a>.</span></label>
        <div><button class="ds-btn ds-btn--filled-red ds-btn--xl-regular" type="submit"><span class="ds-btn__text">Submit</span></button></div>
      </form>
```

## 行为

- submission：Native submit always prevented; valid local FormData entries emitted as ds:form-submit. Page owns business policies, persistence and request handling; no successful transaction is invented.
- reset：Native reset restores text fields and textarea counter; canceled reset preserves values.
- counter：maxlength 5000 and UTF-16 native textarea length counter; user-entered text never inserted as HTML.
- links：Existing demo legal text remains visible; no navigation target claimed for Preview fixture.
- initialization：Single document/root guard. Dynamic fields/options, country selection and native Input component replacement not supported in this finite call.
- nativeStateGuard：Disabled native/ARIA submitter blocks synthetic submit, including inherited fieldset disable. Existing business validation and FormData semantics unchanged.
- phonePrefix：The +1 prefix is static source display with an arrow; no country selector behavior was provided or invented.
- submit：Hidden/ARIA-disabled ancestor or native-disabled submitter blocks synthetic submit without changing values. Valid local submit dispatches only ds:form-submit; business transport remains excluded.
- assembly：Existing gray sourceFields resolves a retained original content record. Native paired rows, full-row textareas, source-required native fields and independently rendered Select. Omit absent demo consent/contact/phone; legacy fieldContent fixture remains strict. No network submission.

## 关系

子组件：button、input、input、input、input、input、input、input、input、input、input、checkbox、checkbox、input、input、button、input、checkbox、input、checkbox、input、select。

已登记父组件：dialog。

图标：components/icons/icon-chevron-down.svg。

详细 Token 数值、适用变体和源文件指纹见同名 JSON；文件源自本地快照，不代表 MasterGo 已在线同步。
