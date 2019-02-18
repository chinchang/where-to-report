// const root = document.documentElement;

import {
  html,
  Component,
  render
} from "https://unpkg.com/htm/preact/standalone.mjs";
const localStorageKeys = {
  THEME: "theme"
};
let state = {
  checklist: {}
};
let data = [];

function toggleDarkTheme() {
  if (document.body.classList.contains("theme-dark")) {
    document.body.classList.remove("theme-dark");
    themeToggle.checked = false;
    localStorage.removeItem(localStorageKeys.THEME);
  } else {
    document.body.classList.add("theme-dark");
    themeToggle.checked = true;
    localStorage.setItem(localStorageKeys.THEME, "dark");
  }
}
themeToggle.addEventListener("change", e => {
  toggleDarkTheme();
});

function renderOnElement(component, element) {
  if (element) {
    render(component, element);
  }
}
function setState(obj) {
  state = { ...state, ...obj };
  renderComponents();
}

function debounce(func, wait, immediate) {
  var timeout;
  return function() {
    var context = this,
      args = arguments;
    var later = function() {
      timeout = null;
      if (!immediate) func.apply(context, args);
    };
    var callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    if (callNow) func.apply(context, args);
  };
}

class SearchResults extends Component {
  constructor() {
    super();
    this.state = {
      results: [],
      isLoading: false
    };
    this.search = debounce(this.search, 300);
  }
  search(term) {
    this.searchTerm = term;
    this.setState({ isLoading: true });
    if (!term || term.length < 3) {
      // lastSearchResultHash = '';
      return;
    }
    term = term.toLowerCase();
    var matchingItems = data.filter(item => {
      if (
        (item.name + "").toLowerCase().indexOf(term) !== -1 ||
        (item.link + "").toLowerCase().indexOf(term) !== -1
      ) {
        return true;
      }
    });
    this.setState({
      results: matchingItems,
      isLoading: false
    });
  }
  componentDidMount() {
    window.searchTerm.addEventListener("input", e => {
      this.search(e.target.value);
    });
  }
  render() {
    return html`
      <div>
        <p>
          ${this.state.isLoading
            ? "Finding..."
            : html`
                ${" "}
              `}
        </p>
        ${!this.state.isLoading && !this.state.results.length && this.searchTerm
          ? html`
              <p>
                No match found.${" "}
                <a
                  href="https://github.com/chinchang/where-to-report#add-to-list"
                  rel="external"
                  >Click here to add it if you come to know.</a
                >
              </p>
            `
          : null}
        <table class=${`${this.state.results.length ? "" : "v-h"}`}>
          <thead>
            <tr>
              <th>Name</th>
              <th>Reporting Link</th>
            </tr>
          </thead>
          ${this.state.results.map(result => {
            return html`
              <tr>
                <td>${result.name}</td>
                <td>
                  <a
                    aria-label=${`Reporting link for ${result.name}`}
                    rel="external"
                    href=${result.reportingLink}
                    >Report here</a
                  >
                </td>
              </tr>
            `;
          })}
        </table>
      </div>
    `;
  }
}

function renderComponents() {
  renderOnElement(
    html`
      <${SearchResults} />
    `,
    window.preactRoot
  );
}

function init() {
  if (localStorage.getItem(localStorageKeys.THEME) === "dark") {
    toggleDarkTheme();
  }
  // Read q=blahblah from url, if present
  const searchQuery = location.search.match(/q\=([^&.]*)/);
  if (searchQuery) {
    window.searchTerm.value = searchQuery[1];
  }

  fetch("_data/list.json")
    .then(res => res.json())
    .then(res => (data = res));

  renderComponents();
}
document.addEventListener("DOMContentLoaded", init);
