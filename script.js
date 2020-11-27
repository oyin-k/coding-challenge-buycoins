const profileDropdown = document.getElementById(
  "nav--actions-profile-dropdown"
);
const profileInfoNavSmallScreen = document.getElementById(
  "nav--link-profile-info-sm"
);
const profile = document.getElementById("profile");
const profileSmallScreen = document.getElementById("profile--info-md");
const repoCount = document.getElementById("feed--info");
const repoCountSmallScreen = document.getElementById("pageNav--counter-md");
const repoCountPageNav = document.getElementById("pageNav--counter");
const repoList = document.getElementById("feed--list");

const userLogin = "oyin-k";

getHeaderAvatar();
getProfileInfo();
getRepoCount();
getRepos();

async function getHeaderAvatar() {
  const resp = await getUserData(userLogin);

  profileDropdown.innerHTML = `
    <img src="${resp.avatarUrl}" alt="profile-picture" />
    <i class="material-icons">arrow_drop_down</i>
  `;

  profileInfoNavSmallScreen.innerHTML = `
    <img src="${resp.avatarUrl}" alt="profile-picture" />
    ${resp.login}
  `;
}

async function getProfileInfo() {
  const resp = await getUserData(userLogin);

  const profileHTML = `
    <div class="profile--image">
        <img src="${resp.avatarUrl}" alt="profile image" />
        <div class="emoji">💭</div>
    </div>
    <div class="profile--info">
        <h1 class="profile--info-Name">${resp.name}</h1>
        <h4 class="profile--info-Username">${resp.login}</h4>
        <p class="profile--info-Description">${resp.bio}</p>
    </div>
  `;

  const profileSmallScreenHTML = `
    <div class="profile--info-md-emoji-description">
    💭 ${resp.status.message}
    </div>
    <p class="profile--info-md-Description">love cooking on computers.</p>
    <button class="profile--info-md-button">Edit Profile</button>
  `;

  profile.innerHTML = profileHTML;
  profileSmallScreen.innerHTML = profileSmallScreenHTML;
}

async function getRepoCount() {
  const resp = await getUserData(userLogin);

  repoCountPageNav.innerText = resp.repositories.totalCount;
  repoCountSmallScreen.innerText = resp.repositories.totalCount;

  repoCount.innerHTML = `
        <p>
            <strong>${resp.repositories.totalCount}</strong> repositories for
            <strong>public</strong> repositories
        </p>
    `;
}

async function getRepos() {
  const resp = await getUserData(userLogin);
  const repos = resp.repositories.nodes;

  let repoHTML = repos
    .map((repo) => {
      return `
        <div class="feed--item">
            <div class="feed--item-Info">
                <h2 class="feed--item-Info-Name">
                    <a href="#">${repo.name}</a>
                </h2>
                <p class="feed--item-Description">
                    ${repo.description ? repo.description : ""}
                </p>
                <div class="added-info">
                    <div class="language">
                    <div class="language--color-Code" style="background-color:${
                      repo.primaryLanguage.color
                    }"></div>
                    <span class="language--name">${
                      repo.primaryLanguage.name
                    }</span>
                    </div>
                    <div class="stars">2</div>
                    <div class="date">${repo.updatedAt}</div>
                </div>
            </div>
            <div class="feed--item-Action">
                <button>
                    <img class="icon" src="./icons/star.svg" alt="star" />
                    Star
                </button>
            </div>
        </div>
    `;
    })
    .join("");

  repoList.innerHTML = repoHTML;
}

function getUserData(user) {
  return queryFetch(
    `
          query getUser($login: String!){
              user(login: $login) {
                repositories(orderBy: {field: CREATED_AT, direction: DESC}, privacy: PUBLIC, first: 20) {
                  nodes {
                    name
                    primaryLanguage {
                      color
                      name
                    }
                    description
                    id
                    updatedAt
                  }
                  totalCount
                }
                avatarUrl(size: 400)
                bio
                name
                login
                status {
                  emoji
                  message
                }
              }
            }`,
    { login: user }
  ).then((data) => {
    return data.data.user;
  });
}

function queryFetch(query, variables) {
  return fetch("https://api.github.com/graphql", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer d084b9b9ebc810141a8ab73f5f22e378b70fcd5e`,
    },
    body: JSON.stringify({
      query: query,
      variables: variables,
    }),
  }).then((res) => res.json());
}
