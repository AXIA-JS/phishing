"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.retrieveAddrList = retrieveAddrList;
exports.retrieveHostList = retrieveHostList;
exports.checkHost = checkHost;
exports.checkAddress = checkAddress;
exports.checkIfDenied = checkIfDenied;

var _util = require("@axia-js/util");

var _utilCrypto = require("@axia-js/util-crypto");

var _fetch = require("./fetch.cjs");

// Copyright 2020-2021 @axia-js/phishing authors & contributors
// SPDX-License-Identifier: Apache-2.0
// Equivalent to https://raw.githubusercontent.com/axia-js/phishing/master/{address,all}.json
const ADDRESS_JSON = 'https://axia.js.org/phishing/address.json';
const ALL_JSON = 'https://axia.js.org/phishing/all.json'; // 1 hour cache refresh

const CACHE_TIMEOUT = 45 * 60 * 1000;
let cacheAddrEnd = 0;
let cacheAddrList = null;
let cacheAddrU8a = null;
let cacheHostEnd = 0;
let cacheHostList = null; // gets the host-only part for a host

function extractHost(path) {
  return path.replace(/https:\/\/|http:\/\/|wss:\/\/|ws:\/\//, '').split('/')[0];
}
/**
 * Retrieve a list of known phishing addresses
 */


async function retrieveAddrList(allowCached = true) {
  const now = Date.now();

  if (allowCached && cacheAddrList && now < cacheAddrEnd) {
    return cacheAddrList;
  }

  const response = await (0, _fetch.fetchWithTimeout)(ADDRESS_JSON);
  const list = await response.json();
  cacheAddrEnd = now + CACHE_TIMEOUT;
  cacheAddrList = list;
  return list;
}

async function retrieveAddrU8a(allowCached = true) {
  const now = Date.now();

  if (allowCached && cacheAddrU8a && now < cacheAddrEnd) {
    return cacheAddrU8a;
  }

  const all = await retrieveAddrList(allowCached);
  cacheAddrU8a = Object.entries(all).map(([key, addresses]) => [key, addresses.map(a => (0, _utilCrypto.decodeAddress)(a))]);
  return cacheAddrU8a;
}
/**
 * Retrieve allow/deny from our list provider
 */


async function retrieveHostList(allowCached = true) {
  const now = Date.now();

  if (allowCached && cacheHostList && now < cacheHostEnd) {
    return cacheHostList;
  }

  const response = await (0, _fetch.fetchWithTimeout)(ALL_JSON);
  const list = await response.json();
  cacheHostEnd = now + CACHE_TIMEOUT;
  cacheHostList = list;
  return list;
}
/**
 * Checks a host to see if it appears in the provided list
 */


function checkHost(items, host) {
  const hostParts = extractHost(host).split('.').reverse();
  return items.some(item => {
    const checkParts = item.split('.').reverse(); // first we need to ensure it has less or equal parts to our source

    if (checkParts.length > hostParts.length) {
      return false;
    } // ensure each section matches


    return checkParts.every((part, index) => hostParts[index] === part);
  });
}
/**
 * Determines if a host is in our deny list. Returns a string containing the phishing site if host is a
 * problematic one. Returns null if the address is not associated with phishing.
 */


async function checkAddress(address, allowCached = true) {
  try {
    const all = await retrieveAddrU8a(allowCached);
    const u8a = (0, _utilCrypto.decodeAddress)(address);
    const entry = all.find(([, all]) => all.some(a => (0, _util.u8aEq)(a, u8a))) || [null];
    return entry[0];
  } catch (error) {
    console.error('Exception while checking address, assuming non-phishing', error.message);
    return null;
  }
}
/**
 * Determines if a host is in our deny list. Returns true if host is a problematic one. Returns
 * false if the host provided is not in our list of less-than-honest sites.
 */


async function checkIfDenied(host, allowCached = true) {
  try {
    const {
      deny
    } = await retrieveHostList(allowCached);
    return checkHost(deny, host);
  } catch (error) {
    console.error(`Exception while checking ${host}, assuming non-phishing`, error.message);
    return false;
  }
}