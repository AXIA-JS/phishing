// Copyright 2020-2021 @axia-js/phishing authors & contributors
// SPDX-License-Identifier: Apache-2.0

import fs from 'fs';

import { decodeAddress } from '@axia-js/util-crypto';

import ourAddrList from '../../../address.json';
import { fetchWithTimeout } from './fetch';

const TICKS = '```';

function fetch (url: string): Promise<Response> {
  return fetchWithTimeout(url, 5000);
}

// loop through each site for a number of times, applying the transform
async function loopSome (site: string, matcher: () => Promise<string[] | null>): Promise<[string, string[]]> {
  const found: string[] = [];

  for (let i = 0; i < 10; i++) {
    try {
      const addresses = await matcher();

      addresses && addresses.forEach((address): void => {
        if (address && !found.includes(address)) {
          found.push(address);
        }
      });
    } catch (error) {
      // console.error(error);
    }

    await new Promise<boolean>((resolve) =>
      setTimeout(
        () => resolve(true),
        Math.floor((Math.random() * 750) + 1000)
      )
    );
  }

  return [site, found];
}

// shared between axia.center & axia-event.com (addresses are also the same on first run)
function checkGetWallet (site: string): Promise<[string, string[]]> {
  return loopSome(site, async (): Promise<string[] | null> => {
    const result = await (await fetch(`https://${site}/get_wallet.php`)).json() as Record<string, string>;

    return (result && result.wallet)
      ? [result.wallet.replace('\r', '').trim()]
      : null;
  });
}

// extract a specific tag from attributes
function checkTag (url: string, tag: string, attr?: string): Promise<[string, string[]]> {
  const site = url.split('/')[2];

  return loopSome(site, async (): Promise<string[] | null> => {
    const result = await (await fetch(url)).text();

    // /<p id="trnsctin">(.*?)<\/p>/g
    const match = new RegExp(`<${tag}${attr ? ` ${attr}` : ''}>(.*?)</${tag}>`, 'g').exec(result);

    // /<\/?p( id="trnsctin")?>/g
    return match && match.length
      ? match.map((v) =>
        v
          .replace(new RegExp(`</?${tag}${attr ? `( ${attr})?` : ''}>`, 'g'), '')
          .replace(/<br>/g, '')
          .replace(/<\/br>/g, '')
          .trim()
      )
      : null;
  });
}

// extract a specific attribute from a tag
function checkAttr (url: string, attr: string): Promise<[string, string[]]> {
  const site = url.split('/')[2];

  return loopSome(site, async (): Promise<string[] | null> => {
    const result = await (await fetch(url)).text();
    const match = new RegExp(`${attr}"[a-zA-Z0-9]+"`, 'g').exec(result);

    return match && match.length
      ? [match[0].replace(new RegExp(attr, 'g'), '').replace(/"/g, '').trim()]
      : null;
  });
}

// all the available checks
function checkAll (): Promise<[string, string[]][]> {
  return Promise.all([
    ...[
      'https://get-dot.me/'
    ].map((u) => checkTag(u, 'div', 'class="wallet" id="code" style="width: 100%"')),
    ...[
      'axia.center',
      'axia-event.com'
    ].map((u) => checkGetWallet(u)),
    ...[
      'https://axialive.network/block-assets/index.html',
      'https://axias.network/block.html',
      'https://axia-gift.org/block.html'
    ].map((u) => checkTag(u, 'p', 'id="trnsctin"')),
    ...[
      'https://polkacoinbonus.com/verification/index.html',
      'https://polkagiveaway.com/verification/index.html',
      'https://axia.activebonus.live/claim/'
    ].map((u) => checkTag(u, 'span', 'id="trnsctin"')),
    ...[
      'https://airdropcampaign-axia.network/block/index.html',
      'https://claimpolka.com/claim/index.html',
      'https://claimpolka.live/claim/index.html',
      'https://claimaxia.com/claim/index.html',
      'https://claimaxia.network/claim/index.html',
      'https://claimaxia.live/claim/index.html',
      'https://polkaeco-airdrops.org/dot/index.html',
      'https://axia-airdrop.org/block/index.html',
      'https://axia-airdrop.online/block/index.html',
      'https://axia-airdropcampaign.network/block/index.html',
      'https://axia-airdropevent.network/block/index.html',
      'https://axia-airdrops.net/block/index.html',
      'https://axia-bonus.live/dot/index.html',
      'https://axia-bonus.network/block/index.html',
      'https://axia.deals/claim/index.html',
      'https://axiastake.live/claim/index.html'
    ].map((u) => checkTag(u, 'span', 'class="real-address"')),
    ...[
      'https://axia-get.com/',
      'https://axia-promo.info/'
    ].map((u) => checkTag(u, 'span', 'id="cosh"')),
    ...[
      'https://dot21.org/promo/',
      'https://dot4.org/promo/',
      'https://dot4.top/promo/'
    ].map((u) => checkTag(u, 'p', 'class="payment-title"')),
    ...[
      'https://getaxia.us/',
      'https://musk-in.com'
    ].map((u) => checkTag(u, 'h5', 'class="transaction-address"')),
    ...[
      'https://getaxia.us/',
      'https://musk-in.com',
      'https://axia-autopool.com/dot/index.html'
    ].map((u) => checkAttr(u, 'data-clipboard-text=')),
    ...[
      'https://axialunar-wallet.com/wallet.php',
      'https://axia-wallet.org/wallet.php'
    ].map((u) => checkAttr(u, 'id="copyTarget" value=')),
    ...[
      'https://axia-online.com/nnn/axia-live.online/block/index.html',
      'https://axia-online.live/nnn/axia-live.online/block/index.html'
    ].map((u) => checkTag(u, 'p', 'id="t12uEsctin"')),
    checkTag('https://axia-gift.info/', 'span', 'id="wallet"'),
    checkTag('https://axiaairdrop.com/address/', 'cool')
  ]);
}

describe('addrcheck', (): void => {
  beforeAll((): void => {
    jest.setTimeout(2 * 60 * 1000);
  });

  it('has all known addresses', async (): Promise<void> => {
    const _results = await checkAll();
    const results = _results.map(([url, addrs]): [string, string[]] => {
      return [url, addrs.filter((a) => {
        try {
          return decodeAddress(a).length === 32;
        } catch (error) {
          console.error(url, (error as Error).message);

          return false;
        }
      })];
    });
    const all = Object.values(ourAddrList).reduce((all: string[], addrs: string[]): string[] => {
      all.push(...addrs);

      return all;
    }, []);
    const listEmpty = results.filter(([, found]) => !found.length).map(([site]) => site);
    const mapFound = results.filter(([, found]) => found.length).reduce((all, [site, found]) => ({ ...all, [site]: found }), {});
    const mapMiss = results
      .map(([site, found]): [string, string[]] => [site, found.filter((a) => !all.includes(a))])
      .filter(([, found]) => found.length)
      .reduce((all: Record<string, string[]>, [site, found]) => ({
        ...all,
        [site]: (all[site] || []).concat(found)
      }), {});
    const sites = Object.keys(mapMiss);

    console.log('Sites with no results\n', JSON.stringify(listEmpty, null, 2));
    console.log('Addresses found\n', JSON.stringify(mapFound, null, 2));
    console.log('Addresses missing\n', JSON.stringify(mapMiss, null, 2));

    sites.length && process.env.CI_LOG && fs.appendFileSync('./.github/addrcheck.md', `\n\n${sites.length} urls with missing entries found at ${new Date().toUTCString()}:\n\n${TICKS}\n${JSON.stringify(mapMiss, null, 2)}\n${TICKS}\n`);

    expect(sites).toEqual([]);
  });
});
