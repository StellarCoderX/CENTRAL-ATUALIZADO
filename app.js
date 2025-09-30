import Auth from "./auth.js";
import UI from "./ui.js";

const App = {
  routes: {
    "#login": UI.renderLoginPage,
    "#register": UI.renderRegisterPage,
    "#dashboard": UI.renderDashboardPage,
    "#profile": UI.renderProfilePage,
    "#credits": UI.renderCreditsPage,
    "#shein-checker": UI.renderToolPage,
    "#vivasorte-checker": UI.renderToolPage,
    "#gg-vtex-checker": UI.renderToolPage, 
  },
  protectedRoutes: [
    "#dashboard", 
    "#profile", 
    "#credits", 
    "#shein-checker", 
    "#vivasorte-checker"
    "#gg-vtex-checker"
  ],

  init() {
    window.addEventListener("hashchange", this.handleRoute.bind(this));
    window.addEventListener("authstatechanged", this.handleRoute.bind(this));

    this.handleRoute();
  },

  handleRoute() {
    const path = window.location.hash || "#login";

    if (this.protectedRoutes.includes(path) && !Auth.isAuthenticated()) {
      window.location.hash = "#login";
      return;
    }

    if (path === "#login" && Auth.isAuthenticated()) {
      window.location.hash = "#dashboard";
      return;
    }

    const routeHandler = this.routes[path];
    if (routeHandler) {
      routeHandler.call(UI);
    } else {
      window.location.hash = Auth.isAuthenticated() ? "#dashboard" : "#login";
    }
  },
};

App.init();

export default App;



