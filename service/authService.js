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
      return result.data;
    });
  };

  this.logout = function () {
    return client.auth.signOut().then(function () {
      localStorage.removeItem('role');
      localStorage.removeItem('name');
    });
  };

  this.getSession = function () {
    return client.auth.getSession().then(function (result) {
      return result.data.session || null;
    });
  };

  this.getCurrentUser = function () {
    return client.auth.getUser().then(function (result) {
      return result.data.user || null;
    });
  };

  this.isLoggedIn = function () {
    return client.auth.getSession().then(function (result) {
      return result.data.session !== null;
    });
  };

  this.getRole = function () {
    return localStorage.getItem('role');
  };

  this.setRole = function (role) {
    localStorage.setItem('role', role);
  };

  this.getName = function () {
    return localStorage.getItem('name');
  };

  this.setName = function (name) {
    localStorage.setItem('name', name);
  };

});
