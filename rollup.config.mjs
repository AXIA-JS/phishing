// Copyright 2017-2021 @axia-js/api authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { createBundle } from '@axia-js/dev/config/rollup';

const pkgs = [
  '@axia-js/phishing'
];

const external = [
  ...pkgs,
  '@axia-js/util',
  '@axia-js/util-crypto'
];

const entries = {};

const overrides = {};

export default pkgs.map((pkg) => {
  const override = (overrides[pkg] || {});

  return createBundle({
    external,
    pkg,
    ...override,
    entries: {
      ...entries,
      ...(override.entries || {})
    }
  });
});
