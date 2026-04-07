import clsx from 'clsx';
import { languages } from '../../i18n/config';
import { Select } from '../Select';
import i18next from 'i18next';
import { useTranslation } from 'react-i18next';

export const LanguageSelector = (): React.ReactElement => {
  const { t } = useTranslation();
  return (
    <Select
      className={clsx('!w-[100px]', 'border-primary', 'text-primary', 'outline-primary')}
      onChange={async (e: React.ChangeEvent<HTMLSelectElement>) => {
        if (languages.includes(e.target.value)) {
          i18next.changeLanguage(e.target.value);
        }
      }}
      defaultValue={i18next.language}
      value={''}
    >
      {languages.map((lang: string) => {
        return (
          <option value={lang} key={lang}>
            {t(`header.lang.${lang}`)}
          </option>
        );
      })}
    </Select>
  );
};
