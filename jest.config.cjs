// Copyright 2020-2021 @axia-js/phishing authors & contributors
// SPDX-License-Identifier: Apache-2.0

const config = require('@axia-js/dev/config/jest.cjs');

module.exports = {
  ...config,
  moduleNameMapper: {},
  testEnvironment: 'jsdom',
  testTimeout: 2 * 60 * 1000
};
