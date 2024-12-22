export function getSearchParams(url: string) {
  // Create a URL object
  const urlObj = new URL(url);

  // Create an object to hold the search parameters
  const paramsObj: Record<string, any> = {};

  // Iterate over the URLSearchParams
  urlObj.searchParams.forEach((value, key) => {
    // If the key already exists, convert the value to an array
    if (paramsObj[key]) {
      // Ensure the value is an array
      if (Array.isArray(paramsObj[key])) {
        paramsObj[key].push(value);
      } else {
        paramsObj[key] = [paramsObj[key], value];
      }
    } else {
      paramsObj[key] = value;
    }
  });

  return paramsObj;
}
