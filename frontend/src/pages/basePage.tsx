import { ReactElement, useCallback, useEffect, useState } from 'react';
import Header from 'src/components/baseComponents/header';
import Section from 'src/components/baseComponents/section';
import DownloadSection from 'src/components/sections/downloadSection';
import LoadingSection from 'src/components/sections/loadingSection';
import UploadSection from 'src/components/sections/uploadSection';
import { ERROR_MSG_UPLOAD } from 'src/constants';
import axios from 'axios';
import { useWebSocket } from 'src/hooks/websocket';
import { ProcessStatus } from 'src/types';

const VITE_BACKEND_APP_URL = import.meta.env.VITE_BACKEND_APP_URL;

const BasePage = (): ReactElement => {
  const { imageUrl, errorMessage: wsErrorMsg, openConnection, closeConnection } = useWebSocket();
  const [processStatus, setProcessStatus] = useState<ProcessStatus>(ProcessStatus.PREPARATION);

  const [imageId, setImageId] = useState<string>('');
  const [fileType, setFileType] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');

  const startProcessingImage = useCallback(
    (imageId: string) => {
      setProcessStatus(ProcessStatus.PROCESSING_IMAGE);
      openConnection(imageId);
    },
    [openConnection]
  );

  const onUpload = useCallback(
    async (selectedFile: File, watermarkText: string) => {
      if (!selectedFile || !watermarkText) return;

      try {
        setProcessStatus(ProcessStatus.UPLOADING_IMAGE);

        // Step 1: Get presigned url
        // file_type: image/png
        const response = await axios.post(
          `${VITE_BACKEND_APP_URL}/upload-image`,
          {
            file_type: selectedFile.type,
            watermark_text: watermarkText,
          },
          {
            headers: { 'Content-Type': 'application/json', "ngrok-skip-browser-warning": "true" },
          }
        );

        // object_key: uploads/123e4567-e89b-12d3-a456-426614174000.jpeg
        const { url, fields, image_id } = response.data;

        // Step 2: Create FormData and include constraint fields and file
        const formData = new FormData();
        Object.entries(fields).forEach(([key, value]) => {
          formData.append(key, value as string);
        });
        formData.append('file', selectedFile);

        // Step 3: Upload image to S3
        await axios.post(url, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });

        setImageId(image_id);
        setFileType(selectedFile.type.split('/')[1]);

        startProcessingImage(image_id);
      } catch (error) {
        setProcessStatus(ProcessStatus.PROCESSING_FAILED);
        setErrorMessage(ERROR_MSG_UPLOAD);
        console.error('Error uploading file:', error);
      }
    },
    [startProcessingImage]
  );

  useEffect(() => {
    if (imageUrl || wsErrorMsg) {
      if (wsErrorMsg) {
        setErrorMessage(wsErrorMsg);
        setProcessStatus(ProcessStatus.PROCESSING_FAILED);
      } else {
        setProcessStatus(ProcessStatus.PROCESSING_FINISHED);
      }
      closeConnection();
    }
  }, [closeConnection, imageUrl, wsErrorMsg]);

  const onAddWatermarkToMoreImages = useCallback(() => {
    setImageId('');
    setFileType('');
    setErrorMessage('');

    setProcessStatus(ProcessStatus.PREPARATION);
  }, []);

  return (
    <div className="h-screen w-full overflow-hidden bg-gray-100">
      <div className="w-full h-full overflow-auto">
        <Header />
        <div className="w-full h-fit mt-[60px] py-8 flex justify-center">
          <Section>
            <div>
              {processStatus === ProcessStatus.PREPARATION && <UploadSection onUpload={onUpload} />}
              {(processStatus === ProcessStatus.UPLOADING_IMAGE ||
                processStatus === ProcessStatus.PROCESSING_IMAGE) && <LoadingSection loaderType={processStatus} />}
              {(processStatus === ProcessStatus.PROCESSING_FINISHED ||
                processStatus === ProcessStatus.PROCESSING_FAILED) && (
                <DownloadSection
                  status={processStatus}
                  fileName={`${imageId}.${fileType}`}
                  fileURL={imageUrl}
                  errorMessage={errorMessage}
                  onAddWatermark={onAddWatermarkToMoreImages}
                />
              )}
            </div>
          </Section>
        </div>
      </div>
    </div>
  );
};

export default BasePage;
