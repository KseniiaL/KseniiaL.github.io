let count = 0,
    buffer = { //buffer to save deleted repos from search
        one: [],
        two: []
    },
    buf={ //buffer to save deleted repos from filters
        one: [],
        two: [],
        three: []
    }, //buffer to save repos languages
    languages = {
        one: [],
        two: []
    };
const form = document.getElementById('form'),
    input = form.querySelector('input'),
    back = document.getElementById('back'),
    profile = document.getElementById('profile'),
    toggleWindow = () => {
        const t = document.body.removeChild(document.body.querySelector('section'));
        t.style.display = "none";
        document.body.appendChild(t);
        document.body.querySelector('section').style.display = "block";
        buffer.one = buffer.two = buf.one = buf.two = buf.three = languages.one = languages.two = [];
    }, //parse XMLHttpRequest's results
    drawUser = (info) => {
        let location = info.user.location || "",
            login = info.user.login,
            name = info.user.name || login,
            bio = info.user.bio;
        if (!info.user.name)
            login = '';
        if (!bio)
            bio = '';
        let r = info.repos.map((r) => {
            count++;
            let description = r.description,
                lang = r.language;
            if (!description) description = '';
            if (!lang) lang = '';
            else
                lang = `<li>${lang}.</li>`;
            let idName = 'win' + count;
            return `<div class="repo" title="${r.fork}">
                        <button onClick="getElementById('${idName}')
                            .removeAttribute('style'); (body.style.overflow='hidden');" type="button">${r.name}</button>
                        <p>${description}</p>
                        <div>
                            ${lang}
                            <li> Stars: ${r.stargazers_count}. </li>
                            <li> Updated ${r.updated_at.split('T')[0]}.</li>
                        </div>
                    </div>
                    <div id="${idName}" style="display:none;">
                        <div class="overlay"></div>
                        <div class="visible">
                            <h2>${r.full_name}</h2>
                            <p><i>${r.description ? [r.description] : []}</i></p>
                            <div class="content">
                                <a href=${r.html_url.toString()}>${r.html_url.toString()}</a>
                                <p>${r.forks_count !== 0 ? ['Branches:'] : []}</p>
                                <a href=${r.html_url + '/branches'}>${r.forks_count !== 0 ? [r.html_url + '/branches']  : []}</a>
                                <p>${r.language ? ['Language: ' + r.language] : []}</p>
                            </div>
                            <button type="button" onClick="getElementById('${idName}').style.display='none'; (body.style.overflow='visible');">close</button>
                        </div>
                    </div>
                    `}).join(''),
            l = info.repos.map (l => {
                let lang = l.language,
                    bool = false;
                if (!lang)
                    return;
                if (languages.one.length === 0){
                    languages.one.push(lang);
                    bool = true;
                }
                for (let i = 0; i < languages.one.length; i++) {
                    if (lang !== languages.one[i]){
                        languages.one.push(lang);
                        bool = true;
                        break;
                    }
                }
                if (bool)
                    return `<option>${lang}</option>`;
            }),
            l2 = info.starred.map (l => {
                let lang = l.language,
                    bool = false;
                if (!lang)
                    return;
                if (languages.two.length === 0){
                    languages.two.push(lang);
                    bool = true;
                }
                for (let i = 0; i < languages.two.length; i++) {
                    if (lang !== languages.two[i]){
                        languages.two.push(lang);
                        bool = true;
                        break;
                    }
                }
                if (bool)
                    return `<option>${lang}</option>`;
            }),
            s = info.starred.map((s) => {
                count++;
                let description = s.description,
                    lang = s.language;
                if (!description) description = '';
                if (!lang) lang = '';
                else
                    lang = `<li>${lang}.</li>`;
                let idName = 'win' + count;
                return `<div id="${idName}" style="display:none;">
                            <div class="overlay"></div>
                                <div class="visible">
                                    <h2>${s.full_name}</h2>
                                    <div class="content">
                                        <a href=${s.html_url.toString()}>${s.html_url.toString()}</a>
                                        <p>${s.forks_count !== 0 ? ['Branches:'] : []}</p>
                                        <a href=${s.html_url + '/branches'}>${s.forks_count !== 0 ? [s.html_url + '/branches']  : []}</a>
                                    </div>
                                    <button type="button" onClick="getElementById('${idName}').style.display='none'; (body.style.overflow='visible');">close</button>
                                </div>
                        </div>
                        <div class="repo">
                        <button onClick="getElementById('${idName}')
                            .removeAttribute('style'); (body.style.overflow='hidden');" type="button">${s.name}</button>
                        <p>${description}</p>
                        <div>
                            ${lang}
                            <li> Stars: ${s.stargazers_count} </li>
                            <li>Forks: ${s.forks_count}</li>
                            <li> Updated ${s.updated_at.split('T')[0]}</li>
                        </div>
                    </div>`}).join(''),
            f1 = info.followers.map((f) => {
                return `<div class="follow">
                            <div>
                                <img src=${f.avatar_url}/>
                                <h3>${f.login}</h3>
                            </div>
                        </div>`}).join(''),
            f2 = info.following.map((f) => {
                return `<div class="follow">
                            <div>
                                <img src=${f.avatar_url}/>
                                <h3>${f.login}</h3>
                            </div>
                        </div>`}).join('');
        if (!r)
            r = `<div class="follow">
                    <h3>${name} hasn't any repositories yet.</h3>
                </div>`;
        if (!s)
            s = `<div class="follow">
                    <h3>${name} hasn't any starred repositories yet.</h3>
                </div>`;
        if (!f1)
            f1 = `<div class="follow">
                    <h3>${name} doesn't have any followers yet.</h3>
                </div>`;
        if (!f2)
            f2 = `<div class="follow">
                    <h3>${name} isn't following anybody.</h3>
                </div>`;
        let out = `<div class="userPage">
                        <div>
                            <img src=${info.user.avatar_url}/>
                            <h2>${name}</h2>
                            <p><i>${login}</i></p>
                            <p>${bio}</p>
                            <p>${location}</p>
                        </div>
                        <div class="second">                      
                            <div class="tabs">
                                <li><button onclick="openTab('tab1')">Repositories (${info.repos.length})</button></li>
                                <li><button onclick="openTab('tab2')">Stars (${info.starred.length})</button></li>
                                <li><button onclick="openTab('tab3')">Followers (${info.followers.length})</button></li>
                                <li><button onclick="openTab('tab4')">Following (${info.following.length})</button></li>
                            </div>
                            <div class="info" id="tab1" style="display: block">
                                <div class="tabs">
                                    <div>
                                        <input id="text-to-find" value="" placeholder="Search" type="text">
                                        <input type="button" onclick=
                                            "FindOnPage('text-to-find','tab1');
                                            return false;" 
                                            style="width: 30px; height: 30px" value="✓"/>
                                    </div>
                                <select id="mySelect" onchange="Filter(value)">
                                        <option value="All" id="val1">Type: All</option>
                                        <option value="Forks" id="val2">Forks</option>
                                        <option value="Sources" id="val3">Sources</option>
                                    </select>
                                <select id="mySelect2" onchange="filterLang(value,'tab1')">
                                    <option value="All">Language: All</option>
                                    ${l}
                                </select>
                                </div>
                                <ul id="infinite-list">
                                    ${r}
                                </ul>
                            </div>
                            <div class="info" id="tab2" style="display:none">
                                <div class="tabs">
                                    <div>
                                        <input id="text-to-find2" value="" placeholder="Search" type="text">
                                        <input type="button" onclick=
                                            "FindOnPage('text-to-find2','tab2');
                                            return false;"
                                            style="width: 30px; height: 30px" value="✓"/>
                                    </div>
                                    <select id="mySelect3" onchange="filterLang(value,'tab2')">
                                        <option value="All">Language: All</option>
                                        ${l2}
                                    </select>
                                </div>
                                <ul id="infinite-list">
                                    ${s}
                                </ul>
                            </div>
                            <div class="info" id="tab3" style="display:none">
                            <ul id="infinite-list">
                                 ${f1}
                            </ul>
                            </div>
                            <div class="info" id="tab4" style="display:none">
                            <ul id="infinite-list">
                                 ${f2}
                            </ul>
                            </div> 
                        </div>
                    </div>`;
        count = 0;
        languages.one = languages.two = [];
        back.style.display = "block";
        profile.innerHTML = out;
        document.getElementById('spinner').style.display="none";
    };
async function  drawProfile (data, cb) {
    spin();
    await getInfo(data.login)
        .then(info => drawUser(info));
    cb();
}
async function getInfo (username) { //request information from Github API
    let info = {
        user: '',
        repos: [],
        starred: [],
        followers: [],
        following: []
    };
    await fetch('https://api.github.com/users/'+username)
          .then(res => res.json()
              .then(r => {
                  info.user = r;
              }))
          .catch(function(err) {
              console.log('Fetch Error :-S', err);
          });
    await fetch('https://api.github.com/users/'+username+'/repos?per_page=100')
            .then(res => res.json()
                .then(r => {
                    info.repos = r;
                }))
            .catch(function(err) {
                console.log('Fetch Error :-S', err);
            });
    await fetch('https://api.github.com/users/'+username+'/starred?per_page=100')
        .then(res => res.json()
            .then(r => {
                info.starred = r;
            }))
        .catch(function(err) {
            console.log('Fetch Error :-S', err);
        });
    await fetch('https://api.github.com/users/'+username+'/followers?per_page=100')
            .then(res => res.json()
                .then(r => {
                    info.followers= r;
                }))
            .catch(function(err) {
                console.log('Fetch Error :-S', err);
            });
    await fetch('https://api.github.com/users/'+username+'/following?per_page=100')
        .then(res => res.json()
            .then(r => {
                info.following = r;
            }))
        .catch(function(err) {
            console.log('Fetch Error :-S', err);
        });
    return info;
}
function submitHandler(e) {
    e.preventDefault();
    fetch('https://api.github.com/users/' + input.value)
        .then(response => {
                response.json()
                    .then(function(data) {
                        drawProfile(data,toggleWindow);
                        input.value = "";
                    });
                }
        )
        .catch(function(err) {
            console.log('Fetch Error :-S', err);
        });
}
function openTab(tab) {
    let i;
    let x = document.getElementsByClassName("info");
    for (i = 0; i < x.length; i++) {
        x[i].style.display = "none";
    }
    document.getElementById(tab).style.display = "block";
}
function TrimStr(s) {
    s = s.replace( /^\s+/g, '');
    return s.replace( /\s+$/g, '');
}
function FindOnPage(input,tabName) { //Search function
    let obj = document.getElementById(input),
        parent = document.querySelector('ul'),
        repo = parent.childNodes,
        textToFind = "",
        reposNames = [];
    for (let i = 0; i < repo.length; i++){
        if (repo[i].className === "repo")
            reposNames.push(repo[i]);
    }
    if (obj) {
        textToFind = TrimStr(obj.value);
    }
    if (textToFind.length === 0) {
        if (tabName === "tab1"){
            for (let i =0; i < buffer.one.length; i++){
                parent.appendChild(buffer.one[i]);
            }
            buffer.one = [];
            return;
        } else {
            for (let i =0; i < buffer.two.length; i++){
                parent.appendChild(buffer.two[i]);
            }
            buffer.two = [];
            return;
        }
    }
    if(document.body.innerHTML.indexOf(textToFind)==="-1")
        alert("Nothing found.");
    for (let i=0; i<reposNames.length; i++) {
        if (tabName === "tab1")
            buffer.one.push(reposNames[i]);
        else buffer.two.push(reposNames[i]);
        if (reposNames[i].innerText.toLowerCase().indexOf(textToFind) === -1){
            parent.removeChild(reposNames[i]);
        }
    }
}
function Filter(input) {
    let parent = document.querySelector('ul'),
        children = parent.childNodes,
        reposNames = [],
        mydiv = document.createElement('div'),
        bool = false;
    mydiv.className="follow";
    for (let i = 0; i < children.length; i++){
        if (children[i].className === "repo")
            reposNames.push(children[i]);
    }
    if (buf.one.length !== 0) {
        if (parent.lastChild.className !== "repo")
            parent.removeChild(parent.lastChild);
        for (let i = 0; i < buf.one.length; i++) {
            parent.appendChild(buf.one[i]);
        }
        buf.one = [];
        bool = false;
    }
    if (input.toString() === "Forks") {
        for (let i = 0; i < reposNames.length; i++)
            if (reposNames[i].title === "false") {
                buf.one.push(reposNames[i]);
                parent.removeChild(reposNames[i]);
            }
        for (let i = 0; i < children.length; i++)
            if (children[i].className === "repo") {
                bool = true;
                return;
            }
        if (!bool) {
            mydiv.innerHTML = "There's no forked repositories";
            parent.appendChild(mydiv);
        }
    }
    else if (input.toString() === "Sources") {
        for (let i = 0; i < reposNames.length; i++)
            if (reposNames[i].title === "true") {
                buf.one.push(reposNames[i]);
                parent.removeChild(reposNames[i]);
            }
        for (let i = 0; i < children.length; i++)
            if (children[i].className === "repo") {
                bool = true;
                return;
            }
        if (!bool) {
            mydiv.innerHTML = "There's no forked repositories";
            parent.appendChild(mydiv);
        }
    }
}
function filterLang(input,tabName) {
    let parent = document.querySelector('ul'),
        children = parent.childNodes,
        reposNames = [];
    for (let i = 0; i < children.length; i++){
        if (children[i].className === "repo")
            reposNames.push(children[i]);
    }
    if (tabName === "tab1"){
        if (buf.two.length !== 0) {
            if (parent.lastChild.className !== "repo")
                parent.removeChild(parent.lastChild);
            for (let i = 0; i < buf.two.length; i++) {
                parent.appendChild(buf.two[i]);
                reposNames.push(buf.two[i]);
            }
            buf.two = [];
        }
        if (input.toString() !== "All"){
            for (let i = 0; i < reposNames.length; i++){
                    if (input.toString() !== reposNames[i].children[2].innerText.split('.')[0]){
                        buf.two.push(reposNames[i]);
                        parent.removeChild(reposNames[i]);
                }}
        }
    } else {
        if (buf.three.length !== 0) {
            if (parent.lastChild.className !== "repo")
                parent.removeChild(parent.lastChild);
            for (let i = 0; i < buf.three.length; i++) {
                parent.appendChild(buf.three[i]);
                reposNames.push(buf.three[i]);
            }
            buf.three = [];
        }
        if (input.toString() !== "All"){
            for (let i = 0; i < reposNames.length; i++){
                if (input.toString() !== reposNames[i].children[2].innerText.split('.')[0]){
                    buf.three.push(reposNames[i]);
                    parent.removeChild(reposNames[i]);
                }}
        }
    }
}
function spin() {
    let canvas = document.getElementById('spinner');
    let context = canvas.getContext('2d');
    let start = new Date();
    let lines = 16,
        cW = context.canvas.width,
        cH = context.canvas.height;
    let draw = function() {
        let rotation = parseInt(((new Date() - start) / 1000) * lines) / lines;
        context.save();
        context.clearRect(0, 0, cW, cH);
        context.translate(cW / 2, cH / 2);
        context.rotate(Math.PI * 2 * rotation);
        for (let i = 0; i < lines; i++) {
            context.beginPath();
            context.rotate(Math.PI * 2 / lines);
            context.moveTo(cW / 10, 0);
            context.lineTo(cW / 4, 0);
            context.lineWidth = cW / 30;
            context.strokeStyle = "rgba(0, 0, 0," + i / lines + ")";
            context.stroke();
        }
        context.restore();
    };
    window.setInterval(draw, 1000 / 30);
}
function infiniteScroll() {
    let listElm = document.querySelector('#infinite-list');
// Add 20 items.
    let nextItem = 1;
    let loadMore = function() {
        for (let i = 0; i < 20; i++) {
            let item = document.createElement('li');
            item.innerText = 'Item ' + nextItem++;
            listElm.appendChild(item);
        }
    };
// Detect when scrolled to bottom.
    listElm.addEventListener('scroll', function() {
        if (listElm.scrollTop + listElm.clientHeight >= listElm.scrollHeight) {
            loadMore();
        }
    });
// Initially load some items.
    loadMore();
}

form.addEventListener('submit', submitHandler);
back.addEventListener('click', toggleWindow);