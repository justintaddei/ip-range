import ip from 'ip'
import ipAddress from 'ip-address'

export type iprange = string | iprange[]

/**
 * Checks if `range` formatted as `"192.168.0.11-192.168.0.18"` (with hyphen)
 */
const isRange = (range: string) => {
  if (typeof range !== 'string') throw new Error(`InvalidRange: expected "string" got ${typeof range} (${range})`)
  return range.includes('-')
}

/**
 * Checks if `range` formatted as `"0.0.0.0/0"` (CIDR notation)
 */
const isCIDR = (range: string) => {
  if (typeof range !== 'string') throw new Error(`InvalidRange: expected "string" got ${typeof range} (${range})`)
  return range.includes('/')
}

/**
 * Checks if `ip` is a valid IPv4 address
 */
const isV4 = (address: string) => {
  if (typeof address !== 'string') throw new Error(`InvalidRange: expected "string" got ${typeof address} (${address})`)
  return new ipAddress.Address4(address).valid
}

/**
 * Checks if `ip` is a valid IPv6 address
 */
const isV6 = (address: string) => {
  if (typeof address !== 'string') throw new Error(`InvalidRange: expected "string" got ${typeof address} (${address})`)
  return new ipAddress.Address6(address).valid
}

/**
 * Returns an array of every IPv4 address between `first`
 * and `last` (inclusive)
 * @param first The IP address to start at
 * @param last The IP address to end at
 */
function v4Range(first: string, last: string): string[] {
  const ips: string[] = []

  // Convert the IP address to a number
  const startAddress = ip.toLong(first)
  const endAddress = ip.toLong(last)

  // Loop from start to end and add each IP to the `ips` array
  for (let currentAddress = startAddress; currentAddress <= endAddress; currentAddress++)
    ips.push(ip.fromLong(currentAddress))

  return ips
}

/**
 * Returns an array of every IPv6 address between `first`
 * and `last` (inclusive)
 * @param first The IP address to start at
 * @param last The IP address to end at
 */
function v6Range(first: string, last: string): string[] {
  const ips: string[] = []

  // Convert the IP address to a number
  const startAddress = (new ipAddress.Address6(first).bigInteger() as unknown) as number
  const endAddress = (new ipAddress.Address6(last).bigInteger() as unknown) as number

  // Loop from start to end and add each IP to the `ips` array
  // * I'm not sure if `currentAddress++` is the right thing to do here, but it seems to work
  // todo: Figure out a better way to type this
  for (let currentAddress = startAddress; currentAddress <= endAddress; currentAddress++)
    ips.push(ipAddress.Address6.fromBigInteger(currentAddress as any).correctForm())

  return ips
}

/**
 * Converts an IP range (ip1-ip2) to an array
 * @param rangeOrFirstIP The range or the first IP
 * @param lastIP The last IP
 */
function fromRange(rangeOrFirstIP: string, lastIP?: string): string[] {
  if (!rangeOrFirstIP) throw new Error('InvalidRange: no IP address supplied')

  const [first, last] = lastIP ? [rangeOrFirstIP, lastIP] : rangeOrFirstIP.split('-')

  if (isCIDR(first) || isCIDR(last)) throw new Error('InvalidRange: Address connot be in CIDR notation')

  if (isV4(first) && isV4(last)) {
    return v4Range(first, last)
  }

  if (isV6(first) && isV6(last)) {
    return v6Range(first, last)
  }

  throw new Error(`InvalidRange: ${rangeOrFirstIP}`)
}

/**
 * Returns an array of every IP address between `firstIP`
 * and `lastIP` (inclusive)
 * @param firstIP The ip to start at
 * @param lastIP The ip to end at
 */
export function ipsBetween(firstIP: string, lastIP: string): string[] {
  return fromRange(firstIP, lastIP)
}

/**
 * Parses an ip range or an array of ip ranges
 * into an array containing each ip within the range(s)
 * @param range The range to parse
 */
export function parseRange(range: iprange): string[] {
  if (!range) throw new Error('InvalidRange: Range cannot be undefined')

  const ips: string[] = []

  // Check if `range` is a string containing a comma
  if (typeof range === 'string' && range.includes(',')) {
    // Split strings like "192.168.0.11-192.168.0.18, 192.168.0.24-192.168.0.56"
    range = range.split(',').map(r => r.trim())
  }

  if (range instanceof Array) {
    // If `range` is an array, recursively
    // convert the elements to an IP range
    for (const subRange of range) {
      const r = parseRange(subRange)
      ips.push(...r)
    }

    return ips
  }

  if (typeof range !== 'string') throw new Error('InvalidRange: Range must be either a string or a string array')

  if (isV4(range)) {
    const { firstAddress, lastAddress } = ip.cidrSubnet(range)

    return v4Range(firstAddress, lastAddress)
  }

  if (isV6(range)) {
    const v6 = new ipAddress.Address6(range)

    return v6Range(v6.startAddress().correctForm(), v6.endAddress().correctForm())
  }

  if (isRange(range)) return fromRange(range)

  throw new Error(`InvalidRange: ${JSON.stringify(range)}`)
}
