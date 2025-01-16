import { ReactElement, useEffect, useState } from 'react';
import Button from './button';

type ImageDetailsProps = {
  file: File;
  onRemove: () => void;
};

const ImageDetails = ({ file, onRemove }: ImageDetailsProps): ReactElement => {
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    const objectUrl = URL.createObjectURL(file);
    setImagePreviewUrl(objectUrl);

    return () => {
      URL.revokeObjectURL(objectUrl);
    };
  }, [file]);

  const getFileSize = (size: number) => {
    if (size >= 1024 * 1024) {
      return `${(size / (1024 * 1024)).toFixed(2)} MB`;
    }
    return `${(size / 1024).toFixed(2)} KB`;
  };

  return (
    <div className="w-full h-fit px-2 py-2 flex gap-2 text-zinc-600 text-sm bg-sky-50 border border-sky-400 rounded-lg">
      <div className="w-full flex gap-4 flex-1  min-w-0">
        {imagePreviewUrl && <div className='rounded-lg overflow-hidden shadow-lg shrink-0'><img src={imagePreviewUrl} alt={file.name} className="h-16 max-h-16 w-auto max-w-28" /></div>}

        <div className="w-full flex flex-col gap-1 flex-1 min-w-0">
          <div className="font-semibold truncate">{file.name}</div>
          <div className="text-xs text-zinc-400">{getFileSize(file.size)}</div>
        </div>
      </div>

      <div className="shrink-0">
        <Button variant="icon" IconVariant="x" size="medium" onClick={onRemove} />
      </div>
    </div>
  );
};

export default ImageDetails;
