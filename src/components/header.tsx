import { ReactElement } from "react";
import Icon from "./atoms/icon";

const Header = (): ReactElement => {

  return (
    <header className="w-full h-fit bg-white shadow-lg fixed top-0 py-4">
      <div className="flex justify-center items-center gap-3">
        <Icon variant="signature" size="large" className="text-blue-500 w-9 font-bold" />
        <h1 className="text-center text-4xl font-semibold bg-gradient-to-b from-blue-600 to-sky-400 bg-clip-text text-transparent">Watermarky</h1>
      </div>
    </header>
  );
};

export default Header;
