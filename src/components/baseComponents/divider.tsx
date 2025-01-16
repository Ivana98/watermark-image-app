import { ReactElement } from 'react';

type DividerProps = {
  text?: string;
};

const Divider = ({ text }: DividerProps): ReactElement => {
  return (
    <div className="flex w-full items-center">
      <div className="h-px w-full grow bg-zinc-300" />
      {text && <span className="mx-4 shrink-0 text-sm text-zinc-400">{text}</span>}
      <div className="h-px w-full grow bg-zinc-300" />
    </div>
  );
};

export default Divider;
