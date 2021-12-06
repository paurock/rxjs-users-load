import {fromEvent} from "rxjs";
import {
  map,
  debounceTime,
  distinctUntilChanged,
  switchMap,
  mergeMap,
  tap
} from "rxjs/operators";
import {ajax} from "rxjs/ajax";

const url = "http://api.github.com/search/users?q=";

const search = document.getElementById("search");
const result = document.getElementById("result");

const stream$ = fromEvent(search, "input").pipe(
  map(e => e.target.value),
  debounceTime(500),
  distinctUntilChanged(),
  tap(() => (result.innerHTML = "")),
  switchMap(value => ajax.getJSON(url + value)),
  map(response => response.items),
  mergeMap(items => items)
);

stream$.subscribe(user => {
  const html = `
    <div class="card">
      <div class="card-image">
        <img src="${user.avatar_url}" />
        <span class="card-title">${user.login}</span>
      </div>
      <div class="card-action">
        <a href="${user.html_url}" target="_blank">Открыть github</a>
      </div>
    </div>
  `;
  result.insertAdjacentHTML("beforeend", html);
});
