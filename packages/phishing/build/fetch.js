// Copyright 2020-2021 @axia-js/phishing authors & contributors
// SPDX-License-Identifier: Apache-2.0
import { fetch } from '@axia-js/x-fetch'; // a fetch with a 2s timeout

export async function fetchWithTimeout(url, timeout = 2000) {
  const controller = new AbortController();
  let isAborted = false;
  const id = setTimeout(() => {
    console.log(`Timeout on ${url}`);
    isAborted = true;
    controller.abort();
  }, timeout);

  try {
    const response = await fetch(url, {
      signal: controller.signal
    });
    clearTimeout(id);
    return response;
  } catch (error) {
    if (!isAborted) {
      clearTimeout(id);
    }

    throw error;
  }
}