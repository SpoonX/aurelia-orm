/**
 * Set the 'validation' metadata to 'true'
 *
 * @return {Function}
 *
 * @decorator
 */
export function validation() {
  return function(target) {
    console.warn('@validation is obsolete');
  };
}
