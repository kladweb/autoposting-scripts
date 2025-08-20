// ==UserScript==
// @name         AutoRepVK_11_mod05_remote
// @author       kladweb
// @match        https://vk.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=vk.com
// @run-at       document-body
// @updateURL    https://raw.githubusercontent.com/kladweb/autoposting-scripts/refs/heads/main/build/VK11_fin.js
// @downloadURL  hhttps://raw.githubusercontent.com/kladweb/autoposting-scripts/refs/heads/main/build/VK11_fin.js
// ==/UserScript==

(function () {
  'use strict';
  const idUser = '562935165';
  const posts = {best: "The best operators", mediabox: "MEDIABOX"};
  const VKName = "vk11";

  // version 1.1.5
  const urlBaseDataStat = "https://689069c9944bf437b595d196.mockapi.io/vkstat";
  const strategy = {
    all: "All groups",
    aftermy: "After my posts",
    my: "Skip my posts",
    rivals: "Competitors"
  };
  const competitors = {
    id358923511: "Анна Егорова",
    diwissmio: "Diwiss Iptv",
    id620542842: "Иван Смирнов",
    sergent771: "Сергей Щепетов",
    id469457210: "Алексей Гвоздев",
    pasha_dubrovsky: "Паша Дубровский",
    satiptv: "Людвиг Ванбетховен",
    id387929772: "Дмитрий (ILook)",
    id476124794: "VK0: Екатерина Менкина",
    id806571200: "VK2: Татьяна Андреева",
    id463839444: "VK6: Павел Каширский",
    id550973432: "VK9: Елена Поведайко",
    id562935165: "VK11: Василий Тис",
    id591910410: "VK13: Andrzey"
  }
  const delays = {30: "30 sec", 15: "15 sec", 10: "10 sec"};
  const deeps = {1: 1, 2: 2, 3: 3, 5: 5, 9: 9};
  const numberBlockPost = {0: 0, 1: 1, 2: 2, 3: 3, 4: 4, 5: 5, 6: 6, 7: 7};
  const [delayM, delayL] = [2000, 3000];
  let delayXL = 10000;
  const currentInfoItems = {myip: "IP", missedposts: "Missed posts", leftposts: "Left posts", errorsposts: "Errors"};
  let postElements = [];
  let inputAllGroups = null;
  let inputCompetitors = null;
  const competitorsMenuItems = [];
  const infoPosts = {};
  const infoContent = {};
  const deepItems = [];
  let currentNumberPost = 0;
  let currentNamePost = null;
  let currentNumberGr = 0;
  let currentPost = null;
  let isSkipCurrPost = false;
  let buttonStart = null;
  let buttonStop = null;
  let deepAmount = 0;
  let functionRepetitions = 0;
  let loadedFetchPosts = {};
  const groupsAll = [];

  const groupsBox = {
    0: [
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
      ["176994995", "tvlisty", "pin"], //29 https://vk.com/tvlisty
      ["167018774", "club167018774"], //30 https://vk.com/club167018774
      ["171843329", "ru_iptv", "pin"], //31 https://vk.com/ru_iptv
      ["131638330", "galaktik_iptv", "pin"], //33 https://vk.com/galaktik_iptv
      ["186442856", "iptv_bt"], //35 https://vk.com/iptv_bt
      ["120034509", "club120034509", "pin"], //32 https://vk.com/club120034509
      ["99770042", "club99770042"], //17 https://vk.com/club99770042
      ["138553819", "club138553819"],//16 https://vk.com/club138553819
    ],
    1: [
      ["141086755", "club141086755"],// https://vk.com/club141086755
      ["136708898", "play_53"],// https://vk.com/play_53
      ["24950442", "club24950442"],// https://vk.com/club24950442
      ["206061686", "club206061686"],// https://vk.com/club206061686
      ["35875023", "sputnikovetv"],// https://vk.com/sputnikovetv
      ["175865636", "iplist", "pin"],// https://vk.com/iplist
      ["148105703", "club148105703"],// https://vk.com/club148105703
      ["132602273", "club132602273"],// https://vk.com/club132602273
      ["218718758", "club218718758"],// https://vk.com/club218718758
      ["86617505", "club86617505"],// https://vk.com/club86617505  1101
    ],
    2: [
      ["44971717", "club44971717", "pin"],// https://vk.com/club44971717  868
      ["64610320", "iptvworld"],// https://vk.com/iptvworld
      ["183716378", "4at_biz"],// https://vk.com/4at_biz
      ["114193852", "iptvstar"],// https://vk.com/iptvstar  237
      ["220867147", "neoniptv"],// https://vk.com/neoniptv  146
      ["106165979", "club106165979"],// https://vk.com/club106165979  74
      ["129904512", "club129904512"],// https://vk.com/club129904512  138
      ["87564019", "club87564019"],// https://vk.com/club87564019  214
      ["182272329", "club182272329"],// https://vk.com/club182272329  677
      ["85473521", "club85473521"],// https://vk.com/club85473521  363
    ],
    3: [
      ["97046131", "club97046131"],// https://vk.com/club97046131  268
      ["181633050", "iptvarmenia"],// https://vk.com/iptvarmenia  274
      ["119225474", "aromashopvl", "pin"],// https://vk.com/aromashopvl  197
      ["163108884", "club_playlistsiptv"],// https://vk.com/club_playlistsiptv  177
      ["163420799", "club163420799"],// https://vk.com/club163420799  165
      ["119462518", "club119462518"],// https://vk.com/club119462518  155*
      ["85129289", "club85129289"],// https://vk.com/club85129289  153
      ["88877831", "iptv15"],// https://vk.com/iptv15  76
      ["133932827", "club133932827"],// https://vk.com/club133932827  115
      ["114358721", "iptvmen", "pin"],// https://vk.com/iptvmen  125
    ],
    4: [
      ["125907101", "club125907101"],// https://vk.com/club125907101  129
      ["100749987", "club100749987"],// https://vk.com/club100749987  128
      ["211817792", "freeiptvplaylist"],// https://vk.com/freeiptvplaylist  121
      ["114852397", "club114852397"],// https://vk.com/club114852397  121
      ["50738228", "club50738228"],// https://vk.com/club50738228  114
      ["51856489", "club51856489"],// https://vk.com/club51856489  102
      ["168355036", "club168355036"],// https://vk.com/club168355036  101
      ["139627862", "clubiptv2017"],// https://vk.com/clubiptv2017  100
      ["92481281", "club92481281"],// https://vk.com/club92481281  80
      ["69750941", "online.iptv"],// https://vk.com/online.iptv  76
    ],
    5: [
      ["33418379", "club33418379"],// https://vk.com/club33418379  71
      ["60125045", "club60125045"],// https://vk.com/club60125045  68
      ["75004959", "club75004959", "pin"],// https://vk.com/club75004959  63
      ["191496548", "club191496548", "pin"],// https://vk.com/club191496548  62
      ["67319747", "club67319747"],// https://vk.com/club67319747  58
      ["88265046", "club88265046"],// https://vk.com/club88265046  58
      ["116759968", "obstv"],// https://vk.com/obstv  54
      ["24890840", "club24890840"],// https://vk.com/club24890840  54
      ["113453722", "club113453722"],// https://vk.com/club113453722  53
      ["72770953", "club72770953"],// https://vk.com/club72770953  50
    ],
    6: [
      ["66538865", "club66538865"],// https://vk.com/club66538865  47
      ["92609310", "club92609310"],// https://vk.com/club92609310  47
      ["39933599", "ip_tv_player"],// https://vk.com/ip_tv_player  46
      ["16982510", "club16982510"],// https://vk.com/club16982510  41
      ["183858399", "tvbox_vk", "pin"],// https://vk.com/tvbox_vk  39
      ["65587412", "plattexpod"],// https://vk.com/plattexpod  38
      ["23943593", "club23943593"],// https://vk.com/club23943593  38
      ["18046120", "club18046120"],// https://vk.com/club18046120  37
      ["205480134", "club205480134"],// https://vk.com/club205480134  35
      ["111331547", "club111331547"],// https://vk.com/club111331547  32
    ],
    7: [
      ["20716313", "club20716313"],// https://vk.com/club20716313  32
      ["24096858", "club24096858"],// https://vk.com/club24096858  32
      ["50585401", "club50585401"],// https://vk.com/club50585401  31
      ["224475216", "iptvbrestt", "pin"],// https://vk.com/iptvbrestt  30
      ["169583842", "club169583842"],// https://vk.com/club169583842  30
      ["200371453", "club200371453"],// https://vk.com/club200371453 29
      ["133880267", "club133880267"],// https://vk.com/club133880267 29
      ["138208217", "club138208217"],// https://vk.com/club138208217 27
      ["224212394", "club224212394"],// https://vk.com/club224212394 25
      ["17837395", "club17837395"],// https://vk.com/club17837395 22
      ["80802384", "club80802384"],// https://vk.com/club80802384 20
      ["178793178", "iptvsfera"],// https://vk.com/iptvsfera 19
      ["129923189", "azimuth_tv", "pin"],// https://vk.com/azimuth_tv  18
      ["182276122", "sharaclub_sat_iptv"],// https://vk.com/sharaclub_sat_iptv  18
      ["112843747", "club112843747"],// https://vk.com/club112843747  14
    ]
  };

  //Color Palette #4694
  const colors = {
    color01: '#816460',
    color02: '#B27D6A',
    color03: '#403F26',
    background01: '#FEF1C5',
    border01: '#F1C196',
  }

  const buttonsSet = [
    {name: "SAVE POSTS", handler: savePosted},
    {name: "SKIP", handler: skipCurrPost},
    {name: "START POSTING", handler: startScript},
  ];

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
  box-sizing: border-box;
  font-size: 14px;
  text-align: center;
  color: ${colors.color01};
  background: ${colors.background01};
  border: 1px solid ${colors.border01};
  border-radius: 3px;
  z-index: 5000;
  `;

  const styleMenu1 = `width: 45%; margin: 4px auto; border: 1px solid ${colors.border01};`
  const styleMenu2 = `margin: 4px auto; border: 1px solid ${colors.border01};`
  const stylesInpType1 = "text-align: left; padding: 4px;";
  const stylesInpType2 = "display: inline-block; padding: 4px;";
  const stylesInpType3 = "text-align: left; padding: 2px;";

  const strategyMenu = createMenuBlock('radio', strategy, 'STRATEGY', styleMenu2, stylesInpType1);
  const postsMenu = createMenuBlock('checkbox', posts, 'POSTS', styleMenu2, stylesInpType1);
  const delaysMenu = createMenuBlock('radio', delays, 'DELAY', styleMenu2, stylesInpType1);
  const deepsMenu = createMenuBlock('radio', deeps, 'DEEP', styleMenu2, stylesInpType2);
  const blockPostMenu = createMenuBlock('checkbox', numberBlockPost, 'BLOCKPOST', styleMenu2, stylesInpType2);
  const competitorsSubMenu = createMenuBlock('checkbox', competitors, 'COMPETITORS', styleMenu1, stylesInpType3);
  const infoPanel = createMenuBlock('', {}, 'Last 12 hours', styleMenu1, stylesInpType1);
  const currentInfo = createMenuBlock('', {}, 'Current Info', styleMenu1, stylesInpType1);
  const buttonsBlock = createButtonsBlock(buttonsSet);
  const menuGroupPost = document.createElement("div");
  menuGroupPost.append(strategyMenu, postsMenu, delaysMenu, deepsMenu, blockPostMenu);
  menuGroupPost.style.cssText = `width: 45%; margin: auto`
  menuVK.append(menuGroupPost, competitorsSubMenu, infoPanel, currentInfo, buttonsBlock);
  const bodyVK = document.querySelector(`body`);
  bodyVK.append(menuVK);
  strategyMenu.addEventListener('click', changeCompInputs);

  createInfoPanelContent(posts, infoPosts, infoPanel, "green");
  createInfoPanelContent(currentInfoItems, infoContent, currentInfo, "green", "red");
  getIp().then((res) => {
      infoContent.myip.namePostEl.innerText = res;
    }
  );

  infoContent.myip.namePostEl.style.cursor = 'pointer';
  infoContent.myip.namePostEl.addEventListener('click', saveIPAddress);

  function createInfoPanelContent(infoItemsObj, contentObj, menuPanel, spanColor, specColor) {
    for (const key in infoItemsObj) {
      const postEl = document.createElement('p');
      postEl.style.cssText = "margin: 4px; text-align: left;";
      const postDivSpan = document.createElement('span');
      postDivSpan.style.cssText = `color: ${key !== 'missedposts' ? spanColor : specColor}; font-weight: bold;`;
      if (key === 'myip' || key === 'leftposts') {
        postDivSpan.style.fontWeight = 'normal';
      }
      postEl.append(document.createTextNode(`${infoItemsObj[key]}:  `));
      postEl.append(postDivSpan);
      contentObj[key] = {namePostEl: postDivSpan, amountCurr: 0, amountLast: 0};
      if (JSON.stringify(infoItemsObj) === JSON.stringify(posts)) {
        loadRenderData(key, postDivSpan);
      }
      if (JSON.stringify(infoItemsObj) === JSON.stringify(currentInfoItems)) {
        contentObj[key].namePostEl.innerText = "-";
      }
      menuPanel.append(postEl);
    }
  }

  function createMenuBlock(menuType, items, name, styleMenu, styleInput) {
    const subMenu = document.createElement('div');
    subMenu.style.cssText = styleMenu;
    const head = document.createElement('div');
    head.append(document.createTextNode(name));
    subMenu.append(head);
    const subMenuItems = Object.keys(items);
    if (/^\d+$/.test(subMenuItems[0]) && name !== "DEEP" && name !== "BLOCKPOST") {
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
      if (name === "STRATEGY") {
        inputEl.className = "strategy";
      }
      if (item === "all") {
        inputAllGroups = inputEl;
      }
      if (item === "rivals") {
        inputCompetitors = inputEl;
      }
      if (name === "COMPETITORS") {
        inputEl.setAttribute('disabled', 'disabled');
        competitorsMenuItems.push(inputEl);
      }
      if (name === "DEEP") {
        inputEl.setAttribute('disabled', 'disabled');
        deepItems.push(inputEl);
      }
      inputBlock.append(inputEl, inputLabel);
      inputBlock.style.cssText = styleInput;
      subMenu.append(inputBlock);
    });
    // if (name === "STRATEGY") {
    //   subMenu.append(competitorsSubMenu);
    // }
    return subMenu;
  }

  function createButtonsBlock(buttons) {
    const buttonsBlock = document.createElement('div');
    buttonsBlock.style.cssText = `width: 95%; margin: 4px 10px;`
    buttons.forEach((btn) => {
      const buttonAct = document.createElement('button');
      buttonAct.style.cssText = `display: inline-block; margin: 20px 10px; color: ${colors.color01}; cursor: pointer;`;
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

  function savePosted() {
    if (infoPosts[currentNamePost] && infoPosts[currentNamePost].amountCurr) {
      updateRenderData(currentNamePost, infoPosts[currentNamePost].amountCurr);
      infoPosts[currentNamePost].amountLast += infoPosts[currentNamePost].amountCurr;
      infoPosts[currentNamePost].amountCurr = 0
    }
  }

  function skipCurrPost() {
    buttonStop.setAttribute('disabled', 'disabled');
    isSkipCurrPost = true;
  }

  function changeCompInputs() {
    if (inputCompetitors.checked) {
      competitorsMenuItems.forEach((element) => {
        element.removeAttribute('disabled');
      });
    } else {
      competitorsMenuItems.forEach((element) => {
        element.setAttribute('disabled', 'disabled');
      });
    }
    if (inputAllGroups.checked) {
      deepItems.forEach((element) => {
        element.setAttribute('disabled', 'disabled');
      });
    } else {
      deepItems.forEach((element) => {
        element.removeAttribute('disabled');
      });
    }
  }

  window.onbeforeunload = function (e) {
    //TODO save amount posts;
    if (infoPosts[currentNamePost] && infoPosts[currentNamePost].amountCurr) {
      updateRenderData(currentNamePost, infoPosts[currentNamePost].amountCurr);
    }
  };

  function loadRenderData(namePost, postEl) {
    fetch(`${urlBaseDataStat}/${VKName}${namePost}`, {
      method: 'GET',
      headers: {'content-type': 'application/json'},
    })
    .then(res => {
      if (res.ok) {
        return res.json();
      } else {
        throw new Error("0: Something went wrong!");
      }
    })
    .then(renderInfo => {
      const result = renderInfo.posts;
      const resultFilter = result.filter((pack) => {
        const currentDate = new Date();
        const packDate = new Date(pack.date);
        return (currentDate - packDate) / 3600000 < 12;
      });
      loadedFetchPosts[namePost] = resultFilter;
      const summArr = resultFilter.reduce((accum, currentValue) => accum + currentValue.amount, 0);
      infoPosts[namePost].amountLast = summArr;
      postEl.innerText = infoPosts[namePost].amountLast + infoPosts[namePost].amountCurr;
    })
    .catch(error => {
      console.log("0: Что-то пошло не так! ", error);
    })
  }

  function updateRenderData(namePost, amount) {
    const newData = {
      posts: [{amount: amount, date: new Date()}, ...loadedFetchPosts[namePost]],
    };

    fetch(`${urlBaseDataStat}/${VKName}${namePost}`, {
      method: 'PUT',
      headers: {'content-type': 'application/json'},
      body: JSON.stringify(newData)
    }).then(res => {
      if (res.ok) {
        return res.json();
      }
      throw new Error("2: Something went wrong!");
    }).then(task => {
      infoPosts[currentNamePost].namePostEl.style.color = "blue";
      console.log("2: Данные на сервере обновлены!");
    }).catch(error => {
      console.log("2: Что-то пошло не так! ", error);
    })
  }

  async function getIp() {
    try {
      const response = await fetch('https://api.ipify.org?format=json');
      const data = await response.json();
      return data.ip;
    } catch (error) {
      console.error('Error fetching IP address:', error);
    }
  }

  async function saveIPAddress() {
    try {
      await navigator.clipboard.writeText(infoContent.myip.namePostEl.innerText)
      .then(() => {
        infoContent.myip.namePostEl.style.color = "blue";
        setTimeout(() => {
          infoContent.myip.namePostEl.style.color = "green";
        }, 1500);
      });
    } catch (error) {
      console.error("4: IP адрес не  сохранен! Ошибка: ", error);
    }
  }

  function clearDataBeforeBigCycle() {
    currentNumberGr = 0;
    groupsAll.length = 0;
    if (infoPosts[currentNamePost]?.namePostEl) {
      infoPosts[currentNamePost].namePostEl.style.color = "green";
    }
  }

  /**
   * START SCRIPT
   **/
  function startScript() {
    clearDataBeforeBigCycle();
    let isAllowStarting = false;
    postElements = [];
    const subMenu02elements = postsMenu.querySelectorAll('input');
    subMenu02elements.forEach((element) => {
      if (element.checked) {
        postElements.push(element.id);
        isAllowStarting = true;
      }
    });
    currentNamePost = postElements[currentNumberPost];
    const subMenu03elements = delaysMenu.querySelectorAll('input');
    subMenu03elements.forEach((element) => {
      if (element.checked) {
        delayXL = (+element.id) * 1000;
      }
    });
    const blockPostMenuEls = blockPostMenu.querySelectorAll('input');
    blockPostMenuEls.forEach((element) => {
      if (element.checked) {
        groupsAll.push(...groupsBox[element.id]);
      }
    });
    infoContent.leftposts.amountCurr = groupsAll.length;
    infoContent.leftposts.namePostEl.innerText = infoContent.leftposts.amountCurr.toString();

    console.log("groupsAll: ", groupsAll);
    console.log("length: ", groupsAll.length);

    // Shuffle array using the Fisher–Yates shuffle
    for (let i = groupsAll.length - 1; i > 0; i--) {
      let j = Math.floor(Math.random() * (i + 1));
      [groupsAll[i], groupsAll[j]] = [groupsAll[j], groupsAll[i]];
    }

    if (isAllowStarting) {
      console.log('Запускаем скрипты: ', postElements);
      buttonStart.setAttribute('disabled', '');
      loadPost();
    } else {
      alert('Необходимо выбрать хотя-бы один пост!');
    }
  }

  function loadPost() {
    fetch(`https://642dd59966a20ec9cea70c6c.mockapi.io/tasks/${VKName}_${currentNamePost}`, {
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
      // console.log("CURRENT POST: ", currentPost);
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
    if (linkGroups) {
      linkGroups.click();
      delayAct(checkLoadGroupsList, delayL);
    } else {
      delayAct(enterToBookMarks, delayM);
    }
  }

  function checkLoadGroupsList() {
    if (document.querySelector('.BookmarksEmptyFeed')) {
      delayAct(loadNarrativeList, delayM);
    } else {
      delayAct(enterToCurrentGroup, delayL);
    }
    // const URLHash = window.location.href;
    // if (URLHash !== 'https://vk.com/bookmarks?type=group') {
    //   delayAct(enterToCurrentGroup, delayL);
    // }
  }

  function loadNarrativeList() {
    const linkPost = document.querySelector('#ui_rmenu_narrative');
    if (linkPost) {
      linkPost.click();
      delayAct(loadGroupsList, delayM);
    } else {
      delayAct(loadNarrativeList, delayM);
    }
  }

  function loadGroupsList() {
    const linkGroup = document.querySelector('#ui_rmenu_group');
    if (linkGroup) {
      delayAct(checkLoadGroupsList, delayL);
    } else {
      delayAct(loadGroupsList, delayM);
    }
  }

  function enterToCurrentGroup() {
    // const URLHash = window.location.href;
    // if (URLHash !== 'https://vk.com/bookmarks?type=group') {
    //   delayAct(enterToCurrentGroup, delayL);
    //   return;
    // }
    buttonStop.removeAttribute('disabled');
    const groupHref = `/${groupsAll[currentNumberGr][1]}`;
    const linkGroup = document.querySelector(`.group_link[href^="${groupHref}"]`);
    if (linkGroup) {
      console.log("linkGroup: ", linkGroup);
      linkGroup.click();
      delayAct(checkCurrentGroup, delayM);
    } else {
      console.log("Didn't find group: ", groupHref);
      console.log("Scrolling page...");
      window.scrollBy(0, 1500);
      delayAct(enterToCurrentGroup, delayM);
    }
  }

  function checkCurrentGroup() {
    const URLHash = window.location.href;
    if (URLHash === 'https://vk.com/bookmarks?type=group') {
      delayAct(checkCurrentGroup, delayM);
    } else {
      console.log("deepItems: ", deepItems);
      deepItems.forEach((element) => {
        if (element.checked) {
          deepAmount = +element.id;
        }
      });
      console.log("deepAmount: ", deepAmount);
      // window.scrollBy(0, deepAmount * 500);
      window.scrollBy({top: deepAmount * 500, left: 0, behavior: 'smooth'});
      delayAct(checkNecessityPosting, delayL);
    }
  }

  /**
   * NECESSITY POSTING
   **/
  function checkNecessityPosting() {
    // window.scrollTo(0, 500);
    window.scrollTo({top: 500, left: 0, behavior: 'smooth'});
    if (isSkipCurrPost) {
      isSkipCurrPost = false;
      infoContent.missedposts.amountCurr++;
      startNewCycle(delayM);
      return;
    }
    // if (currentNumberPost > 0) {
    //   delayAct(clickCreatePost, delayM);
    //   return;
    // }

    let strategyItem = null;
    const subMenu01Elements = strategyMenu.querySelectorAll('.strategy');
    subMenu01Elements.forEach((element) => {
      if (element.checked) {
        strategyItem = element.id;
      }
    });

    //competitorsMenuItems
    let rivals = [];
    if (strategyItem === "rivals") {
      competitorsMenuItems.forEach((element) => {
        if (element.checked) {
          rivals.push(element.id);
        }
      });
    }

    const checkingPostsNode = document.querySelectorAll('.post');
    const checkingPosts = Array.from(checkingPostsNode);

    //check "pin" in the group, if yes, then we increase deepAmount by 1;
    const isFirstPin = checkingPosts[0].querySelector('.PostHeaderTitle__pin');
    if (isFirstPin) {
      console.log("*** There is PIN ***");
      checkingPosts.shift();
    }
    checkingPosts.splice(deepAmount);

    let isNecessityPosting = false;

    for (let i = 0; i < checkingPosts.length; i++) {
      const avatarRich = checkingPosts[i].querySelector('.AvatarRich');
      if (!avatarRich) {
        console.log("Didn't find AvatarRich. checkingPosts: ", checkingPosts);
        continue;
      }
      const postUserId = avatarRich.getAttribute('href');
      console.log("postUserId: ", postUserId);

      if (strategyItem === "aftermy") {
        console.log("00 Compare ", postUserId.substring(3), " and ", idUser);
        if (postUserId.substring(3) === idUser) {
          isNecessityPosting = true;
          break;
        }
        continue;
      }

      if (strategyItem === "my") {
        console.log("01 Compare ", postUserId.substring(3), " and ", idUser);
        if (postUserId.substring(3) === idUser) {
          isNecessityPosting = false;
          break;
        }
        isNecessityPosting = true;
        continue;
      }

      console.log("011 Compare (check presence of our post only for the 1st cycle) ", postUserId.substring(3), " и ", idUser);
      if (i === 0 && postUserId.substring(3) === idUser) {
        break;
      }

      console.log("02 Compare ", rivals, " and ", postUserId.substring(1));
      if (rivals.some(element => postUserId.substring(1).includes(element))) {
        isNecessityPosting = true;
        break;
      }

      if (strategyItem === "all") {
        isNecessityPosting = true;
        break;
      }
    }
    if (isNecessityPosting) {
      delayAct(clickCreatePost, delayM);
    } else {
      infoContent.missedposts.amountCurr++;
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
    if (openDraft) {
      openDraft.click();
      functionRepetitions = 0;
      delayAct(clickContinuePost, delayM);
    } else {
      console.log('Button Открыть черновик didn\'t find!');
      if (functionRepetitions > 5) {
        functionRepetitions = 0;
        groupsAll.push(groupsAll[currentNumberGr]);
        infoContent.leftposts.amountCurr++;
        infoContent.errorsposts.amountCurr++;
        infoContent.errorsposts.namePostEl.innerText = infoContent.errorsposts.amountCurr;
        startNewCycle(delayM);
      } else {
        functionRepetitions++;
        delayAct(clickOpenDraftPost, delayM);
      }
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
      infoContent.missedposts.amountCurr++;
      isSkipCurrPost = false;
      delayAct(clickCloseDraftPost, delayM);
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

  function clickCloseDraftPost() {
    if (functionRepetitions > 5) {
      functionRepetitions = 0;
      startNewCycle(delayM);
      return;
    }
    const closeButton = document.querySelector('[data-testid="modal-close-button"]');
    if (closeButton) {
      closeButton.click();
      functionRepetitions = 0;
      delayAct(startNewCycle.bind(null, delayM), delayM);
    } else {
      functionRepetitions++;
      delayAct(clickCloseDraftPost, delayM);
    }
  }

  function checkPostSubmit() {
    const createPost = document.querySelector('[data-testid="posting_create_post_button"]');
    if (createPost) {
      infoPosts[currentNamePost].amountCurr++;
      infoPosts[currentNamePost].namePostEl.innerText = infoPosts[currentNamePost].amountCurr + infoPosts[currentNamePost].amountLast;
      infoPosts[currentNamePost].namePostEl.style.color = "green";
      delayAct(startNewCycle, delayM);
    } else {
      delayAct(checkPostSubmit, delayM);
    }
  }

  function startNewCycle(newDelay = delayXL) {
    console.log('newDelay: ', newDelay);
    infoContent.leftposts.amountCurr--;
    infoContent.missedposts.namePostEl.innerText = infoContent.missedposts.amountCurr;
    infoContent.leftposts.namePostEl.innerText = infoContent.leftposts.amountCurr;
    const linkGroups = document.querySelector('a[href="/bookmarks?from_menu=1"]');
    if (linkGroups) {
      linkGroups.click();
      delayAct(updateCycleData.bind(null, newDelay), delayM);
    } else {
      delayAct(startNewCycle, delayM);
    }
  }

  function updateCycleData(newDelay = delayXL) {
    const isLastSmallCycle = currentNumberPost >= postElements.length - 1;
    const isLastBigCycle = currentNumberGr >= groupsAll.length - 1;

    //Если завершается большой круг, сохраняем кол-во опубликованных постов на сервере.
    if (isLastBigCycle && infoPosts[currentNamePost].amountCurr) {
      updateRenderData(currentNamePost, infoPosts[currentNamePost].amountCurr);
    }
    if (isLastSmallCycle && isLastBigCycle) {
      delayAct(enterNews, delayM);
      return;
    }
    if (isLastBigCycle) {
      currentNumberPost++;
      currentNamePost = postElements[currentNumberPost];
      currentNumberGr = 0;
      clearDataBeforeBigCycle();
      delayAct(loadPost, newDelay);
      return;
    }
    currentNumberGr++;
    delayAct(savePostToDb, newDelay);
  }

  function enterNews() {
    buttonStart.removeAttribute('disabled');
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
      // window.scrollBy(0, dist);
      window.scrollBy({top: dist, left: 0, behavior: 'smooth'});
      if (k <= 0) {
        alert('ВСЕ СДЕЛАНО !!!');
      } else {
        scrollPage(k - 1);
      }
    }, timer);
  }

})();
