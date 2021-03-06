function RAGEbuildSelector(kw) {
	return 'a[href="http://ra.ge/' + kw + '"]';
}

function RAGEinjectCSS(styleScript) {
	var rageStyles = '';
	var rageIndex  = styleScript.indexOf('a[href=');
	var keyWords   = [];
	while (rageIndex < styleScript.length) {
		// Copy all a[href styles, until the ending bracket.
		if (styleScript.substring(rageIndex, rageIndex + 7) === 'a[href=') {
			var theseKeywords = [];
			while (rageIndex < styleScript.length && styleScript.charAt(rageIndex) !== '{') {

				if (styleScript.substring(rageIndex, rageIndex + 7) !== 'a[href=') {
					rageStyles = rageStyles + styleScript.charAt(rageIndex);
					rageIndex += 1;
				} 
				else {
					var keyword = '';
					rageIndex += 9;
					while (rageIndex < styleScript.length && styleScript.charAt(rageIndex) !== '"') {
						keyword = keyword + styleScript.charAt(rageIndex);
						rageIndex += 1;
					}
					//console.log("RAGES: found keyword: " + keyword);
					theseKeywords.push(keyword);

					rageIndex += 2; /* '"]'*/
					rageStyles = rageStyles + RAGEbuildSelector(keyword);
				}
			}
			if (theseKeywords.length > 1) {
				theseKeywords.forEach(function (s) {
					keyWords.push(s);
				});
			}
			// Rageface, copy to <style> while not }
			while (rageIndex < styleScript.length && styleScript.charAt(rageIndex) !== '}') {
				rageStyles = rageStyles + styleScript.charAt(rageIndex);
				rageIndex += 1;
			}
			rageStyles = rageStyles + '} ';
			rageIndex += 1;
		} 
		else {
			// Not a rage face, find one!
			rageIndex += 1;
		}
	}

	var allRageSelector = '';

	keyWords.forEach(function (kw) {
		allRageSelector = allRageSelector + RAGEbuildSelector(kw) + ', ';
	});

	rageStyles = rageStyles + '\n' + allRageSelector.slice(0, allRageSelector.length - 2) + '{\nfont-size: 0;\ncolor: white;}';

	// End this with </style>
	// rageStyles = rageStyles + ' </style>';
	// document.head.innerHTML = document.head.innerHTML + rageStyles;
	var styles = document.createElement('style');
	styles.setAttribute('type', 'text/css');
	styles.setAttribute('title', 'ragefaces');
	styles.innerHTML = rageStyles;
	var headNode = document.getElementsByTagName('head')[0];
	headNode.appendChild(styles);
	// Whew, done!
}

chrome.extension.sendMessage({'action' : 'fetchRageCSS'}, RAGEinjectCSS);
