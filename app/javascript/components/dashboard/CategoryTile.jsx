import React from 'react';
import PropTypes from 'prop-types';
import { Numerics } from '../../helpers/main';
import Progress from '../shared/Progress';
import CategoryFormModal from '../categories/FormModal';
import ExpenseFormModal from '../expenses/FormModal';

class CategoryTile extends React.Component {
  constructor(props) {
    super(props);
    this.state = { showCategoryEditModal: false, showExpenseCreateModal: false };
  }

  openCategoryEdit = () => { this.setState({ showCategoryEditModal: true }); }
  closeCategoryEdit = () => { this.setState({ showCategoryEditModal: false }); }
  openExpenseCreate = () => { this.setState({ showExpenseCreateModal: true }); }
  closeExpenseCreate = () => { this.setState({ showExpenseCreateModal: false }); }
  onCategorySave = () => {
    this.closeCategoryEdit();
    this.props.onChange();
  }
  onExpenseSave = () => {
    this.closeExpenseCreate();
    this.props.onChange();
  }

  goalDiff() {
    if (!this.props.categoryWithExpensesAndSpend.monthly_goal) { return 0; }
    return this.props.categoryWithExpensesAndSpend.monthly_goal - this.props.categoryWithExpensesAndSpend.spend;
  }

  goalComparisonDisplay() {
    if (!this.props.categoryWithExpensesAndSpend.monthly_goal) { return 'No goal set'; }

    const diff = this.goalDiff();
    return (diff >= 0) ? `${Numerics.centsToDollars(diff)} remaining` : `${Numerics.centsToDollars(Math.abs(diff))} over`;
  }

  normalizedPercentage() {
    if (!this.props.categoryWithExpensesAndSpend.monthly_goal) { return 0; }
    return Math.min(100, this.props.categoryWithExpensesAndSpend.spend / this.props.categoryWithExpensesAndSpend.monthly_goal * 100);
  }

  renderCategoryEditModal() {
    if (!this.state.showCategoryEditModal) { return ''; }
    return (
      <CategoryFormModal
        onClose={this.closeCategoryEdit}
        onSave={this.onCategorySave}
        category={this.props.categoryWithExpensesAndSpend}
        colorsToSkip={this.props.colorsToSkip}
      />
    );
  }

  renderExpenseCreateModal() {
    if (!this.state.showExpenseCreateModal) { return ''; }
    return (
      <ExpenseFormModal
        onClose={this.closeExpenseCreate}
        onSave={this.onExpenseSave}
        categories={this.props.expenseCategoryOptions}
        categoryId={this.props.categoryWithExpensesAndSpend.id}
      />
    );
  }

  render() {
    return (
      <div className="category-tile" style={{ borderColor: this.props.categoryWithExpensesAndSpend.color }} onClick={this.jumpToHistory}>
        {this.renderCategoryEditModal()}
        {this.renderExpenseCreateModal()}
        <div className="flex flex-space-between title">
          <div>
            <div className="flex">
              <a className="dim-on-hover flex flex-baseline" href={null} onClick={this.openCategoryEdit}>
                <h3 className="mr-4 d-inline-block">{this.props.categoryWithExpensesAndSpend.name}</h3>
                <i className="far fa-edit dim-til-hover" />
              </a>
            </div>
          </div>

          <div className="text-right">
            <h2>{Numerics.centsToDollars(this.props.categoryWithExpensesAndSpend.spend)}</h2>
            <div className={this.goalDiff() < 0 ? 'text-warning' : 'text-muted'}>
              {this.goalDiff() < 0 && (
                <i className="fas fa-exclamation-circle mr-4" />
              )}
              {this.goalComparisonDisplay()}
            </div>
          </div>
        </div>

        <Progress data={[{ percentage: this.normalizedPercentage() }]} small />

        <div className='add-expense'>
          <img className="mt-50" onClick={this.openExpenseCreate} src={window.iconPlus} />
        </div>
      </div>
    );
  }
}

CategoryTile.defaultProps = {
  categoryWithExpensesAndSpend: {},
  colorsToSkip: [],
  expenseCategoryOptions: [],
};

CategoryTile.propTypes = {
  categoryWithExpensesAndSpend: PropTypes.object,
  colorsToSkip: PropTypes.array,
  expenseCategoryOptions: PropTypes.array,
  onChange: PropTypes.func.isRequired,
};

export default CategoryTile;
