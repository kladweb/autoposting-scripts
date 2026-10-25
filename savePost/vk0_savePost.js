// ==UserScript==
// @name         VK0_createStore_mod01
// @author       You
// @match        https://vk.ru/club14875387
// @icon         https://www.google.com/s2/favicons?sz=64&domain=vk.com
// @run-at       context-menu
// ==/UserScript==

(function () {
  const userID = '476124794';
  const groupID = '14875387';
  let postObject;

  const request = indexedDB.open("posting-draft-v1", 1);

  request.onerror = function (event) {
    console.error("An error occurred with IndexedDB");
    console.error(event);
  };

  request.onupgradeneeded = function () {
    console.log('AAA');
  };

  request.onsuccess = function () {
    const db = request.result;
    const transaction = db.transaction("posting-draft", "readwrite");
    const store = transaction.objectStore("posting-draft");
    const keyStore = `${userID}--${groupID}`;
    const idQuery = store.get(keyStore);

    idQuery.onsuccess = function () {
      const data = idQuery.result;
      console.log(data);
    };
  };

  // Your code here...
})();
