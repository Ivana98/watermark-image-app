import { ReactElement, useState } from 'react';
import Icon from './icon';
import clsx from 'clsx';

type DragAndDropSectionProps = {
  handleFileChanged: (files?: FileList) => void;
};

const DragAndDropSection = ({ handleFileChanged }: DragAndDropSectionProps): ReactElement => {
  const [isDragging, setIsDragging] = useState(false);

  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    handleFileChanged(files);
  };

  const handleButtonClicked = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    handleFileChanged(files);
  };

  return (
    <div
      className={clsx(
        'w-full border rounded-md p-5 flex flex-col items-center gap-4 text-base',
        isDragging ? 'border-blue-600 border-solid' : 'border-zinc-300 border-dashed'
      )}
      onDragEnter={handleDragEnter}
      onDragOver={(e) => e.preventDefault()}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <Icon variant="image-plus" size="large" className="w-9 text-zinc-600" />
      <div className="flex flex-col items-center gap-2">
        <div className="flex flex-col items-center">
          <p className="text-zinc-600 text-center">
            Drag & Drop or{' '}
            <label htmlFor="file-input" className="text-blue-400 hover:text-blue-600 cursor-pointer underline">
              Choose file
            </label>{' '}
            to upload
          </p>
          <input
            id="file-input"
            type="file"
            className="hidden"
            accept=".jpeg, .png, .webp"
            onChange={handleButtonClicked}
          />
        </div>
        <p className="text-zinc-400 text-sm">JPEG, PNG or WEBP</p>
      </div>
    </div>
  );
};

export default DragAndDropSection;
