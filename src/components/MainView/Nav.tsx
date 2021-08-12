import React, { FunctionComponent } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
const Nav: FunctionComponent = () => {
  const { t } = useTranslation();
  return (
    <nav className="relative flex flex-wrap items-center justify-between px-2 py-3 mb-3">
      <div className="container px-4 mx-auto flex flex-wrap items-center justify-between">
        <div className="w-full relative flex justify-between lg:w-auto  px-4 lg:static lg:block lg:justify-start">
          <Link to="/">
            <span className="font-bold">FEN SAN DE MA JIANG</span>
          </Link>
        </div>
        <div className="lg:flex flex-grow items-center">
          <ul className="flex flex-col lg:flex-row list-none ml-auto">
            <li className="nav-item px-3 py-2 hover:opacity-75 flex items-center text-xs uppercase font-bold leading-snug">
              <Link to="/">{t('nav.Home')}</Link>
            </li>
            <li className="nav-item px-3 py-2 hover:opacity-75 flex items-center text-xs uppercase font-bold leading-snug">
              <Link to="/lobby">{t('nav.Play')}</Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};
export default Nav;
