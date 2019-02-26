import actions from '../../actions';

const { cartActions } = actions;

const initialState = {
	items: [],
	ids: [],
};

const removeItem = ({ items }, { itemId }) => items.filter(item => item._id !== itemId);
const removeItemId = ({ ids }, { itemId }) => ids.filter(id => id !== itemId);

export default (state = initialState, action) => {
	let item;

	switch (action.type) {
	case cartActions.ADD_ITEM_TO_CART:
		({ item } = action);
		return {
			items: [...state.items, { ...item }],
			ids: [...state.ids, item._id],
		};
	case cartActions.REMOVE_ITEM_FROM_CART:
		return {
			items: removeItem(state, action),
			ids: removeItemId(state, action),
		};
	default:
		return state;
	}
};
