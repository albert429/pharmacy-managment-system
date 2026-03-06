app.service('AuthService', function ($http) {
  var supabaseUrl = 'https://mzrwptstmsewkwucwvlt.supabase.co';
  var apiKey = 'sb_publishable_3eyaMNOWfe9xnmLf08SHNg_WUQOfmBc';
  var restBase = supabaseUrl + '/rest/v1';

  var client = supabase.createClient(supabaseUrl, apiKey);

  var headers = {
    apikey: apiKey,
    Authorization: 'Bearer ' + apiKey,
    'Content-Type': 'application/json',
  };

  this.signup = function (email, password, meta) {
    return client.auth.signUp({ email: email, password: password }).then(function (result) {
      if (result.error) return Promise.reject(result.error);

      var user = result.data.user;
      return $http.post(restBase + '/users_metadata', {
        id: user.id,
        role: meta.role,
        name: meta.name || email.split('@')[0],
        email: email,
        phone: meta.phone || null,
      }, { headers: headers }).then(function () {
        return { user: user, role: meta.role, message: 'Signup successful' };
      });
    });
  };

  this.login = function (email, password) {
    return client.auth.signInWithPassword({ email: email, password: password }).then(function (result) {
      if (result.error) return Promise.reject(result.error);

      var user = result.data.user;
      var session = result.data.session;

      // store user info so other parts of the app can access it
      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('session', JSON.stringify(session));

      return result.data;
    });
  };

  this.logout = function () {
    return client.auth.signOut().then(function () {
      localStorage.removeItem('user');
      localStorage.removeItem('session');
    });
  };

  this.getCurrentUser = function () {
    var stored = localStorage.getItem('user');
    return stored ? JSON.parse(stored) : null;
  };

  this.isLoggedIn = function () {
    return localStorage.getItem('session') !== null;
  };
});