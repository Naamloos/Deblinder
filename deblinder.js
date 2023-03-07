async function fetchTeasers() 
{
    let response = await fetch('https://api.gotinder.com/v2/fast-match/teasers', 
    {
        headers: 
        {
            'X-Auth-Token': localStorage.getItem('TinderWeb/APIToken'),
            platform: 'android',
        },
    });
    let json = await response.json();
    return json.data.results;
}

async function fetchUser(id) 
{
    let response = await fetch(`https://api.gotinder.com/user/${id}`, 
    {
        headers: 
        {
            'X-Auth-Token': localStorage.getItem('TinderWeb/APIToken'),
            platform: 'android',
        },
    });

    let json = await response.json();
    return json.results;
}

async function likeUser(id) 
{
    var validId = id.replace("\n", "");

    let response = await fetch(`https://api.gotinder.com/like/${validId}`, 
    {
        method: 'POST',
        headers: 
        {
            'X-Auth-Token': localStorage.getItem('TinderWeb/APIToken'),
            platform: 'android',
        }
    });

    let json = await response.json();
    return json.results;
}

/**
 * 
 * @param {Element} teaserElement 
 * @param {*} profile 
 */
async function InjectInfo(teaserElement, profile, id)
{
    let name = profile.name;
    let age = Math.floor((new Date() - new Date(profile.birth_date)) / (1000 * 60 * 60 * 24 * 365)); // approximate age from ms to years

    let title = teaserElement.parentElement.querySelectorAll('div:nth-child(2)')[0];
    let injection = document.createElement('p');
    injection.innerHTML = `${name} (${age})`;
    injection.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
    injection.style.color = "#FFFFFF";
    injection.style.padding = "5px";
    injection.style.borderRadius = "10px";
    
    let like = document.createElement('button');
    like.style.cursor = "pointer";
    like.style.padding = "10px";
    like.style.display = "inline-block";
    like.title = `Like ${name}'s profile`;
    
    like.onclick = async () => 
    {
        likeUser(id);
        alert(`You liked ${name}! reload tinder to see them appear in your matches.`);
        teaserElement.parentElement.removeChild(teaserElement);
    }

    title.innerHTML = '';
    title.appendChild(injection);
}

async function unblurLikes()
{
    let links = document.querySelectorAll('body');
    let modals = document.querySelectorAll('.modal');
    let teasers = await fetchTeasers();
    let teaserElements = document.querySelectorAll('.Expand.enterAnimationContainer > div:nth-child(1)');

    for(let i = 0; i < links.length; i++)
    {
        links[i].removeAttribute('href');
    }

    for(let i = 0; i < modals.length; i++)
    {
        modals[i].removeAttribute('href');
    }

    for(let i = 0; i < teaserElements.length; i++)
    {
        let teaser = teasers[i];
        let teaserElement = teaserElements[i];
        let teaserImage = teaser.user.photos[0].url;

        if(teaserImage.includes('images-ssl'))
        {
            let id = teaserImage.slice(32, 56);
            let user = await fetchUser(id);

            teaserImage = user.photos[0].url;

            InjectInfo(teaserElement, user, id);
        }

        teaserElement.style.backgroundImage = `url(${teaserImage})`;
    }
}

function createBaseDiv()
{
    let newDiv = document.createElement('div');
    newDiv.id = "deblinder";
    newDiv.style.position = "absolute";
    newDiv.style.right = "5px";
    newDiv.style.bottom = "5px";
    newDiv.style.zIndex = "9999";
    newDiv.style.backgroundColor = "rgba(0, 0, 0, 0.75)";
    newDiv.style.color = "#FD326C";
    newDiv.style.borderRadius = "5px";
    newDiv.style.padding = "10px";
    
    let title = document.createElement("p");
    title.innerHTML = "Deblinder Hax Menu"
    title.style.width = "100%";
    title.style.textAlign = "center";
    title.style.margin = "0";
    newDiv.appendChild(title);

    document.getElementsByTagName('body')[0].childNodes[0].prepend(newDiv);
    return newDiv;
}

function injectButton(id, text, parentElement, callback)
{
    var newEl = document.createElement("button");
    newEl.innerHTML = text;

    newEl.style.width = "200px";
    newEl.style.height = "25px";
    newEl.style.color = "#FFFFFF";
    newEl.style.backgroundColor = "#FD326C";
    newEl.style.marginTop = "10px";
    newEl.style.borderRadius = "15px";
    newEl.style.display = "block";
    newEl.id = id;
    
    newEl.onclick = callback;
    
    parentElement.appendChild(newEl);
}

function disableButton(id)
{
    let btn = document.getElementById('deblinder-deblur');
    btn.onclick = () => alert('You have already used this button. Reload to reuse!');
    btn.style.opacity = "0.3";
}

function checkPage(url)
{
    if(window.location.href.includes(url))
    {
        return true;
    }

    alert('This button only works on ' + url + ' !!');
    return false;
}

let baseDiv = createBaseDiv();

injectButton("deblinder-deblur", "Deblur Likes", baseDiv, () => 
{ 
    if(checkPage('tinder.com/app/likes-you')){
        disableButton("deblinder-deblur");
        unblurLikes();
    }
});

injectButton("deblinder-matchall", "Match All Likes", baseDiv, () => 
{ 
    if(checkPage('tinder.com/app/likes-you')){
        alert('WIP, this feature will come soon.');
    }
});