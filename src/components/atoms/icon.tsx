import { ReactElement } from "react";
import PhotoIcon from "src/assets/icons/photo.svg?react";
import SignatureLock from "src/assets/icons/signature-lock.svg?react";

export type IconSize = "small" | "medium" | "large";
const possibleSizes: Record<IconSize, number> = {
  small: 12,
  medium: 16,
  large: 24,
};

export type IconVariant = "photo" | "signature";

export type IconProps = {
  size?: IconSize;
  variant: IconVariant;
  style?: React.CSSProperties;
  className?: string;
};

const Icon = ({
  variant,
  size = "medium",
  style,
  className,
}: IconProps): ReactElement => {
  switch (variant) {
    case "photo":
      return (
        <PhotoIcon
          width={possibleSizes[size]}
          style={style}
          className={className}
        />
      );
    case "signature":
      return (
        <SignatureLock
          width={possibleSizes[size]}
          style={style}
          className={className}
        />
      );
  }
};

export default Icon;
