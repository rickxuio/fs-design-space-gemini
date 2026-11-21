/* Header host assembly: reserve the largest native text advance before hover.
   No text cloning, changes to atom weight/color, or business navigation. */
(() => {
  if (!document.body.hasAttribute('data-header-stable')) return;
  const reserve = () => {
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    if (!context) return;
    document.querySelectorAll('.ds-nav-header:not(.ds-nav-header--responsive) .ds-nav-header__link').forEach(link => {
      const style = getComputedStyle(link);
      const text = link.textContent.trim();
      const widths = [400, 600].map(weight => {
        context.font = `${weight} ${style.fontSize} ${style.fontFamily}`;
        return context.measureText(text).width;
      });
      link.parentElement.style.width = `${Math.ceil(Math.max(...widths))}px`;
    });
  };
  reserve();
  if (document.fonts) document.fonts.ready.then(reserve);
})();
