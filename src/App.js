import {Component} from 'react'
import Loader from 'react-loader-spinner'
import 'react-loader-spinner/dist/loader/css/react-spinner-loader.css'
import './App.css'

const apiStatusContent = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  loading: 'LOADING',
}

const categoriesList = [
  {id: 'ALL', displayText: 'All'},
  {id: 'STATIC', displayText: 'Static'},
  {id: 'RESPONSIVE', displayText: 'Responsive'},
  {id: 'DYNAMIC', displayText: 'Dynamic'},
  {id: 'REACT', displayText: 'React'},
]

// Replace your code here
class App extends Component {
  state = {
    category: categoriesList[0].id,
    projectsList: [],
    apiStatus: apiStatusContent.initial,
  }

  componentDidMount() {
    this.getList()
  }

  getList = async () => {
    this.setState({apiStatus: apiStatusContent.loading})
    const {category} = this.state
    const url = `https://apis.ccbp.in/ps/projects?category=${category}`
    const options = {
      method: 'GET',
    }
    const response = await fetch(url, options)
    if (response.ok === true) {
      const data = await response.json()
      const updatedData = data.projects.map(eachProject => ({
        id: eachProject.id,
        imageUrl: eachProject.image_url,
        name: eachProject.name,
      }))
      this.setState({
        projectsList: updatedData,
        apiStatus: apiStatusContent.success,
      })
    } else {
      this.setState({apiStatus: apiStatusContent.failure})
    }
  }

  onChangeCategory = event => {
    this.setState({category: event.target.value}, this.getList)
  }

  onRenderCases = () => {
    const {apiStatus} = this.state
    switch (apiStatus) {
      case apiStatusContent.success:
        return this.onSuccessMethod()
      case apiStatusContent.failure:
        return this.onFailureMethod()
      case apiStatusContent.loading:
        return this.onLoadMethod()
      default:
        return null
    }
  }

  onLoadMethod = () => (
    <div className="loader" testid="loader">
      <Loader type="ThreeDots" color="#328af2" height={50} width={50} />
    </div>
  )

  onSuccessMethod = () => {
    const {projectsList} = this.state
    return (
      <ul className="ul-container">
        {projectsList.map(eachItem => (
          <li className="li-container" key={eachItem.id}>
            <img
              className="image"
              src={eachItem.imageUrl}
              alt={eachItem.name}
            />
            <p className="para">{eachItem.name}</p>
          </li>
        ))}
      </ul>
    )
  }

  onRetryProjects = () => {
    this.getList()
  }

  onFailureMethod = () => (
    <div className="failure-container">
      <img
        className="failure-image"
        src="https://assets.ccbp.in/frontend/react-js/projects-showcase/failure-img.png"
        alt="failure view"
      />
      <h1>Oops! Something Went Wrong</h1>
      <p>We cannot seem to find the page you are looking for.</p>
      <button
        type="button"
        onClick={this.onRetryProjects}
        className="retry-btn"
      >
        Retry
      </button>
    </div>
  )

  render() {
    const {category} = this.state

    return (
      <div className="main-bg-container ">
        <nav className="nav-container">
          <img
            className="nav-image"
            src="https://assets.ccbp.in/frontend/react-js/projects-showcase/website-logo-img.png"
            alt="website logo"
          />
        </nav>
        <div className="all-categories-container">
          <select
            onChange={this.onChangeCategory}
            value={category}
            className="select-container"
          >
            {categoriesList.map(eachCategory => (
              <option key={eachCategory.id} value={eachCategory.id}>
                {eachCategory.displayText}
              </option>
            ))}
          </select>
          {this.onRenderCases()}
        </div>
      </div>
    )
  }
}

export default App
