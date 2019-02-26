import React, { Component } from 'react';

import mainImgSrc from './img/main-tea.jpg';
import promoLeftSrc from './img/promo-left.jpg';
import promoRightSrc from './img/promo-right.jpg';

export default class MainPage extends Component {
	render() {
		return (
			<div className="page-component page-component--main">
				<div className="welcome-message-section">
					<img src={mainImgSrc} alt="tea" className="welcome-message__image" />
				</div>
				<div className="promo-section">
					<div className="promo__left-section">
						<img src={promoLeftSrc} alt="tea" className="left-section__image" />
					</div>
					<div className="promo__right-section">
						<img src={promoRightSrc} alt="tea" className="right-section__image" />
					</div>
				</div>
				<div className="description-section">
					<h2 className="description__header">
						Welcome to Natural Beverages!
					</h2>
					<div className="description__text">
						When the human body becomes dehydrated, it experiences thirst.
						This craving of fluids results in an instinctive need to drink.
						Thirst is regulated by the hypothalamus in response to subtle changes
						in the body's electrolyte levels, and also as a result of changes in the
						volume of blood circulating. The complete elimination of drinks, that is, water,
						from the body will result in death faster than the removal of any other substance.
						Water and milk have been basic drinks throughout history. As water is essential for
						life,it has also been the carrier of many diseases.
						As society developed, new techniques were discovered to create the
						drinks from the plants that were available in different areas. The earliest
						archaeological evidence of wine production yet found has been at sites
						in Georgia (c. 6000 BCE) and Iran (c. 5000 BCE). Beer may have been known in
						Neolithic Europe as far back as 3000 BCE, and was mainly brewed on a domestic scale.
						The invention of beer (and bread) has been argued to be responsible for humanity's
						ability to develop technology and build civilization. Tea likely originated in Yunnan,
						China during the Shang Dynasty (1500 BCE–1046 BCE) as a medicinal drink.
					</div>
				</div>
			</div>
		);
	}
}