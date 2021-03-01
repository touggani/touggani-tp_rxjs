import "./styles.css";
import { map, filter, debounceTime, switchMap } from "rxjs/operators";
import { fromEvent } from "rxjs";
import { ajax } from "rxjs/ajax";

function getInput() {
  return document.getElementById("main-input");
}

function githubSearchUserUrl(username) {
  return `https://api.github.com/search/users?q=${username}`;
}

const input = getInput();

const input$ = fromEvent(input, 'input');

const values$ = input$.pipe(
  map((item) => item.target.value),
  filter((input) => input.length > 2),
  debounceTime(1000),
  switchMap((inputSearch) => ajax(githubSearchUserUrl(inputSearch)))
);

values$.subscribe((value) => {
  console.log(value);
  writeUsersToCard(value["response"]["items"]);
});

function writeUsersToCard(users) {
  const el = document.getElementById("container");

  const strValue = users
    .map(
      ({ login, avatar_url, html_url }) => `
  <a target="_blank" href=${html_url} class="flex bg-white p-4 my-2 items-center rounded-lg shadow hover:shadow-xl border-solid border-gray-400 border-2">
    <img src=${avatar_url} class="h-10 w-10 rounded-full mr-4 border-1 border-blue-500" />
    <span class="no-underline hover:underline text-blue-500 text-lg ">${login} <span/>
  </div>
  `
    )
    .join("");

  el.innerHTML = strValue;
}

// .subscribe((val) => console.log('Hello from subscribe', val));
