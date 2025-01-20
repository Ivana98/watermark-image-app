import { ButtonHTMLAttributes, MouseEvent, ReactElement } from 'react';
import clsx, { ClassValue } from 'clsx';
import Icon, { IconSize, IconVariant } from './icon';

export type ButtonProps = {
  variant?: ButtonVariant;
  size?: ButtonSize;
  IconVariant?: IconVariant;
  iconSize?: IconSize;
  iconPosition?: ButtonPosition;
  fullWidth?: boolean;
  text?: string;
  onClick?: (event?: MouseEvent) => void;
} & Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'onClick'>;

type ButtonVariant = 'filled' | 'outline' | 'text' | 'icon';
type ButtonSize = 'small' | 'medium' | 'large';
type ButtonPosition = 'left' | 'right';

const buttonSizeStyle: Record<ButtonSize, string> = {
  small: 'h-6 p-1.5 rounded-md',
  medium: 'h-8 p-2 rounded-lg',
  large: 'h-10 p-3 rounded-lg',
};

const baseVariantStyle = `text-xs text-center disabled:cursor-not-allowed outline-none
  flex gap-1 flex-row justify-center items-center whitespace-nowrap `;

const buttonClasses: Record<ButtonVariant, string> = {
  filled: `
    text-white font-semibold
    bg-blue-500 hover:bg-blue-600 focus-visible:bg-blue-600
    disabled:bg-zinc-400`,
  outline: `
    bg-white text-blue-400 font-semibold hover:text-blue-600 focus-visible:text-blue-600
    border border-zinc-200 hover:border-blue-400 focus-visible:border-blue-400
    disabled:border-zinc-200 disabled:text-zinc-400
    `,
  text: `
    text-blue-400 font-semibold underline hover:text-blue-600 focus-visible:text-blue-600
    disabled:text-zinc-400
    `,
  icon: `
    text-zinc-400 font-semibold hover:text-zinc-600 focus-visible:text-zinc-600
    disabled:text-zinc-200
    `,
};

const buttons = (size = 'medium', fullWidth?: boolean): Record<ButtonVariant, ClassValue[]> => ({
  filled: [baseVariantStyle, buttonClasses['filled'], buttonSizeStyle[size as ButtonSize], fullWidth && 'w-full'],
  outline: [baseVariantStyle, buttonClasses['outline'], buttonSizeStyle[size as ButtonSize], fullWidth && 'w-full'],
  text: [baseVariantStyle, buttonClasses['text']],
  icon: [baseVariantStyle, buttonClasses['icon']],
});

const Button = ({
  disabled = false,
  variant = 'filled',
  size = 'medium',
  IconVariant,
  text,
  iconSize = 'medium',
  iconPosition = 'left',
  fullWidth = false,
  onClick,
  ...htmlButtonProps
}: ButtonProps): ReactElement => {
  return (
    <button
      disabled={disabled}
      className={clsx(variant && buttons(size, fullWidth)[variant])}
      {...htmlButtonProps}
      onClick={(e) => {
        e.stopPropagation();
        onClick?.(e);
      }}
    >
      {IconVariant && iconPosition === 'left' && <Icon variant={IconVariant} size={iconSize ?? size} className='shrink-0'/>}
      <div className="truncate min-w-0">{text} </div>
      {IconVariant && iconPosition === 'right' && <Icon variant={IconVariant} size={iconSize ?? size} className='shrink-0' />}
    </button>
  );
};

export default Button;
