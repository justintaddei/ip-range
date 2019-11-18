import { parseRange, ipsBetween } from '../src/index'

const TEST_CIDR_V4 = '192.168.1.120/29'
const TEST_CIDR_V6 = '0:0:0:0:0:ffff:102:102/126'

const TEST_HYPHEN_START_V4 = '192.168.1.121'
const TEST_HYPHEN_END_V4 = '192.168.1.126'

const TEST_HYPHEN_START_V6 = '::ffff:102:100'
const TEST_HYPHEN_END_V6 = '::ffff:102:103'

const SUCCESS_RESPONSE_V4 = [
  '192.168.1.121',
  '192.168.1.122',
  '192.168.1.123',
  '192.168.1.124',
  '192.168.1.125',
  '192.168.1.126'
]

const SUCCESS_RESPONSE_FROM_ARRAY_V4 = [
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

const SUCCESS_RESPONSE_V6 = ['::ffff:102:100', '::ffff:102:101', '::ffff:102:102', '::ffff:102:103']

describe('cidr notation', () => {
  describe('success cases', () => {
    it('should return an array of ips within the range', () => {
      expect(parseRange(TEST_CIDR_V4)).toEqual(SUCCESS_RESPONSE_V4)
    })

    it('supports IPv6', () => {
      expect(parseRange(TEST_CIDR_V6)).toEqual(SUCCESS_RESPONSE_V6)
    })
  })
  describe('error cases', () => {
    describe('InvalidRange error', () => {
      it('throws an `InvalidRange` error if no range is supplied', () => {
        expect(parseRange).toThrowError(/InvalidRange/)
      })
      it('throws an `InvalidRange` error if range is undefined', () => {
        // @ts-ignore
        expect(() => parseRange(undefined)).toThrowError(/InvalidRange/)
      })
      it('throws an `InvalidRange` error if range is null', () => {
        // @ts-ignore
        expect(() => parseRange(null)).toThrowError(/InvalidRange/)
      })
      it('throws an `InvalidRange` error if range is an empty string', () => {
        expect(() => parseRange('')).toThrowError(/InvalidRange/)
      })
      it('throws an `InvalidRange` error if the IP is invalid (string)', () => {
        expect(() => parseRange('not.an.ip')).toThrowError(/InvalidRange/)
      })
      it('throws an `InvalidRange` error if the IP is invalid (number)', () => {
        // @ts-ignore
        expect(() => parseRange(123)).toThrowError(/InvalidRange/)
      })
      it('throws an `InvalidRange` error if the range contains number that is too high', () => {
        expect(() => parseRange('192.168.1.12/33')).toThrowError(/InvalidRange/)
      })
    })
    describe('invalid CIDR subnet errors', () => {
      it('throws an `invalid CIDR subnet` error if range is not in CIDR notation', () => {
        expect(() => parseRange('192.168.1.1')).toThrowError(/invalid CIDR subnet/)
      })
    })
  })
})

describe('get array of ips between two ips', () => {
  describe('success cases', () => {
    it('supports two IPv4 addresses', () => {
      expect(ipsBetween(TEST_HYPHEN_START_V4, TEST_HYPHEN_END_V4)).toEqual(SUCCESS_RESPONSE_V4)
    })
    it('supports two IPv6 addresses', () => {
      expect(ipsBetween(TEST_HYPHEN_START_V6, TEST_HYPHEN_END_V6)).toEqual(SUCCESS_RESPONSE_V6)
    })
    it('supports a hyphenated IPv4 range', () => {
      expect(parseRange(`${TEST_HYPHEN_START_V4}-${TEST_HYPHEN_END_V4}`)).toEqual(SUCCESS_RESPONSE_V4)
    })
    it('supports a hyphenated IPv6 range', () => {
      expect(parseRange(`${TEST_HYPHEN_START_V6}-${TEST_HYPHEN_END_V6}`)).toEqual(SUCCESS_RESPONSE_V6)
    })
  })

  describe('error cases', () => {
    describe('ipsBetween', () => {
      it('throws an `InvalidRange` error no ips are supplied', () => {
        // @ts-ignore
        expect(() => ipsBetween()).toThrowError(/InvalidRange/)
      })
      it('throws an `InvalidRange` error if only ip is supplied', () => {
        // @ts-ignore
        expect(() => ipsBetween('not.an.ip')).toThrowError(/InvalidRange/)
      })
      describe('throw an `InvalidRange` error if one or both ips are invalid', () => {
        it('invalid (string), valid (string)', () => {
          expect(() => ipsBetween('not.an.ip', '192.168.1.1')).toThrowError(/InvalidRange/)
        })
        it('valid (string), invalid (string)', () => {
          expect(() => ipsBetween('192.168.1.1', 'not.an.ip')).toThrowError(/InvalidRange/)
        })
        it('invalid (string), invalid (string)', () => {
          expect(() => ipsBetween('not.an.ip', 'not.an.ip')).toThrowError(/InvalidRange/)
        })
        it('invalid (number), valid (string)', () => {
          //@ts-ignore
          expect(() => ipsBetween(192168, '192.168.1.12')).toThrowError(/InvalidRange/)
        })
        it('valid (string), invalid (number)', () => {
          //@ts-ignore
          expect(() => ipsBetween('192.168.1.12', 192168)).toThrowError(/InvalidRange/)
        })
        it('invalid (number), invalid (number)', () => {
          //@ts-ignore
          expect(() => ipsBetween(10002, 192168)).toThrowError(/InvalidRange/)
        })
        it('invalid (CIDR), valid (string)', () => {
          expect(() => ipsBetween('192.168.1.0/24', '192.168.1.50')).toThrowError(/InvalidRange/)
        })
        it('valid (string), invalid (CIDR)', () => {
          expect(() => ipsBetween('192.168.1.50', '192.168.1.0/24')).toThrowError(/InvalidRange/)
        })
        it('invalid (CIDR), invalid (CIDR)', () => {
          expect(() => ipsBetween('192.168.1.0/24', '192.168.1.120/29')).toThrowError(/InvalidRange/)
        })
        it('invalid (null), valid (string)', () => {
          //@ts-ignore
          expect(() => ipsBetween(null, '192.168.1.12')).toThrowError(/InvalidRange/)
        })
        it('valid (string), invalid (null)', () => {
          //@ts-ignore
          expect(() => ipsBetween('192.168.1.12', null)).toThrowError(/InvalidRange/)
        })
        it('invalid (null), invalid (null)', () => {
          //@ts-ignore
          expect(() => ipsBetween(null, null)).toThrowError(/InvalidRange/)
        })
        it('invalid (undefined), valid (string)', () => {
          //@ts-ignore
          expect(() => ipsBetween(undefined, '192.168.1.12')).toThrowError(/InvalidRange/)
        })
        it('valid (string), invalid (undefined)', () => {
          //@ts-ignore
          expect(() => ipsBetween('192.168.1.12', undefined)).toThrowError(/InvalidRange/)
        })
        it('invalid (undefined), invalid (undefined)', () => {
          //@ts-ignore
          expect(() => ipsBetween(undefined, undefined)).toThrowError(/InvalidRange/)
        })
      })
    })
    describe('parseRange hyphen notation', () => {
      describe('throw an `InvalidRange` error if one or both ips are invalid', () => {
        it('invalid (string), valid (string)', () => {
          expect(() => parseRange('not.an.ip-192.168.1.1')).toThrowError(/InvalidRange/)
        })
        it('valid (string), invalid (string)', () => {
          expect(() => parseRange('192.168.1.1-not.an.ip')).toThrowError(/InvalidRange/)
        })
        it('invalid (string), invalid (string)', () => {
          expect(() => parseRange('not.an.ip-not.an.ip')).toThrowError(/InvalidRange/)
        })
        it('invalid (number), valid (string)', () => {
          //@ts-ignore
          expect(() => parseRange('192168-192.168.1.12')).toThrowError(/InvalidRange/)
        })
        it('valid (string), invalid (number)', () => {
          //@ts-ignore
          expect(() => parseRange('192.168.1.12-192168')).toThrowError(/InvalidRange/)
        })
        it('invalid (number), invalid (number)', () => {
          //@ts-ignore
          expect(() => parseRange('10002-192168')).toThrowError(/InvalidRange/)
        })
        it('invalid (CIDR), valid (string)', () => {
          expect(() => parseRange('192.168.1.0/24-192.168.1.50')).toThrowError(/InvalidRange/)
        })
        it('valid (string), invalid (CIDR)', () => {
          expect(() => parseRange('192.168.1.50-192.168.1.0/24')).toThrowError(/InvalidRange/)
        })
        it('invalid (CIDR), invalid (CIDR)', () => {
          expect(() => parseRange('192.168.1.0/24-192.168.1.120/29')).toThrowError(/InvalidRange/)
        })
        it('invalid (null), valid (string)', () => {
          //@ts-ignore
          expect(() => parseRange('null-192.168.1.12')).toThrowError(/InvalidRange/)
        })
        it('valid (string), invalid (null)', () => {
          //@ts-ignore
          expect(() => parseRange('192.168.1.12-null')).toThrowError(/InvalidRange/)
        })
        it('invalid (null), invalid (null)', () => {
          //@ts-ignore
          expect(() => parseRange('null-null')).toThrowError(/InvalidRange/)
        })
        it('invalid (undefined), valid (string)', () => {
          //@ts-ignore
          expect(() => parseRange('undefined-192.168.1.12')).toThrowError(/InvalidRange/)
        })
        it('valid (string), invalid (undefined)', () => {
          //@ts-ignore
          expect(() => parseRange('192.168.1.12-undefined')).toThrowError(/InvalidRange/)
        })
        it('invalid (undefined), invalid (undefined)', () => {
          //@ts-ignore
          expect(() => parseRange('undefined-undefined')).toThrowError(/InvalidRange/)
        })
      })
    })
  })
})

describe('use array as parameter', () => {
  it('returns flat array', () => {
    expect(parseRange(['192.168.1.120/29', ['10.0.0.2-10.0.0.8', '192.168.0.8-192.168.0.12']])).toEqual(
      SUCCESS_RESPONSE_FROM_ARRAY_V4
    )
  })
  it('throws `InvalidRange` error in nested arrays', () => {
    expect(() => parseRange(['192.168.1.120/29', ['10.0.0.2-10.0.0.8', '192.168.0.8/23-192.168.0.12']])).toThrowError(
      /InvalidRange/
    )
  })
})
