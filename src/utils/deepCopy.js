const deepCopy = (item) => {
  if (!item && (item !== false)) { return null; } // null, undefined values check

  const types = [Number, String, Boolean];
  let result;

  // Normalizing primitives
  types.forEach((type) => {
    if (item instanceof type) {
      result = type(item);
    }
  });

  if (typeof result === 'undefined') {
    // Check for array reference
    if (Object.prototype.toString.call(item) === '[object Array]') {
      result = []; // New array
      item.forEach((child, index) => {
        result[index] = deepCopy(child);
      });
    } else if (typeof item === 'object') {
      // Check object literal
      if (!item.prototype) {
        if (item instanceof Date) {
          result = new Date(item);
        } else {
          result = {};
          Object.keys(item).forEach((key) => {
            result[key] = deepCopy(item[key]);
          });
        }
      } else {
        result = null;
      }
    } else {
      // Copy primitive
      result = item;
    }
  }

  return result;
};

export default deepCopy;
