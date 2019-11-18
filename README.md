# ip-range

![](https://img.shields.io/travis/justintaddei/ip-range.svg?style=flat)
![](https://img.shields.io/github/issues-raw/justintaddei/ip-range.svg?style=flat)
![](https://img.shields.io/npm/v/@network-utils/ip-range.svg?style=flat)
![](https://img.shields.io/npm/dt/@network-utils/ip-range.svg?style=flat)
![](https://img.shields.io/npm/l/@network-utils/ip-range.svg?style=flat)
[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat)](https://github.com/prettier/prettier)
![](https://img.shields.io/github/languages/top/justintaddei/ip-range.svg?colorB=blue&style=flat)
![](https://img.shields.io/badge/status-awesome-red.svg?style=flat)

## About

`ip-range` is a dead simple and super flexable parser for IP ranges, written in Typescript. It supports both IPv4 and IPv6 in CIDR notation (`192.168.1.0/24`) and hyphenated ranges (`192.168.1.12-192.168.1.24`)

## Installation

```bash
$ npm i @network-utils/ip-range
```

## Usage

### Example

```typescript
import { parseRange, ipsBetween } from '@network-utils/ip-range'

// These could be IPv6 also.
const ipsFromCIDR = parseRange('192.168.1.120/29')
const ipsFromHyphenatedRange = parseRange('192.168.1.121-192.168.1.126')
const ipsFromHyphenatedRange = ipsBetween('192.168.1.121', '192.168.1.126')

/*
    All three output:

    [
        '192.168.1.121',
        '192.168.1.122',
        '192.168.1.123',
        '192.168.1.124',
        '192.168.1.125',
        '192.168.1.126'
    ]
*/

// parseRange also accepts multi-dimensional arrays
// so you can mix-and-match however you want
const totallyWorks = parseRange(['192.168.1.120/29', ['10.0.0.2-10.0.0.8', '192.168.0.8/23-192.168.0.12']])

/*
    output:

    [
        '192.168.1.121',
        '192.168.1.122',
        '192.168.1.123',
        '192.168.1.124',
        '192.168.1.125',
        '192.168.1.126',
        '10.0.0.2',
        '10.0.0.3',
        '10.0.0.4',
        '10.0.0.5',
        '10.0.0.6',
        '10.0.0.7',
        '10.0.0.8',
        '192.168.0.8',
        '192.168.0.9',
        '192.168.0.10',
        '192.168.0.11',
        '192.168.0.12'
    ]
*/
```

---

### `type iprange`

A string or array of strings, recursive

```typescript
type iprange = string | iprange[]
```

---

### `parseRange(range: iprange): string[]`

Parses an ip range or an array of ip ranges into an array containing each ip within the range(s)  
**Throws** an `"InvalidRange"` error if `range` is invalid

---

### `ipsBetween(firstIP: string, lastIP: string): string[]`

Returns an array of every IP address between `firstIP` and `lastIP` (inclusive)  
**Throws** an `"InvalidRange"` error if `firstIP` or `lastIP` are not a valid IP address

---

## Testing

```bash
$ git clone https://github.com/justintaddei/ip-range.git
$ cd ip-range
$ npm install
$ npm test
```

## License

MIT
