/* Native modal dialog: browser provides inert background and focus containment. */
(function () {
  const openers = new WeakMap();
  const pointerStarts = new WeakMap();
  function outside(dialog, event) {
    const r = dialog.getBoundingClientRect();
    return event.clientX < r.left || event.clientX > r.right || event.clientY < r.top || event.clientY > r.bottom;
  }
  document.addEventListener('click', function (event) {
    const trigger = event.target.closest('[data-dialog-open]');
    if (trigger) {
      const dialog = document.getElementById(trigger.dataset.dialogOpen);
      if (!dialog || !dialog.matches('dialog.ds-dialog') || dialog.open) return;
      openers.set(dialog, trigger);
      dialog.returnValue = '';
      dialog.showModal();
      return;
    }
    const dialog = event.target.closest('dialog.ds-dialog');
    if (!dialog || !dialog.open) return;
    if (event.target.closest('[data-dialog-close]')) dialog.close('cancel');
    else if (event.target.closest('[data-dialog-confirm]')) {
      const accepted = dialog.dispatchEvent(new CustomEvent('fs-dialog-confirm', { bubbles: true, cancelable: true }));
      if (accepted) dialog.close('confirm');
    } else if (event.target === dialog && pointerStarts.get(dialog) && outside(dialog, event) && dialog.dataset.dialogBackdrop !== 'false') {
      dialog.close('backdrop');
    }
  });
  document.addEventListener('pointerdown', function (event) {
    const dialog = event.target.closest('dialog.ds-dialog');
    if (dialog) pointerStarts.set(dialog, event.target === dialog && outside(dialog, event));
  });
  // Capture non-bubbling close events, including instances added after initialization.
  document.addEventListener('close', function (event) {
    const dialog = event.target;
    if (!dialog.matches || !dialog.matches('dialog.ds-dialog')) return;
    const trigger = openers.get(dialog);
    if (trigger && trigger.isConnected) trigger.focus();
    pointerStarts.delete(dialog);
  }, true);
}());
