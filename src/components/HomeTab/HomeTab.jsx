import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import Media from 'react-media';
import {
  selectGlobalIsModalAddTransactionOpen,
  selectTransactions,
  selectUserFirstName,
  selectTransactionsIsLoading,
  selectTransactionsError,
  selectGlobalIsModalEditTransactionOpen,
} from '../../redux/selectors';
import {
  fetchTransactions,
  deleteTransactionById,
} from '../../redux/transactions/transactions.operations';
import css from './HomeTab.module.css';
import TransactionDetails from './TransactionDetails/TransactionDetails';
import {
  updateIsModalAddTransactionOpen,
  updateIsModalEditTransactionOpen,
} from '../../redux/global/global.slice';
import { mediaQueries } from '../../utils/constants';
import TempBalance from '../temporary components/TempBalance';
import ElementsLoader from '../ElementsLoader/ElementsLoader';
import { ButtonAddTransaction } from '../ButtonAddTransactions/ButtonAddTransaction';

const HomeTab = () => {
  const dispatch = useDispatch();
  const transactions = useSelector(selectTransactions);
  const isModalEditTransactionOpen = useSelector(selectGlobalIsModalEditTransactionOpen);
  const isAddTransactionModalOpen = useSelector(selectGlobalIsModalAddTransactionOpen);
  const isTransactionsLoading = useSelector(selectTransactionsIsLoading);
  const isTransactionsError = useSelector(selectTransactionsError);
  const { mobile } = mediaQueries;

  useEffect(() => {
    dispatch(fetchTransactions());
  }, [dispatch]);

  const userName = useSelector(selectUserFirstName);
  const sortedToNewestTransactions =
    transactions.length > 0 ? [...transactions].sort((a, b) => b.date.localeCompare(a.date)) : null;

  const toggleAddTransactionModal = ev => {
    ev.preventDefault;
    dispatch(updateIsModalAddTransactionOpen(!isAddTransactionModalOpen));
  };

  const toggleEditTransactionModal = ev => {
    ev.preventDefault;
    dispatch(updateIsModalEditTransactionOpen(!isModalEditTransactionOpen));
  };

  const handleButtonDelete = id => {
    dispatch(deleteTransactionById(id));
  };

  return (
    <>
      <div className={css.homeTabWrapper}>
        <Media query={mobile} render={() => <TempBalance />} />
        <div className={css.homeTab}>
          <ul className={css.tableBody}>
            <li key={`${userName}header`} className={css.tableItem}>
              <ul className={css.tableHeader}>
                <li key={`${userName}date`} className={css.tableHeaderItem}>
                  <p className={css.itemType}>Date</p>
                </li>
                <li key={`${userName}type`} className={css.tableHeaderItem}>
                  <p className={css.itemType}>Type</p>
                </li>
                <li key={`${userName}category`} className={css.tableHeaderItem}>
                  <p className={css.itemType}>Category</p>
                </li>
                <li key={`${userName}comment`} className={css.tableHeaderItem}>
                  <p className={css.itemType}>Comment</p>
                </li>
                <li key={`${userName}sum`} className={css.tableHeaderItem}>
                  <p className={css.itemType}>Sum</p>
                </li>
                <li key={`${userName}operations`} className={css.tableHeaderItem}></li>
              </ul>
            </li>
            {transactions.length === 0 && <h1>No transactions yet</h1>}
            {isTransactionsLoading && !isTransactionsError && <ElementsLoader />}
            {transactions.length > 0 &&
              sortedToNewestTransactions.map(({ _id, date, type, category, comment, sum }) => (
                <li key={_id} className={css.tableItem}>
                  {
                    <TransactionDetails
                      id={_id}
                      date={date}
                      type={type}
                      category={category}
                      comment={comment}
                      sum={sum}
                      toggleEditModal={toggleEditTransactionModal}
                      handleDeleteBtn={handleButtonDelete}
                    />
                  }
                </li>
              ))}
          </ul>
        </div>
        {isModalEditTransactionOpen && (
          <div>
            <p>Edit Transaction Modal is open</p>
            <button type="button" onClick={toggleEditTransactionModal}>
              Close EditTransaction
            </button>
          </div>
        )}
        {isAddTransactionModalOpen && (
          <div>
            <p>Add Transaction Modal is open</p>
            <button type="button" onClick={toggleAddTransactionModal}>
              Close AddTransaction
            </button>
          </div>
        )}
        <ButtonAddTransaction onClick={toggleAddTransactionModal} />
      </div>
    </>
  );
};

export default HomeTab;
