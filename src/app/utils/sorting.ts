export function sortBy<T>(key: keyof T): (a: T, b: T) => 1 | 0 | -1 {
  return (a: T, b: T) => {
    const aValue = a[key];
    const bValue = b[key];
    if (aValue < bValue) {
      return -1;
    }
    if (aValue > bValue) {
      return 1;
    }
    return 0;
  };
}
