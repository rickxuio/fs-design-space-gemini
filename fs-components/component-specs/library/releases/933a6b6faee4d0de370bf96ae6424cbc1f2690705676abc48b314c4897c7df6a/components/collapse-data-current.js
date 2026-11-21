(function(){if(document.__fsCollapseDataCurrent)return;document.__fsCollapseDataCurrent=true;
var ROOT='[data-collapse-data-current]',ITEM='.ds-collapse__item';
function set(item,open){var button=item.querySelector('.ds-collapse__order-toggle'),body=item.querySelector('.ds-collapse__body');if(!button||!body||button.getAttribute('aria-controls')!==body.id)return;item.classList.toggle('ds-collapse__item--open',open);button.setAttribute('aria-expanded',String(open));body.hidden=!open;body.setAttribute('aria-hidden',String(!open));}
document.addEventListener('click',function(e){var button=e.target.closest('button'),root=button&&button.closest(ROOT),item=button&&button.closest(ITEM);if(!root||!item||item.parentElement!==root||button.matches(':disabled')||button.closest('[hidden],[aria-disabled="true"]'))return;
if(button.classList.contains('ds-collapse__order-toggle')){var open=button.getAttribute('aria-expanded')!=='true';if(open)Array.from(root.children).forEach(function(peer){if(peer!==item)set(peer,false);});set(item,open);}
else if(button.dataset.orderAction)root.dispatchEvent(new CustomEvent('ds:collapse-order-action',{bubbles:true,detail:{action:button.dataset.orderAction,orderId:item.dataset.orderId}}));
});})();
