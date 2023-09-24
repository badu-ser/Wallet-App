import React from 'react';
import css from './ButtonAddTransactions.module.css';

export const ButtonAddTransactions = ({ handleClick }) => {
  return (
    <>
      <button className={css.openModal} onClick={handleClick}>
        <svg>
          <use href="../../assets/icons/sprite.svg#icon-btnOpenModal" />
        </svg>
      </button>
    </>
  );
};
 