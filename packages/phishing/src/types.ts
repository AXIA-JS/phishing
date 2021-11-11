// Copyright 2020-2021 @axia-js/phishing authors & contributors
// SPDX-License-Identifier: Apache-2.0

export interface HostList {
  allow: string[];
  deny: string[];
}

export type AddressList = Record<string, string[]>;
