'use strict'

const core = {
  // matches ajv + length checks + does not start with a dot
  // note that quoted emails are deliberately unsupported (as in ajv), who would want \x01 in email
  // first check is an additional fast path with lengths: 20+(1+21)*2 = 64, (1+61+1)+((1+60+1)+1)*3 = 252 < 253, that should cover most valid emails
  // max length is 64 (name) + 1 (@) + 253 (host), we want to ensure that prior to feeding to the fast regex
  // the second regex checks for quoted, starting-leading dot in name, and two dots anywhere
  email: (input) => {
    if (input.length > 318) return false
    const fast = /^[a-z0-9!#$%&'*+/=?^_`{|}~-]{1,20}(\.[a-z0-9!#$%&'*+/=?^_`{|}~-]{1,21}){0,2}@[a-z0-9]([a-z0-9-]{0,61}[a-z0-9])?(\.[a-z0-9]([a-z0-9-]{0,60}[a-z0-9])?){0,3}$/i
    if (fast.test(input)) return true
    if (!input.includes('@') || /(^\.|^"|\.@|\.\.)/.test(input)) return false
    const [name, host, ...rest] = input.split('@')
    if (!name || !host || rest.length !== 0 || name.length > 64 || host.length > 253) return false
    if (!/^[a-z0-9.-]+$/i.test(host) || !/^[a-z0-9.!#$%&'*+/=?^_`{|}~-]+$/i.test(name)) return false
    return host.split('.').every((part) => /^[a-z0-9]([a-z0-9-]{0,61}[a-z0-9])?$/i.test(part))
  },
  // matches ajv + length checks
  hostname: (input) => {
    if (input.length > (input.endsWith('.') ? 254 : 253)) return false
    const hostname = /^[a-z0-9]([a-z0-9-]{0,61}[a-z0-9])?(\.[a-z0-9]([a-z0-9-]{0,61}[a-z0-9])?)*\.?$/i
    return hostname.test(input)
  },

  // 'time' matches ajv + length checks, 'date' matches ajv full
  // date: https://tools.ietf.org/html/rfc3339#section-5.6
  // date-time: https://tools.ietf.org/html/rfc3339#section-5.6
  // leap year: https://tools.ietf.org/html/rfc3339#appendix-C
  // 11: 1990-01-01, 1: T, 9: 00:00:00., 12: maxiumum fraction length (non-standard), 6: +00:00
  date: (input) => {
    if (input.length !== 10) return false
    if (input[5] === '0' && input[6] === '2') {
      if (/^\d\d\d\d-02-(?:[012][1-8]|[12]0|[01]9)$/.test(input)) return true
      const matches = input.match(/^(\d\d\d\d)-02-29$/)
      if (!matches) return false
      const year = matches[1] | 0
      return year % 16 === 0 || (year % 4 === 0 && year % 25 !== 0)
    }
    if (input.endsWith('31')) return /^\d\d\d\d-(?:0[13578]|1[02])-31$/.test(input)
    return /^\d\d\d\d-(0[13-9]|1[012])-(?:[012][1-9]|[123]0)$/.test(input)
  },
  // leap second handling is special, we check it's 23:59:60.*
  time: (input) => {
    if (input.length > 9 + 12 + 6) return false
    const time = /^(2[0-3]|[0-1]\d):[0-5]\d:([0-5]\d|60)(\.\d+)?(z|[+-](2[0-3]|[0-1]\d)(:?[0-5]\d)?)?$/i
    if (!time.test(input)) return false
    if (!/:60/.test(input)) return true
    const p = input.match(/([0-9.]+|[^0-9.])/g)
    let hm = Number(p[0]) * 60 + Number(p[2])
    if (p[5] === '+') hm += 24 * 60 - Number(p[6] || 0) * 60 - Number(p[8] || 0)
    else if (p[5] === '-') hm += Number(p[6] || 0) * 60 + Number(p[8] || 0)
    return hm % (24 * 60) === 23 * 60 + 59
  },
  // first two lines specific to date-time, then tests for unanchored (at end) date, code identical to 'date' above
  'date-time': (input) => {
    if (input.length > 10 + 1 + 9 + 12 + 6) return false
    const full = /^\d{4}-(0[1-9]|1[0-2])-([0-2]\d|3[01])[t\s](2[0-3]|[0-1]\d):[0-5]\d:([0-5]\d|60)(\.\d+)?(z|[+-](2[0-3]|[0-1]\d)(:?[0-5]\d)?)$/i
    if (!full.test(input) || /^.{4}-02-3/.test(input)) return false
    if (/:60/.test(input)) {
      const p = input.slice(11).match(/([0-9.]+|[^0-9.])/g)
      let hm = Number(p[0]) * 60 + Number(p[2])
      if (p[5] === '+') hm += 24 * 60 - Number(p[6] || 0) * 60 - Number(p[8] || 0)
      else if (p[5] === '-') hm += Number(p[6] || 0) * 60 + Number(p[8] || 0)
      if (hm % (24 * 60) !== 23 * 60 + 59) return false
    }
    if (/^\d\d\d\d-(0[13-9]|1[012])-([012][1-9]|[123]0)/.test(input)) return true
    if (/^\d\d\d\d-02-([012][1-8]|[12]0|[01]9)/.test(input)) return true
    if (/^\d\d\d\d-(0[13578]|1[02])-31/.test(input)) return true
    const matches = input.match(/^(\d\d\d\d)-02-29/)
    if (!matches) return false
    const year = matches[1] | 0
    return year % 16 === 0 || (year % 4 === 0 && year % 25 !== 0)
  },

  /* ipv4 and ipv6 are from ajv with length restriction */
  // optimized https://www.safaribooksonline.com/library/view/regular-expressions-cookbook/9780596802837/ch07s16.html
  ipv4: (input) =>
    input.length <= 15 &&
    /^((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)\.){3}(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d\d?)$/.test(input),
  // optimized http://stackoverflow.com/questions/53497/regular-expression-that-matches-valid-ipv6-addresses
  // max length: 1000:1000:1000:1000:1000:1000:255.255.255.255
  // before that, we check a couple of fast paths for simple common cases
  ipv6: (input) => {
    if (input.length > 45 || input.length < 2) return false
    if (!input.includes('.')) {
      if (!/^[0-9a-f:]+$/i.test(input)) return false
      if (!input.includes('::')) return /^([0-9a-f]{1,4}:){7}[0-9a-f]{1,4}$/.test(input)
      if (input === '::') return true
      if (input.startsWith(':')) return /^:(:[0-9a-f]{1,4}){1,7}$/.test(input)
      if (input.endsWith(':')) return /^([0-9a-f]{1,4}:){1,7}:$/.test(input)
      if (input.indexOf('::') !== input.lastIndexOf('::')) return false
      const short = /^(([0-9a-f]{1,4}:){6}:[0-9a-f]{1,4}|([0-9a-f]{1,4}:){5}(:[0-9a-f]{1,4}){1,2}|([0-9a-f]{1,4}:){4}(:[0-9a-f]{1,4}){1,3}|([0-9a-f]{1,4}:){3}(:[0-9a-f]{1,4}){1,4}|([0-9a-f]{1,4}:){2}(:[0-9a-f]{1,4}){1,5}|([0-9a-f]{1,4}:){1}(:[0-9a-f]{1,4}){1,6})$/i
      return short.test(input)
    }
    const ipv6ipv4 = /^(([0-9a-f]{1,4}:){6}|([0-9a-f]{1,4}:){5}:|([0-9a-f]{1,4}:){4}(:[0-9a-f]{1,4})?:|([0-9a-f]{1,4}:){3}(:[0-9a-f]{1,4}){0,2}:|([0-9a-f]{1,4}:){2}(:[0-9a-f]{1,4}){0,3}:|([0-9a-f]{1,4}:){1}(:[0-9a-f]{1,4}){0,4}:|:(:[0-9a-f]{1,4}){0,5}:)(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}$/i
    return ipv6ipv4.test(input)
  },
  // matches ajv with optimization
  uri: /^[a-z][a-z0-9+\-.]*:(\/?\/(([a-z0-9\-._~!$&'()*+,;=:]|%[0-9a-f]{2})*@)?(\[(((([0-9a-f]{1,4}:){6}|::([0-9a-f]{1,4}:){5}|([0-9a-f]{1,4})?::([0-9a-f]{1,4}:){4}|(([0-9a-f]{1,4}:){0,1}[0-9a-f]{1,4})?::([0-9a-f]{1,4}:){3}|(([0-9a-f]{1,4}:){0,2}[0-9a-f]{1,4})?::([0-9a-f]{1,4}:){2}|(([0-9a-f]{1,4}:){0,3}[0-9a-f]{1,4})?::[0-9a-f]{1,4}:|(([0-9a-f]{1,4}:){0,4}[0-9a-f]{1,4})?::)([0-9a-f]{1,4}:[0-9a-f]{1,4}|((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d\d?)\.){3}(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d\d?))|(([0-9a-f]{1,4}:){0,5}[0-9a-f]{1,4})?::[0-9a-f]{1,4}|(([0-9a-f]{1,4}:){0,6}[0-9a-f]{1,4})?::)|v[0-9a-f]+\.[a-z0-9\-._~!$&'()*+,;=:]+)\]|((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d\d?)\.){3}(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d\d?)|([a-z0-9\-._~!$&'()*+,;=]|%[0-9a-f]{2})*)(:\d*)?(\/([a-z0-9\-._~!$&'()*+,;=:@]|%[0-9a-f]{2})*)*|\/?(([a-z0-9\-._~!$&'()*+,;=:@]|%[0-9a-f]{2})+(\/([a-z0-9\-._~!$&'()*+,;=:@]|%[0-9a-f]{2})*)*)?)(\?([a-z0-9\-._~!$&'()*+,;=:@/?]|%[0-9a-f]{2})*)?(#([a-z0-9\-._~!$&'()*+,;=:@/?]|%[0-9a-f]{2})*)?$/i,
  // matches ajv with optimization
  'uri-reference': /^([a-z][a-z0-9+\-.]*:)?(\/?\/(([a-z0-9\-._~!$&'()*+,;=:]|%[0-9a-f]{2})*@)?(\[(((([0-9a-f]{1,4}:){6}|::([0-9a-f]{1,4}:){5}|([0-9a-f]{1,4})?::([0-9a-f]{1,4}:){4}|(([0-9a-f]{1,4}:){0,1}[0-9a-f]{1,4})?::([0-9a-f]{1,4}:){3}|(([0-9a-f]{1,4}:){0,2}[0-9a-f]{1,4})?::([0-9a-f]{1,4}:){2}|(([0-9a-f]{1,4}:){0,3}[0-9a-f]{1,4})?::[0-9a-f]{1,4}:|(([0-9a-f]{1,4}:){0,4}[0-9a-f]{1,4})?::)([0-9a-f]{1,4}:[0-9a-f]{1,4}|((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d\d?)\.){3}(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d\d?))|(([0-9a-f]{1,4}:){0,5}[0-9a-f]{1,4})?::[0-9a-f]{1,4}|(([0-9a-f]{1,4}:){0,6}[0-9a-f]{1,4})?::)|v[0-9a-f]+\.[a-z0-9\-._~!$&'()*+,;=:]+)\]|((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d\d?)\.){3}(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d\d?)|([a-z0-9\-._~!$&'()*+,;=]|%[0-9a-f]{2})*)(:\d*)?(\/([a-z0-9\-._~!$&'()*+,;=:@]|%[0-9a-f]{2})*)*|\/?(([a-z0-9\-._~!$&'()*+,;=:@]|%[0-9a-f]{2})+(\/([a-z0-9\-._~!$&'()*+,;=:@]|%[0-9a-f]{2})*)*)?)?(\?([a-z0-9\-._~!$&'()*+,;=:@/?]|%[0-9a-f]{2})*)?(#([a-z0-9\-._~!$&'()*+,;=:@/?]|%[0-9a-f]{2})*)?$/i,
  // ajv has /^(([^\x00-\x20"'<>%\\^`{|}]|%[0-9a-f]{2})|\{[+#./;?&=,!@|]?([a-z0-9_]|%[0-9a-f]{2})+(:[1-9][0-9]{0,3}|\*)?(,([a-z0-9_]|%[0-9a-f]{2})+(:[1-9][0-9]{0,3}|\*)?)*\})*$/i
  // this is equivalent
  // uri-template: https://tools.ietf.org/html/rfc6570
  // eslint-disable-next-line no-control-regex
  'uri-template': /^([^\x00-\x20"'<>%\\^`{|}]|%[0-9a-f]{2}|\{[+#./;?&=,!@|]?([a-z0-9_]|%[0-9a-f]{2})+(:[1-9][0-9]{0,3}|\*)?(,([a-z0-9_]|%[0-9a-f]{2})+(:[1-9][0-9]{0,3}|\*)?)*\})*$/i,

  // ajv has /^(\/([^~/]|~0|~1)*)*$/, this is equivalent
  // JSON-pointer: https://tools.ietf.org/html/rfc6901
  'json-pointer': /^(|\/([^~]|~0|~1)*)$/,
  // ajv has /^(0|[1-9][0-9]*)(#|(\/([^~/]|~0|~1)*)*)$/, this is equivalent
  // relative JSON-pointer: http://tools.ietf.org/html/draft-luff-relative-json-pointer-00
  'relative-json-pointer': /^(0|[1-9][0-9]*)(|#|\/([^~]|~0|~1)*)$/,

  // matches ajv + unwrap nested group
  // uuid: http://tools.ietf.org/html/rfc4122
  uuid: /^(urn:uuid:)?[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i,

  // length restriction is an arbitrary safeguard
  // first regex checks if this a week duration (can't be combined with others)
  // second regex verifies symbols, no more than one fraction, at least 1 block is present, and T is not last
  // third regex verifies structure
  duration: (input) =>
    input.length > 1 &&
    input.length < 80 &&
    (/^P\d+([.,]\d+)?W$/.test(input) ||
      (/^P[\dYMDTHS]*(\d[.,]\d+)?[YMDHS]$/.test(input) &&
        /^P([.,\d]+Y)?([.,\d]+M)?([.,\d]+D)?(T([.,\d]+H)?([.,\d]+M)?([.,\d]+S)?)?$/.test(input))),

  // TODO: iri, iri-reference, idn-email, idn-hostname
}

const extra = {
  // basic
  alpha: /^[a-zA-Z]+$/,
  alphanumeric: /^[a-zA-Z0-9]+$/,

  // hex
  'hex-digits': /^[0-9a-f]+$/i,
  'hex-digits-prefixed': /^0x[0-9a-f]+$/i,
  'hex-bytes': /^([0-9a-f][0-9a-f])+$/i,
  'hex-bytes-prefixed': /^0x([0-9a-f][0-9a-f])+$/i,

  base64: (input) => input.length % 4 === 0 && /^[a-z0-9+/]*={0,3}$/i.test(input),

  // ajv has /^#(\/([a-z0-9_\-.!$&'()*+,;:=@]|%[0-9a-f]{2}|~0|~1)*)*$/i, this is equivalent
  // uri fragment: https://tools.ietf.org/html/rfc3986#appendix-A
  'json-pointer-uri-fragment': /^#(|\/(\/|[a-z0-9_\-.!$&'()*+,;:=@]|%[0-9a-f]{2}|~0|~1)*)$/i,

  // draft3 backwards compat
  'host-name': core.hostname,
  'ip-address': core.ipv4,

  // manually cleaned up from is-my-json-valid, CSS 2.1 colors only per draft03 spec
  color: /^(#[0-9A-Fa-f]{3,6}|aqua|black|blue|fuchsia|gray|green|lime|maroon|navy|olive|orange|purple|red|silver|teal|white|yellow|rgb\(\s*([0-9]|[1-9][0-9]|1[0-9][0-9]|2[0-4][0-9]|25[0-5])\s*,\s*([0-9]|[1-9][0-9]|1[0-9][0-9]|2[0-4][0-9]|25[0-5])\s*,\s*([0-9]|[1-9][0-9]|1[0-9][0-9]|2[0-4][0-9]|25[0-5])\s*\)|rgb\(\s*(\d?\d%|100%)\s*,\s*(\d?\d%|100%)\s*,\s*(\d?\d%|100%)\s*\))$/,

  // style is deliberately unsupported, don't accept untrusted styles
}

const weak = {
  // In weak because don't accept regexes from untrusted sources, using them can cause DoS
  // matches ajv + length checks
  // eslint comment outside because we don't want comments in functions, those affect output
  /* eslint-disable no-new */
  regex: (str) => {
    if (str.length > 1e5) return false
    const Z_ANCHOR = /[^\\]\\Z/
    if (Z_ANCHOR.test(str)) return false
    try {
      new RegExp(str)
      return true
    } catch (e) {
      return false
    }
  },
  /* eslint-enable no-new */
}

module.exports = { core, extra, weak }
