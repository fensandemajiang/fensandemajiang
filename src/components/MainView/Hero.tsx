import React from 'react';
import { useHistory } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const Hero = () => {
  const history = useHistory();
  const { t } = useTranslation();
  const onClick = () => {
    history.push('/lobby');
  };
  return (
    <div className="m-16 flex justify-center items-center">
      <div className="px-16">
        <h1 className="mt-6 text-5xl font-headline tracking-tight font-extrabold text-gray-900 leading-snug">
          {t('hero.top')}
          <br />
          <span className="text-blue-700">{t('hero.bottom')}</span>
        </h1>
        <p className="w-3/5 mt-2 text-gray-600 text-lg">
          {t('hero.description')}
        </p>
        <div className="mt-8 flex">
          <button
            className="flex items-center justify-center px-8 py-3 font-medium rounded-md text-white bg-blue-700 shadow uppercase disabled:opacity-50"
            onClick={onClick}
          >
            {t('nav.Play')}
          </button>
        </div>
      </div>
      <div className="mr-40">
        <img
          className="object-cover object-center w-96 rounded-md"
          src="https://cdn.cnn.com/cnnnext/dam/assets/210107195604-02-mahjongline-apology-trnd-super-169.jpg"
          alt={t('hero.imgalt')}
        />
      </div>
    </div>
  );
};
export default Hero;
