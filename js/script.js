let globalUsers = [];
let globalCountries = [];
let globalusersAndCountries = [];

async function start() {
  /* await fetchUsers();
  await fetchCountries(); */

  /*   console.time('promise');
  await promiseUsers();
  await promiseCountries();
  console.timeEnd('promise'); */

  console.time('promiseall');
  const p1 = promiseUsers();
  const p2 = promiseCountries();

  await Promise.all([p1, p2]);
  console.timeEnd('promiseall');
  hideSpinner();

  mergeUsersAndCountries();
  render();
}

function promiseUsers() {
  return new Promise(async (resolve, reject) => {
    const users = await fetchUsers();

    setTimeout(() => {
      resolve(users);
    }, 5000);
  });
}

function promiseCountries() {
  return new Promise(async (resolve, reject) => {
    const countries = await fetchCountries();
    setTimeout(() => {
      resolve(countries);
    }, 6000);
  });
}

async function fetchUsers() {
  const res = await fetch(
    'https://randomuser.me/api/?results=100&seed=promise&nat=us,fr,au,br'
  );
  const json = await res.json();

  globalUsers = json.results.map(({ name, picture, nat }) => {
    return {
      userName: name.first,
      userPicture: picture.large,
      userCountry: nat,
    };
  });
}

async function fetchCountries() {
  const res = await fetch('https://restcountries.eu/rest/v2/all');
  const json = await res.json();

  globalCountries = json.map(({ name, alpha2Code, flag }) => {
    return {
      countryName: name,
      countryCode: alpha2Code,
      countryFlag: flag,
    };
  });
}

function hideSpinner() {
  const spinner = document.querySelector('#spinner');
  spinner.classList.add('hide');
}

function mergeUsersAndCountries() {
  globalusersAndCountries = [];

  globalUsers.forEach((user) => {
    const userCountry = globalCountries.find((country) => {
      return country.countryCode === user.userCountry;
    });

    globalusersAndCountries.push({ ...user, ...userCountry });
  });

  render();
}

function render() {
  const divUsers = document.querySelector('#divUsers');

  divUsers.innerHTML = `
    <div class='row'>
      ${globalusersAndCountries
        .map(({ userPicture, userName, countryFlag, countryName }) => {
          return `
          <div class='col s6 m4 l3'>
            <div class='flex-row bordered'>
              <img class='avatar' src='${userPicture}' alt='${userName}' >
              
              <div class='flex-column'>
                <span>${userName}</span>
                <img class='flag' src='${countryFlag}' alt='${countryName}' >
              </div>
            </div>
          </div>
        `;
        })
        .join('')}
    </div>
  `;
}

start();
