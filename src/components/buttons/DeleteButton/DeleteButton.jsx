import css from './DeleteButton.module.css';

const DeleteButton = () => {
  const handleClick = () => {
    alert("You're not authorised to do this action (admin function)");
  };

  return (
    <button className={css.deleteButton} type="button" onClick={handleClick}>
      Delete
    </button>
  );
};

export default DeleteButton;
