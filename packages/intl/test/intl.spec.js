const { Intl, MissingLocale, MissingLocaleKey, InvalidLocaleMessage } = require('../index')
const { test, expect } = global

let locales = {
  'en-us': {
    welcome: 'Welcome {name}',
    messages: `You have {messages, plural, =0 {no messages} one {1 message} other {{messages} messages}}`,
    first: { second: { third: `Hi {name} from deep nested key` }}
  },
  'sq-al': {
    welcome: 'Miresevjen {name}',
    messages: `Ju {messages, plural, =0 {s'keni asnje mesazh} one {keni 1 mesazh} other {keni {messages} mesazhe}}`
  }
}

test('key is found and formatted correctly', () => {
  const intl = new Intl(locales, 'en-us')
  let message = intl.format('welcome', { name: 'John' })

  expect(message).toBe('Welcome John')
})

test('deep nested key is found and formatted correctly', () => {
  const intl = new Intl(locales, 'en-us')
  let message = intl.format('first.second.third', { name: 'John' })

  expect(message).toBe('Hi John from deep nested key')
})

test('locale is changed after initialization', () => {
  const intl = new Intl(locales, 'en-us')
  let messageEn = intl.format('welcome', { name: 'John' })
  intl.locale = 'sq-al'
  let messageSq = intl.format('welcome', { name: 'Xhon' })

  expect(messageEn).toBe('Welcome John')
  expect(messageSq).toBe('Miresevjen Xhon')
})

test('locale is changed temporarily for a single format call', () => {
  const intl = new Intl(locales, 'en-us')
  let messageEn = intl.format('welcome', { name: 'John' })
  let messageSq = intl.in('sq-al').format('welcome', { name: 'Xhon' })

  expect(messageEn).toBe('Welcome John')
  expect(messageSq).toBe('Miresevjen Xhon')
})

test('locale is reported correctly', () => {
  const intl = new Intl(locales, 'en-us')
  expect(intl.locale).toBe('en-us')
})

test("throws when locale doesn't exist", () => {
  expect(() => {
    let intl = new Intl(locales, 'en-us')
    intl.locale = 'fr'
    intl.format('welcome', { name: 'John' })
  }).toThrow(MissingLocale)

  expect(() => {
    let intl = new Intl(locales, 'en-us')
    intl.in('fr').format('welcome', { name: 'John' })
  }).toThrow(MissingLocale)
})

test("throws when locale key doesn't exist", () => {
  expect(() => {
    let intl = new Intl(locales, 'en-us')
    intl.format('unknown', { name: 'John' })
  }).toThrow(MissingLocaleKey)
})

test('throws when locale message is not correctly formatted', () => {
  expect(() => {
    locales['en-us'].welcome = 'Welcome {{name}'
    let intl = new Intl(locales, 'en-us')
    intl.format('welcome', { name: 'John' })
  }).toThrow(InvalidLocaleMessage)
})
