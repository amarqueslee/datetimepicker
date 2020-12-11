import {
  toMilliseconds,
  toWebInputFormat,
  fromWebEventFormat,
} from '../src/utils.js';

describe('utils', () => {
  describe('toMilliseconds', () => {
    it('converts Date values by key to milliseconds', () => {
      const options = {
        value: new Date('2020-12-12'),
        minimumDate: new Date('1950-01-01'),
        maximumDate: new Date('2050-12-31'),
      };

      toMilliseconds(options, 'value');
      expect(options).toHaveProperty('value', 1607731200000);

      toMilliseconds(options, 'minimumDate', 'maximumDate');
      expect(options).toHaveProperty('minimumDate', -631152000000);
      expect(options).toHaveProperty('maximumDate', 2556057600000);
    });
  });

  describe('toWebInputFormat', () => {
    const tzOffset = new Date(1).getTimezoneOffset() * 60 * 1000;

    it('renders a time of day', () => {
      const input = new Date((12 * 60 + 30) * 60 * 1000 + tzOffset); // 9 hours and 9 minutes
      expect(toWebInputFormat('time', input)).toBe('12:30');
    });

    it('uses 24-hour format', () => {
      const input = new Date((17 * 60 + 30) * 60 * 1000 + tzOffset); // 9 hours and 9 minutes
      expect(toWebInputFormat('time', input)).toBe('17:30');
    });

    it('pads a time of day', () => {
      const input = new Date((9 * 60 + 9) * 60 * 1000 + tzOffset); // 9 hours and 9 minutes
      expect(toWebInputFormat('time', input)).toBe('09:09');
    });

    let hourlyDateFormatTest = (hour) => () => {
      /*
       * The aim of this test is to essentially help remember that `date.toISOString().split('T')[0]`
       * is not a valid implementation because timezone offsets may skew the date-portion of the ISO string.
       *
       * Unfortunately, this test will pass if the system's locale is +0000, not sure how to handle that.
       *
       * In other cases, hour-of-day where ISO string skew will happen depends on your locale, so here I brute-force
       * all hours of the day.
       */
      let hourstring = (hour < 10 ? '0' : '') + hour;
      const input = new Date('2020-12-10T' + hourstring + ':00:00+1100'); // NOTE month zero-indexed
      expect(toWebInputFormat('date', input)).toStrictEqual('2020-12-10');
    };

    for (var hour = 0; hour < 23; ++hour) {
      it(
        'renders locally-zoned date for the ' + hour + 'th hour of the day',
        hourlyDateFormatTest(hour),
      );
    }
  });

  describe('fromWebEventFormat', () => {
    // fromWebEventFormat uses this as a reference to know what TZ offset to work with
    const referenceDate = new Date(2020, 11, 10);

    it('converts from a time stamp', () => {
      const result = fromWebEventFormat(referenceDate, 'time', '18:56');
      expect(result.getHours()).toBe(18);
      expect(result.getMinutes()).toBe(56);
    });

    it('converts from a date stamp', () => {
      const result = fromWebEventFormat(referenceDate, 'date', '2020-12-10');
      expect(result.getFullYear()).toBe(2020);
      expect(result.getMonth()).toBe(11); // NOTE month zero-indexed
      expect(result.getDate()).toBe(10);
    });

    it('converts from a datetime stamp', () => {
      const result = fromWebEventFormat(
        referenceDate,
        'datetime',
        '2020-12-10T00:00:00.000Z',
      );
      expect(result.getUTCFullYear()).toBe(2020);
      expect(result.getUTCMonth()).toBe(11); // NOTE month zero-indexed
      expect(result.getUTCDate()).toBe(10);
      expect(result.getUTCHours()).toBe(0);
      expect(result.getUTCMinutes()).toBe(0); // NOTE month zero-indexed
      expect(result.getUTCSeconds()).toBe(0);
    });
  });
});
