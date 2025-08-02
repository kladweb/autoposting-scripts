// ==UserScript==
// @name         AutoRepVK_13_mod04
// @author       kladweb
// @match        https://vk.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=vk.com
// @run-at       document-body
// ==/UserScript==

(function () {
  'use strict';
  const idUser = '591910410';
  const posts = {cbilling: "cbilling", best: 'The best operators'};
  const VKName = "vk13";

  const postingAfter = {
    all: "all groups",
    my: "Skip my posts",
    id358923511: "Анна Егорова",
    id620542842: "Иван Смирнов",
    satiptv: "Людвиг Ванбетховен"
  };
  // Здесь будем проверять файл. Версия 003
  const delays = {15: "15 sec", 10: "10 sec", 7: "7 sec"};
  const deeps = {1: 1, 2: 2, 3: 3};
  const [delayM, delayL] = [2000, 3000];
  let delayXL = 10000;
  let subMenu02posting = [];
  let currentNumberPost = 0;
  let currentNumberGr = 0;
  let currentPost = null;
  let isSkipCurrPost = false;
  let buttonStart = null;
  let buttonStop = null;

  const groupsAll = [
    ["14875387", "club14875387"], //Bel https://vk.com/club14875387
    ["198518322", "iptvstreamshub"], // https://vk.com/iptvstreamshub
    ["130237472", "club130237472"], //24 https://vk.com/club130237472
    ["18331470", "marinaol"], //22	https://vk.com/marinaol
    ["132944148", "iptvlistok"], //27 https://vk.com/iptvlistok
    ["114119485", "aurahdclub"], //11 https://vk.com/aurahdclub
    ["140398176", "oknotiviru"], //28 https://vk.com/oknotiviru
    ["106796170", "club106796170"],//25 https://vk.com/club106796170
    ["52218536", "club52218536"],//21 https://vk.com/club52218536
    ["84120000", "club84120000"], //18 https://vk.com/club84120000
    ["176994995", "tvlisty", "pinned"], //29 https://vk.com/tvlisty
    ["167018774", "club167018774"], //30 https://vk.com/club167018774
    ["171843329", "ru_iptv", "pinned"], //31 https://vk.com/ru_iptv
    ["131638330", "galaktik_iptv", "pinned"], //33 https://vk.com/galaktik_iptv
    ["186442856", "iptv_bt"], //35 https://vk.com/iptv_bt
    ["120034509", "club120034509", "pinned"], //32 https://vk.com/club120034509
    ["99770042", "club99770042"], //17 https://vk.com/club99770042
    ["138553819", "club138553819"],//16 https://vk.com/club138553819
  ];

  //Color Palette #4694
  const colors = {
    color01: '#816460',
    color02: '#B27D6A',
    background01: '#FEF1C5',
    border01: '#F1C196',
  }
  const menuVK = document.createElement('div');
  menuVK.style.cssText = `
  position: fixed;
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  bottom: 50px;
  left: 10px;
  max-width: 500px;
  padding: 10px 0;
  font-size: 14px;
  text-align: center;
  color: ${colors.color01};
  background: ${colors.background01};
  border: 1px solid ${colors.border01};
  border-radius: 3px;
  z-index: 5000;
  `;

  function createMenuBlock(menuType, items, name, styleInput) {
    const subMenu = document.createElement('div');
    subMenu.style.cssText = `width: 45%; margin: 4px 10px; border: 1px solid ${colors.border01};`;
    const head = document.createElement('div');
    head.append(document.createTextNode(name));
    subMenu.append(head);
    const subMenuItems = Object.keys(items);
    if (/^\d+$/.test(subMenuItems[0]) && name !== "deep") {
      subMenuItems.reverse();
    }
    subMenuItems.forEach((item, index) => {
      const inputBlock = document.createElement('div');
      const inputEl = document.createElement('input');
      inputEl.setAttribute('type', menuType);
      inputEl.setAttribute('name', name);
      inputEl.setAttribute('id', item);
      if (index === 0) {
        inputEl.setAttribute('checked', 'checked');
      }
      const inputLabel = document.createElement('label');
      inputLabel.setAttribute('for', item);
      inputLabel.append(document.createTextNode(items[item]));
      inputBlock.append(inputEl, inputLabel);
      inputBlock.style.cssText = styleInput;
      subMenu.append(inputBlock);
    });
    return subMenu;
  }

  const buttonsSet = [
    {name: "START POSTING", handler: startScript},
    {name: "SKIP", handler: skipCurrPost},
  ]

  function createButtonsBlock(buttons) {
    const buttonsBlock = document.createElement('div');
    buttonsBlock.style.cssText = `width: 45%; margin: 4px 10px;`
    buttons.forEach((btn) => {
      const buttonAct = document.createElement('button');
      buttonAct.style.cssText = `display: block; margin: 20px auto; color: ${colors.color01};`;
      buttonAct.append(document.createTextNode(btn.name));
      buttonAct.addEventListener('click', btn.handler);
      buttonsBlock.append(buttonAct);
      if (btn.name === 'START POSTING') {
        buttonStart = buttonAct;
      }
      if (btn.name === 'SKIP') {
        buttonStop = buttonAct;
      }
    });
    return buttonsBlock;
  }

  const stylesInpType1 = "text-align: left; padding: 4px;";
  const stylesInpType2 = "display: inline-block; padding: 4px;";

  const subMenu01 = createMenuBlock('radio', postingAfter, 'after', stylesInpType1);
  const subMenu02 = createMenuBlock('checkbox', posts, 'posts', stylesInpType1);
  const subMenu03 = createMenuBlock('radio', delays, 'delay', stylesInpType1);
  const subMenu04 = createMenuBlock('radio', deeps, 'deep', stylesInpType2);
  const buttonsBlock = createButtonsBlock(buttonsSet);
  menuVK.append(subMenu01, subMenu02, subMenu03, subMenu04, buttonsBlock);
  const bodyVK = document.querySelector(`body`);
  bodyVK.append(menuVK);

  function skipCurrPost() {
    isSkipCurrPost = true;
    buttonStop.setAttribute('disabled', 'disabled');
  }

  //START SCRIPT
  function startScript() {
    let isAllowStarting = false;
    subMenu02posting = [];
    const subMenu02elements = subMenu02.querySelectorAll('input');
    subMenu02elements.forEach((element) => {
      if (element.checked) {
        subMenu02posting.push(element.id);
        isAllowStarting = true;
      }
    });
    const subMenu03elements = subMenu03.querySelectorAll('input');
    subMenu03elements.forEach((element) => {
      if (element.checked) {
        delayXL = (+element.id) * 1000;
      }
    });
    if (isAllowStarting) {
      console.log('Запускаем скрипты: ', subMenu02posting);
      console.log('buttonStart: ', buttonStart);
      buttonStart.setAttribute('disabled', '');
      loadPost();
    } else {
      alert('Необходимо выбрать хотя-бы один пост!');
    }
  }

  async function loadPost() {
    fetch(`https://642dd59966a20ec9cea70c6c.mockapi.io/tasks/${VKName}_${subMenu02posting[currentNumberPost]}`, {
      method: 'GET',
      headers: {'content-type': 'application/json'},
    })
    .then(res => {
      if (res.ok) {
        return res.json();
      } else {
        throw new Error("Something went wrong!");
      }
    }).then(post => {
      currentPost = post;
      savePostToDb();
    }).catch(error => {
      console.log("Что-то пошло не так! ", error);
      buttonStart.removeAttribute('disabled');
    })
  }

  function savePostToDb() {
    const request = indexedDB.open("posting-draft-v1", 1);
    request.onerror = function (event) {
      console.error("An error occurred with IndexedDB");
      console.error(event);
      buttonStart.removeAttribute('disabled');
    };
    request.onsuccess = function () {
      const db = request.result;
      const transaction = db.transaction("posting-draft", "readwrite");
      const store = transaction.objectStore("posting-draft");
      const keyStore = `${idUser}--${groupsAll[currentNumberGr][0]}`;
      const idQuery = store.get(keyStore);
      idQuery.onsuccess = function () {
        store.put(currentPost, keyStore);
        checkEnterToBookMarks();
      };
    };
  }

  function delayAct(action, delay) {
    console.log(action.name);
    return (setTimeout(action, delay));
  }

  function checkEnterToBookMarks() {
    const URLHash = window.location.href;
    if (URLHash === 'https://vk.com/bookmarks?type=group') {
      enterToCurrentGroup();
    } else {
      enterToBookMarks();
    }
  }

  function enterToBookMarks() {
    const linkGroups = document.querySelector('a[href="/bookmarks?from_menu=1"]');
    console.log('linkGroups0: ', linkGroups);
    if (linkGroups) {
      linkGroups.click();
      delayAct(enterToCurrentGroup, delayM);
    } else {
      delayAct(enterToBookMarks, delayM);
    }
  }

  function enterToCurrentGroup() {
    const groupHref = `/${groupsAll[currentNumberGr][1]}`;
    const linkGroup = document.querySelector(`.group_link[href^="${groupHref}"]`);
    console.log('linkGroup: ', linkGroup);
    if (linkGroup) {
      linkGroup.click();
      delayAct(checkCurrentGroup, delayM);
    } else {
      delayAct(enterToCurrentGroup, delayM);
    }
  }

  function checkCurrentGroup() {
    const URLHash = window.location.href;
    if (URLHash === 'https://vk.com/bookmarks?type=group') {
      delayAct(checkCurrentGroup, delayM);
    } else {
      delayAct(checkNecessityPosting, delayM);
    }
  }

  //NecessityPosting
  function checkNecessityPosting() {
    if (isSkipCurrPost) {
      startNewCycle(delayM);
      buttonStop.removeAttribute('disabled');
      isSkipCurrPost = false;
      return;
    }
    let postingAfterItem = null;
    const subMenu01elements = subMenu01.querySelectorAll('input');
    subMenu01elements.forEach((element) => {
      if (element.checked) {
        postingAfterItem = element.id;
      }
    });

    if (postingAfterItem === "all") {
      delayAct(clickCreatePost, delayM);
      return;
    }

    let deepAmount = 0;
    const subMenu04elements = subMenu04.querySelectorAll('input');
    subMenu04elements.forEach((element) => {
      if (element.checked) {
        deepAmount = +element.id;
      }
    });
    const checkingPostsNode = document.querySelectorAll('.post');
    const checkingPosts = Array.from(checkingPostsNode);
    //проверяем наличие "pinned" в группе, если да, то deep увеличиваем на 1;
    if (groupsAll[currentNumberGr][2]) {
      deepAmount++;
    }
    checkingPosts.splice(deepAmount);

    let isThereMyPost = false;
    let isThereStrangePost = false;
    for (let i = 0; i < checkingPosts.length; i++) {
      const avatarRich = checkingPosts[i].querySelector('.AvatarRich');
      if (!avatarRich) {
        console.log("Не найден AvatarRich. checkingPosts: ", checkingPosts);
        continue;
      }
      const postUserId = avatarRich.getAttribute('href');
      console.log("postUserId: ", postUserId);
      if (postingAfterItem === "my") {
        console.log("01 Сравниваем ", postUserId.substring(3), " и ", idUser);
        if (postUserId.substring(3) === idUser) {
          isThereMyPost = true;
          break;
        }
      }
      console.log("02 Сравниваем ", postingAfterItem, " и ", postUserId.substring(1));
      if (postingAfterItem === postUserId.substring(1)) {
        isThereStrangePost = true;
        break;
      }
    }
    if (!isThereMyPost || isThereStrangePost) {
      delayAct(clickCreatePost, delayM);
    } else {
      startNewCycle(delayM);
    }
  }

  function clickCreatePost() {
    const createPost = document.querySelector('[data-testid="posting_create_post_button"]');
    if (createPost) {
      createPost.click();
      delayAct(clickOpenDraftPost, delayM);
    } else {
      delayAct(clickCreatePost, delayM);
    }
  }

  function clickOpenDraftPost() {
    const openDraft = document.querySelector('.box_controls_buttons .FlatButton--primary');
    console.log(openDraft);
    if (openDraft) {
      openDraft.click();
      delayAct(clickContinuePost, delayM);
    } else {
      console.log('Кнопка Открыть черновик не найдена!');
      delayAct(clickOpenDraftPost, delayM);
    }
  }

  function clickContinuePost() {
    const buttonFar = document.querySelector('[data-testid="posting_base_screen_next"]');
    if (buttonFar) {
      buttonFar.click();
      delayAct(clickSavePost, delayM);
    } else {
      delayAct(clickContinuePost, delayM);
    }
  }

  function clickSavePost() {
    if (isSkipCurrPost) {
      startNewCycle(delayM);
      buttonStop.removeAttribute('disabled');
      isSkipCurrPost = false;
      return;
    }
    const buttonSubmit = document.querySelector('[data-testid="posting_submit_button"]');
    if (buttonSubmit) {
      buttonSubmit.click();
      delayAct(checkPostSubmit, delayL);
    } else {
      delayAct(clickSavePost, delayM);
    }
  }

  function checkPostSubmit() {
    const createPost = document.querySelector('[data-testid="posting_create_post_button"]');
    if (createPost) {
      delayAct(startNewCycle, delayM);
    } else {
      delayAct(checkPostSubmit, delayM);
    }
  }

  function startNewCycle(newDelay = delayXL) {
    const linkGroups = document.querySelector('a[href="/bookmarks?from_menu=1"]');
    console.log('linkGroups: ', linkGroups);
    if (linkGroups) {
      linkGroups.click();
      delayAct(updateCycleData, newDelay);
    } else {
      delayAct(startNewCycle, delayM);
    }
  }

  function updateCycleData() {
    const isLastSmallCycle = currentNumberPost >= subMenu02posting.length - 1;
    const isLastBigCycle = currentNumberGr >= groupsAll.length - 1;
    if (isLastSmallCycle && isLastBigCycle) {
      // buttonStart.removeAttribute('disabled');
      delayAct(enterNews, delayM);
      return;
    }
    if (isLastBigCycle) {
      currentNumberPost++;
      currentNumberGr = 0;
      loadPost();
      return;
    }
    currentNumberGr++;
    delayAct(savePostToDb, delayM);
  }

  function enterNews() {
    const buttonNews = document.querySelector('a[href="/feed"]');
    if (buttonNews) {
      buttonNews.click();
      delayAct(scrollPage.bind(null, 10), delayM);
    } else {
      delayAct(enterNews, delayM);
    }
  }

  function scrollPage(k = 20) {
    if (isSkipCurrPost) {
      isSkipCurrPost = false;
      return;
    }
    const n = 1000;
    const m = 5000;
    const timer = Math.floor(Math.random() * (m - n + 1)) + n;
    const a = 300;
    const b = 700;
    const dist = Math.floor(Math.random() * (b - a + 1)) + a;
    setTimeout(() => {
      window.scrollBy(0, dist);
      if (k <= 0) {
        alert('ВСЕ СДЕЛАНО !!!');
      } else {
        scrollPage(k - 1);
      }
    }, timer);
  }

})();
