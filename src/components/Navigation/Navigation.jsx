import React from 'react';
import SvgIcon from '@mui/material/SvgIcon';
import { NavLink } from 'react-router-dom';
import Media from 'react-media';
import { mediaQueries } from '../../utils/constants';
import css from './Navigation.module.css';
import CurrencyIcon from '../../assets/icons/currency.svg?react';

const Navigation = () => {
  const { mobile } = mediaQueries;

  return (
    <nav className={css.nav}>
      <ul className={css.list}>
        {/* Home - Already correct */}
        <li className={css.listItem}>
          <NavLink className={css.link} to="/dashboard" end>
            <SvgIcon ...>
              {/* Path remains same */}
            </SvgIcon>
            <span className={css.span}>Home</span>
          </NavLink>
        </li>

        {/* Statistics - Add listItem class */}
        <li className={css.listItem}>  {/* Added className */}
          <NavLink className={css.link} to="statistics">
            <SvgIcon ...>
              {/* Path remains same */}
            </SvgIcon>
            <span className={css.span}>Statistics</span>
          </NavLink>
        </li>

        {/* Currency - Fixed version */}
        <li className={css.listItem}>  {/* Added className */}
          <Media queries={{ small: mobile }}>
            {matches =>
              matches.small ? (
                <NavLink className={css.link} to="currency">
                  <CurrencyIcon
                    className={css.icon}
                    color="inherit"  {/* Added color prop */}
                    sx={{
                      width: '44px',
                      height: '44px',
                      padding: '0px',
                      fill: 'var(--color-icon-navi-hover)',
                      transition: 'all 50ms ease-in-out',
                      '@media screen and (min-width: 768px)': {
                        width: '24px',
                        height: '24px',
                      },
                    }}
                  />
                  <span className={css.span}>Currency</span>  {/* Added text label */}
                </NavLink>
              ) : null
            }
          </Media>
        </li>
      </ul>
    </nav>
  );
};

export default Navigation;
