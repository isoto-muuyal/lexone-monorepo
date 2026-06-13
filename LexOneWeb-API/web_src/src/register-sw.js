const registerServiceWorker = () => {
  if ("serviceWorker" in navigator) {
    navigator.serviceWorker
      .register("./firebase-messaging-sw.js")
      .then(function(registration) {
        console.log('registration',registration);
        console.log("Registration successful, scope is:", registration.scope);
      })
      .catch(function(err) {
        console.log('registration_err',err);
        console.log("Service worker registration failed, error:", err);
      });
  }
};
  
export { registerServiceWorker };