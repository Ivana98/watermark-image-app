import { ReactElement } from 'react';
import Button from '../baseComponents/button';
import Divider from '../baseComponents/divider';
import Alert from '../baseComponents/alert';
import { ProcessStatus } from 'src/types';

type DownloadSectionProps = {
  errorMessage: string;
  fileName: string;
  fileURL: string;
  status: FinishStatus;
  onAddWatermark: () => void;
};
type FinishStatus = ProcessStatus.PROCESSING_FAILED | ProcessStatus.PROCESSING_FINISHED;

const DownloadSection = ({
  errorMessage,
  fileName,
  fileURL,
  status,
  onAddWatermark
}: DownloadSectionProps): ReactElement => {
  const handleOpenImage = () => {
    if (fileURL) window.open(fileURL, '_blank');
  };

  return (
    <div className="w-full h-fit flex flex-col gap-10 text-zinc-600">
      {status === 'succeed' && fileName && fileURL && (
        <div className="w-full flex flex-col gap-6">
          <h3 className="w-full text-lg text-center">All done!</h3>
          <Button
            variant="text"
            text={fileName}
            IconVariant="external-link"
            iconPosition="right"
            onClick={handleOpenImage}
          />
          <div className="flex justify-center">
            <Button
              variant="filled"
              text="Download your image!"
              IconVariant="download"
              onClick={() => console.log('')}
            />
          </div>
        </div>
      )}
      {status === 'failed' && errorMessage && (
        <div>
          <Alert alertType="error" title='Failed to process image' message={errorMessage} />
        </div>
      )}
      <Divider />
      <div className="w-full flex justify-center">
        <Button variant="outline" text="Add watermark to more images" onClick={onAddWatermark} />
      </div>
    </div>
  );
};

export default DownloadSection;
