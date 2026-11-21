'use strict';
const fs = require('node:fs'), path = require('node:path');

// An incomplete family does not invalidate a separately completed requested
// variant or sourced subpart. It never admits an unrelated completed scope.
function requestedDependencyReady(root, target, dependency) {
  if (!target) return false;
  if (dependency.part) {
    const part = target.parts?.[dependency.part], source = part?.source;
    if (part?.isComplete !== true || part.pendingParts?.length || typeof source !== 'string'
      || path.isAbsolute(source) || source.split(/[\\/]/).includes('..')) return false;
    return (dependency.requiredVariants || []).length > 0
      && dependency.requiredVariants.every(v => (part.colorVariants || []).includes(v))
      && fs.existsSync(path.join(root, source));
  }
  return (dependency.requiredVariants || []).length > 0
    && dependency.requiredVariants.every(name => target.variants?.some(v =>
      v.name === name && (v.isComplete ?? target.isComplete) === true
      && !(v.pendingParts || (v.isComplete === true ? [] : target.pendingParts) || []).length));
}
module.exports = { requestedDependencyReady };
