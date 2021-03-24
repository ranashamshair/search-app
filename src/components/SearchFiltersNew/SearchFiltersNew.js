import React, { Component } from 'react';
import './SearchFiltersNew.css';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowUp, faArrowDown, faArrowRight } from '@fortawesome/free-solid-svg-icons';

import {connect} from "react-redux";
import {
  getCategories, updateFiltersNew,
  updateSearch, updateSorting, updateTab
} from "../../actions";
import store from "../../store";
// import Loader from "react-loader-spinner";

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

      pricemin: '',
      pricemax: '',

      categoriesSaved: [],

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

    console.log('Filters from URL: ', tab);
    
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

      console.log('currentTab: ', currentTab);
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
      store.dispatch(updateSorting({sorting: sorting}));
    }
  }

  componentDidMount() {
    this.props.getCategories();

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

  categorySelected = categoryId => (this.state.categoriesSaved.indexOf(categoryId) !== -1);

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
    console.log('e.target.value: ', e.target.value);
    this.setState({sorting: e.target.value}, () => this.updateUrlParams());
  }

  render() {
    const { currentTab, pricemin, pricemax, sorting, isOpen, isMobile } = this.state;
    const filtersPosition = [
    "Fine Art", "American Art", "Contemporary Art", "19th Centry European Pain", "Photographs", "Diamonds", "Fine Art1", "American Art1", "Contemporary Art1"
    ];

    console.log('sorting: ', sorting);

    const sortOptions = {
      'upcoming': [
        {
          label: 'Next sale date (older)',
          value: 'date||asc'
        },
        {
          label: 'Next sale date (newer)',
          value: 'date||desc'
        },
        {
          label: 'Estimate (low to high)',
          value: 'price||asc'
        },
        {
          label: 'Estimate (high to low)',
          value: 'price||desc'
        }
      ],
      'past': [
        {
          label: 'Past sale date (older)',
          value: 'date||asc'
        },
        {
          label: 'Past sale date (newer)',
          value: 'date||desc'
        },
        {
          label: 'Result price (low to high)',
          value: 'price||asc'
        },
        {
          label: 'Result price (high to low)',
          value: 'price||desc'
        }
      ],
      'auctions': [
        {
          label: 'Date (older)',
          value: 'date||asc'
        },
        {
          label: 'Date (newer)',
          value: 'date||desc'
        },
        {
          label: 'Title (Ascending)',
          value: 'title||asc'
        },
        {
          label: 'Title (Descending)',
          value: 'title||desc'
        },
        {
          label: 'Category (Ascending)',
          value: 'category||asc'
        },
        {
          label: 'Category (Descending)',
          value: 'category||desc'
        }
      ],
      'other': [
        {
          label: 'Date (older)',
          value: 'date||asc'
        },
        {
          label: 'Date (newer)',
          value: 'date||desc'
        },
        {
          label: 'Title (Ascending)',
          value: 'title||asc'
        },
        {
          label: 'Title (Descending)',
          value: 'title||desc'
        },
      ],
    };

    const currentSortOptions = sortOptions[currentTab];

    return (
      <div className="pt-4 search-filter">
        <div className="d-flex justify-content-center justify-content-sm-between align-items-end">
          <button className="py-2 px-4 text-uppercase font-weight-bold" onClick={this.handleOpenClose}>Filter <FontAwesomeIcon className="ml-3" icon={isOpen ? faArrowUp : faArrowDown}/></button>
          {
            !isMobile ?
            (<select onChange={this.handleSortingSelect} value={sorting}>
              <option value="">Sort by</option>
              {
                currentSortOptions.map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))
              }
            </select>)
          : ""
          }
        </div>
        {
          isOpen &&
          <div className="col-12 pt-4 px-0 d-flex justify-content-center justify-content-md-between flex-wrap filter-container">
            {
              (currentTab === 'upcoming' || currentTab === 'past') && (
                  <div className="col-12 col-md-3 col-lg-2 pb-3 pb-md-0 px-md-0">
                    <input type="text" placeholder="Min price" value={pricemin} onChange={this.handleSetMinMax} name="pricemin" className="col-12 mb-2 py-1 px-3" />
                    <input type="text" placeholder="Max price" value={pricemax} onChange={this.handleSetMinMax} name="pricemax" className="col-12 py-1 px-3" />
                  </div>
              )
            }

            <div className="col-12 col-md-9 d-flex flex-wrap">
              {
                // TODO categories !!!
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
