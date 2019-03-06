import {
	fork,
	takeLatest,
	put,
	call,
	select,
} from 'redux-saga/effects';

import makeRequestSaga from './makeRequestSaga';
import * as requests from '../requests';
import actions from '../actions';
import localStorage from '../localStorage';

import * as utils from '../../utils';
import * as constants from '../../constants';
import {GET_ORDERS, GET_ORDERS_BY_ID} from "../actions/order.actions";

const {
	beverageActions,
	userActions,
	cartActions,
	orderActions,
	errorsActions,
} = actions;

const {
	NBEVERAGES_TOKEN,
	NBEVERAGES_SHOPPING_CART,
} = constants;

const {
	watcherSagaGenerator: watchFetchBeverages,
} = makeRequestSaga({
	request: requests.getBeverages,
	onSuccessAction: beverageActions.fetchBeveragesSucceded,
}, {
	watchedActionType: beverageActions.FETCH_BEVERAGES,
});

const {
	watcherSagaGenerator: watchDeleteBeverages,
} = makeRequestSaga({
	request: requests.deleteBeverages,
	onSuccessAction: beverageActions.deleteBeverageSucceded,
}, {
	watchedActionType: beverageActions.DELETE_BEVERAGE,
});

const {
	watcherSagaGenerator: watchAddBeverage,
} = makeRequestSaga({
	request: requests.createBeverage,
	onSuccessAction: beverageActions.addNewBeverageSucceeded,
}, {
	watchedActionType: beverageActions.ADD_NEW_BEVERAGE,
});

const {
	watcherSagaGenerator: watchUpdateBeverage,
} = makeRequestSaga({
	request: requests.updateBeverage,
	onSuccessAction: beverageActions.updateBeverageSucceeded,
}, {
	watchedActionType: beverageActions.UPDATE_BEVERAGE,
});

const handleLoginResponse = (response) => {
	const { token } = response;

	localStorage.setItem(NBEVERAGES_TOKEN, token);

	const decoded = utils.decodeJwtToken(token);

	return {
		user: { ...decoded },
	};
};

const {
	watcherSagaGenerator: watchUserLogin,
} = makeRequestSaga({
	request: requests.userLogin,
	onSuccessAction: userActions.userLoginSucceded,
	handleResponse: handleLoginResponse,
}, {
	watchedActionType: userActions.USER_LOGIN,
});

function* userLogout() {
	try {
		localStorage.removeItem(NBEVERAGES_TOKEN);

		yield put(userActions.userLogoutSucceded());
	} catch (error) {
		yield put(errorsActions.setErrors(error));
	}
}

function* watchLogout() {
	yield takeLatest(userActions.USER_LOGOUT, userLogout);
}

const {
	watcherSagaGenerator: watchFetchBeverageById,
} = makeRequestSaga({
	request: requests.getBeverages,
	onSuccessAction: beverageActions.fetchBeverageByIdSucceeded,
}, {
	watchedActionType: beverageActions.FETCH_BEVERAGE_BY_ID,
});

function* updateCartLocalStorage(action) {
	try {
		const { item, itemId } = action;
		const shoppingCart = yield localStorage.getItem(NBEVERAGES_SHOPPING_CART);
		let updatedShoppingCart = {
			items: [],
			ids: [],
		};

		if (item) {
			if (shoppingCart) {
				updatedShoppingCart = {
					items: [...shoppingCart.items, item],
					ids: [...shoppingCart.ids, item._id],
				};
			} else {
				updatedShoppingCart = {
					items: [item],
					ids: [item._id],
				};
			}
		} else if (itemId) {
			updatedShoppingCart = {
				items: shoppingCart.items.filter(({ _id }) => _id !== itemId),
				ids: shoppingCart.ids.filter(itmId => itmId !== itemId),
			};
		}

		yield localStorage.setItem(NBEVERAGES_SHOPPING_CART, updatedShoppingCart);
	} catch (e) {
		console.error(e);
	}
}

function* watchAddItemToCart() {
	yield takeLatest(cartActions.ADD_ITEM_TO_CART, updateCartLocalStorage);
}

function* watchRemoveItemFromCart() {
	yield takeLatest(cartActions.REMOVE_ITEM_FROM_CART, updateCartLocalStorage);
}

const {
	watcherSagaGenerator: watchCreateOrder,
} = makeRequestSaga({
	request: requests.createOrder,
	onSuccessAction: orderActions.createOrderSucceded,
}, {
	watchedActionType: orderActions.CREATE_ORDER,
});

function* watchCreateOrderSucceded() {
	yield takeLatest(orderActions.CREATE_ORDER_SUCCEDED, updateCartLocalStorage);
}

const getAppliedFilters = state => state.beverages.appliedFilters;

function* fetchFilteredBeverages() {
	try {
		const appliedFilters = yield select(getAppliedFilters);
		const query = appliedFilters
			.reduce((q, { filterName, filter }) => ({
				...q,
				[filterName]: filter,
			}), {});

		const response = yield call(requests.getBeverages, { query });

		yield put(beverageActions.fetchBeveragesSucceded(response));
	} catch (error) {
		yield put(errorsActions.setErrors(error));
	}
}

function* watchBeveragesFilter() {
	yield takeLatest(beverageActions.SET_BEVERAGES_FILTER, fetchFilteredBeverages);
}

const {
	watcherSagaGenerator: watchFetchOrdersById,
} = makeRequestSaga({
	request: requests.getOrders,
	onSuccessAction: orderActions.createOrderSucceded,
}, {
	watchedActionType: orderActions.GET_ORDERS_BY_ID,
});

const {
	watcherSagaGenerator: watchFetchOrders,
} = makeRequestSaga({
	request: requests.getOrders,
	onSuccessAction: orderActions.getOrdersSucceded,
}, {
	watchedActionType: orderActions.GET_ORDERS,
});

export default function* rootSaga() {
	yield fork(watchFetchBeverages);
	yield fork(watchDeleteBeverages);
	yield fork(watchAddBeverage);
	yield fork(watchUpdateBeverage);
	yield fork(watchFetchBeverageById);
	yield fork(watchBeveragesFilter);

	yield fork(watchUserLogin);
	yield fork(watchLogout);

	yield fork(watchAddItemToCart);
	yield fork(watchRemoveItemFromCart);

	yield fork(watchCreateOrder);
	yield fork(watchCreateOrderSucceded);
	yield fork(watchFetchOrders);
	yield fork(watchFetchOrdersById);
}
