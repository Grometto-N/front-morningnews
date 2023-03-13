import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// reducer contenant les favoris sous forme d'objet article

type ArticleObject = {
	title: string;
	author: string;
	description : string;
    urlToImage : string;
};

export interface BookmarksState {
    value: ArticleObject[]
};

const initialState: BookmarksState = {
	value: [] ,
};

// seulement trois méthodes : une pour ajouter, une pour retirer et une pour tout supprimer (pour le logout)
export const bookmarksSlice = createSlice({
	name: 'bookmarks',
	initialState,
	reducers: {
		addBookmark: (state : BookmarksState, action : PayloadAction<ArticleObject>) => {
			state.value.push(action.payload);
		},
		removeBookmark: (state, action) => {
			state.value = state.value.filter(bookmark => bookmark.title !== action.payload.title);
		},
		removeAllBookmark: (state) => {
			state.value = [];
		},
	},
});

export const { addBookmark, removeBookmark, removeAllBookmark } = bookmarksSlice.actions;
export default bookmarksSlice.reducer;