import Chart from './Chart/Chart';
import StatsSelectList from './StatsSelectList/StatsSelectList';
import StatsSummary from './StatsSummary/StatsSummary';
import StatsTable from './StatsTable/StatsTable';
import css from './Statistics.module.css';
import TitleComponent from '../TitleComponent/Title.Component.jsx';
import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import {
  selectTransactions,
  selectTransactionsIsLoading,
  selectTransactionsFilterYear,
  selectTransactionsFilterMonth,
} from '../../redux/selectors.js';

const Statistics = () => {
  // const dispatch = useDispatch();

  const transactions = useSelector(selectTransactions);
  const [filteredTransactions, setFilteredTransactions] = useState([]);

  const isTransactionsLoading = useSelector(selectTransactionsIsLoading);

  const actualYear = useSelector(selectTransactionsFilterYear);
  const actualMonth = useSelector(selectTransactionsFilterMonth);

  /******* obsługa filtra **/
  const [selectedFilter, setSelectedFilter] = useState({
    month: actualMonth,
    year: actualYear,
  });

  const [filterChoice, setFilterChoice] = useState({
    months: [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December',
    ],
    years: [],
  });
  
const [categoriesSums, setCategoriesSums] = useState([
{ color: '#F50505', name: 'Main expenses', sum: 0 },
{ color: '#0DFF00', name: 'TR Winnings', sum: 0 },
{ color: '#DB1616', name: 'TR Withdrawal', sum: 0 },
{ color: '#FF4747', name: 'UPI Withdrawal', sum: 0 },
{ color: '#7CF280', name: 'Deposit', sum: 0 },
{ color: '#3A9C3D', name: 'Referral Income', sum: 0 },
{ color: '#038534', name: 'Join Bonus', sum: 0 },
{ color: '#10730A', name: 'Income', sum: 0 },
]);
  

  const [incomesSum, setIncomesSum] = useState(0);
  const [expensesSum, setExpensesSum] = useState(0);
  const [balance, setBalance] = useState(0);

  const setFilterChoiceYears = transactions => {
    setFilterChoice(
      prevFilterChoice =>
        (prevFilterChoice = {
          ...filterChoice,
          years: [
            ...transactions
              .map(t => t.year)
              .filter((year, index, array) => array.indexOf(year) === index),
          ],
        }),
    );
  };

  const refreshTransactions = (transactions, year, month) =>
    [...transactions].filter(t => t.year == year && t.month == month);

  const refreshBalance = transactions => {
    const inc = [...transactions]
      .filter(t => t.type === 'Income')
      .reduce((acc, t) => {
        return (acc * 100 + t.sum * 100) / 100;
      }, 0);
    const exp = [...transactions]
      .filter(t => t.type === 'Expense')
      .reduce((acc, e) => {
        return (acc * 100 + e.sum * 100) / 100;
      }, 0);
    const bal = (inc * 100 - exp * 100) / 100;
    setIncomesSum(prev => (prev = inc));

    setExpensesSum(prev => (prev = exp));

    setBalance(prev => (prev = bal));
  };

  const transactionsReducer = (transactions, category) => {
    return [...transactions]
      .filter(t => t.category === category)
      .reduce((acc, t) => {
        return (acc * 100 + t.sum * 100) / 100;
      }, 0);
  };

  const refreshCategoriesSum = transactions => {
  const newCategoriesSums = [
    { color: 'linear-gradient(to right, #FFB3B3, #FF6666)', name: 'Main expenses', sum: 0 },
    { color: 'linear-gradient(to right, #66BB6A, #A8E6CF)', name: 'TR Winnings', sum: 0 },       // Green for winnings
    { color: 'linear-gradient(to right, #FF7F7F, #FF4C4C)', name: 'TR Withdrawal', sum: 0 },
    { color: 'linear-gradient(to right, #FF7F7F, #FF4C4C)', name: 'UPI Withdrawal', sum: 0 },     // Coral gradient
    { color: 'linear-gradient(to right, #A8E6CF, #66BB6A)', name: 'Deposit', sum: 0 },
    { color: 'linear-gradient(to right, #81C784, #66BB6A)', name: 'Referral Income', sum: 0 },
    { color: 'linear-gradient(to right, #B2FF59, #66BB6A)', name: 'Join Bonus', sum: 0 },
    { color: 'linear-gradient(to right, #66BB6A, #A8E6CF)', name: 'Income', sum: 0 },
  ];

  // You can continue processing transactions and updating `newCategoriesSums` here...

  
    const refreshedCategoriesSums = newCategoriesSums.map(cS => ({
      ...cS,
      sum: transactionsReducer(transactions, cS.name),
    }));
    setCategoriesSums(prev => (prev = refreshedCategoriesSums));
  };

  // const setFilterChoiceMonths = (transactions, year) => {
  //   setFilterChoice({
  //     ...filterChoice,
  //     months: [
  //       ...transactions
  //         .filter(t => t.year === year)
  //         .map(t => t.month)
  //         .filter((month, index, array) => array.indexOf(month) === index),
  //     ],
  //   });
  // };

  // useEffect(() => {
  //   setFilterChoiceMonths(transactions, selectedFilter.year);
  // }, [transactions, selectedFilter.year]);

  useEffect(() => {
    setFilterChoiceYears(transactions);
  }, [transactions]);

  useEffect(() => {
    setFilteredTransactions(
      prev => (prev = refreshTransactions(transactions, selectedFilter.year, selectedFilter.month)),
    );
  }, [selectedFilter.year, selectedFilter.month]);

  useEffect(() => {
    refreshCategoriesSum(filteredTransactions);
  }, [filteredTransactions]);

  useEffect(() => {
    refreshBalance(filteredTransactions);
  }, [categoriesSums]);

  const handleFilterChange = ev => {
    const { name, value } = ev.target;
    setSelectedFilter(prev => (prev = { ...selectedFilter, [name]: value }));
  };

  return (
    <>
      {!isTransactionsLoading && (
        <div className={css.wrapper}>
          <div className={css.container}>
            <TitleComponent text="Statistics" />
            <div className={css.chart}>
              <Chart categoriesSums={categoriesSums} balance={balance} />
            </div>
          </div>
          <div className={css.statisticsContainer}>
            <StatsSelectList
              yearFilter={selectedFilter.year}
              monthFilter={selectedFilter.month}
              months={filterChoice.months}
              years={filterChoice.years}
              handleFilter={handleFilterChange}
            />
            <StatsTable categoriesSums={categoriesSums} />
            <div className={css.statisticsSummary}>
              <StatsSummary incomes={incomesSum} expenses={expensesSum} />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Statistics;
