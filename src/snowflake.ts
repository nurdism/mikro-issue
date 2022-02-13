
const FLAKE_EPOCH = 1569888000000 // Date.UTC(2000, 0, 1) == epoch ms, since 1 Jan 2000 00:00
const UNSIGNED_23BIT_MAX = 8388607 // (Math.pow(2, 23) - 1) >> 0
const FLAKE_TIMESTAMP_LENGTH = 41n
const FLAKE_RANDOM_LENGTH = 23n
const FLAKE_RANDOM_SHIFT = 0n
const FLAKE_TIMESTAMP_SHIFT = 23n

const CACHE_64_BIT_ZEROS = '0000000000000000000000000000000000000000000000000000000000000000'

function create(ts = Date.now(), bits?: number, epoch = FLAKE_EPOCH): bigint {
  return (BigInt(ts - epoch) << FLAKE_TIMESTAMP_SHIFT) + BigInt(bits || Math.round(Math.random() * UNSIGNED_23BIT_MAX))
}

function generate(ts = Date.now(), bits?: number, epoch = FLAKE_EPOCH): string {
  return create(ts, bits, epoch).toString()
}

function binary(value: string, padding = true): string {
  const binValue = BigInt(value).toString(2)
  return padding && binValue.length < 64 ? CACHE_64_BIT_ZEROS.substr(0, 64 - binValue.length) + binValue : binValue
}

function extract(data: bigint, shift: bigint, length: bigint): bigint {
  const shiftN = BigInt(shift)
  const bitmask = ((1n << BigInt(length)) - 1n) << shiftN
  return (BigInt(data) & bitmask) >> shiftN
}

class Flake {
  constructor(public timestamp: string, public bits: string) {
    if (timestamp === undefined || bits === undefined) {
      throw new Error('missing argument for flake')
    }
  }
}

function parse(flake: bigint): Flake {
  return new Flake(
    (extract(flake, FLAKE_TIMESTAMP_SHIFT, FLAKE_TIMESTAMP_LENGTH) + BigInt(FLAKE_EPOCH)).toString(10),
    extract(flake, FLAKE_RANDOM_SHIFT, FLAKE_RANDOM_LENGTH).toString(10),
  )
}

export { create, generate, binary, extract, parse, FLAKE_EPOCH }
