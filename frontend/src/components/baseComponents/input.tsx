import React, { InputHTMLAttributes, ReactElement, useState } from 'react';
import Icon, { IconVariant } from './icon';

type InputProps = {
  labelText: string;
  labelIconVariant?: IconVariant;
  maxLength?: number;
} & InputHTMLAttributes<HTMLInputElement>;

const Input = ({ labelText, labelIconVariant, maxLength, ...props }: InputProps): ReactElement => {
  const [charCount, setCharCount] = useState(0);

  const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCharCount(e.target.value.length);
    if (props.onChange) props.onChange(e);
  };

  return (
    <div className="w-full flex items-center gap-4 text-zinc-600 text-sm">
      <label htmlFor={props.id} className="shrink-0 flex items-center gap-2">
        {labelIconVariant && <Icon variant={labelIconVariant} size="medium" className="text-zinc-600" />}
        <div>{labelText}</div>
      </label>
      <input
        {...props}
        maxLength={maxLength}
        onChange={handleOnChange}
        className="w-full h-fit border border-zinc-300 rounded-lg px-2 py-1 hover:border-blue-600 focus:border-blue-500 focus:outline-none focus-visible:border-blue-600 disabled:text-zinc-400 placeholder:text-zinc-400"
      />
      {maxLength && (
        <label className="pr-1 text-zinc-400">
          {charCount}/{maxLength}
        </label>
      )}
    </div>
  );
};

export default Input;
