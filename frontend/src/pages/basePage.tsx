import { ReactElement, useCallback, useEffect, useRef, useState } from 'react';
import Header from 'src/components/baseComponents/header';
import Section from 'src/components/baseComponents/section';
import DownloadSection from 'src/components/sections/downloadSection';
import LoadingSection from 'src/components/sections/loadingSection';
import UploadSection from 'src/components/sections/uploadSection';
import { ERROR_MSG_PROCESSING, ERROR_MSG_UPLOAD, RESPONSE_TIMEOUT } from 'src/constants';
import axios from 'axios';
import { ProcessStatus } from 'src/types';
import { useImageEventSource } from 'src/hooks/useImageEventSource';

const VITE_BACKEND_APP_URL = import.meta.env.VITE_BACKEND_APP_URL;

const BasePage = (): ReactElement => {
  const { openConnection, closeConnection, eventMessage } = useImageEventSource();

  const [processStatus, setProcessStatus] = useState<ProcessStatus>(ProcessStatus.PREPARATION);
  const processStatusRef = useRef<ProcessStatus>(ProcessStatus.PREPARATION);

  const [imageId, setImageId] = useState<string>('');
  const [fileType, setFileType] = useState<string>('');
  const [downloadImageUrl, setDownloadImageUrl] = useState('');
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

        // Get presigned url
        const response = await axios.post(
          `${VITE_BACKEND_APP_URL}/upload-image`,
          {
            file_type: selectedFile.type,
            watermark_text: watermarkText,
          },
          {
            headers: { 'Content-Type': 'application/json', 'ngrok-skip-browser-warning': 'true' },
            timeout: RESPONSE_TIMEOUT,
          }
        );

        const { url, fields, image_id } = response.data;

        // Create FormData and include constraint fields and file
        const formData = new FormData();
        Object.entries(fields).forEach(([key, value]) => {
          formData.append(key, value as string);
        });
        formData.append('file', selectedFile);

        // Upload image to S3
        await axios.post(url, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
          timeout: RESPONSE_TIMEOUT,
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
    if (eventMessage) {
      if (eventMessage.status === 'failed') {
        setErrorMessage(eventMessage.error);
        setProcessStatus(ProcessStatus.PROCESSING_FAILED);
      } else {
        setDownloadImageUrl(eventMessage.presigned_url);
        setProcessStatus(ProcessStatus.PROCESSING_FINISHED);
      }
      closeConnection();
    }
  }, [closeConnection, eventMessage]);

  useEffect(() => {
    processStatusRef.current = processStatus;
  }, [processStatus]);

  useEffect(() => {
    if (processStatus === ProcessStatus.PROCESSING_IMAGE) {
      setTimeout(() => {
        if (processStatusRef.current === ProcessStatus.PROCESSING_IMAGE) {
          setErrorMessage(ERROR_MSG_PROCESSING);
          setProcessStatus(ProcessStatus.PROCESSING_FAILED);

          closeConnection();
        }
      }, RESPONSE_TIMEOUT);
    }
  }, [closeConnection, processStatus]);

  const onAddWatermarkToMoreImages = useCallback(() => {
    setImageId('');
    setFileType('');
    setErrorMessage('');
    setDownloadImageUrl('');

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
                  fileURL={downloadImageUrl}
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
