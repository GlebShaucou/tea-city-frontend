import React, { useEffect } from 'react';

const NotFoundPage = () => {
	useEffect(() => {
		document.title = 'Not Found | Tea City';
	}, []);

	return (
		<div className="page-component page-component--not-found">
			NotFound
		</div>
	);
};

export default NotFoundPage;
