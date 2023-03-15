type ArticleObject = {
    title: string;
    author: string;
    description : string;
    urlToImage : string;
}


type ArticleProps = {
	title: string;
	author: string;
	description : string;
    urlToImage : string;
    isBookmarked : boolean;
    inBookmarks : boolean;
};


export type { ArticleObject, ArticleProps};