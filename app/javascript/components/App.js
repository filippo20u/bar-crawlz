import React from "react"

//mock Data
// import mockBars from './pages/yelpBarData.js'
import mockCrawls from './pages/mockCrawls.js'


//Components
import Header from './components/Header'
import Footer from './components/Footer'

//Pages
import AboutUs from './pages/AboutUs'
import BarCrawlEditP from './pages/BarCrawlEditP'
import BarShow from './pages/BarShow'
import Home from './pages/Home'
import NotFound from './pages/NotFound'
import UserDashboardP from './pages/UserDashboardP'

import {
  BrowserRouter as  Router,
  Route,
  Switch
} from 'react-router-dom'

class App extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      bars: null,
      crawls: mockCrawls,
      location: "",
      term: ""
    }
  } 

// method 
  getUserYelpInfo = (userlocation, userterm) => {
    this.setState({ location: userlocation, term: userterm })
    this.indexYelpBars()
  }

  indexYelpBars = () => {
    let { location, term } = this.state
    console.log(location)
    console.log(term)
    fetch(`/yelp?location=${location}&term=${term}`)
    .then(response => response.json())
    .then(payload => {
      console.log(payload)
      this.setState({bars: payload})
    })
  }

//methods used in newcrawlmodal
  createNewCrawl = (newcrawl) => {
    console.log(newcrawl)
  }

  addBartoCrawl = (bar, crawlID) => {
    console.log(bar, crawlID)
  }

//methods used in user dashboard
  deleteCrawl = (crawl) => {
    console.log("DELETED CRAWL", crawl)
  }

  updateCrawlTitle = (crawl, id) => {
    console.log("crawl:", crawl)
    console.log("id:", id)
  }

//methods used in barcrawl edit
  deleteBarFromCrawl = (crawl) => {
    console.log(crawl)
  }

  render () {

//info about whats happening with logged in users etc
    console.log("mockBars test",this.state.bars)
    console.log("logged in", this.props.logged_in)
    console.log("current user", this.props.current_user)
    console.log("this.state.bars", this.state.bars)

    return (

    <Router>

      <Header 
        logged_in={ this.props.logged_in }
        sign_in_route = { this.props.sign_in_route }
        sign_out_route = { this.props.sign_out_route }
        sign_up_route = { this.props.sign_up_route }
        new_user_route={ this.props.new_user_route }
      />

  <Switch>
    {/* -----Home Route----- */}
      <Route exact path="/" 
            render={ (props) => 
            <Home      
              bars = { this.state.bars }     
              sign_in_route = { this.props.sign_in_route }
              sign_out_route = { this.props.sign_out_route }
              sign_up_route = { this.props.sign_up_route }
              new_user_route={ this.props.new_user_route }
              getUserYelpInfo={ this.getUserYelpInfo } 
            /> 
        } 
      />

    {/* -----About Us Page Route----- */}
      <Route path="/about" component={ AboutUs } 
      />


    {/* -----Bar Show Route----- */}
    <Route 
          path="/bar/:id"
          render={ (props) =>{
            let id = props.match.params.id
            let bar = this.state.bars.businesses.find(bar => bar.id == id)
            let crawls = this.state.crawls
            return (
              <BarShow 
                bar={ bar }
                crawls= { crawls }
                createNewCrawl={ this.createNewCrawl }
                addBartoCrawl={ this.addBartoCrawl }
                logged_in={ this.props.logged_in }
                sign_in_route = { this.props.sign_in_route }
                sign_out_route = { this.props.sign_out_route }
                sign_up_route = { this.props.sign_up_route }
                new_user_route={ this.props.new_user_route }
                current_user={ this.props.current_user }  
                />
            )
          }}
        />
        

    {/* -----Bar Crawl Edit Route (protected)----- */}
{ this.props.logged_in &&
    <Route 
      path="/editbarcrawl/:id"
      render={ (props) => {
          let id = props.match.params.id
          let crawl = this.state.crawls.find(crawl => crawl.id === parseInt(id))
              return (
                <BarCrawlEditP
                  crawl= { crawl }
                  bars = { this.props.bars }
                  current_user={ this.props.current_user }
                  sign_out_route = { this.props.sign_out_route }
                  updateCrawlTitle={ this.updateCrawlTitle }
                  deleteBarFromCrawl={ this.deleteBarFromCrawl }
                />
              )
            }}
          />
  }



    {/* -----User Dashboard Route----- */}
    { this.props.logged_in &&
    <Route
       path="/userdashboard"
       render={ (props) =>{
        let id = this.props.current_user.id
        let crawl = this.state.crawls.find(crawl => crawl.id === parseInt(id))
        let crawls = this.state.crawls.filter(crawl => crawl.user_id === id)
        return(
          <UserDashboardP 
            crawls={ crawls }
            crawl={ crawl }
            sign_out_route = { this.props.sign_out_route } 
            deleteCrawl={ this.deleteCrawl }
          />
        )
      }}
    />
  }

    {/* -----NotFound Route----- */}
    <Route component={ NotFound } />

  </Switch>
        <Footer 
          logged_in={ this.props.logged_in }
          sign_in_route = { this.props.sign_in_route }
          sign_out_route = { this.props.sign_out_route }
          sign_up_route = { this.props.sign_up_route }
          new_user_route={ this.props.new_user_route }
        />
          
</Router>

    );
  }
}

export default App
