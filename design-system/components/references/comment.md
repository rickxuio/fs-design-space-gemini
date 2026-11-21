# Comment — AI 调用参考

此文件自动生成，请修改组件契约、Preview、Token 或图标源文件，再运行 npm run component:sync。

范围：source-backed-desktop-comment-calls；视觉审阅：pending。

按已有回答/未回答、产品评论、汇总、媒体查看选择具体PC变体。QA主回答始终展开；提交只发可取消事件，宿主确认后才更新业务数据。媒体以真实调用数据填充；默认产品图片仅为规范演示，不标为原客户实拍。普通FAQ不可替代。

必须加载：components/tokens.css、components/components.css、components/button-current.css、components/button-runtime-current.css、components/text-button-current.css、components/icon-button-current.css、components/tag-current.css、components/rate-summary-current.css、components/comment-current.css、components/comment-call-current.css、components/rate-current.js、components/rate-summary-current.js、components/comment-current.js、components/comment-call-current.js。

字体样式表：https://fonts.googleapis.com/css2?family=Open+Sans:wght@400;600&display=swap。

Complete question, empty-answer prompt and hidden composer. Safe unique panel ID matches trigger aria-controls; copies replace panelIdentity and linked control atomically. No initialized local answer or open composer in canonical markup.

Only explicit text fields and linked panel identity may change; preserved Q: marker, native form/textarea, required data markers and true Button child structure.

不可修改：Answered QA keeps its main answer visible; only the child reply composer starts hidden；Unanswered QA issues a host answer request, without inventing an answer or form；Real Rate, Tag, Button, TextButton and IconButton children retain their atomic styles and allowed finite scope；Reply draft remains until the host confirms persistence; no invented saved comment or backend request；Only current PC source templates are callable; mobile and visual approval remain separate。

## qa-thread

用：产品问答已有回答，主回答始终展开，可展开子评论输入。

不用：普通FAQ、营销卡片或伪造已提交/已保存评论；不接后端持久化、登录或移动端。

可修改：question、questionMeta、answer、answerMeta、panelIdentity、submitCallback、helpfulCallback。

```html
<article class="ds-comment ds-comment--qa-thread" data-comment-call="qa-thread" data-ai-example="ai-comment-call-qa-thread">
        <div class="ds-comment__question">
          <span class="ds-comment__marker">Q:</span>
          <div class="ds-comment__body">
            <h3 class="ds-comment__title">What is the benefit of using the AmpCon Network Controller to manage my network?</h3>
            <p class="ds-comment__meta">by L***n on Dec 22, 2022</p>
          </div>
        </div>
        <div class="ds-comment__answer">
          <span class="ds-comment__marker">A:</span>
          <div class="ds-comment__body">
            <p class="ds-comment__text">The AmpCon Network Controller offers several advantages by delivering immediate insights into your network's traffic and operational status, which enables swift identification and troubleshooting of potential network problems. It eases the complexity associated with setting up and managing network configurations, allowing for quicker and less labor-intensive completion of these tasks. Moreover, it enhances the allocation and use of network resources, promoting a high-performing and scalable network infrastructure.</p>
            <div class="ds-comment__answer-list">
              <p>1. Review traffic and operational status.</p>
              <p>2. Identify and resolve potential problems.</p>
              <p>3. Optimize resources for a scalable network.</p>
            </div>
            <p class="ds-comment__meta">by L***n on Dec 22, 2022</p>
            <div class="ds-comment__action-row">
              <button class="ds-comment__action" type="button" data-comment-action="helpful" aria-pressed="false">
                <span class="ds-comment__action-icon ds-comment__action-icon--helpful" aria-hidden="true"><img class="ds-comment__action-icon-shape ds-comment__action-icon-shape--default" src="../icons/icon-helpful.svg" alt=""><img class="ds-comment__action-icon-shape ds-comment__action-icon-shape--active" src="../icons/icon-helpful-active.svg" alt=""></span>
                <span class="ds-comment__action-label">Helpful</span><span data-comment-count="">6</span>
              </button>
              <button class="ds-comment__action" type="button" data-comment-action="comment" aria-expanded="false" aria-controls="current-qa-thread-qa-comments" aria-pressed="false">
                <span class="ds-comment__action-icon ds-comment__action-icon--comment" aria-hidden="true"><img class="ds-comment__action-icon-shape ds-comment__action-icon-shape--default" src="../icons/icon-comment.svg" alt=""><img class="ds-comment__action-icon-shape ds-comment__action-icon-shape--active" src="../icons/icon-comment-active.svg" alt=""></span>
                <span class="ds-comment__action-label">Comment</span><span data-comment-count="">3</span>
              </button>
            </div>
            <div class="ds-comment__comments" id="current-qa-thread-qa-comments" hidden="">
              <form class="ds-comment__composer" data-comment-composer="" data-composer-type="comment">
                <textarea class="ds-comment__textarea" aria-label="Write down your comments" placeholder="Write down your comments..." required=""></textarea>
                <div class="ds-comment__composer-actions">
                  <a class="ds-text-btn ds-text-btn--with-bg ds-text-btn--l-bg" href="#" role="button" data-comment-cancel="">
          <span class="ds-text-btn__text">Cancel</span>
          
        </a>
                  <button class="ds-btn ds-btn--filled-red ds-btn--l" type="submit"><span class="ds-btn__text">Submit</span></button>
                </div>
              </form>
              <div class="ds-comment__comment-block">
                <p class="ds-comment__comment-heading" data-comment-heading="">Showing 3 Comments</p>
                <ol class="ds-comment__comment-list">
                  <li class="ds-comment__comment-item">There is a reset button on the switch; a 10-second press restores factory settings. by w***y</li>
                  <li class="ds-comment__comment-item">The reset process completes automatically. by w***y</li>
                  <li class="ds-comment__comment-item">Please back up the configuration first. by w***y</li>
                </ol>
              </div>
            </div>
          </div>
        </div>
      </article>
```

## qa-unanswered

用：产品问答暂无回答，展示未回答提示并请求宿主提供回答入口。

不用：普通FAQ、营销卡片或伪造已提交/已保存评论；不接后端持久化、登录或移动端。

可修改：question、questionMeta、answerCallback。

```html
<article class="ds-comment ds-comment--qa-thread" data-comment-call="qa-unanswered" data-ai-example="ai-comment-call-qa-unanswered">
        <div class="ds-comment__question">
          <span class="ds-comment__marker">Q:</span>
          <div class="ds-comment__body">
            <h3 class="ds-comment__title">What is the benefit of using the AmpCon Network Controller to manage my network?</h3>
            <p class="ds-comment__meta">by L***n on Dec 22, 2022</p>
          </div>
        </div>
        <div class="ds-comment__empty-answer">
          <p class="ds-comment__empty-copy">There is no answer for the moment. or you can <button class="ds-comment__inline-action" type="button" data-comment-action="answer">answer it</button>.</p>
        </div>
        
      </article>
```

## review-thread

用：展示客户评论、只读评分、媒体和Helpful/子评论入口。

不用：普通FAQ、营销卡片或伪造已提交/已保存评论；不接后端持久化、登录或移动端。

可修改：panelIdentity、submitCallback、author、reviewTitle、body、media、ratingContent、helpfulCallback。

```html
<article class="ds-comment ds-comment--review-thread" data-comment-call="review-thread" data-ai-example="ai-comment-call-review-thread">
        <div class="ds-comment__review">
          <div class="ds-comment__review-layout">
            <div class="ds-comment__avatar" aria-hidden="true">H</div>
            <div class="ds-comment__review-content">
              <div class="ds-comment__user">
                <div class="ds-comment__user-summary">
                  <h3 class="ds-comment__review-title">H***w</h3>
                  <p class="ds-comment__meta"><span>January 22, 2022</span><span>United States</span></p>
                </div>
                <span class="ds-comment__verified"><img src="../icons/icon-verified.svg" alt="">Verified Purchase</span>
              </div>
              <div class="ds-comment__body ds-comment__review-detail">
                <div class="ds-comment__rating">
                  <div class="ds-rate ds-rate--display ds-rate--sm" role="img" aria-label="5 out of 5 stars">
                    <span class="ds-rate__stars" aria-hidden="true">
                      <img class="ds-rate__star" src="../icons/icon-rate-on-16.svg" alt="">
                      <img class="ds-rate__star" src="../icons/icon-rate-on-16.svg" alt="">
                      <img class="ds-rate__star" src="../icons/icon-rate-on-16.svg" alt="">
                      <img class="ds-rate__star" src="../icons/icon-rate-on-16.svg" alt="">
                      <img class="ds-rate__star" src="../icons/icon-rate-on-16.svg" alt="">
                    </span>
                    <span class="ds-rate__label ds-rate__label--muted">5.0</span>
                  </div>
                  <h3 class="ds-comment__review-title">The product is excellent</h3>
                </div>
                <div class="ds-comment__attributes">
                  <span class="ds-comment__attribute"><span class="ds-comment__attribute-key">Transceiver Models:</span><span>MMA4Z00-NS | 800G SR8</span></span>
                  <span class="ds-comment__attribute"><span class="ds-comment__attribute-key">Compatible Brands:</span><span>NVIDIA InfiniBand (800G)</span></span>
                </div>
                <p class="ds-comment__text">The 24 port switch from other vendor started to fail one port at a time, and we have been migrating everything across to FS ones, it's no problem now, our 5 Ubiquiti AP's are already on FS 24 port switch.</p>
                <div class="ds-comment__review-media"><img class="ds-comment__review-image" src="../../docs/assets/20250901105611h7ydr7.jpg.webp" alt="示例产品图片，请按实际评论媒体替换"></div>
                <div class="ds-comment__action-row">
                  <button class="ds-comment__action" type="button" data-comment-action="helpful" aria-pressed="false"><span class="ds-comment__action-icon ds-comment__action-icon--helpful" aria-hidden="true"><img class="ds-comment__action-icon-shape ds-comment__action-icon-shape--default" src="../icons/icon-helpful.svg" alt=""><img class="ds-comment__action-icon-shape ds-comment__action-icon-shape--active" src="../icons/icon-helpful-active.svg" alt=""></span><span class="ds-comment__action-label">Helpful</span><span data-comment-count="">6</span></button>
                  <button class="ds-comment__action" type="button" data-comment-action="comment" aria-expanded="false" aria-controls="current-review-thread-review-comments" aria-pressed="false"><span class="ds-comment__action-icon ds-comment__action-icon--comment" aria-hidden="true"><img class="ds-comment__action-icon-shape ds-comment__action-icon-shape--default" src="../icons/icon-comment.svg" alt=""><img class="ds-comment__action-icon-shape ds-comment__action-icon-shape--active" src="../icons/icon-comment-active.svg" alt=""></span><span class="ds-comment__action-label">Comment</span><span data-comment-count="">3</span></button>
                </div>
                <div class="ds-comment__comments" id="current-review-thread-review-comments" hidden="">
                  <form class="ds-comment__composer" data-comment-composer="" data-composer-type="comment">
                    <textarea class="ds-comment__textarea" aria-label="Write down your comments" placeholder="Write down your comments..." required=""></textarea>
                    <div class="ds-comment__composer-actions"><a class="ds-text-btn ds-text-btn--with-bg ds-text-btn--l-bg" href="#" role="button" data-comment-cancel="">
          <span class="ds-text-btn__text">Cancel</span>
          
        </a><button class="ds-btn ds-btn--filled-red ds-btn--l" type="submit"><span class="ds-btn__text">Submit</span></button></div>
                  </form>
                  <div class="ds-comment__comment-block">
                    <p class="ds-comment__comment-heading" data-comment-heading="">Showing 3 Comments</p>
                    <ol class="ds-comment__comment-list">
                      <li class="ds-comment__comment-item"><span class="ds-comment__comment-copy">1. There is a reset button on the switch; a 10-second press restores factory settings.</span><span class="ds-comment__comment-meta">by w***y</span></li>
                      <li class="ds-comment__comment-item"><span class="ds-comment__comment-copy">2. The reset process completes automatically.</span><span class="ds-comment__comment-meta">by w***y</span></li>
                      <li class="ds-comment__comment-item"><span class="ds-comment__comment-copy">3. Please back up the configuration first.</span><span class="ds-comment__comment-meta">by w***y</span></li>
                    </ol>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </article>
```

## rating-summary

用：展示评分分布与分类筛选；数据由调用方提供，筛选发事件。

不用：普通FAQ、营销卡片或伪造已提交/已保存评论；不接后端持久化、登录或移动端。

可修改：counts、galleryTarget、filterCallback、filters。

```html
<section class="ds-comment ds-comment--rating-summary" data-comment-rating-counts="[28,14,0,0,0]" data-comment-call="rating-summary" data-ai-example="ai-comment-call-rating-summary">
        <div class="ds-comment__summary">
          <div class="ds-comment__summary-main">
            <div class="ds-comment__summary-left"><div class="ds-rate ds-rate--summary" data-rate-summary-current="" data-rate-summary-counts="[28,14,0,0,0]" aria-label="Rating summary: 4.7 out of 5 from 42 reviews"><div class="ds-rate__score-card"><span class="ds-rate__summary-score">4.7</span><span class="ds-rate__stars" role="img" aria-label="4.7 out of 5 stars"><span class="ds-rate__summary-star"><img class="ds-rate__star" src="../icons/icon-rate-off-16.svg" alt=""><span class="ds-rate__summary-star-fill"><img class="ds-rate__star" src="../icons/icon-rate-on-16.svg" alt=""></span></span><span class="ds-rate__summary-star"><img class="ds-rate__star" src="../icons/icon-rate-off-16.svg" alt=""><span class="ds-rate__summary-star-fill"><img class="ds-rate__star" src="../icons/icon-rate-on-16.svg" alt=""></span></span><span class="ds-rate__summary-star"><img class="ds-rate__star" src="../icons/icon-rate-off-16.svg" alt=""><span class="ds-rate__summary-star-fill"><img class="ds-rate__star" src="../icons/icon-rate-on-16.svg" alt=""></span></span><span class="ds-rate__summary-star"><img class="ds-rate__star" src="../icons/icon-rate-off-16.svg" alt=""><span class="ds-rate__summary-star-fill"><img class="ds-rate__star" src="../icons/icon-rate-on-16.svg" alt=""></span></span><span class="ds-rate__summary-star"><img class="ds-rate__star" src="../icons/icon-rate-off-16.svg" alt=""><span class="ds-rate__summary-star-fill"><img class="ds-rate__star" src="../icons/icon-rate-on-16.svg" alt=""></span></span></span><span class="ds-rate__review-count">(42 reviews)</span></div><div class="ds-rate__distribution" role="group" aria-label="Rating distribution"><button class="ds-rate__distribution-row" type="button" value="5" aria-pressed="false" aria-describedby="rate-summary-tooltip-5"><span class="ds-rate__distribution-label">5 stars</span><span class="ds-rate__progress" role="progressbar" aria-label="5 stars: 28 reviews" aria-valuemin="0" aria-valuemax="42" aria-valuenow="28"><span class="ds-rate__progress-fill"></span></span><span class="ds-rate__distribution-count">28</span><span class="ds-rate__summary-tooltip" role="tooltip" id="rate-summary-tooltip-5" hidden="">28 reviews</span></button><button class="ds-rate__distribution-row" type="button" value="4" aria-pressed="false" aria-describedby="rate-summary-tooltip-4"><span class="ds-rate__distribution-label">4 stars</span><span class="ds-rate__progress" role="progressbar" aria-label="4 stars: 14 reviews" aria-valuemin="0" aria-valuemax="42" aria-valuenow="14"><span class="ds-rate__progress-fill"></span></span><span class="ds-rate__distribution-count">14</span><span class="ds-rate__summary-tooltip" role="tooltip" id="rate-summary-tooltip-4" hidden="">14 reviews</span></button><button class="ds-rate__distribution-row" type="button" value="3" aria-pressed="false" aria-describedby="rate-summary-tooltip-3" disabled=""><span class="ds-rate__distribution-label">3 stars</span><span class="ds-rate__progress" role="progressbar" aria-label="3 stars: 0 reviews" aria-valuemin="0" aria-valuemax="42" aria-valuenow="0"><span class="ds-rate__progress-fill"></span></span><span class="ds-rate__distribution-count">0</span><span class="ds-rate__summary-tooltip" role="tooltip" id="rate-summary-tooltip-3" hidden="">0 reviews</span></button><button class="ds-rate__distribution-row" type="button" value="2" aria-pressed="false" aria-describedby="rate-summary-tooltip-2" disabled=""><span class="ds-rate__distribution-label">2 stars</span><span class="ds-rate__progress" role="progressbar" aria-label="2 stars: 0 reviews" aria-valuemin="0" aria-valuemax="42" aria-valuenow="0"><span class="ds-rate__progress-fill"></span></span><span class="ds-rate__distribution-count">0</span><span class="ds-rate__summary-tooltip" role="tooltip" id="rate-summary-tooltip-2" hidden="">0 reviews</span></button><button class="ds-rate__distribution-row" type="button" value="1" aria-pressed="false" aria-describedby="rate-summary-tooltip-1" disabled=""><span class="ds-rate__distribution-label">1 star</span><span class="ds-rate__progress" role="progressbar" aria-label="1 star: 0 reviews" aria-valuemin="0" aria-valuemax="42" aria-valuenow="0"><span class="ds-rate__progress-fill"></span></span><span class="ds-rate__distribution-count">0</span><span class="ds-rate__summary-tooltip" role="tooltip" id="rate-summary-tooltip-1" hidden="">0 reviews</span></button></div></div></div>
            <div class="ds-comment__summary-media">
              <button class="ds-comment__media-button" type="button" data-comment-gallery-open="#comment-gallery-demo" data-gallery-start="detail" aria-label="Open customer image 1" data-gallery-index="0"><span class="ds-comment__media" data-comment-image-source="108-default-no-border"><img class="" src="../../docs/assets/20250901105611h7ydr7.jpg.webp" alt="示例产品媒体 1"></span></button>
              <button class="ds-comment__media-button" type="button" data-comment-gallery-open="#comment-gallery-demo" data-gallery-start="detail" aria-label="Open customer image 2" data-gallery-index="1"><span class="ds-comment__media" data-comment-image-source="108-default-no-border"><img class="" src="../../docs/assets/20250901105611h7ydr7.jpg.webp" alt="示例产品媒体 2"></span></button>
              <button class="ds-comment__media-button" type="button" data-comment-gallery-open="#comment-gallery-demo" data-gallery-start="detail" aria-label="Open customer image 3" data-gallery-index="2"><span class="ds-comment__media" data-comment-image-source="108-default-no-border"><img class="" src="../../docs/assets/20250901105611h7ydr7.jpg.webp" alt="示例产品媒体 3"></span></button>
              
              
              
              
            </div>
          </div>
          <div class="ds-comment__filter-group" data-comment-filter-group=""><button class="ds-tag ds-tag--selectable ds-tag--checked" type="button" data-comment-filter="" aria-pressed="true" data-comment-controlled-tag="" value="all"><span class="ds-tag__label">All (42)</span></button><button class="ds-tag ds-tag--selectable" type="button" data-comment-filter="" aria-pressed="false" data-comment-controlled-tag="" value="with-photos"><span class="ds-tag__label">With photos</span></button></div>
        </div>
      </section>
```

## customer-gallery

用：展示客户媒体网格与单图详情，支持缩略图、前后切换及关闭返回。

不用：普通FAQ、营销卡片或伪造已提交/已保存评论；不接后端持久化、登录或移动端。

可修改：ratingContent、helpfulCallback、images、author、body。

```html
<dialog class="ds-comment ds-comment--customer-gallery" id="current-customer-gallery-comment-gallery-call" data-comment-gallery-source="pc-grid-029476" aria-label="Customer Gallery" data-comment-call="customer-gallery" data-ai-example="ai-comment-call-customer-gallery">
    <div class="ds-comment__gallery">
      <div class="ds-comment__gallery-view ds-comment__gallery-view--grid" data-gallery-view="grid">
        <header class="ds-comment__gallery-header">
          <div class="ds-comment__gallery-source-header-row">
            <h2 class="ds-comment__gallery-title">Customer Gallery</h2>
            <button class="ds-icon-btn ds-icon-btn--plain ds-icon-btn--l" type="button" data-comment-gallery-close="" aria-label="Close customer gallery"><img class="ds-icon-btn__icon" src="../icons/icon-close.svg" alt=""></button>
          </div>
          <div class="ds-comment__gallery-detail-divider" aria-hidden="true"></div>
        </header>
        <div class="ds-comment__gallery-body">
          <div class="ds-comment__gallery-grid">
            <button class="ds-comment__media-button" type="button" data-gallery-item="0" aria-label="Open customer image 1"><span class="ds-comment__media" data-comment-image-source="168-default-no-border" data-comment-source-node="68908:029488" data-component-source-main="68908:016292"><img class="" src="../../docs/assets/20250901105611h7ydr7.jpg.webp" alt="示例产品媒体 1"></span></button>
            <button class="ds-comment__media-button" type="button" data-gallery-item="1" aria-label="Open customer image 2"><span class="ds-comment__media" data-comment-image-source="168-default-no-border" data-comment-source-node="68908:029483" data-component-source-main="68908:016292"><img class="" src="../../docs/assets/20250901105611h7ydr7.jpg.webp" alt="示例产品媒体 2"></span></button>
            <button class="ds-comment__media-button" type="button" data-gallery-item="2" aria-label="Open customer image 3"><span class="ds-comment__media" data-comment-image-source="168-default-no-border" data-comment-source-node="68908:029490" data-component-source-main="68908:016292"><img class="" src="../../docs/assets/20250901105611h7ydr7.jpg.webp" alt="示例产品媒体 3"></span></button>
            
            
            
            
            
            
            
            
            
          </div>
        </div>
        <span class="ds-comment__scrollbar" data-comment-scrollbar-source="style3" data-comment-source-node="68908:029503" data-component-source-main="68908:016577" aria-hidden="true"><span class="ds-comment__scrollbar-thumb"></span></span>
      </div>
      <div class="ds-comment__gallery-view ds-comment__gallery-view--detail" data-gallery-view="detail" hidden="">
        <header class="ds-comment__gallery-detail-header">
          <div class="ds-comment__gallery-detail-header-row">
            <button class="ds-comment__gallery-back" type="button" data-gallery-back=""><span class="ds-comment__gallery-back-icon"><img src="../icons/icon-carousel-prev.svg" alt=""></span><span>View All Customer Gallery</span></button>
            <button class="ds-icon-btn ds-icon-btn--plain ds-icon-btn--l" type="button" data-comment-gallery-close="" aria-label="Close customer gallery"><img class="ds-icon-btn__icon" src="../icons/icon-close.svg" alt=""></button>
          </div>
          <div class="ds-comment__gallery-detail-divider"></div>
        </header>
        <div class="ds-comment__gallery-detail">
          <div class="ds-comment__gallery-carousel" data-gallery-carousel="" data-index="0">
            <div class="ds-comment__gallery-track">
              <div class="ds-comment__gallery-slide"><div class="ds-comment__gallery-stage"><span class="ds-comment__gallery-media"><img class="" src="../../docs/assets/20250901105611h7ydr7.jpg.webp" alt="示例产品媒体 1"></span></div></div>
              <div class="ds-comment__gallery-slide"><div class="ds-comment__gallery-stage"><span class="ds-comment__gallery-media"><img class="" src="../../docs/assets/20250901105611h7ydr7.jpg.webp" alt="示例产品媒体 2"></span></div></div>
              <div class="ds-comment__gallery-slide"><div class="ds-comment__gallery-stage"><span class="ds-comment__gallery-media"><img class="" src="../../docs/assets/20250901105611h7ydr7.jpg.webp" alt="示例产品媒体 3"></span></div></div>
            </div>
            <button class="ds-comment__gallery-nav ds-comment__gallery-nav--prev" type="button" data-gallery-prev="" aria-label="Previous customer image"><img src="../icons/icon-carousel-prev.svg" alt=""></button>
            <button class="ds-comment__gallery-nav ds-comment__gallery-nav--next" type="button" data-gallery-next="" aria-label="Next customer image"><img src="../icons/icon-carousel-next.svg" alt=""></button>
          </div>
          <div class="ds-comment__gallery-review">
            <div class="ds-comment__gallery-user">
              <span class="ds-comment__avatar" aria-hidden="true">P</span>
              <div class="ds-comment__gallery-user-copy">
                <h3 class="ds-comment__review-title">P***l</h3>
                <p class="ds-comment__meta"><span class="ds-comment__gallery-date">Dec 22, 2022</span><span>United States</span></p>
              </div>
            </div>
            <div class="ds-rate ds-rate--display ds-rate--sm" role="img" aria-label="5 out of 5 stars">
              <span class="ds-rate__stars" aria-hidden="true">
                <img class="ds-rate__star" src="../icons/icon-rate-on-16.svg" alt="">
                <img class="ds-rate__star" src="../icons/icon-rate-on-16.svg" alt="">
                <img class="ds-rate__star" src="../icons/icon-rate-on-16.svg" alt="">
                <img class="ds-rate__star" src="../icons/icon-rate-on-16.svg" alt="">
                <img class="ds-rate__star" src="../icons/icon-rate-on-16.svg" alt="">
              </span>
              <span class="ds-rate__label ds-rate__label--muted">5.0</span>
            </div>
            <div class="ds-comment__gallery-copy">
              <p class="ds-comment__text ds-comment__text--clamped" id="current-customer-gallery-comment-gallery-review-text">Product was reasonably priced, it arrived on time and was of good quality. Product was reasonably priced, it arrived on time and was of good quality. Product was reasonably priced, it arrived Product was reasonably priced, it arrived</p>
              <a class="ds-text-btn ds-text-btn--inline ds-text-btn--blue-link ds-text-btn--m" href="#" role="button" data-comment-text-toggle="" aria-expanded="false" aria-controls="current-customer-gallery-comment-gallery-review-text">
          <span class="ds-text-btn__text">See more</span>
          
        </a>
            </div>
            <div class="ds-comment__gallery-thumbs"><button class="ds-comment__gallery-thumb ds-comment__gallery-thumb--active" type="button" data-gallery-thumb="0" aria-label="Show customer image 1" aria-pressed="true"><span class="ds-comment__media"><img class="" src="../../docs/assets/20250901105611h7ydr7.jpg.webp" alt="示例产品媒体 1"></span></button><button class="ds-comment__gallery-thumb" type="button" data-gallery-thumb="1" aria-label="Show customer image 2" aria-pressed="false"><span class="ds-comment__media"><img class="" src="../../docs/assets/20250901105611h7ydr7.jpg.webp" alt="示例产品媒体 2"></span></button><button class="ds-comment__gallery-thumb" type="button" data-gallery-thumb="2" aria-label="Show customer image 3" aria-pressed="false"><span class="ds-comment__media"><img class="" src="../../docs/assets/20250901105611h7ydr7.jpg.webp" alt="示例产品媒体 3"></span></button></div>
            <span class="ds-comment__verified"><img src="../icons/icon-verified.svg" alt="">Verified Purchase</span>
            <button class="ds-comment__action" type="button" data-comment-action="helpful" aria-pressed="false"><span class="ds-comment__action-icon ds-comment__action-icon--helpful" aria-hidden="true"><img class="ds-comment__action-icon-shape ds-comment__action-icon-shape--default" src="../icons/icon-helpful.svg" alt=""><img class="ds-comment__action-icon-shape ds-comment__action-icon-shape--active" src="../icons/icon-helpful-active.svg" alt=""></span><span class="ds-comment__action-label">Helpful</span><span data-comment-count="">6</span></button>
          </div>
        </div>
      </div>
    </div>
  </dialog>
```

## 行为

- answer：answer it toggles composer and focuses textarea. Cancel clears/hides composer and returns focus. Blank submit retains composer and focuses input. Nonempty submit replaces empty prompt with local answer using textContent; no server request.
- repeat：Current runtime guards document delegate registration. Repeated legacy loading toggles panel twice; current loading only once. Do not co-load scripts.
- identity：Global aria-controls lookup requires unique safe IDs. Duplicate IDs are rejected in canonical inspection; regenerate paired IDs for copies.
- limits：Native submission and browser textarea focus remain pending. Answer author/time are existing demo placeholders, not business data. Other comment features stay outside finite canonical scope.
- nativeStateGuard：Native/ARIA disabled buttons do not handle synthetic clicks. Hidden composers, disabled textareas or disabled submitters do not accept synthetic submit events; values remain intact. No business policy or requests added.
- submit：ds:comment-submit contains kind/content; draft remains until host acknowledges; no fabricated saved answer, author or success.

## 关系

子组件：button、rate、tag、icon-button、text-button、text-button、rate。

已登记父组件：暂无；不根据视觉相似度猜测父关系。

图标：components/icons/icon-helpful.svg、components/icons/icon-helpful-active.svg、components/icons/icon-comment.svg、components/icons/icon-comment-active.svg、components/icons/icon-rating-star.svg、components/icons/icon-verified.svg、components/icons/icon-close.svg、components/icons/icon-carousel-prev.svg、components/icons/icon-carousel-next.svg。

详细 Token 数值、适用变体和源文件指纹见同名 JSON；文件源自本地快照，不代表 MasterGo 已在线同步。
