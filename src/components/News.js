import React, { Component } from 'react'
import NewsItem from './NewsItem'
import Spinner from './Spinner';
import PropTypes from 'prop-types'


export default class News extends Component {
    static defaultProps = {
        pageSize: 8,
        country : "in",
        category :"general",
    }
    static propTypes = {
        pageSize: PropTypes.number,
        country: PropTypes.string,
        category: PropTypes.string,
    }
    constructor(){
        super();
        console.log("this is a constructor of news component");
        this.state = {
            articles: [],
            loading: false,
            page: 1
        }
    }
    async componentDidMount(){
        this.setState({loading: true});
        let url = `https://newsapi.org/v2/top-headlines?country=us&category=${this.props.category}&apiKey=aa7a6f8b876c4071a7121bedaefb0ccf&pageSize=${this.props.pageSize}`
        let data = await fetch(url);
        let parseData = await data.json();
        this.setState({
            articles: parseData.articles || [],
            totalResults : parseData.totalResults,
            loading: false  
        })

    }
     handleNextClick= async()=>{
        console.log("next");

        if (this.state.page + 1 <= Math.ceil(this.state.totalResults / this.props.pageSize)) {
            this.setState({ loading: true });
            let url = `https://newsapi.org/v2/top-headlines?country=us&category=${this.props.category}&apiKey=aa7a6f8b876c4071a7121bedaefb0ccf&page=${this.state.page + 1}&pageSize=${this.props.pageSize}`;
            let data = await fetch(url);
            let parseData = await data.json();

            this.setState({
                page: this.state.page + 1,
                articles: parseData.articles || [],
                loading: false
            });
        }
    }
     handlePrevClick=async()=>{
        this.setState({ loading: true });

        let url = `https://newsapi.org/v2/top-headlines?country=us&category=${this.props.category}&apiKey=aa7a6f8b876c4071a7121bedaefb0ccf&page=${this.state.page - 1}&pageSize=${this.props.pageSize}`;
        let data = await fetch(url);
        let parseData = await data.json();

        this.setState({
            page: this.state.page - 1,
            articles: parseData.articles || [],
            loading: false
        });
    }
    render() {
        
    const defaultImage = 'https://fortune.com/img-assets/wp-content/uploads/2024/11/GettyImages-2173454425_e29352-e1732212304271.jpg?resize=1200,600';
    return (
      <div className='container my-3'>
        <h1 className='text-center'>NewsApp - Top Headlines</h1>
        {this.state.loading && <Spinner/>}
        <div className='row'>
        {
  this.state.articles && this.state.articles.length > 0 ? (
    !this.state.loading && this.state.articles.map((element) => {
      return (
        <div className='col-md-4 my-3' key={element.url}>
          <NewsItem 
            title={element.title.slice(0, 45)} 
            description={element.description ? element.description.slice(0, 100) : 'No description'} 
            imageUrl={element.urlToImage || defaultImage} 
            newsUrl={element.url} 
          />
        </div>
      )
    })
  ) : (
    <p>No articles available</p> // Fallback message when no articles are available
  )
}
        </div>

                
        <div className="d-flex justify-content-between">
        <button disabled={this.state.page<=1} type="button" className="btn btn-dark" onClick={this.handlePrevClick}>&larr; Previous</button>
        <button disabled={this.state.page + 1> Math.ceil(this.state.totalResults/this.props.pageSize)} type="button" className="btn btn-dark" onClick={this.handleNextClick}>Next &rarr;</button>
        </div>
      </div>
    )
  }
}
