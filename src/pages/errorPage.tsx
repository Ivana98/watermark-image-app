import { ReactElement } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from 'src/components/baseComponents/button';
import Header from 'src/components/baseComponents/header';

const ErrorPage = (): ReactElement => {
  const navigate = useNavigate();

  return (
    <div className="h-screen w-full overflow-hidden bg-gray-100">
      <div className="w-full h-full">
        <Header />
        <div className={'flex flex-col items-center justify-center text-zinc-600 h-full w-full'}>
          <div className={'flex flex-col items-center justify-center w-[360px] gap-4'}>
            <h3 className="text-center text-lg">Sorry, we cannot find the page that you are looking for...</h3>
            <Button variant="text" text="Return to homepage instead" onClick={() => navigate('/')} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ErrorPage;
