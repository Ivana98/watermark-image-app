import { ReactElement } from 'react';
import Loader from '../baseComponents/loader';

type LoaderType = 'uploading' | 'processing';

type LoadingSectionProps = {
  loaderType: LoaderType;
};

const LoadingSection = ({ loaderType }: LoadingSectionProps): ReactElement => {
  return (
    <div className="w-full h-[320px] flex flex-col gap-4 items-center justify-center">
      <Loader />
      {loaderType === 'uploading' && <p className="text-zinc-600 text-sm">Uploading image...</p>}
      {loaderType === 'processing' && <p className="text-zinc-600 text-sm">Processing image...</p>}
    </div>
  );
};

export default LoadingSection;
