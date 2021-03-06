"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.fetchWithTimeout = fetchWithTimeout;

var _xFetch = require("@axia-js/x-fetch");

// Copyright 2020-2021 @axia-js/phishing authors & contributors
// SPDX-License-Identifier: Apache-2.0
// a fetch with a 2s timeout
async function fetchWithTimeout(url, timeout = 2000) {
  const controller = new AbortController();
  let isAborted = false;
  const id = setTimeout(() => {
    console.log(`Timeout on ${url}`);
    isAborted = true;
    controller.abort();
  }, timeout);

  try {
    const response = await (0, _xFetch.fetch)(url, {
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