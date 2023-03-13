
import { createSlice, PayloadAction } from '@reduxjs/toolkit';


export interface HidenArticleState {
    value: string[]
};

const initialState: HidenArticleState = {
	value: [] ,
};

export const hiddenSlice = createSlice({
	name: 'hiddenArticles',
	initialState,
	reducers: {
		hideArticle: (state: HidenArticleState, action: PayloadAction<string>) => {
			state.value.push(action.payload);
		},
        removeAllHidden:  (state: HidenArticleState) => {
			state.value=[];
		},
		unhideArticles: (state: HidenArticleState) => {
			state.value = [];
		  }
	},
});

export const { hideArticle, removeAllHidden,unhideArticles } = hiddenSlice.actions;
export default hiddenSlice.reducer;