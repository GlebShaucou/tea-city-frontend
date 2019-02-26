import { connect } from 'react-redux';
import App from './App.component';

const mapStateToProps = state => ({
	isFetching: state.isFetching,
});

export default connect(
	mapStateToProps,
)(App);