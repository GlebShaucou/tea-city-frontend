import { connect } from 'react-redux';
import AdminPage from './Admin.page';

import actions from '../../data-layer/actions';

const { beverageActions } = actions;

const mapStateToProps = state => ({
	...state.beverages,
});

const mapDispatchToProps = dispatch => ({
	loadData: () => {
		dispatch(beverageActions.fetchBeverages({ id: undefined }));
	},
});

export default connect(
	mapStateToProps,
	mapDispatchToProps,
)(AdminPage);
