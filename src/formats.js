'use strict'

const core = {
  // matches ajv + length checks + does not start with a dot
  // note that quoted emails are deliberately unsupported (as in ajv), who would want \x01 in email
  email: (input) => {
    if (input[0] === '"') return false
    const [name, host, ...rest] = input.split('@')
    if (!name || !host || rest.length !== 0 || name.length > 64 || host.length > 253) return false
    if (name[0] === '.' || name.endsWith('.') || name.includes('..')) return false
    if (!/^[a-z0-9.-]+$/i.test(host) || !/^[a-z0-9.!#$%&'*+/=?^_`{|}~-]+$/i.test(name)) return false
    return host.split('.').every((part) => /^[a-z0-9]([a-z0-9-]{0,61}[a-z0-9])?$/i.test(part))
  },
  // matches ajv + length checks
  hostname: (input) => {
    const host = input.endsWith('.') ? input.slice(0, input.length - 1) : input
    if (host.length > 253) return false
    if (!/^[a-z0-9.-]+$/i.test(host)) return false
    return host.split('.').every((part) => /^[a-z0-9]([a-z0-9-]{0,61}[a-z0-9])?$/i.test(part))
  },

  // 'time' matches ajv + length checks, 'date' matches ajv full
  // date: https://tools.ietf.org/html/rfc3339#section-5.6
  // date-time: https://tools.ietf.org/html/rfc3339#section-5.6
  // leap year: https://tools.ietf.org/html/rfc3339#appendix-C
  // 11: 1990-01-01, 1: T, 9: 00:00:00., 12: maxiumum fraction length (non-standard), 6: +00:00
  date: (input) => {
    if (input.length !== 10) return false
    if (/^\d\d\d\d-(0[13-9]|1[012])-([012][1-9]|[123]0)$/.test(input)) return true
    if (/^\d\d\d\d-02-([012][1-8]|[12]0|[01]9)$/.test(input)) return true
    if (/^\d\d\d\d-(0[13578]|1[02])-31$/.test(input)) return true
    const matches = input.match(/^(\d\d\d\d)-02-29$/)
    if (!matches) return false
    const year = matches[1] | 0
    return year % 16 === 0 || (year % 4 === 0 && year % 25 !== 0)
  },
  time: (input) =>
    input.length <= 9 + 12 + 6 &&
    /^([0-2]\d:[0-5]\d:[0-5]\d|23:59:60)(\.\d+)?(z|[+-]\d\d(:?\d\d)?)?$/i.test(input),
  // first two lines specific to date-time, then tests for unanchored (at end) date, code identical to 'date' above
  'date-time': (input) => {
    if (input.length > 10 + 1 + 9 + 12 + 6) return false
    const full = /^\d{4}-(0[1-9]|1[0-2])-[0-3]\d[t\s]([0-2]\d:[0-5]\d:[0-5]\d|23:59:60)(\.\d+)?(z|[+-]\d\d(:?\d\d)?)$/i
    if (!full.test(input)) return false
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
    /^((25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(25[0-5]|2[0-4]\d|[01]?\d\d?)$/.test(input),
  // optimized http://stackoverflow.com/questions/53497/regular-expression-that-matches-valid-ipv6-addresses
  // max length: 1000:1000:1000:1000:1000:1000:255.255.255.255
  ipv6: (input) =>
    input.length <= 45 &&
    /^((([0-9a-f]{1,4}:){7}([0-9a-f]{1,4}|:))|(([0-9a-f]{1,4}:){6}(:[0-9a-f]{1,4}|((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9a-f]{1,4}:){5}(((:[0-9a-f]{1,4}){1,2})|:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9a-f]{1,4}:){4}(((:[0-9a-f]{1,4}){1,3})|((:[0-9a-f]{1,4})?:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9a-f]{1,4}:){3}(((:[0-9a-f]{1,4}){1,4})|((:[0-9a-f]{1,4}){0,2}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9a-f]{1,4}:){2}(((:[0-9a-f]{1,4}){1,5})|((:[0-9a-f]{1,4}){0,3}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9a-f]{1,4}:){1}(((:[0-9a-f]{1,4}){1,6})|((:[0-9a-f]{1,4}){0,4}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(:(((:[0-9a-f]{1,4}){1,7})|((:[0-9a-f]{1,4}){0,5}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:)))$/i.test(
      input
    ),
  // matches ajv with optimization
  uri: /^[a-z][a-z0-9+\-.]*:(\/?\/(([a-z0-9\-._~!$&'()*+,;=:]|%[0-9a-f]{2})*@)?(\[(((([0-9a-f]{1,4}:){6}|::([0-9a-f]{1,4}:){5}|([0-9a-f]{1,4})?::([0-9a-f]{1,4}:){4}|(([0-9a-f]{1,4}:){0,1}[0-9a-f]{1,4})?::([0-9a-f]{1,4}:){3}|(([0-9a-f]{1,4}:){0,2}[0-9a-f]{1,4})?::([0-9a-f]{1,4}:){2}|(([0-9a-f]{1,4}:){0,3}[0-9a-f]{1,4})?::[0-9a-f]{1,4}:|(([0-9a-f]{1,4}:){0,4}[0-9a-f]{1,4})?::)([0-9a-f]{1,4}:[0-9a-f]{1,4}|((25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(25[0-5]|2[0-4]\d|[01]?\d\d?))|(([0-9a-f]{1,4}:){0,5}[0-9a-f]{1,4})?::[0-9a-f]{1,4}|(([0-9a-f]{1,4}:){0,6}[0-9a-f]{1,4})?::)|v[0-9a-f]+\.[a-z0-9\-._~!$&'()*+,;=:]+)\]|((25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(25[0-5]|2[0-4]\d|[01]?\d\d?)|([a-z0-9\-._~!$&'()*+,;=]|%[0-9a-f]{2})*)(:\d*)?(\/([a-z0-9\-._~!$&'()*+,;=:@]|%[0-9a-f]{2})*)*|\/?(([a-z0-9\-._~!$&'()*+,;=:@]|%[0-9a-f]{2})+(\/([a-z0-9\-._~!$&'()*+,;=:@]|%[0-9a-f]{2})*)*)?)(\?([a-z0-9\-._~!$&'()*+,;=:@/?]|%[0-9a-f]{2})*)?(#([a-z0-9\-._~!$&'()*+,;=:@/?]|%[0-9a-f]{2})*)?$/i,
  // matches ajv with optimization
  'uri-reference': /^([a-z][a-z0-9+\-.]*:)?(\/?\/(([a-z0-9\-._~!$&'()*+,;=:]|%[0-9a-f]{2})*@)?(\[(((([0-9a-f]{1,4}:){6}|::([0-9a-f]{1,4}:){5}|([0-9a-f]{1,4})?::([0-9a-f]{1,4}:){4}|(([0-9a-f]{1,4}:){0,1}[0-9a-f]{1,4})?::([0-9a-f]{1,4}:){3}|(([0-9a-f]{1,4}:){0,2}[0-9a-f]{1,4})?::([0-9a-f]{1,4}:){2}|(([0-9a-f]{1,4}:){0,3}[0-9a-f]{1,4})?::[0-9a-f]{1,4}:|(([0-9a-f]{1,4}:){0,4}[0-9a-f]{1,4})?::)([0-9a-f]{1,4}:[0-9a-f]{1,4}|((25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(25[0-5]|2[0-4]\d|[01]?\d\d?))|(([0-9a-f]{1,4}:){0,5}[0-9a-f]{1,4})?::[0-9a-f]{1,4}|(([0-9a-f]{1,4}:){0,6}[0-9a-f]{1,4})?::)|v[0-9a-f]+\.[a-z0-9\-._~!$&'()*+,;=:]+)\]|((25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(25[0-5]|2[0-4]\d|[01]?\d\d?)|([a-z0-9\-._~!$&'()*+,;=]|%[0-9a-f]{2})*)(:\d*)?(\/([a-z0-9\-._~!$&'()*+,;=:@]|%[0-9a-f]{2})*)*|\/?(([a-z0-9\-._~!$&'()*+,;=:@]|%[0-9a-f]{2})+(\/([a-z0-9\-._~!$&'()*+,;=:@]|%[0-9a-f]{2})*)*)?)?(\?([a-z0-9\-._~!$&'()*+,;=:@/?]|%[0-9a-f]{2})*)?(#([a-z0-9\-._~!$&'()*+,;=:@/?]|%[0-9a-f]{2})*)?$/i,
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
