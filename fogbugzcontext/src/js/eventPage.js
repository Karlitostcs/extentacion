var contextMenuItem = {
    "id":"SearchInFogBugz",
    "title":"Search In FogBugz",
    "contexts":["selection"],
    "targetUrlPatterns":["http://fogbugz.tcsgeeks.com/*"]
};

        chrome.contextMenus.create(contextMenuItem);
        chrome.contextMenus.onClicked.addListener(handleClick);

function handleClick(clickedItem,tab){
        let newURL = 'http://fogbugz.tcsgeeks.com/f/search/?sSearchFor='+encodeURI(clickedItem.selectionText);
        window.open(newURL,'_blank');
}