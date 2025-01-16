import { ReactElement } from 'react';

import CheckCircleIcon from 'src/assets/icons/check-circle.svg?react';
import DownloadIcon from 'src/assets/icons/download.svg?react';
import ExclamationTriangleIcon from 'src/assets/icons/exclamation-triangle.svg?react';
import ImagePlusIcon from 'src/assets/icons/image-plus.svg?react';
import InfoCircleIcon from 'src/assets/icons/info-circle.svg?react';
import PhotoIcon from 'src/assets/icons/photo.svg?react';
import SignatureLockIcon from 'src/assets/icons/signature-lock.svg?react';
import SignatureIcon from 'src/assets/icons/signature.svg?react';
import UploadIcon from 'src/assets/icons/upload.svg?react';
import XIcon from 'src/assets/icons/x.svg?react';

export type IconSize = 'small' | 'medium' | 'large';
const possibleSizes: Record<IconSize, number> = {
  small: 12,
  medium: 16,
  large: 24,
};

export type IconVariant =
  | 'check-circle'
  | 'download'
  | 'exclamation-triangle'
  | 'image-plus'
  | 'info-circle'
  | 'photo'
  | 'signature-lock'
  | 'signature'
  | 'upload'
  | 'x';

export type IconProps = {
  size?: IconSize;
  variant: IconVariant;
  style?: React.CSSProperties;
  className?: string;
};

const Icon = ({ variant, size = 'medium', style, className }: IconProps): ReactElement => {
  switch (variant) {
    case 'check-circle':
      return <CheckCircleIcon width={possibleSizes[size]} style={style} className={className} />;
    case 'download':
      return <DownloadIcon width={possibleSizes[size]} style={style} className={className} />;
    case 'exclamation-triangle':
      return <ExclamationTriangleIcon width={possibleSizes[size]} style={style} className={className} />;
    case 'image-plus':
      return <ImagePlusIcon width={possibleSizes[size]} style={style} className={className} />;
    case 'info-circle':
      return <InfoCircleIcon width={possibleSizes[size]} style={style} className={className} />;
    case 'photo':
      return <PhotoIcon width={possibleSizes[size]} style={style} className={className} />;
    case 'signature-lock':
      return <SignatureLockIcon width={possibleSizes[size]} style={style} className={className} />;
    case 'signature':
      return <SignatureIcon width={possibleSizes[size]} style={style} className={className} />;
    case 'upload':
      return <UploadIcon width={possibleSizes[size]} style={style} className={className} />;
    case 'x':
      return <XIcon width={possibleSizes[size]} style={style} className={className} />;
  }
};

export default Icon;
