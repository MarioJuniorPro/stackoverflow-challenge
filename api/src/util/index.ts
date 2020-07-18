/* eslint-disable @typescript-eslint/explicit-module-boundary-types */

/**
 * Wait milliseconds before return.
 * @param ms {number}
 */
export const delay = (ms: number) =>
  new Promise((resolve: any) => {
    setTimeout(resolve, ms);
  });
