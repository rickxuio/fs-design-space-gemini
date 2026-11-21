/* Reuse Select and native Checkbox; no parallel popup/selection implementation. */
(function(){if(document.__fsConfigurationCurrent)return;document.__fsConfigurationCurrent=true;
function paint(root){var selected=root.querySelector('[role="option"][aria-selected="true"]'),swatch=root.querySelector('.ds-tag__configuration-swatch');if(selected&&swatch&&/^#[0-9a-fA-F]{6}$/.test(selected.dataset.color||''))swatch.style.backgroundColor=selected.dataset.color;}
document.addEventListener('ds:select-change',function(e){if(e.target.matches('[data-option-color-current]'))paint(e.target);});
function init(){document.querySelectorAll('[data-option-color-current]').forEach(paint);}if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();
