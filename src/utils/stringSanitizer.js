export default function (value = '') {
  // Type and length checking
  if ((typeof value !== 'string') || (value.length < 3)) {
    return false;
  }

  return value.replace(/[^a-zA-Z0-9_-]+/g, '');
}
