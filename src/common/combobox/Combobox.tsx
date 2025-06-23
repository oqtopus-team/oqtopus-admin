import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import clsx from 'clsx';
import styles from './Combobox.module.css';

interface Option {
  value: string | number;
  label: string;
}

interface ComboboxProps {
  options: Option[];
  placeholder?: string;
  onChange?: (value: string | number | null | (string | number)[]) => void;
  value?: string | number | null | (string | number)[];
  disabled?: boolean;
  clearable?: boolean;
  multiple?: boolean;
}

export const Combobox: React.FC<ComboboxProps> = ({
  options = [],
  placeholder = 'common.combobox.select_option_placeholder',
  onChange,
  value,
  disabled = false,
  clearable = true,
  multiple = false,
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [highlightedIndex, setHighlightedIndex] = useState<number>(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const { t } = useTranslation();

  const filteredOptions: Option[] = options.filter((option) =>
    option.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getDisplayValue = (): string => {
    if (!multiple && value) {
      const selectedOption = options.find((opt) => opt.value === value);
      return selectedOption ? selectedOption.label : '';
    }

    return searchTerm;
  };

  const isSelected = (optionValue: string | number): boolean => {
    if (multiple && Array.isArray(value)) {
      return value.includes(optionValue);
    }
    return value === optionValue;
  };

  const handleSelectOption = (option: Option): void => {
    if (multiple) {
      const currentValues = Array.isArray(value) ? value : [];
      if (currentValues.includes(option.value)) {
        const newValues = currentValues.filter((v) => v !== option.value);
        onChange?.(newValues);
      } else {
        onChange?.([...currentValues, option.value]);
      }
      setSearchTerm('');
    } else {
      onChange?.(option.value);
      setSearchTerm('');
      setIsOpen(false);
    }
    setHighlightedIndex(-1);
  };

  const handleClear = (e: React.MouseEvent<HTMLButtonElement>): void => {
    e.stopPropagation();
    onChange?.(multiple ? [] : null);
    setSearchTerm('');
    setHighlightedIndex(-1);
  };

  const removeSelectedItem = (itemValue: string | number, e: React.MouseEvent): void => {
    e.stopPropagation();
    if (multiple && Array.isArray(value)) {
      const newValues = value.filter((v) => v !== itemValue);
      onChange?.(newValues);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>): void => {
    if (disabled) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        if (!isOpen) {
          setIsOpen(true);
        } else {
          setHighlightedIndex((prev) => (prev < filteredOptions.length - 1 ? prev + 1 : 0));
        }
        break;

      case 'ArrowUp':
        e.preventDefault();
        if (isOpen) {
          setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : filteredOptions.length - 1));
        }
        break;

      case 'Enter':
        e.preventDefault();
        if (isOpen && highlightedIndex >= 0) {
          handleSelectOption(filteredOptions[highlightedIndex]);
        } else if (!isOpen) {
          setIsOpen(true);
        }
        break;

      case 'Escape':
        setIsOpen(false);
        setHighlightedIndex(-1);
        inputRef.current?.blur();
        break;

      case 'Tab':
        setIsOpen(false);
        setHighlightedIndex(-1);
        break;
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const newValue = e.target.value;
    setSearchTerm(newValue);
    setIsOpen(true);
    setHighlightedIndex(-1);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent): void => {
      const comboboxElement = inputRef.current?.closest(`.${styles.combobox}`);
      if (comboboxElement && !comboboxElement.contains(event.target as Node)) {
        setIsOpen(false);
        setHighlightedIndex(-1);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (highlightedIndex >= 0 && listRef.current) {
      const highlightedElement = listRef.current.children[highlightedIndex] as HTMLElement;
      if (highlightedElement) {
        highlightedElement.scrollIntoView({
          block: 'nearest',
          behavior: 'smooth',
        });
      }
    }
  }, [highlightedIndex]);

  return (
    <div className={clsx(styles.combobox)}>
      <div
        className={clsx(styles.combobox_input_group, {
          [styles.open]: isOpen,
          [styles.disabled]: disabled,
          [styles.multiple]: multiple,
        })}
        onClick={() => !disabled && inputRef.current?.focus()}
      >
        <div>
          {multiple && Array.isArray(value) && value.length > 0 && (
            <div className={styles.selected_items}>
              {value.map((selectedValue) => {
                const option = options.find((opt) => opt.value === selectedValue);
                return option ? (
                  <span key={selectedValue} className={styles.selected_item}>
                    {option.label}
                    <button
                      onClick={(e) => removeSelectedItem(selectedValue, e)}
                      className={styles.remove_item_button}
                      disabled={disabled}
                    >
                      ✕
                    </button>
                  </span>
                ) : null;
              })}
            </div>
          )}

          <input
            ref={inputRef}
            type="text"
            value={
              multiple && Array.isArray(value) && value.length > 0 && !isOpen
                ? ''
                : getDisplayValue()
            }
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            onFocus={() => !disabled && setIsOpen(true)}
            placeholder={multiple && Array.isArray(value) && value.length > 0 ? '' : t(placeholder)}
            disabled={disabled}
            className={styles.combobox_input}
            autoComplete="off"
          />
        </div>

        <div className={styles.combobox_buttons}>
          {clearable &&
            ((multiple && Array.isArray(value) && value.length > 0) || (!multiple && value)) &&
            !disabled && (
              <button
                onClick={handleClear}
                className={clsx(styles.combobox_button, styles.combobox_clear_button)}
              >
                <span className={styles.clear_icon}>✕</span>
              </button>
            )}

          <button
            onClick={() => !disabled && setIsOpen(!isOpen)}
            disabled={disabled}
            className={clsx(styles.combobox_button, styles.combobox_dropdown_button)}
          >
            <span
              className={clsx(styles.dropdown_icon, { [styles.open]: isOpen })}
            >
              ▼
            </span>
          </button>
        </div>
      </div>

      {isOpen && (
        <div className={styles.combobox_dropdown}>
          <ul ref={listRef} className={styles.combobox_list}>
            {filteredOptions.length > 0 ? (
              filteredOptions.map((option, index) => (
                <li
                  key={option.value}
                  onClick={() => handleSelectOption(option)}
                  className={clsx(styles.combobox_item, {
                    [styles.highlighted]: highlightedIndex === index,
                    [styles.selected]: isSelected(option.value),
                  })}
                >
                  <span>{option.label}</span>
                  {isSelected(option.value) && <span className={styles.check_icon}>✓</span>}
                </li>
              ))
            ) : (
              <li className={styles.combobox_no_results}>{t('common.combobox.nothing_found')}</li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
};
