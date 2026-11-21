/* Native modal dialog: browser provides inert background and focus containment. */
(function () {
  if (document.__fsDialogCurrentReady) return;
  document.__fsDialogCurrentReady = true;
  const openers = new WeakMap();
  const pointerStarts = new WeakMap();
  function outside(dialog, event) {
    const r = dialog.getBoundingClientRect();
    return event.clientX < r.left || event.clientX > r.right || event.clientY < r.top || event.clientY > r.bottom;
  }
  document.addEventListener('click', function (event) {
    const activeDialog = event.target.closest('dialog.ds-dialog');
    const startedOutside = activeDialog && pointerStarts.get(activeDialog);
    if (activeDialog) pointerStarts.delete(activeDialog);
    if (event.defaultPrevented) return;
    const trigger = event.target.closest('[data-dialog-open]');
    if (trigger) {
      if (trigger.matches(':disabled') || trigger.closest('[hidden],[aria-disabled="true"]')) return;
      const dialog = document.getElementById(trigger.dataset.dialogOpen);
      if (!dialog || !dialog.matches('dialog.ds-dialog') || dialog.open || dialog.closest('[hidden],[aria-disabled="true"]')) return;
      openers.set(dialog, trigger);
      pointerStarts.delete(dialog);
      dialog.returnValue = '';
      dialog.showModal();
      return;
    }
    const dialog = activeDialog;
    if (!dialog || !dialog.open || dialog.closest('[hidden],[aria-disabled="true"]')) return;
    const action = event.target.closest('[data-dialog-close], [data-dialog-confirm]');
    if (action && (action.matches(':disabled') || action.closest('[hidden],[aria-disabled="true"]'))) return;
    if (action?.hasAttribute('data-dialog-close')) dialog.close('cancel');
    else if (action?.hasAttribute('data-dialog-confirm')) {
      const accepted = dialog.dispatchEvent(new CustomEvent('fs-dialog-confirm', { bubbles: true, cancelable: true }));
      if (accepted) dialog.close('confirm');
    } else if (event.target === dialog && startedOutside && outside(dialog, event) && dialog.dataset.dialogBackdrop !== 'false') {
      dialog.close('backdrop');
    }
  });
  document.addEventListener('pointerdown', function (event) {
    const dialog = event.target.closest('dialog.ds-dialog');
    if (dialog) {
      pointerStarts.delete(dialog);
      if (!event.defaultPrevented && dialog.open && !dialog.closest('[hidden],[aria-disabled="true"]')) pointerStarts.set(dialog, event.target === dialog && outside(dialog, event));
    }
  });
  document.addEventListener('pointercancel', function (event) {
    const dialog = event.target.closest('dialog.ds-dialog');
    if (dialog) pointerStarts.delete(dialog);
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
