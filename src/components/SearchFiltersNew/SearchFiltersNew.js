import React, { Component } from 'react';
import './SearchFiltersNew.css';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowUp, faArrowDown, faArrowRight } from '@fortawesome/free-solid-svg-icons';

import {connect} from "react-redux";
import {
  getCategories, updateFiltersNew, updateSorting
} from "../../actions";
import store from "../../store";
import Loader from "react-loader-spinner";

class SearchFilters extends Component {

  constructor(props) {
    super(props);

    const storeState = store.getState();

    this.state = {
      noResult: true,
      availableCategories: storeState.availableCategories,
      submited: storeState.loading || true,
      isOpen: true, // work
      isMobile: false, // work
      setCategory: [], // work

      pricemin: storeState.priceMin || '',
      pricemax: storeState.priceMax || '',
      categoriesSaved: storeState.selectedCategories || [],

      currentTab: storeState.currentTab || 'upcoming',
      sorting: storeState.sorting || '',
      search: storeState.searchText || '',
    };
    this._isMounted = false;

    this.handleOpenClose = this.handleOpenClose.bind(this);
    this.handleSetMinMax = this.handleSetMinMax.bind(this);
    this.handleCheckboxChange = this.handleCheckboxChange.bind(this);
    this.handleSubmitFilters = this.handleSubmitFilters.bind(this);
    this.handleSortingSelect = this.handleSortingSelect.bind(this);
  }

  updateUrlParams() {
    const { search = '', currentTab, setCategory = [], pricemin = null, pricemax = null, sorting = null } = this.state;

    const storeState = store.getState();

    const difference = storeState.selectedCategories
      .filter(x => !this.state.setCategory.includes(x))
      .concat(this.state.setCategory.filter(x => !storeState.selectedCategories.includes(x)));

    if (
        storeState.currentTab !== currentTab ||
        storeState.sorting !== sorting ||
        difference.length > 0 ||
        storeState.priceMin !== pricemin ||
        storeState.priceMax !== pricemax
    ) {
      const params = [];

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
        }, currentTab));
        store.dispatch(updateSorting({sorting: sorting}));
      }
    }
  }

  componentDidMount() {
    this._isMounted = true;
    this.props.getCategories();

    const _this = this;

    store.subscribe(() => {
      const { availableCategories, loading, currentTab, selectedCategories, priceMin, priceMax, sorting, searchText, lotsCount, pastLotsCount, auctionsCount, postsCount } = store.getState();

      const stateChanges = {
        currentTab: currentTab,
        search: searchText,
        availableCategories: availableCategories,
        categoriesSaved: selectedCategories,
        setCategory: selectedCategories,
        pricemin: priceMin,
        pricemax: priceMax,
        sorting: sorting,
        noResults: (!loading &&
          (
            (currentTab === 'upcoming' && lotsCount === 0) ||
            (currentTab === 'past' && pastLotsCount === 0) ||
            (currentTab === 'auctions' && auctionsCount === 0) ||
            (currentTab === 'other' && postsCount === 0)
          )
        ) || loading,
        // ) || (loading && this.state.currentTab !== currentTab),
      };

      stateChanges.submited = (!loading && _this.state.submited) ? false : loading;

      if (this._isMounted) this.setState(stateChanges);
    });

    if (this._isMounted) {
      if ( window.innerWidth < 576 ) {
        this.setState({isMobile: true});
      } else {
        this.setState({isMobile: false});
      }
    }
  }

  componentWillUnmount() {
      this._isMounted = false;
  }

  categorySelected = categoryId => (this.state.categoriesSaved.indexOf(categoryId.toString()) !== -1);

  handleOpenClose (e) {
    e.preventDefault();

    if (this._isMounted) this.setState({isOpen: !this.state.isOpen});
  }

  handleSetMinMax ({target:{value, name}}) {
    if ( !isNaN(value) && this._isMounted ) {
      this.setState({[name]: value})
    }
  }

  handleCheckboxChange ({target}) {
    if (this._isMounted) {
      const {setCategory} = this.state;

      const newCategories = [...setCategory];
      if (target.checked) {
        newCategories.push(target.value.toString());
      } else {
        const idx = setCategory.indexOf(target.value.toString());

        if (idx !== -1) {
          newCategories.splice(idx, 1);
        }
      }

      this.setState({setCategory: newCategories, categoriesSaved: newCategories})
    }
  }

  handleSubmitFilters (e) {
    e.preventDefault();

    if (this._isMounted) this.updateUrlParams();
  }

  handleSortingSelect (e) {
    this.setState({sorting: e.target.value}, () => {
      if (this._isMounted)  this.updateUrlParams()
    });
  }

  render() {
    const { noResults, availableCategories, submited, currentTab, pricemin, pricemax, sorting, isOpen, isMobile } = this.state;

    // if(submited){
    //   setTimeout(() => {
    //     this.setState({submited: false})
    //   }, 3000)
    // }


    const sortOptions = {
      'upcoming': [
        {
          label: 'Next Sale Date',
          value: 'date||asc'
        },
        {
          label: 'Estimate - Low to High',
          value: 'price||asc'
        },
        {
          label: 'Estimate - High to Low',
          value: 'price||desc'
        }
      ],
      'past': [
        {
          label: 'Past Sale Date',
          value: 'date||desc'
        },
        {
          label: 'Sold Price - Low to High',
          value: 'price||asc'
        },
        {
          label: 'Sold Price - High to Low',
          value: 'price||desc'
        }
      ],
      'auctions': [
        {
          label: 'Date',
          value: 'date||asc'
        },
        {
          label: 'Title',
          value: 'title||asc'
        },
        {
          label: 'Category',
          value: 'category||asc'
        },
        // {
        //   label: 'Category (Descending)',
        //   value: 'category||desc'
        // }
      ],
      'other': [
        {
          label: 'Recent',
          value: 'date||desc'
        },
        {
          label: 'Title',
          value: 'title||asc'
        },
      ],
    };

    const currentSortOptions = sortOptions[currentTab];

    return (
        <>
            {
                submited ? (
                    <div className="preloader-blur">
                        <Loader
                            type="ThreeDots"
                            color="#8C2828"
                            height={50}
                            width={50}
                            timeout={3000}
                        />
                    </div>
                ) : ''
            }
            <div className="pt-4 search-filter">
                <div className="d-flex justify-content-center justify-content-sm-between align-items-end">
                    <button className="py-2 px-4 text-uppercase font-weight-bold" onClick={this.handleOpenClose}>Filter <FontAwesomeIcon className="ml-3" icon={isOpen ? faArrowUp : faArrowDown}/></button>
                    {
                        !isMobile ?
                            (<select onChange={this.handleSortingSelect} value={sorting}>
                                <option value="" disabled>Sort by</option>
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
                                (currentTab !== 'past' && !noResults) && availableCategories.map(item => (
                                    <div className="ui checkbox col-12 col-lg-4 col-md-6 pb-2" key={'category_' + item.id}>
                                        <input
                                            type="checkbox"
                                            id={'category_' + item.id}
                                            // defaultChecked={this.categorySelected(item.replaceAll(' ','-'))}
                                            checked={this.categorySelected(item.id)}
                                            value={item.id}
                                            onChange={this.handleCheckboxChange}
                                        />
                                        <label htmlFor={'category_' + item.id}>{item.name}</label>
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
        </>
    );
  }
}

function mapStateToProps(state) {
  // console.log('store state: ', state);

  return {
      availableCategories: state.availableCategories
  };
}

export default connect(
  mapStateToProps,
  { getCategories }
)(SearchFilters);
