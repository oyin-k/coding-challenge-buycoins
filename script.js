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

const userName = "oyin-k";

getUserData(userName).then((data) => {
  const userData = data.data.user;

  getHeaderAvatar(userData);
  getProfileInfo(userData);
  getRepoCount(userData);
  getRepos(userData);
});

function getHeaderAvatar(user) {
  profileDropdown.innerHTML = `
      <img src="${user.avatarUrl}" alt="profile-picture" />
      <i class="material-icons">arrow_drop_down</i>
    `;

  profileInfoNavSmallScreen.innerHTML = `
      <img src="${user.avatarUrl}" alt="profile-picture" />
      ${user.login}
    `;
}

function getProfileInfo(user) {
  const profileHTML = `
      <div class="profile--image">
          <img src="${user.avatarUrl}" alt="profile image" />
          <div class="emoji">💭</div>
      </div>
      <div class="profile--info">
          <h1 class="profile--info-Name">${user.name}</h1>
          <h4 class="profile--info-Username">${user.login}</h4>
          <p class="profile--info-Description">${user.bio}</p>
      </div>
    `;

  const profileSmallScreenHTML = `
      <div class="profile--info-md-emoji-description">
      💭 ${user.status.message}
      </div>
      <p class="profile--info-md-Description">love cooking on computers.</p>
      <button class="profile--info-md-button">Edit Profile</button>
    `;

  profile.innerHTML = profileHTML;
  profileSmallScreen.innerHTML = profileSmallScreenHTML;
}

function getRepoCount(user) {
  repoCountPageNav.innerText = user.repositories.totalCount;
  repoCountSmallScreen.innerText = user.repositories.totalCount;

  repoCount.innerHTML = `
          <p>
              <strong>${user.repositories.totalCount}</strong> repositories for
              <strong>public</strong> repositories
          </p>
      `;
}

function getRepos(user) {
  const repos = user.repositories.nodes;

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
                      
                      ${
                        repo.stargazerCount > 0
                          ? `<div class="stars">
                                <img class="icon" src="./icons/star.svg" alt="star" />
                                ${repo.stargazerCount}
                            </div>`
                          : ""
                      }
                      <div class="date"> Updated on ${moment(
                        repo.updatedAt
                      ).format("Do MMMM")}</div>
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
                      stargazerCount
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
  );
}

async function queryFetch(query, variables) {
  const response = await fetch("https://api.github.com/graphql", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer d084b9b9ebc810141a8ab73f5f22e378b70fcd5e`,
    },
    body: JSON.stringify({
      query: query,
      variables: variables,
    }),
  });

  return await response.json();
}
