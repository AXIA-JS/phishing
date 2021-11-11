# CHANGELOG

## 0.6.1 Feb 28, 2021

Contributed:

- Added axia-bonus.network (Thanks to https://github.com/FlorianFranzen)
- Added polkadgiveaway.com (Thanks to https://github.com/SimonKraus)
- Added axiabridge.org, dot-event.org, dot-event.news (Thanks to https://github.com/NukeManDan)
- Added wallet-validation.site, axialunar-wallet.com, atomicwalletgift.live (Thanks to https://github.com/laboon)
- Added axia-airdrop.online, axia-airdrops.net, axia.wallet-linker.net, web-axia.web.app (Thanks to https://github.com/nymetva)
- Add scam addresses from victims (Thanks to https://github.com/michalisFr)

Changes:

- Align tests with all new sites as added
- Adjust visual display for active status (via cors proxy)
- Add current balances to account display
- Group accounts based on network they belong to
- Added axialive.com, axiasnetwork.com, polkabeam.org, axia-js.site (as reported)


## 0.5.1 Feb 15, 2021

Contributed:

- Added axia-event.com, axia-support.com, axia-js.online, claimpolka.live (Thanks to https://github.com/laboon)
- Added axias.live (Thanks to https://github.com/SimonKraus)
- Added axiaairdrop.com (Thanks to https://github.com/NukeManDan)
- Added axia-get.com, axia-promo.info (Thanks to https://github.com/BraveSam)
- Add known historic phishing addresses (Thanks to https://github.com/jackesky)
- Added non-threat simpleswap.io to known checks https://github.com/dud1337)

Changes:

- JSON files & index page published to IPNS, https://ipfs.io/ipns/phishing.dotapps.io
- Add list of known phishing addresses under `address.json`
- Add a CI check against known sites for addresses (as changed)
- Add known phishing addresses not via sites (e.g. Youtube scam links)


## 0.4.1 Jan 24, 2021

Contributed:

- Added axia-wallet.com (Thanks to https://github.com/FlorianFranzen)
- Added 4dot.net, axias.network, axiawallet-unlock.org (Thanks to https://github.com/FlorianFranzen)
- Added axiaunlockwallet.com, axia.company (Thanks to https://github.com/FlorianFranzen)
- Added dot4.org, getaxia.net (Thanks to https://github.com/FlorianFranzen)
- Added dotevent.org, axia.center, axialive.network (Thanks to https://github.com/FlorianFranzen)
- Added axia.express (Thanks to https://github.com/laboon)
- Added axia-airdrop.org, axia-live.online, walletsynchronization.com (Thanks to https://github.com/jackesky)

Changes:

- Add `checkAddress` function to check addresses
- Add test for sites with www prefix
- Sort sites as part of the pre-publish build
- Add duplicate check on CI
- Add address.json for list of known addresses
- Add urlmeta.json for extended info
- Add index.html for table display from meta
- Added axia-airdrop.live
- Added axiafund.com


## 0.3.1 Dec 13, 2020

Contributed:

- Added axia.com.se (Thanks to https://github.com/gdixon)

Changes:

- Publish as dual cjs/esm modules
- Allow for list caching, while maintaining freshness


## 0.2.1 Nov 11, 2020

Changes:

- Remove default export on package


## 0.1.1 Sep 21, 2020

Changes:

- Initial release
