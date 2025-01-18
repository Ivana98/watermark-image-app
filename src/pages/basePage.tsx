/* eslint-disable @typescript-eslint/no-unused-vars */
import { ReactElement, useCallback, useState } from 'react';
import Header from 'src/components/baseComponents/header';
import Section from 'src/components/baseComponents/section';
import DownloadSection from 'src/components/sections/downloadSection';
import LoadingSection from 'src/components/sections/loadingSection';
import UploadSection from 'src/components/sections/uploadSection';
import { ProcessStatus } from 'src/constants';
import axios from 'axios';

const BasePage = (): ReactElement => {
  const [processStatus, setProcessStatus] = useState<ProcessStatus>(ProcessStatus.PREPARATION);

  const [fileName, setFileName] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [fileUrl, setFileUrl] = useState<string | null>(null);

  const waitforProcessingImage = useCallback(() => {
    setTimeout(() => {
      setProcessStatus(ProcessStatus.PROCESSING_FINISHED);
    }, 3000);
    // setProcessStatus(ProcessStatus.PROCESSING_FAILED);
    // setErrorMessage("An error occurred while processing the image. Please try again later.");
  }, []);

  const onUpload = useCallback(
    async (selectedFile: File, watermarkText: string) => {
      if (!selectedFile || !watermarkText) return;

      try {
        setProcessStatus(ProcessStatus.UPLOADING_IMAGE);

        // file_name: myImage.png file_type: image/png
        const response = await axios.get('http://localhost:8000/generate-presigned-url/', {
          params: {
            file_name: selectedFile.name,
            file_type: selectedFile.type,
          },
        });

        const { url } = response.data;

        // Upload the file to S3 using the presigned URL
        await axios.put(url, selectedFile, {
          headers: {
            'Content-Type': selectedFile.type,
          },
        });

        setProcessStatus(ProcessStatus.PROCESSING_IMAGE);
        waitforProcessingImage();
      } catch (error) {
        setProcessStatus(ProcessStatus.PROCESSING_FAILED);
        setErrorMessage('An error occurred during the image upload process. Please try again later.');
        console.error('Error uploading file:', error);
      }
    },
    [waitforProcessingImage]
  );

  const onAddWatermarkToMoreImages = useCallback(() => {
    setFileName('');
    setFileUrl('');
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
                  fileName={fileName}
                  fileURL={fileUrl}
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
