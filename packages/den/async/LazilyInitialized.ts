// This Source Code Form is subject to the terms of the Mozilla Public
// License, v2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/

/**
 * Holds a value generated from a calling a given async function. The function is called at most
 * once and is not called until the first `get()` of the LazilyInitialized object.
 */
export default class LazilyInitialized<T> {
  // The promise and compute function are held separately so the function can be garbage collected
  // when it is no longer needed.
  private state: { promise: Promise<T> } | { promise?: undefined; compute: () => Promise<T> };

  constructor(compute: () => Promise<T>) {
    this.state = { compute };
  }

  async get(): Promise<T> {
    if (this.state.promise) {
      return this.state.promise;
    }
    const promise = this.state.compute();
    this.state = { promise };
    return promise;
  }
}