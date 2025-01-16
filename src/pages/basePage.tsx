import { ReactElement, useCallback, useState } from 'react';
import Header from 'src/components/baseComponents/header';
import Section from 'src/components/baseComponents/section';
import LoadingSection from 'src/components/sections/loadingSection';
import UploadSection from 'src/components/sections/uploadSection';

enum ProcesStatus {
  PREPARATION = 'preparation',
  UPLOADING_IMAGE = 'uploading',
  PROCESSING_IMAGE = 'processing',
  PROCESSING_FINISHED = 'finished',
  PROCESSING_FAILED = 'failed',
}

const BasePage = (): ReactElement => {
  const [processStatus, setProcessStatus] = useState<ProcesStatus>(ProcesStatus.PREPARATION);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const onUpload = useCallback((selectedFile: File, watermarkText: string) => {
    setProcessStatus(ProcesStatus.UPLOADING_IMAGE);
  }, []);

  return (
    <div className="h-screen w-full overflow-hidden bg-gray-100">
      <div className="w-full h-full overflow-auto">
        <Header />
        <div className="w-full h-fit mt-[60px] py-8 flex justify-center">
          <Section>
            <div>
              {processStatus === ProcesStatus.PREPARATION && <UploadSection onUpload={onUpload} />}
              {(processStatus === ProcesStatus.UPLOADING_IMAGE || processStatus === ProcesStatus.PROCESSING_IMAGE) && (
                <LoadingSection loaderType={processStatus} />
              )}
            </div>
          </Section>
        </div>
      </div>
    </div>
  );
};

export default BasePage;
