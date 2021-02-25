import React, { Component, useState, useEffect } from 'react';
import './SearchFiltersNew.css';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowUp, faArrowDown, faArrowRight } from '@fortawesome/free-solid-svg-icons';

import {connect} from "react-redux";
import {
    getAuctions, getCategories, getEvents, getLots, getNews, getPastLots, updateFiltersNew,
    updateFiltersOnly, updateSearch, updateSorting, updateTab
} from "../../actions";
import store from "../../store";
import Loader from "react-loader-spinner";

// TODO cleanup after API !!!
class SearchFilters extends Component {

  constructor(props) {
    super(props);

    this.state = {
      // submited: false,
      submited: true,
      isOpen: true, // work
      isMobile: false, // work
      setCategory: [], // work
      upcoming: false,
      types: {
        lots: false,
        auctions: false,
        events: false,
        stories: false
      },
      pricemin: '',
      pricemax: '',

      upcomingSaved: false,
      categoriesSaved: [],
      typesSaved: {
        lots: false,
        auctions: false,
        events: false,
        stories: false
      },
      priceminSaved: '',
      pricemaxSaved: '',

      filterCounter: 0,

      dropdowns: {
        upcoming: false,
        category: false,
        other: false
      },

      // NEW DATA
      currentTab: 'upcoming',
      sorting: '',
      search: '',

    };

    this.saveUpcomingFilter = this.saveUpcomingFilter.bind(this);
    this.cancelUpcomingFilter = this.cancelUpcomingFilter.bind(this);
    this.saveCategoryFilter = this.saveCategoryFilter.bind(this);
    this.cancelCategoryFilter = this.cancelCategoryFilter.bind(this);
    this.saveOtherFilters = this.saveOtherFilters.bind(this);
    this.cancelOtherFilter = this.cancelOtherFilter.bind(this);
    this.handleChangeType = this.handleChangeType.bind(this);
    this.resetAll = this.resetAll.bind(this);
    this.handleOpenClose = this.handleOpenClose.bind(this);
    this.handleSetMinMax = this.handleSetMinMax.bind(this);
    this.handleCheckboxChange = this.handleCheckboxChange.bind(this);
    this.handleSubmitFilters = this.handleSubmitFilters.bind(this);
    this.handleSortingSelect = this.handleSortingSelect.bind(this);
  }

  parseUrl() {
    const url = window.location.search;
    let query = url.substr(1);
    let result = {};
    query.split("&").forEach(function(part) {
      let item = part.split("=");
      result[item[0]] = decodeURIComponent(item[1]);
    });
    return result;
  }

  getFiltersFromUrlParams() {
      // TODO remake for redux when API will be updated !!!
    const { tab = 'upcoming', search = '', categories = null, min_price = '', max_price = '', sort = '' } = this.parseUrl();

    if (this.state.currentTab !== tab) {
        store.dispatch(updateTab({currentTab: tab}));
    }

    store.dispatch(updateFiltersNew({
        selectedCategories: categories ? categories.split(',') : [],
        priceMin: min_price,
        priceMax: max_price,
    }));

    if (this.state.search !== search) {
        store.dispatch(updateSearch({searchText: search}));
    }
    if (this.state.sorting !== sort) {
        store.dispatch(updateSorting({sorting: sort}));
    }
  }

  updateUrlParams() {
    const { search = '', currentTab, setCategory = [], pricemin = null, pricemax = null, sorting = null } = this.state;

    const params = [];
    // const

    if (window.history.pushState) {
      let newUrl = window.location.protocol + "//" + window.location.host + window.location.pathname;

      if (currentTab) params.push('tab=' + currentTab);
      if (search) params.push('search=' + search);

      if (setCategory.length) {
        params.push('categories=' + setCategory.join(','));
      }

      if (pricemin) params.push('min_price=' + pricemin);
      if (pricemax) params.push('max_price=' + pricemax);
      if (sorting) params.push('sort=' + sorting);

      if (params.length) {
        newUrl += '?' + params.join('&');
      }

      window.history.pushState({path:newUrl},'',newUrl);

      store.dispatch(updateFiltersNew({
          selectedCategories: setCategory,
          priceMin: pricemin || '',
          priceMax: pricemax || '',
      }));
      if (sorting) {
          store.dispatch(updateSorting({sorting: sorting}));
      }
    }
  }

  componentDidMount() {
    this.props.getCategories();

    this.checkFilterCount();

    const _this = this;

    store.subscribe(() => {
      const { upcomingLoading, pastLoading, newsLoading, currentTab, selectedCategories, priceMin, priceMax, sorting, searchText } = store.getState();

      const stateChanges = {
        currentTab: currentTab,
        search: searchText,
        categoriesSaved: selectedCategories,
        setCategory: selectedCategories,
        pricemin: priceMin,
        pricemax: priceMax,
        sorting: sorting,
      };

      if(!upcomingLoading && !pastLoading && !newsLoading && _this.state.submited){
        stateChanges.submited = false;
      }

      this.setState(stateChanges);
    });

    this.getFiltersFromUrlParams();
    window.addEventListener('popstate', () => {
        this.getFiltersFromUrlParams();
    });

    if ( window.innerWidth < 576 ) {
      this.setState({isMobile: true});
    } else {
      this.setState({isMobile: false});
    }
  }

  componentWillUnmount() {
      window.removeEventListener('popstate', () => {
          this.getFiltersFromUrlParams();
      });
  }

  handleChangeType(e) {
    const tg = e.target, { types } = this.state;

    types[tg.id] = tg.checked;

    this.setState({types: types})
  }


  checkFilterCount() {
    const { typesSaved } = this.state;

    let filterCounter = 0;

    if(typesSaved.lots) ++filterCounter;
    if(typesSaved.auctions) ++filterCounter;
    if(typesSaved.events) ++filterCounter;
    if(typesSaved.stories) ++filterCounter;

    this.setState({filterCounter: filterCounter});
  }

  categorySelected = categoryId => (this.state.categoriesSaved.indexOf(categoryId) !== -1);

  saveUpcomingFilter = e => {
    const { upcoming, dropdowns } = this.state;
    dropdowns.upcoming = false;

    this.setState({upcomingSaved: upcoming, dropdowns: dropdowns}, () => this.updateResults());
  };

  cancelUpcomingFilter = e => {
    const { upcomingSaved, dropdowns } = this.state;
    dropdowns.upcoming = false;

    this.setState({upcoming: upcomingSaved, dropdowns: dropdowns});
  };

  saveCategoryFilter = e => {
    const { dropdowns } = this.state;
    dropdowns.category = false;

    const categoriesEls = document.querySelectorAll('input[data-input="categories_chechbox"]:checked');

    const categories = [];
    if(categoriesEls && categoriesEls.length > 0){
      for(let ch of categoriesEls){
        categories.push(ch.value);
      }
    }

    this.setState({categoriesSaved: categories, dropdowns: dropdowns}, () => this.updateResults());
  };

  cancelCategoryFilter = e => {
    const { dropdowns } = this.state;
    dropdowns.category = false;

    this.resetCategoriesFilter();

    this.setState({dropdowns: dropdowns});
  };

  resetCategoriesFilter(clear = false){
    const categoriesEls = document.querySelectorAll('input[data-input="categories_chechbox"]');

    if(categoriesEls && categoriesEls.length > 0){
      for(let ch of categoriesEls){
        ch.checked = clear ? false : this.categorySelected(ch.value);
      }
    }
  }

  saveOtherFilters(e) {
    const { types, pricemin, pricemax, dropdowns } = this.state;
    dropdowns.other = false;

    this.setState({typesSaved: types, priceminSaved: pricemin, pricemaxSaved: pricemax, dropdowns: dropdowns}, () => {
      this.checkFilterCount(); this.updateResults()
    });
  }

  cancelOtherFilter(e) {
    const { typesSaved, priceminSaved, pricemaxSaved, dropdowns } = this.state;
    dropdowns.other = false;

    this.setState({types: typesSaved, pricemin: priceminSaved, pricemax: pricemaxSaved, dropdowns: dropdowns});
  }

  resetAll(e) {
    this.resetCategoriesFilter(true);

    this.setState({
      upcoming: false,
      types: {
        lots: false,
        // auctions: false,
        // events: false,
        stories: false
      },
      pricemin: '',
      pricemax: '',
      upcomingSaved: false,
      categoriesSaved: [],
      typesSaved: {
        lots: false,
        // auctions: false,
        // events: false,
        stories: false
      },
      priceminSaved: '',
      pricemaxSaved: '',

      filterCounter: 0,

      dropdowns: {
        upcoming: false,
        category: false,
        other: false,
      }

    }, () => this.updateResults(true))
  }

  updateResults(resetSearch = false) {
    this.setState({submited: true}, () => {
      const { upcomingSaved, categoriesSaved, typesSaved, priceminSaved, pricemaxSaved } = this.state;

      const payload = store.getState();

      payload.page = 0;
      payload.pagePast = 0;
      // payload.pageAuctions = 0;
      // payload.pageEvents = 0;
      payload.pageNews = 0;
      payload.upcomingLoading = true;
      payload.pastLoading = true;
      // payload.auctionsLoading = true;
      // payload.eventsLoading = true;
      payload.newsLoading = true;
      payload.staticFilters = {
        upcomingOnly: upcomingSaved,
        contentType: typesSaved,
        categories: categoriesSaved,
        pricemin: priceminSaved,
        pricemax: pricemaxSaved,
      };

      if(resetSearch) payload.searchQuery = '';


      let types = typesSaved;
      let allFiltersUnchecked = (!types.lots && !types.auctions && !types.events && !types.stories);

      if(allFiltersUnchecked || types.lots){
        store.dispatch( getLots(payload) );

        if(!upcomingSaved){
          store.dispatch( getPastLots(payload) );
        }
      }
      // store.dispatch( getAuctions(payload) );
      // store.dispatch( getEvents(payload) );
      if(allFiltersUnchecked || types.stories){
        if(payload.searchQuery){
          store.dispatch(getNews(payload));
        }else{
          payload.news = [];
          payload.newsLoading = false;
          payload.newsMessage = "Empty search keyword";

          store.dispatch(updateFiltersOnly(payload));
        }
      }
    });
  }

  handleOpenClose (e) {
    e.preventDefault();

    this.setState({isOpen: !this.state.isOpen});
  }

  handleSetMinMax ({target:{value, name}}) {
    if ( !isNaN(value) ) {
      this.setState({[name]: value})
    }
  }

  handleCheckboxChange ({target}) {
    // TODO remake for redux when API will be updated !!!
    const {setCategory} = this.state;

    const newCategories = [...setCategory];
    if (target.checked) {
      newCategories.push(target.value);
    } else {
      const idx = setCategory.indexOf(target.value);

      if (idx !== -1) {
        newCategories.splice(setCategory.indexOf(target.value), 1)
      }
    }

    this.setState({setCategory: newCategories, categoriesSaved: newCategories})
  }

  handleSubmitFilters (e) {
    e.preventDefault();

    this.updateUrlParams();
  }

  handleSortingSelect (e) {
    this.setState({sorting: e.target.value}, () => this.updateUrlParams());
  }

  render() {
    const { submited, upcoming, upcomingSaved, categoriesSaved, priceminSaved, pricemaxSaved, types, pricemin, pricemax, sorting, filterCounter, dropdowns, isOpen, isMobile } = this.state;
    const filtersPosition = [
    "Fine Art", "American Art", "Contemporary Art", "19th Centry European Pain", "Photographs", "Diamonds", "Fine Art1", "American Art1", "Contemporary Art1"
    ];

    console.log('sorting: ', sorting);

    return (
      <div className="pt-4 search-filter">
        <div className="d-flex justify-content-center justify-content-sm-between align-items-end">
          <button className="py-2 px-4 text-uppercase font-weight-bold" onClick={this.handleOpenClose}>Filter <FontAwesomeIcon className="ml-3" icon={isOpen ? faArrowUp : faArrowDown}/></button>
          {
            !isMobile ?
            (<select onChange={this.handleSortingSelect} value={sorting}>
              <option value="">Sort by</option>
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4">4</option>
            </select>)
          : ""
          }
        </div>
        {
          isOpen &&
          <div className="col-12 pt-4 px-0 d-flex justify-content-center justify-content-md-between flex-wrap filter-container">
            <div className="col-12 col-md-3 col-lg-2 pb-3 pb-md-0 px-md-0">
              <input type="text" placeholder="Min price" value={pricemin} onChange={this.handleSetMinMax} name="pricemin" className="col-12 mb-2 py-1 px-3" />
              <input type="text" placeholder="Max price" value={pricemax} onChange={this.handleSetMinMax} name="pricemax" className="col-12 py-1 px-3" />
            </div>
            <div className="col-12 col-md-9 d-flex flex-wrap">
              {
                filtersPosition.map(item => (
                  <div className="ui checkbox col-12 col-lg-4 col-md-6 pb-2" key={item.replaceAll(' ','-')}>
                    <input
                      type="checkbox"
                      id={item.replaceAll(' ','-')}
                      // defaultChecked={this.categorySelected(item.replaceAll(' ','-'))}
                      checked={this.categorySelected(item.replaceAll(' ','-'))}
                      value={item.replaceAll(' ','-')}
                      onChange={this.handleCheckboxChange}
                    />
                    <label htmlFor={item.replaceAll(' ','-')}>{item}</label>
                  </div>
                ))
                // this.props.categories.map(item => (
                //   <div className="ui checkbox" key={'category_' + item.id}>
                //     <input type="checkbox" data-input="categories_chechbox" id={'category_' + item.id} defaultChecked={this.categorySelected(item.id)} value={item.id} />
                //     <label htmlFor={'category_' + item.id}>{item.name}</label>
                //   </div>
                // ))
              }
            </div>
            <div className="col-12 d-flex justify-content-center p-3">
              <button type="submit" className="py-2 px-4 text-uppercase font-weight-bold" onClick={this.handleSubmitFilters}>Apply filters <FontAwesomeIcon className="ml-3" icon={faArrowRight}/></button>
            </div>
          </div>
        }
      </div>
    );
  }
}

function mapStateToProps(state) {
  // console.log('store state: ', state);

  return {
    categories: state.categories
  };
}

export default connect(
  mapStateToProps,
  { getCategories }
)(SearchFilters);


// function SearchFiltersNew () {
//
//   let filterStyle = `${isOpen ? "d-flex" : "d-none"}`;
//
//   const filtersPosition = [
//     "Fine Art", "American Art", "Contemporary Art", "19th Centry European Pain", "Photographs", "Diamonds", "Fine Art", "American Art", "Contemporary Art"
//   ]
//
//   return (
//     <div className="pt-4 search-filter">
//       <div className="d-flex justify-content-between">
//         <button className="py-2 px-4 text-uppercase" onClick={handleButtonClick}>Filter <FontAwesomeIcon className="ml-3" icon={isOpen ? faArrowUp : faArrowDown}/></button>
//         <select>
//           <option value="1">1</option>
//           <option value="2">2</option>
//           <option value="3">3</option>
//           <option value="4">4</option>
//         </select>
//       </div>
//       {
//         isOpen &&
//         <div className="col-12 py-4 px-0 d-flex justify-content-between">
//           <div className="col-2 p-0">
//             <input type="text" placeholder="Min price" className="col-12 mb-2 py-1 px-3" />
//             <input type="text" placeholder="Max price" className="col-12 py-1 px-3" />
//           </div>
//           <div className="col-10">
//             {
//               filtersPosition.map((item) => {
//                 const formatStr = item.replace(' ', '-');
//                 return (
//                   <div className="ui checkbox" key={'category_' + item.id}>
//                     <input type="checkbox" data-input="categories_chechbox" id={'category_' + item.id} defaultChecked={categorySelected(item.id)} value={item.id} />
//                     <label htmlFor={'category_' + item.id}>{item.name}</label>
//                   </div>
//                 )
//               })
//             }
//           </div>
//         </div>
//       }
//     </div>
//   );
// }
