/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * This is a controlled component version of RNDateTimePicker
 *
 * @format
 * @flow strict-local
 */
import {MODE_DATE} from './constants';
import invariant from 'invariant';
import React from 'react';

import type {Event, WebNativeProps} from './types';
import {toWebInputFormat, fromWebEventFormat} from './utils';

export default function DateTimePicker({
  value,
  mode,
  maximumDate,
  minimumDate,
  style,
  onChange,
}: WebNativeProps) {
  const _onChange = (event: Event) => {
    let newValue = fromWebEventFormat(value, mode, event.target.value);
    onChange && onChange(event, newValue);
  };

  invariant(value instanceof Date, 'A date or time should be specified as `value`.');

  // It seems 'datetime' is a deprecated type for 'input' tag, 'datetime-local' is the modern replacement.
  const inputType: string = mode === 'datetime' ? 'datetime-local' : mode;

  return (
    <input
      type={inputType}
      style={style}
      min={minimumDate && toWebInputFormat(mode, minimumDate)}
      max={maximumDate && toWebInputFormat(mode, maximumDate)}
      value={toWebInputFormat(mode, value)}
      onChange={_onChange}
    />
  );
}

DateTimePicker.defaultProps = {
  mode: MODE_DATE,
};
