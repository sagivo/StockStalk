import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import Table from './Table';
import Watchilist from './Watchilist';
import RH from './helpers/rh/index';
import { link } from './helpers/general';

@inject('store') @observer
export default class Main extends Component {
  constructor(props) {
    super(props);

    this.state = { news: [], newsIndex: 0 };

    this.loadData = this.loadData.bind(this);
    this.renderNews = this.renderNews.bind(this);

    setTimeout(this.loadData, 1000)
  }

  async loadData() {
    const rh = new RH();
    const account = new rh.Account();
    const news = await account.news;
    if (news.results) {
      console.log(news.results);
      this.setState({ ...this.state, allNews: news.results });
    }
  }

  renderNews() {
    const { allNews, newsIndex } = this.state;
    if (!allNews || !allNews.length) return null;
    const n = allNews[newsIndex];
    const url = n.action.includes('web?url=') ? decodeURIComponent(n.action.split('web?url=')[1]) : null;

    return (
      <div id="news">
        {url && <h4><a href="#a" onClick={() => link(url)}>{n.title}</a></h4>}
        {!url && <h4>{n.title}</h4>}
        {(newsIndex > 0) && <a href="#a" className="link" id="prevNews" onClick={() => this.setState({...this.state, newsIndex: this.state.newsIndex - 1})}>{'<'}</a>}
        {(newsIndex < allNews.length - 1) && <a href="#a" className="link" id="nextNews" onClick={() => this.setState({...this.state, newsIndex: this.state.newsIndex + 1})}>{'>'}</a>}
        <div id="news-text">
          {n.message}
        </div>
      </div>
    )
  }

  render() {
    const { userStore } = this.props.store;
    if (!userStore.positions || !userStore.portfolio.todayChange) return <div>Loading...</div>;

    return (
      <div id="main-container">
        {this.renderNews()}
        {userStore.positions.length && <Table />}
        {userStore.watchlist.length && <div>
          <h1>Watchlist</h1>
          <Watchilist />
        </div>
        }
      </div>
    );
  }
}

