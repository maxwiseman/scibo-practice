import { z } from "zod";

import { server } from ".";
import { protocolSchema } from "./schema/from-server";

export function force<T>(val: T): T {
  return val;
}

export function publish<T extends z.infer<typeof protocolSchema>>(
  room: string,
  data: T,
) {
  server.publish(room, JSON.stringify(data));
}

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

export function omitKey<T extends object, U extends string>(
  key: U,
  obj: T,
): Omit<T, U> {
  const { [key]: omitted, ...rest } = obj;
  return rest;
}
