import { ReactElement, useState } from 'react';
import Button from '../baseComponents/button';
import Divider from '../baseComponents/divider';
import Alert from '../baseComponents/alert';
import { FinishStatus } from 'src/types';
import axios from 'axios';
import { ERROR_MSG_DOWNLOAD, RESPONSE_TIMEOUT } from 'src/constants';

type DownloadSectionProps = {
  errorMessage: string;
  fileName: string;
  fileURL: string;
  status: FinishStatus;
  onAddWatermark: () => void;
};

const BACKEND_APP_URL = import.meta.env.BACKEND_APP_URL;

const DownloadSection = ({
  errorMessage,
  fileName,
  fileURL,
  status,
  onAddWatermark,
}: DownloadSectionProps): ReactElement => {
  const [hasDownloadError, setHasDownloadError] = useState(false);

  const handleOpenImage = () => {
    if (fileURL) window.open(fileURL, '_blank');
  };

  const handleDownloadImage = async () => {
    if (fileURL && fileName) {
      try {
        setHasDownloadError(false);

        const response = await axios.get(`${BACKEND_APP_URL}/download-image/${fileName}`, {
          responseType: 'blob',
          timeout: RESPONSE_TIMEOUT,
        });

        if (response) {
          const link = document.createElement('a');
          const url = window.URL.createObjectURL(response.data);
          link.href = url;
          link.setAttribute('download', fileName);
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        }
      } catch (error) {
        console.error('Error while downloading image:', error);
        setHasDownloadError(true);
      }
    }
  };

  return (
    <div className="w-full h-fit flex flex-col gap-10 text-zinc-600">
      {status === 'succeed' && fileName && fileURL && (
        <div className="w-full flex flex-col gap-6">
          <h3 className="w-full text-lg text-center">All done!</h3>
          <Button
            variant="text"
            text="Open watermarked image in new tab"
            IconVariant="external-link"
            iconPosition="right"
            onClick={handleOpenImage}
          />
          <div className="flex justify-center">
            <Button variant="filled" text="Download your image!" IconVariant="download" onClick={handleDownloadImage} />
          </div>
          {hasDownloadError && (
            <div>
              <Alert alertType="error" title="Failed to download image" message={ERROR_MSG_DOWNLOAD} />
            </div>
          )}
        </div>
      )}
      {status === 'failed' && errorMessage && (
        <div>
          <Alert alertType="error" title="Failed to process image" message={errorMessage} />
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
