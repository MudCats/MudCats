function getCookie(cname) {
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for(var i = 0; i <ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}

class App extends React.Component {
  constructor (props) {
    super (props);
    // will hold state of all entries in database and current search values
    this.state = {
      viewingEntry: '',
      allEntries: [],
      searchResults: [],
      currentUser: '',
      greeting: 'Hello!'
    }
  }
  // when the component loads successfully
  componentWillMount () {
    // load all of the user's data
    this.getUserEntries();
    this.greetUser();
  }

  getUserEntries () {
    $.ajax({
      url: '/querydb',
      type: 'GET',
      success: (response) => {
        // sets state of all entries
        // sets current user name
        if (response.length) {
          this.setState({
            allEntries: response,
            currentUser: response[0].user
          })
        } else {
          this.setState({
            allEntries: []
          });

        }
      },
      error: function (error) {
        console.log(error);
        throw error;
      }
    })
  };

   getFilterEntries (choice) {
    console.log("choice", choice)
    $.ajax({
      url: '/querydb/filter' + '?choice=' + choice.toLowerCase(),
      type: 'GET',
      success: (response) => {
        // sets state of all entries
        // sets current user name
        if (response.length) {
          this.setState({
            allEntries: response,
            currentUser: response[0].user
          })
        }
      },
      error: function (error) {
        console.log(error);
        throw error;
      }
    })
  };
  // generates greeting in banner
  greetUser () {
    // if current user is identified
    var cookie = document.cookie;
    if (cookie.includes('username')) {
      $.ajax({
      url: '/querydb/user',
      type: 'GET',
      success: (response) => {
        // sets state of all entries
        // sets current user name

        if (response.length) {
          this.setState({
            currentUser: response[0].user
          });
          if (this.state.currentUser) {
            // greet them by name
            this.setState({
              greeting: `Hello, ${this.state.currentUser}!`
            });
          } else {
            // new users are greetedwith Hello
            this.setState({
              greeting: 'Hello!'
            });
          }
        }
      },
      error: function (error) {
        console.log(error);
        throw error;
        }
      })
    }
  }
  // deletes a listening instance from the db
  deleteUserEntries (id, date, albumName, callback, filter) {
    $.ajax({
      url:'/querydb/delete',
      type:'POST',
      data: {
        impressionId: id,
        date: date,
        albumName: albumName
      },
      success: function (response) {
        if (filter) {
          callback(filter);
        } else {
          callback();
        }
      },
      error: function (error) {
        console.log(error);
        throw error;
      }
    })
  }
  // updates a user entry
  updateUserEntries (id, rating, impression, callback, filter) {
    $.ajax({
      url:'/querydb/update',
      type:'POST',
      data:{
        id: id,
        rating: rating,
        impression: impression
      },
      success: function (response) {
        if (filter) {
          callback(filter);
        } else {
          callback();
        }
      },
      error: function (error) {
        console.log(error);
        throw error;
      }
    })
  }

  openNav() {
    document.getElementById("mySidenav").style.width = "250px";
    document.getElementById("app").style.marginLeft = "250px";
  }
  logout(){
        FB.getLoginStatus(function(response) {
          console.log(response);
            if (response.status === 'connected') {
                FB.logout(function(response) {
                    // this part just clears the $_SESSION var
                    // replace with your own code
                        document.cookie.split(";").forEach(function(c) { 
                          document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/"); 
                         });
                        window.location.reload();
                });
            }
        });
    }
  

  // renders the app to the DOM

  render () {
    return (
      <div>
        <div className="container-fluid app">
          <header className="navbar">
            <div><h2 className="greeting">{this.state.greeting}</h2></div>
            

            <div id="status">
            </div>
              <button className="btn btn-default landing" style={{float: 'right'}} onClick={this.logout}><span>Sign Out</span></button>
          





            <img className='navbar-center header logo' src="styles/logo.svg"></img>
            <div  className="col-md-2 search">
              <Search getUserEntries={this.getUserEntries.bind(this)}/>
            </div>
          </header>
          <div>
            <a onClick={this.openNav.bind(this)} id="main-search" className='glyphicon-search glyphicon'>&nbsp;</a>
          </div>
          <div className="col-md-12">
            <table className="table-responsive table">
              <EntryList allEntries={this.state.allEntries}
                updateUserEntries={this.updateUserEntries.bind(this)}
                getUserEntries={this.getUserEntries.bind(this)}
                getFilterEntries={this.getFilterEntries.bind(this)}
                deleteUserEntries={this.deleteUserEntries.bind(this)}/>
              </table>
            </div>
          </div>

      </div>
    )
  }
}

window.App = App;
