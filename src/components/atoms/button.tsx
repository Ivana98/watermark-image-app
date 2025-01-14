import { ButtonHTMLAttributes, MouseEvent, ReactElement } from "react";
import clsx, { ClassValue } from "clsx";
import Icon, { IconSize, IconVariant } from "./icon";

export type ButtonProps = {
  variant?: ButtonVariant;
  size?: ButtonSize;
  IconVariant?: IconVariant;
  iconSize?: IconSize;
  fullWidth?: boolean;
  text?: string;
  onClick?: (event?: MouseEvent) => void;
} & Omit<ButtonHTMLAttributes<HTMLButtonElement>, "onClick">;

type ButtonVariant = "filled" | "outline" | "borderless" | "text";
type ButtonSize = "small" | "medium" | "large";

const buttonSizeStyle: Record<ButtonSize, string> = {
  small: "h-6 p-1.5 rounded-md",
  medium: "h-8 p-2 rounded-lg",
  large: "h-10 p-3 rounded-lg",
};

const baseVariantStyle = `font-body text-xs text-center disabled:cursor-not-allowed
  flex gap-1 flex-row justify-center items-center whitespace-nowrap `;

const buttonClasses: Record<ButtonVariant, string> = {
  filled:
    "bg-primary-500 hover:bg-primary-600 focus-visible:bg-primary-600 disabled:bg-warmGray-600 text-base-0 font-semibold",
  outline: `
    bg-base-0 text-primary-500 font-semibold
    border border-primary-150 hover:border-primary-500 focus-visible:border-primary-500
    disabled:border-warmGray-300 disabled:text-warmGray-600
    `,
  borderless: `text-base-500 font-regular bg-base-0 hover:text-base-500 focus-visible:text-base-500 focus-visible:bg-primary-50 hover:bg-primary-50 
              disabled:text-warmGray-600  disabled:bg-base-0`,
  text: `
    text-primary-500 font-semibold hover:text-primary-600 focus-visible:text-primary-600
    disabled:text-warmGray-600
    `,
};

const buttons = (
  size = "medium",
  fullWidth?: boolean
): Record<ButtonVariant, ClassValue[]> => ({
  filled: [
    baseVariantStyle,
    buttonClasses["filled"],
    buttonSizeStyle[size as ButtonSize],
    fullWidth && "w-full",
  ],
  outline: [
    baseVariantStyle,
    buttonClasses["outline"],
    buttonSizeStyle[size as ButtonSize],
    fullWidth && "w-full",
  ],
  borderless: [
    baseVariantStyle,
    buttonClasses["borderless"],
    buttonSizeStyle[size as ButtonSize],
    fullWidth && "w-full",
  ],
  text: [
    baseVariantStyle,
    buttonClasses["text"],
  ],
});

const Button = ({
  disabled = false,
  variant = "filled",
  size = "medium",
  IconVariant,
  text,
  iconSize,
  fullWidth = false,
  onClick,
  ...htmlButtonProps
}: ButtonProps): ReactElement => {
  return (
    <button
      disabled={disabled}
      className={clsx(
        variant && buttons(size, fullWidth)[variant]
      )}
      {...htmlButtonProps}
      onClick={(e) => {
        e.stopPropagation();
        onClick?.(e);
      }}
    >
      {IconVariant && <Icon variant={IconVariant} size={iconSize ?? size} />}
      {text}
    </button>
  );
};

export default Button;
