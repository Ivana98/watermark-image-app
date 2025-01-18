import { ReactElement } from 'react';
import Icon from './icon';
import Button from './button';

type AlertProps = {
  title: string;
  message: string;
  alertType: AlertType;
  onClose?: () => void;
};

type AlertType = 'info' | 'error';

const Alert = ({ title, message, alertType, onClose }: AlertProps): ReactElement => {
  return (
    <div className="w-full px-2 py-1 flex flex-col gap-1 text-zinc-600 text-sm bg-sky-50 border border-sky-400 rounded-lg">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-1.5 font-semibold text-blue-500">
          <div>
            {alertType === 'info' && <Icon variant="info-circle" size="medium" />}
            {alertType === 'error' && <Icon variant="exclamation-triangle" size="medium" />}
          </div>
          <div>{title}</div>
        </div>
        {onClose && <Button variant="icon" IconVariant="x" size="medium" onClick={onClose} />}
      </div>
      <div>{message}</div>
    </div>
  );
};

export default Alert;
